import { useState } from "react";
import { Download, FileCode2, FileImage, FileText, Box } from "lucide-react";
import { Modal } from "@/components/quietforge/ui";
import type { Project } from "@/lib/quietforge/model";
import { makeConceptSvg, makeConceptPdf, makeCalibrationStl, makeCalibration3mf } from "@/lib/quietforge/export-safe";

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function safeName(name: string) {
  return (name.trim().replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").slice(0, 48) || "concept").toLowerCase();
}

async function exportPng(name: string) {
  const svg = makeConceptSvg(name);
  const src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not render the concept image."));
      image.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable on this browser.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("PNG creation is unavailable on this browser.");
    save(blob, `${safeName(name)}-overview.png`);
  } finally {
    URL.revokeObjectURL(src);
  }
}

function CubePreview({ angle, onAngle }: { angle: number; onAngle: (next: number) => void }) {
  const faces = [
    ["front", "translateZ(51px)"], ["back", "rotateY(180deg) translateZ(51px)"],
    ["left", "rotateY(-90deg) translateZ(51px)"], ["right", "rotateY(90deg) translateZ(51px)"],
    ["top", "rotateX(90deg) translateZ(51px)"], ["bottom", "rotateX(-90deg) translateZ(51px)"],
  ];
  return (
    <div className="rounded-lg border border-border bg-bg px-4 py-3">
      <div className="flex h-40 items-center justify-center" style={{ perspective: "600px" }}>
        <div className="relative h-[102px] w-[102px]" style={{ transformStyle: "preserve-3d", transform: `rotateX(-24deg) rotateY(${angle}deg)` }}>
          {faces.map(([face, transform]) => (
            <div key={face} className="absolute inset-0 flex items-center justify-center border-2 border-brass bg-brass/30 font-mono text-xs text-brass" style={{ transform, backfaceVisibility: "hidden" }}>
              {face === "front" ? "20 mm" : ""}
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-3 text-xs text-muted">
        Rotate preview
        <input aria-label="Rotate generic cube" className="min-w-0 flex-1 accent-brass" type="range" min="0" max="360" step="5" value={angle} onChange={(e) => onAngle(Number(e.target.value))} />
      </label>
    </div>
  );
}

export function ExportPanel({ open, onClose, activeName, projects }: {
  open: boolean;
  onClose: () => void;
  activeName: string | null;
  projects: Project[];
}) {
  const [angle, setAngle] = useState(30);
  const [error, setError] = useState("");
  const name = activeName ?? "New concept";
  const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-bg px-3 text-sm font-medium text-fg hover:bg-surface-2";
  const attempt = async (action: () => Promise<void> | void) => {
    setError("");
    try { await action(); } catch (e) { setError(e instanceof Error ? e.message : "Export could not be completed."); }
  };
  return (
    <Modal open={open} title="Export" onClose={onClose}>
      <div className="max-h-[68dvh] space-y-5 overflow-y-auto pr-1">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-brass">Concept &amp; study files</h3>
          <p className="text-xs leading-relaxed text-muted">
            SVG, PNG and PDF provide a branded, non-dimensional overview of the open study.
            They are presentation files, not scaled drawings or 3D print geometry.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className={button} type="button" onClick={() => void attempt(() => save(new Blob([makeConceptSvg(name)], { type: "image/svg+xml" }), `${safeName(name)}-overview.svg`))}>
              <FileCode2 className="size-4" /> SVG
            </button>
            <button className={button} type="button" onClick={() => void attempt(() => exportPng(name))}>
              <FileImage className="size-4" /> PNG
            </button>
            <button className={button} type="button" onClick={() => void attempt(() => save(makeConceptPdf(name), `${safeName(name)}-overview.pdf`))}>
              <FileText className="size-4" /> PDF
            </button>
            <button className={button} type="button" onClick={() => void attempt(() => save(new Blob([JSON.stringify({ version: 3, projects }, null, 2)], { type: "application/json" }), "suppressor-studio-studies.json"))}>
              <Download className="size-4" /> JSON backup
            </button>
          </div>
          <p className="text-xs text-muted">JSON keeps your saved study settings for restoration in this app; it is not a slicer or CAD file.</p>
        </section>
        <div className="h-px bg-border" />
        <section className="space-y-2">
          <div className="flex items-center gap-2"><Box className="size-4 text-brass" /><h3 className="text-sm font-semibold text-brass">Generic 3D demo — slicer compatible</h3></div>
          <p className="text-xs leading-relaxed text-muted">
            Fixed 20 × 20 × 20 mm solid calibration cube (not derived from your studies).
            Download STL or 3MF, then use File → Open in OrcaSlicer.
          </p>
          <CubePreview angle={angle} onAngle={setAngle} />
          <div className="grid grid-cols-2 gap-2">
            <button className={button} type="button" onClick={() => void attempt(() => save(makeCalibrationStl(), "generic-20mm-calibration-cube.stl"))}>
              <Download className="size-4" /> STL
            </button>
            <button className={button} type="button" onClick={() => void attempt(() => save(makeCalibration3mf(), "generic-20mm-calibration-cube.3mf"))}>
              <Download className="size-4" /> 3MF
            </button>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Suppressor components and study geometry cannot be exported to STL, 3MF or a slicer.
          </p>
        </section>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end">
          <button className="min-h-10 rounded-md px-4 text-sm text-muted hover:bg-surface-2" type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}
