import { useEffect, useState } from "react";
import { getCloudWorkspace, saveCloudWorkspace, type CloudWorkspace } from "@/lib/quietforge/cloud";
import { useForge, workspaceSnapshot } from "@/lib/quietforge/store";

export type CloudStatus = "local" | "loading" | "saved" | "saving" | "offline" | "conflict";

type SyncJournal = { revision: number; dirty: boolean };
type SyncState = {
  status: CloudStatus;
  error: string | null;
  conflict: boolean;
  useCloud: () => void;
  keepDevice: () => void;
};

const NOOP = () => {};

function journalKey(userId: string) {
  return `quietforge.sync.v1.${userId}`;
}

function loadJournal(userId: string): SyncJournal | null {
  try {
    const raw = localStorage.getItem(journalKey(userId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const journal = parsed as Partial<SyncJournal>;
    return Number.isSafeInteger(journal.revision) && Number(journal.revision) >= 0 && typeof journal.dirty === "boolean"
      ? { revision: Number(journal.revision), dirty: journal.dirty }
      : null;
  } catch {
    return null;
  }
}

function saveJournal(userId: string, journal: SyncJournal) {
  try {
    localStorage.setItem(journalKey(userId), JSON.stringify(journal));
  } catch {
    // The workspace remains usable in memory even if browser storage is denied.
  }
}

function isOnline() {
  return typeof navigator === "undefined" || navigator.onLine;
}

function stateJson() {
  return JSON.stringify(workspaceSnapshot(useForge.getState()));
}

/** One account's optimistic-revision cloud sync. Never runs for a guest. */
export function useCloudSync(userId: string | null, ready: boolean, hadLocalWorkspace: boolean): SyncState {
  const [state, setState] = useState<{ status: CloudStatus; error: string | null; conflict: boolean }>({
    status: "local", error: null, conflict: false,
  });
  const [resolution, setResolution] = useState<{ useCloud: () => void; keepDevice: () => void }>({
    useCloud: NOOP, keepDevice: NOOP,
  });

  useEffect(() => {
    if (!userId || !ready) {
      setState({ status: "local", error: null, conflict: false });
      setResolution({ useCloud: NOOP, keepDevice: NOOP });
      return;
    }

    const id = userId;
    let disposed = false;
    let applying = false;
    let initialized = false;
    let editedBeforeInit = false;
    let busy = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let conflict: { snapshot: CloudWorkspace; revision: number } | null = null;
    let journal = loadJournal(id) ?? { revision: 0, dirty: false };
    const hadJournal = loadJournal(id) !== null;
    let lastJson = stateJson();

    const updateStatus = (status: CloudStatus, error: string | null = null) => {
      if (!disposed) setState({ status, error, conflict: status === "conflict" });
    };
    const markJournal = (dirty: boolean) => {
      journal = { ...journal, dirty };
      saveJournal(id, journal);
    };
    const applyRemote = (snapshot: CloudWorkspace, revision: number) => {
      applying = true;
      useForge.setState(snapshot);
      lastJson = stateJson();
      applying = false;
      journal = { revision, dirty: false };
      saveJournal(id, journal);
      conflict = null;
      updateStatus("saved");
    };
    const showConflict = (snapshot: CloudWorkspace, revision: number) => {
      conflict = { snapshot, revision };
      updateStatus("conflict", "Another device has changes. Choose which version to keep.");
    };

    const queue = (delay = 800) => {
      clearTimeout(timer);
      timer = setTimeout(() => { void flush(); }, delay);
    };

    const flush = async () => {
      if (disposed || !initialized || busy || conflict || !journal.dirty) return;
      if (!isOnline()) { updateStatus("offline", "Changes are stored locally until you're online."); return; }
      busy = true;
      updateStatus("saving");
      const sending = workspaceSnapshot(useForge.getState());
      const sendingJson = JSON.stringify(sending);
      try {
        const result = await saveCloudWorkspace({ data: { snapshot: sending, expectedRevision: journal.revision } });
        if (disposed) return;
        if (result.saved) {
          journal.revision = result.revision;
          markJournal(stateJson() !== sendingJson);
          updateStatus(journal.dirty ? "saving" : "saved");
        } else if (result.snapshot) {
          showConflict(result.snapshot, result.revision);
        } else {
          updateStatus("offline", "The cloud copy wasn't available. Your changes are saved here.");
        }
      } catch (error) {
        if (!disposed) updateStatus("offline", error instanceof Error && error.message.includes("plan supports")
          ? error.message
          : "Couldn't reach cloud storage. Your changes remain on this device.");
      } finally {
        busy = false;
        if (!disposed && journal.dirty && !conflict && isOnline()) queue(3500);
      }
    };

    const refresh = async () => {
      if (disposed || busy || conflict || !isOnline()) return;
      if (journal.dirty) { void flush(); return; }
      busy = true;
      try {
        const result = await getCloudWorkspace();
        if (disposed) return;
        if (result.snapshot && result.revision > journal.revision) applyRemote(result.snapshot, result.revision);
      } catch {
        if (!disposed) updateStatus("offline", "Couldn't check for changes on other devices.");
      } finally {
        busy = false;
      }
    };

    const unsubscribe = useForge.subscribe(() => {
      if (disposed || applying) return;
      const json = stateJson();
      if (json === lastJson) return;
      lastJson = json;
      markJournal(true);
      if (!initialized) { editedBeforeInit = true; return; }
      if (!conflict) {
        updateStatus(isOnline() ? "saving" : "offline");
        queue();
      }
    });

    const useCloud = () => {
      if (!conflict) return;
      applyRemote(conflict.snapshot, conflict.revision);
    };
    const keepDevice = () => {
      if (!conflict) return;
      journal.revision = conflict.revision;
      conflict = null;
      markJournal(true);
      updateStatus("saving");
      queue(0);
    };
    setResolution({ useCloud, keepDevice });

    const onFocus = () => { if (initialized) void refresh(); };
    const onOnline = () => { if (initialized) { if (journal.dirty) queue(0); else void refresh(); } };
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    const periodic = window.setInterval(onFocus, 45_000);

    const initialize = async () => {
      updateStatus("loading");
      try {
        const remote = await getCloudWorkspace();
        if (disposed) return;
        // Old browser-only accounts have no journal. Preserve their studies
        // until the user explicitly resolves a pre-existing cloud workspace.
        if (remote.snapshot) {
          if (journal.dirty || editedBeforeInit || (!hadJournal && hadLocalWorkspace && JSON.stringify(remote.snapshot) !== stateJson())) {
            if (JSON.stringify(remote.snapshot) === stateJson()) {
              applyRemote(remote.snapshot, remote.revision);
            } else if (journal.dirty && journal.revision === remote.revision) {
              updateStatus("saving");
            } else {
              showConflict(remote.snapshot, remote.revision);
            }
          } else {
            applyRemote(remote.snapshot, remote.revision);
          }
        } else {
          journal.revision = 0;
          markJournal(true);
          updateStatus("saving");
        }
      } catch {
        if (!disposed) {
          markJournal(true);
          updateStatus("offline", "Cloud storage is unavailable; your changes are still local.");
        }
      } finally {
        initialized = true;
        if (!disposed && journal.dirty && !conflict) queue(0);
      }
    };

    void initialize();
    return () => {
      disposed = true;
      clearTimeout(timer);
      window.clearInterval(periodic);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
      unsubscribe();
    };
  }, [userId, ready, hadLocalWorkspace]);

  return { ...state, ...resolution };
}
