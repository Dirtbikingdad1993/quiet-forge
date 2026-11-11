import { useEffect, useState } from "react";
import { Calculator, Compass, FolderKanban, Download } from "lucide-react";
import { Dashboard } from "@/components/quietforge/dashboard";
import { Engineering } from "@/components/quietforge/engineering";
import { Studio } from "@/components/quietforge/studio";
import { AccountControl } from "@/components/quietforge/account-control";
import { Guide } from "@/components/quietforge/guide";
import { ExportPanel } from "@/components/quietforge/export-panel";
import { activeProject, useForge } from "@/lib/quietforge/store";
import { useCloudSync } from "@/lib/quietforge/use-cloud-sync";
import { ink } from "@/lib/quietforge/ink";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { ViewId } from "@/lib/quietforge/model";

const NAV: { id: ViewId; label: string; icon: typeof Compass }[] = [
  { id: "studio", label: "Sketch", icon: Compass },
  { id: "engineering", label: "Screen", icon: Calculator },
  { id: "projects", label: "Studies", icon: FolderKanban },
];

export function Shell() {
  const { user, isPending } = useCurrentUserState();
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [hadSavedKey, setHadSavedKey] = useState(false);
  const storageKey = user && !user.isDevFallback ? `quietforge.v1.user.${user.id}` : "quietforge.v1";
  const sync = useCloudSync(user && !user.isDevFallback ? user.id : null, !isPending && readyKey === storageKey, hadSavedKey);

  useEffect(() => {
    if (isPending) return;
    let current = true;
    useForge.persist.setOptions({ name: storageKey });
    let exists = false;
    try { exists = window.localStorage.getItem(storageKey) !== null; } catch { /* Storage may be blocked. */ }
    setHadSavedKey(exists);
    let loaded = true;
    void useForge.persist.rehydrate().catch(() => {
      loaded = false;
    }).finally(() => {
      if (!current) return;
      // A missing key must NOT inherit another signed-in account's in-memory state.
      if (!exists || !loaded) useForge.setState({
        projects: [], activeId: "", view: "projects", unit: "in", renderMode: "concept",
      });
      setReadyKey(storageKey);
    });
    return () => { current = false; };
  }, [isPending, storageKey]);

  const view = useForge((s) => s.view);
  const unit = useForge((s) => s.unit);
  const renderMode = useForge((s) => s.renderMode);
  const projects = useForge((s) => s.projects);
  const active = useForge((s) => activeProject(s));
  const setView = useForge((s) => s.setView);
  const setUnit = useForge((s) => s.setUnit);
  const setRenderMode = useForge((s) => s.setRenderMode);
  const open = useForge((s) => s.open);
  const updateActive = useForge((s) => s.updateActive);
  const create = useForge((s) => s.create);
  const duplicate = useForge((s) => s.duplicate);
  const remove = useForge((s) => s.remove);
  const replaceAll = useForge((s) => s.replaceAll);

  if (isPending || readyKey !== storageKey) {
    return <div className="flex h-dvh items-center justify-center bg-bg text-sm text-muted">Opening your workspace…</div>;
  }

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg lg:flex-row">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-3 px-4 py-5">
          <Mark />
          <div>
            <p className="text-sm font-semibold tracking-wide">Suppressor Studio</p>
            <p className="font-mono text-xs text-brass">CONCEPT STUDIO</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavButton key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
          ))}
        </nav>
        <div className="space-y-2 border-t border-border px-4 py-4">
          <AccountControl />
          <UnitToggle unit={unit} onChange={setUnit} />
          <SyncLabel status={sync.status} />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <Mark />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Suppressor Studio</p>
            <p className="font-mono text-xs text-brass">Concept studio</p>
          </div>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="border-b border-border px-4 py-2 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <AccountControl />
            <SyncLabel status={sync.status} />
          </div>
        </div>
        {sync.conflict && (
          <div role="alert" className="flex flex-wrap items-center gap-3 border-b border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
            <p className="min-w-48 flex-1">Another device has newer studies. Choose which version you want to keep.</p>
            <button type="button" onClick={sync.useCloud} className="min-h-10 rounded border border-border px-3 text-fg hover:bg-surface-2">Use cloud version</button>
            <button type="button" onClick={sync.keepDevice} className="min-h-10 rounded bg-brass px-3 font-medium text-brass-ink">Keep this device</button>
          </div>
        )}
        {sync.error && !sync.conflict && (
          <p role="status" className="border-b border-border px-4 py-2 text-xs text-muted">{sync.error}</p>
        )}
        <div className="flex items-center gap-3 border-b border-border px-4 py-2">
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
            Concept sketches only. Not a manufacturing drawing, print file, or safety approval.
          </p>
          <button type="button" onClick={() => setExportOpen(true)}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-fg hover:bg-surface-2">
            <Download className="size-4" /> Export
          </button>
        </div>

        {active ? (
          <Studio
            project={active}
            unit={unit}
            mode={renderMode}
            visible={view === "studio"}
            onChange={updateActive}
            onMode={setRenderMode}
          />
        ) : (
          <div className={view === "studio" ? "flex flex-1 items-center justify-center px-6" : "hidden"}>
            <p className="text-sm text-muted">No study is open. Start one from Studies.</p>
          </div>
        )}

        <Engineering project={active} unit={unit} visible={view === "engineering"} onChange={updateActive} />
        <Dashboard
          projects={projects}
          unit={unit}
          mode={renderMode}
          visible={view === "projects"}
          onOpen={open}
          onCreate={create}
          onDuplicate={duplicate}
          onRemove={remove}
          onReplace={replaceAll}
          cloudEnabled={Boolean(user && !user.isDevFallback)}
        />
      </div>

      <nav className="grid grid-cols-3 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={
              view === item.id
                ? "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium text-brass"
                : "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium text-muted"
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <ExportPanel open={exportOpen} onClose={() => setExportOpen(false)} activeName={active?.name ?? null} projects={projects} />
      <Guide view={view} />
    </div>
  );
}

function SyncLabel({ status }: { status: ReturnType<typeof useCloudSync>["status"] }) {
  const label = {
    local: "Saved on this device",
    loading: "Connecting cloud…",
    saving: "Syncing…",
    saved: "Cloud synced",
    offline: "Offline — saved locally",
    conflict: "Sync needs attention",
  }[status];
  return <p className="shrink-0 font-mono text-xs text-muted" aria-live="polite">{label}</p>;
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex min-h-11 items-center gap-3 rounded-md bg-brass/10 px-3 text-sm font-medium text-brass"
          : "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg"
      }
    >
      <Icon className="size-4" />
      {item.label}
    </button>
  );
}

function UnitToggle({ unit, onChange }: { unit: "in" | "mm"; onChange: (unit: "in" | "mm") => void }) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      {(["in", "mm"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={unit === option}
          onClick={() => onChange(option)}
          className={
            unit === option
              ? "min-h-9 min-w-10 rounded px-2 font-mono text-xs text-brass-ink bg-brass"
              : "min-h-9 min-w-10 rounded px-2 font-mono text-xs text-muted"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={ink.surface} stroke={ink.line} />
      <circle cx="16" cy="16" r="8" fill="none" stroke={ink.brass} strokeWidth="1.6" />
      <path d="M16 8.5 V16 L21.5 19.5" fill="none" stroke={ink.brass} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.3" fill={ink.blueprint} />
    </svg>
  );
}
