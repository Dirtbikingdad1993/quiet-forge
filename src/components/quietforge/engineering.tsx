import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ink } from "@/lib/quietforge/ink";
import {
  MATERIALS,
  derive,
  fmtIn3,
  fmtLen,
  fmtPsi,
  wallSweep,
  type Project,
  type Unit,
} from "@/lib/quietforge/model";

export function Engineering({
  project,
  unit,
  visible,
  onChange,
}: {
  project: Project | null;
  unit: Unit;
  visible: boolean;
  onChange: (patch: Partial<Project>) => void;
}) {
  if (!project) {
    return (
      <div className={visible ? "min-h-0 flex-1 overflow-y-auto" : "hidden"}>
        <p className="px-6 py-16 text-sm text-muted">Open a study to run the classroom screen.</p>
      </div>
    );
  }

  const d = derive(project);
  const rows = wallSweep(project).map((row) => ({
    wall: unit === "mm" ? Math.round(row.wall * 25.4 * 10) / 10 : row.wall,
    sf: row.sf,
    stress: row.stress,
  }));
  const wallNow = unit === "mm" ? Math.round(project.wallIn * 25.4 * 10) / 10 : Math.round(project.wallIn * 1000) / 1000;
  const domainMax = Math.max(2, Math.min(20, (Number.isFinite(d.safetyFactor) ? d.safetyFactor : 2) * 1.8));

  return (
    <div className={visible ? "min-h-0 flex-1 overflow-y-auto" : "hidden"}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Classroom screen</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            A thin-wall hoop check and a rough internal volume. Gas in a suppressor is a blast, not a steady
            pressure in a pipe. These figures never clear a design to be built or fired.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Stat label="Free volume" value={fmtIn3(d.freeIn3, unit)} hint="Cavity minus a flat-disk allowance per baffle" />
          <Stat label="Expansion" value={`${d.expansion.toFixed(1)}×`} hint="Inner area ÷ aperture area. Not decibels." />
          <Stat label="Mean spacing" value={d.spacingIn > 0 ? fmtLen(d.spacingIn, unit, 2) : "—"} hint="Axis pitch of the stack" />
          <Stat label="Sketch mass" value={`${d.massOz.toFixed(1)} oz`} hint="Tube shell plus disk allowance" />
          <Stat label="Hoop stress" value={fmtPsi(d.hoopPsi)} hint="P × inner radius ÷ wall, at your assumption" />
          <Stat
            label="Yield ÷ hoop"
            value={Number.isFinite(d.safetyFactor) ? d.safetyFactor.toFixed(2) : "—"}
            hint={d.materialName}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-surface p-4 lg:col-span-3">
            <h2 className="text-sm font-semibold">Hoop screen versus wall</h2>
            <p className="mt-1 text-xs text-muted">
              Same outer diameter and assumed pressure. The brass line is this sketch.
            </p>
            <div className="mt-3 h-56 w-full min-w-0">
              {visible ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={ink.line} strokeOpacity={0.45} />
                    <XAxis
                      type="number"
                      dataKey="wall"
                      domain={["dataMin", "dataMax"]}
                      stroke={ink.muted}
                      tick={{ fill: ink.muted, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      unit={unit === "mm" ? " mm" : " in"}
                    />
                    <YAxis
                      stroke={ink.muted}
                      tick={{ fill: ink.muted, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, domainMax]}
                      width={36}
                    />
                    <Tooltip
                      contentStyle={{
                        background: ink.surface,
                        border: `1px solid ${ink.line}`,
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: ink.fg }}
                      itemStyle={{ color: ink.brass }}
                      formatter={(value) => {
                        const n = typeof value === "number" ? value : Number(value);
                        return [Number.isFinite(n) ? n.toFixed(2) : "—", "Yield / hoop"];
                      }}
                    />
                    <ReferenceLine y={1} stroke={ink.danger} strokeDasharray="4 4" />
                    <ReferenceLine x={wallNow} stroke={ink.brass} />
                    <Line type="monotone" dataKey="sf" stroke={ink.blueprint} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-md bg-bg" />
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-surface p-4 lg:col-span-2">
            <label className="block text-sm text-muted">
              Material, room-temp yield
              <select
                value={project.materialId}
                onChange={(e) => onChange({ materialId: e.target.value })}
                className="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-brass"
              >
                {MATERIALS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs leading-relaxed text-muted">{MATERIALS.find((m) => m.id === project.materialId)?.note}</p>
            <label className="block text-sm text-muted">
              <span className="flex items-baseline justify-between">
                <span>Assumed pressure</span>
                <span className="font-mono text-xs text-brass">{fmtPsi(project.assumedPressurePsi)}</span>
              </span>
              <input
                type="range"
                min={2000}
                max={60000}
                step={500}
                value={project.assumedPressurePsi}
                onChange={(e) => onChange({ assumedPressurePsi: Number(e.target.value) })}
                className="mt-2 w-full"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                [8000, "8k"],
                [15000, "15k"],
                [35000, "35k"],
                [55000, "55k"],
              ].map(([psi, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onChange({ assumedPressurePsi: Number(psi) })}
                  className="min-h-10 rounded-md border border-border px-3 font-mono text-xs text-fg hover:border-brass"
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Rifle chamber pressure is often near 55,000 psi at the case. Pressure along a tube is lower and
              uneven. This slider is your assumption, not a prediction.{" "}
              {d.thinWall ? "Thin-wall formula is in range." : "Wall is thick enough that the thin-wall formula is weak."}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">What this screen ignores</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
            <li>Blast reflection and the load on each baffle face</li>
            <li>Heat, erosion, and carbon packing</li>
            <li>Threads, shoulders, welds, and sharp corners</li>
            <li>Cone buckling and real baffle thickness</li>
            <li>Ammunition, barrel length, and firing schedule</li>
            <li>Any path from a sketch to a finished part</li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-fg">
            {screenSentence(d.safetyFactor)}
          </p>
        </section>

        <section>
          <label className="block text-sm text-muted" htmlFor="study-notes">
            Notes on {project.name}
            <textarea
              id="study-notes"
              value={project.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              rows={4}
              className="mt-1.5 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-fg outline-none focus:border-brass"
            />
          </label>
        </section>
      </div>
    </div>
  );
}

function screenSentence(sf: number) {
  if (!Number.isFinite(sf)) return "The hoop estimate is not available for this geometry.";
  const base = `Published yield divided by the assumed hoop stress is ${sf.toFixed(2)}.`;
  if (sf < 1) {
    return `${base} That assumption is past the published yield on a static screen. Clearing the screen the other way would still not approve anything.`;
  }
  return `${base} A larger number is not permission to manufacture or fire. The load this formula skips is the one that matters.`;
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-3">
      <p className="font-mono text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-lg text-fg">{value}</p>
      <p className="mt-1 text-xs leading-snug text-muted">{hint}</p>
    </div>
  );
}
