import { useId } from "react";
import { ink } from "@/lib/quietforge/ink";
import { fmtLen, type Derived, type RenderMode, type Unit } from "@/lib/quietforge/model";

type Props = {
  derived: Derived;
  mode: RenderMode;
  unit: Unit;
  zoom: number;
  showDims: boolean;
  showLabels: boolean;
};

export function Scene({ derived, mode, unit, zoom, showDims, showLabels }: Props) {
  const uid = useId().replace(/:/g, "");
  const p = derived.project;
  const yO = p.odIn / 2;
  const yI = Math.max(derived.idIn / 2, 0.02);
  const yB = Math.min(derived.boreIn / 2, yI - 0.01);
  const L = p.lengthIn;
  const concept = mode === "concept";
  const stroke = concept ? ink.line : ink.blueprint;
  const metal = concept ? ink.surface2 : `url(#hatch-${uid})`;
  const cap = concept ? ink.surface : "none";
  const baffleFill = concept ? ink.brass : "none";
  const baffleStroke = concept ? ink.brassDeep : ink.blueprint;
  const px = (n: number) => n / zoom;

  return (
    <g>
      <defs>
        <pattern
          id={`hatch-${uid}`}
          width="0.12"
          height="0.12"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(40)"
        >
          <line x1="0" y1="0" x2="0" y2="0.12" stroke={ink.blueprint} strokeWidth="0.012" strokeOpacity="0.55" />
        </pattern>
      </defs>

      {p.mount === "hub" && (
        <g>
          <rect
            x={-0.34}
            y={-(yO + 0.09)}
            width={0.52}
            height={(yO + 0.09) * 2}
            fill={concept ? ink.surface : "none"}
            stroke={stroke}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <rect x={-0.36} y={-yB} width={0.4} height={yB * 2} fill={concept ? ink.lumen : ink.bg} />
        </g>
      )}

      <rect
        x={0}
        y={-yO}
        width={L}
        height={p.odIn}
        fill={metal}
        stroke={stroke}
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        x={derived.rearIn}
        y={-yI}
        width={Math.max(0.02, L - derived.rearIn - derived.frontIn)}
        height={yI * 2}
        fill={ink.bg}
      />

      {concept && derived.spanIn > 0 && (
        <rect
          x={derived.rearIn}
          y={-yI}
          width={Math.max(0, Math.min(p.blastIn, L - derived.frontIn) - derived.rearIn)}
          height={yI * 2}
          fill={ink.brass}
          opacity={0.08}
        />
      )}

      {derived.spanIn > -0.2 &&
        derived.baffles.map((b) => (
          <Baffle
            key={b.index}
            x={b.x}
            depth={p.coneDepthIn}
            yI={yI}
            yB={Math.max(yB, 0.02)}
            style={p.style}
            fill={baffleFill}
            stroke={baffleStroke}
          />
        ))}

      <rect
        x={0}
        y={-yO}
        width={derived.rearIn}
        height={p.odIn}
        fill={cap}
        stroke={stroke}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        x={L - derived.frontIn}
        y={-yO}
        width={derived.frontIn}
        height={p.odIn}
        fill={cap}
        stroke={stroke}
        vectorEffect="non-scaling-stroke"
      />
      <rect x={-0.02} y={-yB} width={derived.rearIn + 0.04} height={yB * 2} fill={concept ? ink.lumen : ink.bg} />
      <rect
        x={L - derived.frontIn - 0.01}
        y={-yB}
        width={derived.frontIn + 0.04}
        height={yB * 2}
        fill={concept ? ink.lumen : ink.bg}
      />

      <line
        x1={-0.45}
        y1={0}
        x2={L + 0.55}
        y2={0}
        stroke={concept ? ink.brass : ink.blueprint}
        strokeOpacity={0.7}
        strokeDasharray={`${px(5)} ${px(4)}`}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={derived.rearIn}
        y1={-yI}
        x2={L - derived.frontIn}
        y2={-yI}
        stroke={stroke}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={derived.rearIn}
        y1={yI}
        x2={L - derived.frontIn}
        y2={yI}
        stroke={stroke}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />

      {showLabels && (
        <g fill={concept ? ink.muted : ink.blueprint} fontFamily="IBM Plex Mono, ui-monospace, monospace">
          <text x={derived.rearIn + 0.08} y={-yI + px(14)} fontSize={px(11)}>
            BLAST
          </text>
          <text x={L - derived.frontIn - 0.05} y={-yO - px(8)} fontSize={px(11)} textAnchor="end">
            MUZZLE
          </text>
          <text x={p.mount === "hub" ? -0.34 : 0} y={yO + px(16)} fontSize={px(11)}>
            REAR
          </text>
        </g>
      )}

      {showDims && (
        <g>
          <DimH x1={0} x2={L} y={yO + 0.55} label={fmtLen(L, unit, 2)} zoom={zoom} />
          <DimH
            x1={0}
            x2={Math.min(p.blastIn, L)}
            y={-yO - 0.42}
            label={`blast ${fmtLen(p.blastIn, unit, 2)}`}
            zoom={zoom}
          />
          <DimV x={L + 0.48} y1={-yO} y2={yO} label={`OD ${fmtLen(p.odIn, unit, 2)}`} zoom={zoom} />
          <DimV x={-0.42} y1={-yO} y2={-yI} label={fmtLen(p.wallIn, unit, 3)} zoom={zoom} />
          {derived.baffles.length > 1 && derived.spacingIn > 0.15 && (
            <DimH
              x1={derived.baffles[0].x}
              x2={derived.baffles[1].x}
              y={yI - px(14)}
              label={fmtLen(derived.spacingIn, unit, 2)}
              zoom={zoom}
            />
          )}
        </g>
      )}
    </g>
  );
}

function Baffle({
  x,
  depth,
  yI,
  yB,
  style,
  fill,
  stroke,
}: {
  x: number;
  depth: number;
  yI: number;
  yB: number;
  style: "cone" | "clipped" | "radial";
  fill: string;
  stroke: string;
}) {
  const common = {
    fill,
    stroke,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
    fillOpacity: fill === "none" ? 0 : 0.92,
  };
  if (style === "radial") {
    const h = Math.max(0.02, yI - yB);
    return (
      <g>
        <rect x={x} y={-yI} width={depth} height={h} {...common} />
        <rect x={x} y={yB} width={depth} height={h} {...common} />
      </g>
    );
  }
  const port = style === "clipped" ? (yI - yB) * 0.42 : 0;
  const topApex = -(yB + port);
  const botApex = yB;
  return (
    <g>
      <polygon points={`${x},${-yI} ${x + depth},${topApex} ${x},${topApex}`} {...common} />
      <polygon points={`${x},${yI} ${x + depth},${botApex} ${x},${botApex}`} {...common} />
    </g>
  );
}

function DimH({ x1, x2, y, label, zoom }: { x1: number; x2: number; y: number; label: string; zoom: number }) {
  const tick = 7 / zoom;
  const mid = (x1 + x2) / 2;
  return (
    <g fill={ink.blueprint} stroke={ink.blueprint}>
      <line x1={x1} y1={y} x2={x2} y2={y} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <line x1={x1} y1={y - tick} x2={x1} y2={y + tick} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <line x1={x2} y1={y - tick} x2={x2} y2={y + tick} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <text
        x={mid}
        y={y - 5 / zoom}
        textAnchor="middle"
        fontSize={11 / zoom}
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

function DimV({ x, y1, y2, label, zoom }: { x: number; y1: number; y2: number; label: string; zoom: number }) {
  const tick = 7 / zoom;
  const mid = (y1 + y2) / 2;
  return (
    <g fill={ink.blueprint} stroke={ink.blueprint}>
      <line x1={x} y1={y1} x2={x} y2={y2} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <line x1={x - tick} y1={y1} x2={x + tick} y2={y1} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <line x1={x - tick} y1={y2} x2={x + tick} y2={y2} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <text
        x={x + 8 / zoom}
        y={mid}
        dominantBaseline="middle"
        fontSize={11 / zoom}
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

export function CardSketch({ derived, mode }: { derived: Derived; mode: RenderMode }) {
  const p = derived.project;
  const padX = p.mount === "hub" ? 0.5 : 0.18;
  const padY = 0.22;
  return (
    <svg
      viewBox={`${-padX} ${-p.odIn / 2 - padY} ${p.lengthIn + padX + 0.2} ${p.odIn + padY * 2}`}
      className="h-full w-full"
      role="img"
      aria-label={`${p.name} cross-section`}
    >
      <rect x={-padX} y={-p.odIn / 2 - padY} width={p.lengthIn + padX + 0.2} height={p.odIn + padY * 2} fill={ink.bg} />
      <Scene derived={derived} mode={mode} unit="in" zoom={70} showDims={false} showLabels={false} />
    </svg>
  );
}
