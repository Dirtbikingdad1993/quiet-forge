/** Safe, presentation-only concept files and an unrelated fixed calibration cube.
 * No suppressor dimensions or component geometry enter any STL/3MF export.
 */
const encoder = new TextEncoder();
const CUBE_MM = 20;
type Vertex = readonly [number, number, number];
const vertices: Vertex[] = [
  [-10, -10, 0], [10, -10, 0], [10, 10, 0], [-10, 10, 0],
  [-10, -10, CUBE_MM], [10, -10, CUBE_MM], [10, 10, CUBE_MM], [-10, 10, CUBE_MM],
];
const faces: [number, number, number][] = [
  [0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7],
  [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5],
  [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7],
];

const xmlEscape = (s: string) => s.replace(/[&<>"']/g, (v) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[v] || v
));
const plainAscii = (s: string) => s.normalize("NFKD").replace(/[^\x20-\x7E]/g, "?").slice(0, 85);
const pdfEscape = (s: string) => plainAscii(s).replace(/[\\()]/g, (c) => "\\" + c);

/** A branded, intentionally non-dimensional concept-cover graphic. */
export function makeConceptSvg(name: string): string {
  const label = xmlEscape(name.slice(0, 65));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#203444" stroke-width="1"/></pattern></defs>
  <rect width="1200" height="675" fill="#0a1019"/><rect width="1200" height="675" fill="url(#grid)" opacity=".65"/>
  <rect x="52" y="52" width="1096" height="571" rx="22" fill="#0f1a26" stroke="#39586a" stroke-width="2"/>
  <circle cx="105" cy="111" r="22" fill="none" stroke="#d9aa5f" stroke-width="3"/>
  <path d="M97 111h16m-8-8v16" stroke="#d9aa5f" stroke-width="2"/>
  <text x="146" y="117" fill="#d9aa5f" font-family="sans-serif" font-size="26" font-weight="700">SUPPRESSOR STUDIO</text>
  <text x="96" y="216" fill="#8ba2b6" font-family="sans-serif" font-size="23" letter-spacing="3">EDUCATIONAL CONCEPT RECORD</text>
  <text x="96" y="297" fill="#f2f5f7" font-family="sans-serif" font-weight="700" font-size="44" textLength="0">${label}</text>
  <path d="M96 355H1104" stroke="#476478" stroke-width="2"/>
  <circle cx="320" cy="455" r="50" fill="none" stroke="#6bc4db" stroke-width="6"/>
  <circle cx="320" cy="455" r="14" fill="#6bc4db"/>
  <rect x="470" y="410" width="280" height="90" rx="14" fill="none" stroke="#d9aa5f" stroke-width="4"/>
  <path d="M790 456h145m-24-24 24 24-24 24" fill="none" stroke="#6bc4db" stroke-width="5" stroke-linecap="round"/>
  <text x="96" y="574" fill="#bed0dc" font-family="sans-serif" font-size="22">Presentation graphic only — not to scale</text>
  <text x="96" y="603" fill="#829aaa" font-family="sans-serif" font-size="18">No fabrication geometry or manufacturing approval is provided.</text>
</svg>`;
}

export function makeConceptPdf(name: string): Blob {
  const lines = [
    ["Suppressor Studio", 42, 735, 24],
    ["Educational concept record", 42, 686, 16],
    ["Study: " + name, 42, 642, 16],
    ["This file is a presentation summary, not a fabrication drawing.", 42, 585, 12],
    ["No printable suppressor geometry is provided.", 42, 562, 12],
    ["Use the JSON backup option to preserve your personal study data.", 42, 539, 12],
  ] as const;
  const stream = lines.map(([s, x, y, size]) =>
    `BT /F1 ${size} Tf ${x} ${y} Td (${pdfEscape(s)}) Tj ET`
  ).join("\n") + "\n";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}endstream`,
  ];
  let result = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((s, i) => { offsets.push(encoder.encode(result).length); result += `${i + 1} 0 obj\n${s}\nendobj\n`; });
  const start = encoder.encode(result).length;
  result += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((n) => { result += `${String(n).padStart(10, "0")} 00000 n \n`; });
  result += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
  return new Blob([result], { type: "application/pdf" });
}

function normal(a: Vertex, b: Vertex, c: Vertex): Vertex {
  const x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
  const u = c[0] - a[0], v = c[1] - a[1], w = c[2] - a[2];
  const n: Vertex = [y * w - z * v, z * u - x * w, x * v - y * u];
  const len = Math.hypot(...n);
  return [n[0] / len, n[1] / len, n[2] / len];
}

/** Binary STL for one fixed, solid 20 mm calibration cube, unrelated to saved studies. */
export function makeCalibrationStl(): Blob {
  const buffer = new ArrayBuffer(84 + faces.length * 50);
  const data = new DataView(buffer);
  encoder.encode("Suppressor Studio - generic calibration cube, 20mm").forEach((b, i) => data.setUint8(i, b));
  data.setUint32(80, faces.length, true);
  let offset = 84;
  for (const face of faces) {
    const a = vertices[face[0]], b = vertices[face[1]], c = vertices[face[2]];
    for (const point of [normal(a, b, c), a, b, c]) {
      for (const n of point) { data.setFloat32(offset, n, true); offset += 4; }
    }
    data.setUint16(offset, 0, true);
    offset += 2;
  }
  return new Blob([buffer], { type: "model/stl" });
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const b of bytes) {
    crc ^= b;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Minimal valid ZIP archive using STORE (no compression), for 3MF files. */
function zip(files: { name: string; data: string }[]): ArrayBuffer {
  const entries = files.map(({ name, data }) => ({
    name: encoder.encode(name), data: encoder.encode(data), crc: crc32(encoder.encode(data)),
  }));
  const localBytes = entries.reduce((n, e) => n + 30 + e.name.length + e.data.length, 0);
  const centralBytes = entries.reduce((n, e) => n + 46 + e.name.length, 0);
  const buffer = new ArrayBuffer(localBytes + centralBytes + 22);
  const view = new DataView(buffer), bytes = new Uint8Array(buffer);
  let at = 0;
  const write = (data: Uint8Array) => { bytes.set(data, at); at += data.length; };
  const offsets: number[] = [];
  for (const e of entries) {
    offsets.push(at);
    view.setUint32(at, 0x04034b50, true);
    view.setUint16(at + 4, 20, true);
    view.setUint32(at + 14, e.crc, true);
    view.setUint32(at + 18, e.data.length, true);
    view.setUint32(at + 22, e.data.length, true);
    view.setUint16(at + 26, e.name.length, true);
    at += 30; write(e.name); write(e.data);
  }
  const centralStart = at;
  entries.forEach((e, i) => {
    view.setUint32(at, 0x02014b50, true);
    view.setUint16(at + 4, 20, true);
    view.setUint16(at + 6, 20, true);
    view.setUint32(at + 16, e.crc, true);
    view.setUint32(at + 20, e.data.length, true);
    view.setUint32(at + 24, e.data.length, true);
    view.setUint16(at + 28, e.name.length, true);
    view.setUint32(at + 42, offsets[i], true);
    at += 46; write(e.name);
  });
  const centralLength = at - centralStart;
  view.setUint32(at, 0x06054b50, true);
  view.setUint16(at + 8, entries.length, true);
  view.setUint16(at + 10, entries.length, true);
  view.setUint32(at + 12, centralLength, true);
  view.setUint32(at + 16, centralStart, true);
  return buffer;
}

/** 3MF package containing the same fixed 20 mm calibration cube, in millimetres. */
export function makeCalibration3mf(): Blob {
  const model = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
 <metadata name="Title">Generic 20 mm calibration cube</metadata>
 <resources><object id="1" type="model" name="Calibration cube"><mesh>
  <vertices>${vertices.map(([x,y,z]) => `<vertex x="${x}" y="${y}" z="${z}"/>`).join("")}</vertices>
  <triangles>${faces.map(([v1,v2,v3]) => `<triangle v1="${v1}" v2="${v2}" v3="${v3}"/>`).join("")}</triangles>
 </mesh></object></resources><build><item objectid="1"/></build>
</model>`;
  return new Blob([zip([
    { name: "[Content_Types].xml", data: `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>` },
    { name: "_rels/.rels", data: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>` },
    { name: "3D/3dmodel.model", data: model },
  ])], { type: "model/3mf" });
}
