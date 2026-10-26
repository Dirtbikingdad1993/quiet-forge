import { Calculator, Compass, FolderKanban } from "lucide-react";
import { Dashboard } from "@/components/quietforge/dashboard";
import { Engineering } from "@/components/quietforge/engineering";
import { Studio } from "@/components/quietforge/studio";
import { activeProject, useForge } from "@/lib/quietforge/store";
import { ink } from "@/lib/quietforge/ink";
import type { ViewId } from "@/lib/quietforge/model";

const NAV: { id: ViewId; label: string; icon: typeof Compass }[] = [
  { id: "studio", label: "Sketch", icon: Compass },
  { id: "engineering", label: "Screen", icon: Calculator },
  { id: "projects", label: "Studies", icon: FolderKanban },
];

export function Shell() {
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

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg lg:flex-row">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-3 px-4 py-5">
          <Mark />
          <div>
            <p className="text-sm font-semibold tracking-wide">QuietForge</p>
            <p className="font-mono text-xs text-brass">CONCEPT STUDIO</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavButton key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
          ))}
        </nav>
        <div className="space-y-2 border-t border-border px-4 py-4">
          <UnitToggle unit={unit} onChange={setUnit} />
          <p className="font-mono text-xs text-muted">Saved on this device</p>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <Mark />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">QuietForge</p>
            <p className="font-mono text-xs text-brass">Concept studio</p>
          </div>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <p className="border-b border-border px-4 py-2 text-xs leading-relaxed text-muted">
          Concept sketches only. In the US a silencer is an NFA firearm — making one without an approved Form 1
          is a federal felony. This is not a manufacturing drawing, a print file, or a safety approval.
        </p>

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
    </div>
  );
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
