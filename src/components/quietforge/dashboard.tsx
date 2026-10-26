import { useRef, useState } from "react";
import { Copy, Download, Plus, Search, Trash2, Upload } from "lucide-react";
import { CardSketch } from "@/components/quietforge/scene";
import { Modal } from "@/components/quietforge/ui";
import {
  PRESETS,
  derive,
  fmtLen,
  parseBackup,
  type Project,
  type RenderMode,
  type Unit,
} from "@/lib/quietforge/model";

export function Dashboard({
  projects,
  unit,
  mode,
  visible,
  onOpen,
  onCreate,
  onDuplicate,
  onRemove,
  onReplace,
}: {
  projects: Project[];
  unit: Unit;
  mode: RenderMode;
  visible: boolean;
  onOpen: (id: string) => void;
  onCreate: (patch: Partial<Project>, name: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onReplace: (projects: Project[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("New envelope");
  const [preset, setPreset] = useState(PRESETS[0].id);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const needle = query.trim().toLowerCase();
  const shown = projects.filter((p) => {
    if (!needle) return true;
    const cal = derive(p).caliberLabel.toLowerCase();
    return p.name.toLowerCase().includes(needle) || cal.includes(needle);
  });

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ version: 3, projects }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quietforge-studies.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className={visible ? "min-h-0 flex-1 overflow-y-auto" : "hidden"}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Studies</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Parametric cross-sections saved on this device. Open one to edit the sketch.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brass px-3 text-sm font-semibold text-brass-ink"
            >
              <Plus className="size-4" />
              New study
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-fg"
            >
              <Download className="size-4" />
              Export
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-fg"
            >
              <Upload className="size-4" />
              Restore
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                const parsed = parseBackup(await file.text());
                if (!parsed) {
                  setNotice("That file is not a QuietForge study backup.");
                  return;
                }
                onReplace(parsed);
                setNotice(`Restored ${parsed.length} ${parsed.length === 1 ? "study" : "studies"}.`);
              }}
            />
          </div>
        </div>

        {notice && (
          <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg">{notice}</p>
        )}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or caliber"
            className="w-full rounded-md border border-border bg-surface py-3 pr-3 pl-10 text-sm text-fg outline-none focus:border-brass"
          />
        </div>

        {shown.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <p className="text-base font-medium">No matching studies</p>
            <p className="mt-1 text-sm text-muted">Clear the search, or start a new envelope.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {shown.map((project) => {
              const d = derive(project);
              return (
                <li key={project.id} className="overflow-hidden rounded-lg border border-border bg-surface">
                  <button
                    type="button"
                    onClick={() => onOpen(project.id)}
                    className="block h-36 w-full bg-bg text-left"
                  >
                    <CardSketch derived={d} mode={mode} />
                  </button>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold">{project.name}</h2>
                        <p className="mt-1 font-mono text-xs text-muted">
                          {d.caliberLabel} · {fmtLen(project.lengthIn, unit, 2)} · {project.baffleCount} baffles
                        </p>
                      </div>
                      <time className="font-mono text-xs text-muted" dateTime={new Date(project.updatedAt).toISOString()}>
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        }).format(project.updatedAt)}
                      </time>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onOpen(project.id)}
                        className="min-h-11 flex-1 rounded-md bg-brass/15 text-sm font-semibold text-brass"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        aria-label={`Duplicate ${project.name}`}
                        onClick={() => onDuplicate(project.id)}
                        className="inline-flex size-11 items-center justify-center rounded-md border border-border text-fg"
                      >
                        <Copy className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${project.name}`}
                        onClick={() => setPendingDelete(project)}
                        className="inline-flex size-11 items-center justify-center rounded-md border border-border text-danger"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal open={creating} title="New study" onClose={() => setCreating(false)}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const chosen = PRESETS.find((p) => p.id === preset) ?? PRESETS[0];
            onCreate(chosen.patch, name.trim() || chosen.name);
            setCreating(false);
          }}
        >
          <label className="block text-sm text-muted">
            Name
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-brass"
            />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm text-muted">Starting envelope</legend>
            {PRESETS.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2.5">
                <input
                  type="radio"
                  name="preset"
                  checked={preset === item.id}
                  onChange={() => setPreset(item.id)}
                  className="mt-1 accent-brass"
                />
                <span>
                  <span className="block text-sm text-fg">{item.name}</span>
                  <span className="block text-xs text-muted">{item.blurb}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setCreating(false)} className="min-h-11 rounded-md px-3 text-sm text-muted">
              Cancel
            </button>
            <button type="submit" className="min-h-11 rounded-md bg-brass px-4 text-sm font-semibold text-brass-ink">
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={pendingDelete !== null} title="Delete study?" onClose={() => setPendingDelete(null)}>
        <p className="text-sm text-muted">
          {pendingDelete ? `“${pendingDelete.name}” is removed from this device. Export first if you want a copy.` : ""}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setPendingDelete(null)} className="min-h-11 rounded-md px-3 text-sm text-muted">
            Keep
          </button>
          <button
            type="button"
            onClick={() => {
              if (pendingDelete) onRemove(pendingDelete.id);
              setPendingDelete(null);
            }}
            className="min-h-11 rounded-md bg-danger px-4 text-sm font-semibold text-fg"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
