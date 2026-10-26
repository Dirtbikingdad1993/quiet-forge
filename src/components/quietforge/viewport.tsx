import { useEffect, useRef, useState } from "react";
import { Crosshair, Download, Maximize2, Minus, Plus } from "lucide-react";
import { ink } from "@/lib/quietforge/ink";
import { fmtLen, type Derived, type RenderMode, type Unit } from "@/lib/quietforge/model";
import { Scene } from "@/components/quietforge/scene";

type Props = {
  derived: Derived;
  mode: RenderMode;
  unit: Unit;
  visible: boolean;
};

export function Viewport({ derived, mode, unit, visible }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(80);
  const [pan, setPan] = useState({ x: 40, y: 180 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);
  const fitted = useRef("");

  const fit = () => {
    const el = wrapRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 40) return false;
    const p = derived.project;
    const padL = mode === "blueprint" ? 1.15 : p.mount === "hub" ? 0.7 : 0.4;
    const padR = mode === "blueprint" ? 2.1 : 0.55;
    const padY = mode === "blueprint" ? 1.15 : 0.45;
    const worldW = p.lengthIn + padL + padR;
    const worldH = p.odIn + padY * 2;
    const z = Math.min(rect.width / worldW, rect.height / worldH) * 0.92;
    setZoom(z);
    setPan({
      x: (rect.width - p.lengthIn * z) / 2 + (padL - padR) * 0.12 * z,
      y: rect.height / 2,
    });
    return true;
  };

  useEffect(() => {
    if (!visible) {
      fitted.current = "";
      return;
    }
    const key = `${derived.project.id}:${mode}`;
    if (fitted.current === key) return;
    const frame = requestAnimationFrame(() => {
      if (fit()) fitted.current = key;
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, derived.project.id, mode, derived.project.mount]);

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const wx = (px - pan.x) / zoom;
    const wy = (py - pan.y) / zoom;
    const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
    const next = Math.min(720, Math.max(18, zoom * factor));
    setZoom(next);
    setPan({ x: px - wx * next, y: py - wy * next });
  };

  const track = (clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || !xRef.current || !yRef.current) return;
    const wx = (clientX - rect.left - pan.x) / zoom;
    const wy = -(clientY - rect.top - pan.y) / zoom;
    xRef.current.textContent = fmtLen(wx, unit, 3);
    yRef.current.textContent = fmtLen(wy, unit, 3);
  };

  const exportSvg = () => {
    const src = svgRef.current;
    const wrap = wrapRef.current;
    if (!src || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const clone = src.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(Math.round(rect.width)));
    clone.setAttribute("height", String(Math.round(rect.height)));
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", "100%");
    bg.setAttribute("height", "100%");
    bg.setAttribute("fill", ink.bg);
    clone.insertBefore(bg, clone.firstChild);
    const note = document.createElementNS("http://www.w3.org/2000/svg", "text");
    note.setAttribute("x", "16");
    note.setAttribute("y", String(Math.round(rect.height - 16)));
    note.setAttribute("fill", ink.muted);
    note.setAttribute("font-size", "12");
    note.setAttribute("font-family", "IBM Plex Mono, ui-monospace, monospace");
    note.textContent = "QUIETFORGE CONCEPT SKETCH — NOT A MANUFACTURING DRAWING";
    clone.appendChild(note);
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${derived.project.name.replace(/\s+/g, "-").toLowerCase()}-sketch.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const lines = [];
  if (mode === "blueprint") {
    for (let x = -2; x <= 18; x += 1) {
      lines.push(
        <line
          key={`vx${x}`}
          x1={x}
          y1={-8}
          x2={x}
          y2={8}
          stroke={ink.blueprint}
          strokeOpacity={0.16}
          vectorEffect="non-scaling-stroke"
        />,
      );
    }
    for (let y = -6; y <= 6; y += 1) {
      lines.push(
        <line
          key={`hy${y}`}
          x1={-4}
          y1={y}
          x2={20}
          y2={y}
          stroke={ink.blueprint}
          strokeOpacity={0.16}
          vectorEffect="non-scaling-stroke"
        />,
      );
    }
  }

  return (
    <div
      ref={wrapRef}
      className={
        mode === "blueprint"
          ? "qf-blueprint relative h-full min-h-64 w-full cursor-grab touch-none overflow-hidden bg-bg active:cursor-grabbing"
          : "qf-dots relative h-full min-h-64 w-full cursor-grab touch-none overflow-hidden bg-bg active:cursor-grabbing"
      }
      onWheel={onWheel}
      onDoubleClick={fit}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        drag.current = { dx: e.clientX - pan.x, dy: e.clientY - pan.y };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        track(e.clientX, e.clientY);
        if (!drag.current) return;
        setPan({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <svg ref={svgRef} className="h-full w-full">
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {lines}
          <Scene
            derived={derived}
            mode={mode}
            unit={unit}
            zoom={zoom}
            showDims={mode === "blueprint"}
            showLabels
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-3 rounded-md border border-border bg-surface/90 px-3 py-2 font-mono text-xs text-muted">
        <Crosshair className="size-3.5 text-brass" />
        <span>
          X <span ref={xRef} className="text-brass">0.000 in</span>
        </span>
        <span>
          Y <span ref={yRef} className="text-brass">0.000 in</span>
        </span>
        <span>
          <span className="text-fg">{Math.round(zoom)} px/in</span>
        </span>
      </div>

      <p className="pointer-events-none absolute bottom-3 left-3 hidden font-mono text-xs text-muted sm:block">
        Drag to pan · scroll to zoom · double-click to fit
      </p>

      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-border bg-surface/95 p-1">
        <IconButton label="Zoom out" onClick={() => setZoom((z) => Math.max(18, z / 1.15))}>
          <Minus className="size-4" />
        </IconButton>
        <IconButton label="Zoom in" onClick={() => setZoom((z) => Math.min(720, z * 1.15))}>
          <Plus className="size-4" />
        </IconButton>
        <IconButton label="Fit sketch" onClick={fit}>
          <Maximize2 className="size-4" />
        </IconButton>
        <IconButton label="Download SVG sketch" onClick={exportSvg}>
          <Download className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors hover:bg-surface-2 hover:text-brass"
    >
      {children}
    </button>
  );
}
