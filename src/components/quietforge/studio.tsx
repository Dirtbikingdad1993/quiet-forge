import { CALIBERS, derive, type Project, type Unit } from "@/lib/quietforge/model";
import { CountControl, LengthControl, SelectField } from "@/components/quietforge/ui";
import { Viewport } from "@/components/quietforge/viewport";

const LEVEL = {
  ok: "text-ok",
  note: "text-muted",
  warn: "text-brass",
  bad: "text-danger",
} as const;

export function Studio({
  project,
  unit,
  mode,
  visible,
  onChange,
  onMode,
}: {
  project: Project;
  unit: Unit;
  mode: "concept" | "blueprint";
  visible: boolean;
  onChange: (patch: Partial<Project>) => void;
  onMode: (mode: "concept" | "blueprint") => void;
}) {
  const derived = derive(project);
  const depthLabel = project.style === "radial" ? "Disk thickness" : "Cone depth";

  return (
    <div className={visible ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
        <input
          aria-label="Study name"
          value={project.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-fg outline-none placeholder:text-muted sm:max-w-sm"
        />
        <span className="hidden font-mono text-xs text-muted md:inline">{derived.caliberLabel}</span>
        <div className="ml-auto flex rounded-md border border-border bg-bg p-1">
          <ModeButton active={mode === "concept"} onClick={() => onMode("concept")}>
            Concept
          </ModeButton>
          <ModeButton active={mode === "blueprint"} onClick={() => onMode("blueprint")}>
            Blueprint
          </ModeButton>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="h-[46dvh] min-h-64 lg:h-auto lg:min-h-0 lg:flex-1">
          <Viewport derived={derived} mode={mode} unit={unit} visible={visible} />
        </div>

        <aside className="min-h-0 flex-1 overflow-y-auto border-t border-border bg-surface lg:w-80 lg:flex-none lg:border-l lg:border-t-0">
          <div className="space-y-6 p-4">
            <section className="space-y-4">
              <h2 className="font-mono text-xs tracking-wide text-brass">ENVELOPE</h2>
              <SelectField label="Caliber" value={project.caliberId} onChange={(caliberId) => onChange({ caliberId })}>
                {["Rimfire", "Rifle", "Pistol"].map((group) => (
                  <optgroup key={group} label={group}>
                    {CALIBERS.filter((c) => c.group === group).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} · {c.diameterIn.toFixed(3)} in
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectField>
              <LengthControl label="Tube length" inches={project.lengthIn} minIn={3} maxIn={14} stepIn={0.05} unit={unit} digits={2} onChange={(lengthIn) => onChange({ lengthIn })} />
              <LengthControl label="Outer diameter" inches={project.odIn} minIn={0.9} maxIn={2.4} stepIn={0.025} unit={unit} digits={3} onChange={(odIn) => onChange({ odIn })} />
              <LengthControl label="Wall thickness" inches={project.wallIn} minIn={0.03} maxIn={0.2} stepIn={0.005} unit={unit} digits={3} onChange={(wallIn) => onChange({ wallIn })} />
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xs tracking-wide text-brass">STACK</h2>
              <LengthControl label="Blast chamber" inches={project.blastIn} minIn={0.4} maxIn={6} stepIn={0.05} unit={unit} digits={2} onChange={(blastIn) => onChange({ blastIn })} />
              <CountControl label="Baffle count" value={project.baffleCount} min={1} max={12} onChange={(baffleCount) => onChange({ baffleCount })} />
              <LengthControl label={depthLabel} inches={project.coneDepthIn} minIn={0.08} maxIn={0.9} stepIn={0.02} unit={unit} digits={2} onChange={(coneDepthIn) => onChange({ coneDepthIn })} />
              <LengthControl label="Aperture over bullet" inches={project.boreClearanceIn} minIn={0.02} maxIn={0.1} stepIn={0.005} unit={unit} digits={3} onChange={(boreClearanceIn) => onChange({ boreClearanceIn })} />
              <SelectField label="Baffle sketch" value={project.style} onChange={(style) => onChange({ style: style as Project["style"] })}>
                <option value="cone">Coaxial cone</option>
                <option value="clipped">Clipped cone</option>
                <option value="radial">Flat disk</option>
              </SelectField>
              <SelectField label="Rear interface" value={project.mount} onChange={(mount) => onChange({ mount: mount as Project["mount"] })}>
                <option value="direct-thread">Direct-thread shoulder</option>
                <option value="hub">Hub flange</option>
              </SelectField>
              <StackBudget derived={derived} />
            </section>

            <section className="space-y-2">
              <h2 className="font-mono text-xs tracking-wide text-brass">FIT</h2>
              <ul className="space-y-2">
                {derived.issues.map((issue) => (
                  <li key={issue.text} className={`text-sm leading-snug ${LEVEL[issue.level]}`}>
                    {issue.text}
                  </li>
                ))}
              </ul>
              <dl className="grid grid-cols-2 gap-2 pt-2 font-mono text-xs text-muted">
                <div className="rounded-md border border-border bg-bg px-2 py-2">
                  <dt>ID</dt>
                  <dd className="text-fg">{derived.idIn.toFixed(3)} in</dd>
                </div>
                <div className="rounded-md border border-border bg-bg px-2 py-2">
                  <dt>Aperture</dt>
                  <dd className="text-fg">{derived.boreIn.toFixed(3)} in</dd>
                </div>
                <div className="rounded-md border border-border bg-bg px-2 py-2">
                  <dt>Spacing</dt>
                  <dd className="text-fg">{derived.spacingIn > 0 ? derived.spacingIn.toFixed(3) : "—"} in</dd>
                </div>
                <div className="rounded-md border border-border bg-bg px-2 py-2">
                  <dt>Expansion</dt>
                  <dd className="text-fg">{derived.expansion.toFixed(1)}×</dd>
                </div>
              </dl>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "min-h-10 rounded px-3 text-sm font-medium bg-brass text-brass-ink"
          : "min-h-10 rounded px-3 text-sm font-medium text-muted hover:text-fg"
      }
    >
      {children}
    </button>
  );
}

function StackBudget({ derived }: { derived: ReturnType<typeof derive> }) {
  const L = derived.project.lengthIn;
  const rear = derived.rearIn / L;
  const blast = Math.max(0, derived.project.blastIn - derived.rearIn) / L;
  const front = derived.frontIn / L;
  const stack = Math.max(0.02, 1 - rear - blast - front);
  return (
    <div>
      <p className="mb-1.5 text-sm text-muted">Length budget</p>
      <div className="flex h-3 overflow-hidden rounded-sm bg-bg">
        <span className="bg-line" style={{ width: `${rear * 100}%` }} />
        <span className="bg-brass/40" style={{ width: `${blast * 100}%` }} />
        <span className="bg-brass" style={{ width: `${stack * 100}%` }} />
        <span className="bg-line" style={{ width: `${front * 100}%` }} />
      </div>
      <p className="mt-1.5 font-mono text-xs text-muted">Cap · blast · stack · cap</p>
    </div>
  );
}
