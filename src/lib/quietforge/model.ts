export type BaffleStyle = "cone" | "clipped" | "radial";
export type MountStyle = "direct-thread" | "hub";
export type Unit = "in" | "mm";
export type RenderMode = "concept" | "blueprint";
export type ViewId = "projects" | "studio" | "engineering";

export type Project = {
  id: string;
  name: string;
  updatedAt: number;
  caliberId: string;
  lengthIn: number;
  odIn: number;
  wallIn: number;
  blastIn: number;
  baffleCount: number;
  coneDepthIn: number;
  boreClearanceIn: number;
  style: BaffleStyle;
  mount: MountStyle;
  notes: string;
  assumedPressurePsi: number;
  materialId: string;
};

export type IssueLevel = "ok" | "note" | "warn" | "bad";

export type Issue = { level: IssueLevel; text: string };

export type BaffleMark = { index: number; x: number };

export type Derived = {
  project: Project;
  caliberLabel: string;
  bulletIn: number;
  boreIn: number;
  idIn: number;
  rearIn: number;
  frontIn: number;
  skirtIn: number;
  spacingIn: number;
  spanIn: number;
  baffles: BaffleMark[];
  expansion: number;
  cavityIn3: number;
  freeIn3: number;
  massOz: number;
  hoopPsi: number;
  safetyFactor: number;
  thinWall: boolean;
  issues: Issue[];
  materialName: string;
  yieldPsi: number;
};

export type Caliber = {
  id: string;
  label: string;
  diameterIn: number;
  group: string;
};

export type Material = {
  id: string;
  name: string;
  yieldPsi: number;
  densityLbPerIn3: number;
  note: string;
};

export const CALIBERS: Caliber[] = [
  { id: "22lr", label: ".22 LR", diameterIn: 0.223, group: "Rimfire" },
  { id: "556", label: "5.56 / .223", diameterIn: 0.224, group: "Rifle" },
  { id: "65", label: "6.5 Creedmoor", diameterIn: 0.264, group: "Rifle" },
  { id: "300blk", label: ".300 BLK", diameterIn: 0.308, group: "Rifle" },
  { id: "308", label: ".308 Win", diameterIn: 0.308, group: "Rifle" },
  { id: "9mm", label: "9mm", diameterIn: 0.355, group: "Pistol" },
  { id: "45", label: ".45 ACP", diameterIn: 0.452, group: "Pistol" },
];

export const MATERIALS: Material[] = [
  {
    id: "17-4",
    name: "17-4 PH, H900",
    yieldPsi: 170000,
    densityLbPerIn3: 0.282,
    note: "Typical aged room-temp yield, not a cert.",
  },
  {
    id: "316",
    name: "316L annealed",
    yieldPsi: 25000,
    densityLbPerIn3: 0.289,
    note: "Annealed minimum. Cold work is higher.",
  },
  {
    id: "ti64",
    name: "Ti-6Al-4V",
    yieldPsi: 120000,
    densityLbPerIn3: 0.16,
    note: "Typical annealed room-temp yield.",
  },
  {
    id: "718",
    name: "Inconel 718",
    yieldPsi: 150000,
    densityLbPerIn3: 0.296,
    note: "Typical aged room-temp yield.",
  },
];

export const REAR_CAP_IN = 0.22;
export const FRONT_CAP_IN = 0.2;

const LIMITS = {
  lengthIn: [3, 16] as const,
  odIn: [0.85, 2.6] as const,
  wallIn: [0.025, 0.28] as const,
  blastIn: [0.3, 10] as const,
  baffleCount: [1, 14] as const,
  coneDepthIn: [0.08, 1.1] as const,
  boreClearanceIn: [0.015, 0.12] as const,
  assumedPressurePsi: [1000, 70000] as const,
};

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function caliberById(id: string) {
  return CALIBERS.find((c) => c.id === id) ?? CALIBERS[4];
}

export function materialById(id: string) {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}

export function defaultProject(over: Partial<Project> = {}): Project {
  return sanitize({
    id: over.id ?? "study-untitled",
    name: "Untitled study",
    updatedAt: Date.now(),
    caliberId: "308",
    lengthIn: 8,
    odIn: 1.5,
    wallIn: 0.065,
    blastIn: 1.9,
    baffleCount: 7,
    coneDepthIn: 0.36,
    boreClearanceIn: 0.04,
    style: "cone",
    mount: "direct-thread",
    notes: "",
    assumedPressurePsi: 15000,
    materialId: "17-4",
    ...over,
  });
}

export function sanitize(p: Project): Project {
  const lengthIn = clamp(num(p.lengthIn, 8), LIMITS.lengthIn[0], LIMITS.lengthIn[1]);
  const odIn = clamp(num(p.odIn, 1.5), LIMITS.odIn[0], LIMITS.odIn[1]);
  let wallIn = clamp(num(p.wallIn, 0.065), LIMITS.wallIn[0], LIMITS.wallIn[1]);
  const maxWall = (odIn - 0.12) / 2;
  if (wallIn > maxWall) wallIn = Math.max(LIMITS.wallIn[0], maxWall);
  const style: BaffleStyle = p.style === "clipped" || p.style === "radial" ? p.style : "cone";
  const mount: MountStyle = p.mount === "hub" ? "hub" : "direct-thread";
  const caliberId = CALIBERS.some((c) => c.id === p.caliberId) ? p.caliberId : "308";
  const materialId = MATERIALS.some((m) => m.id === p.materialId) ? p.materialId : "17-4";
  return {
    ...p,
    name: (p.name || "Untitled study").slice(0, 64),
    notes: (p.notes || "").slice(0, 2000),
    updatedAt: Number.isFinite(p.updatedAt) ? p.updatedAt : Date.now(),
    caliberId,
    materialId,
    style,
    mount,
    lengthIn,
    odIn,
    wallIn,
    blastIn: clamp(num(p.blastIn, 1.9), LIMITS.blastIn[0], LIMITS.blastIn[1]),
    baffleCount: Math.round(clamp(num(p.baffleCount, 7), LIMITS.baffleCount[0], LIMITS.baffleCount[1])),
    coneDepthIn: clamp(num(p.coneDepthIn, 0.36), LIMITS.coneDepthIn[0], LIMITS.coneDepthIn[1]),
    boreClearanceIn: clamp(num(p.boreClearanceIn, 0.04), LIMITS.boreClearanceIn[0], LIMITS.boreClearanceIn[1]),
    assumedPressurePsi: clamp(
      num(p.assumedPressurePsi, 15000),
      LIMITS.assumedPressurePsi[0],
      LIMITS.assumedPressurePsi[1],
    ),
  };
}

function num(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export function derive(project: Project): Derived {
  const p = sanitize(project);
  const cal = caliberById(p.caliberId);
  const mat = materialById(p.materialId);
  const boreIn = cal.diameterIn + p.boreClearanceIn;
  const idIn = p.odIn - 2 * p.wallIn;
  const rearIn = REAR_CAP_IN;
  const frontIn = FRONT_CAP_IN;
  const skirtIn = p.style === "radial" ? p.coneDepthIn : 0.045;
  const depth = p.coneDepthIn;
  const last = p.lengthIn - frontIn - depth;
  const spanIn = last - p.blastIn;
  const spacingIn = p.baffleCount <= 1 ? 0 : spanIn / (p.baffleCount - 1);
  const baffles: BaffleMark[] = [];
  for (let i = 0; i < p.baffleCount; i++) {
    const x = p.baffleCount === 1 ? p.blastIn : p.blastIn + i * spacingIn;
    baffles.push({ index: i, x });
  }

  const cavityLen = Math.max(0, p.lengthIn - rearIn - frontIn);
  const cavityIn3 = Math.PI * (idIn / 2) ** 2 * cavityLen;
  const disk =
    Math.PI * Math.max(0, (idIn / 2) ** 2 - (Math.min(boreIn, idIn) / 2) ** 2) * Math.max(skirtIn, 0);
  const freeIn3 = Math.max(0, cavityIn3 - disk * p.baffleCount);
  const tubeMetal = Math.PI * Math.max(0, (p.odIn / 2) ** 2 - (idIn / 2) ** 2) * p.lengthIn;
  const massOz = (tubeMetal + disk * p.baffleCount) * mat.densityLbPerIn3 * 16;
  const expansion = boreIn > 0 && idIn > 0 ? (idIn / 2) ** 2 / (boreIn / 2) ** 2 : 0;
  const hoopPsi = idIn > 0 && p.wallIn > 0 ? (p.assumedPressurePsi * (idIn / 2)) / p.wallIn : Infinity;
  const safetyFactor = hoopPsi > 0 && Number.isFinite(hoopPsi) ? mat.yieldPsi / hoopPsi : 0;
  const thinWall = p.wallIn < idIn / 10;

  const issues: Issue[] = [];
  if (!(idIn > boreIn + 0.02)) {
    issues.push({
      level: "bad",
      text: "Interior does not clear the aperture. Lower the wall, the clearance, or the caliber.",
    });
  }
  if (p.blastIn < rearIn + 0.08) {
    issues.push({
      level: "warn",
      text: "Blast chamber is shorter than the rear cap, so the first cone collides with it in this sketch.",
    });
  }
  if (spanIn < 0.04) {
    issues.push({
      level: "bad",
      text: "The stack does not fit. Lengthen the tube, shorten the blast chamber, or reduce cone depth.",
    });
  } else if (p.baffleCount > 1 && p.style !== "radial" && spacingIn < depth * 0.98) {
    issues.push({
      level: "warn",
      text: "Cones overlap on the axis. Add length, or reduce count or cone depth.",
    });
  }
  if (p.wallIn < 0.04) {
    issues.push({
      level: "note",
      text: "Wall is thin for a tube sketch. That is a proportion note, not a pressure rating.",
    });
  }
  if (!thinWall && idIn > 0) {
    issues.push({
      level: "note",
      text: "Wall is thick relative to the inner radius. A thin-wall hoop formula is a weak model here.",
    });
  }
  if (issues.length === 0) {
    issues.push({
      level: "ok",
      text: "The sketch fits: aperture, caps, and stack clear each other. Fit is not a safety approval.",
    });
  }

  return {
    project: p,
    caliberLabel: cal.label,
    bulletIn: cal.diameterIn,
    boreIn,
    idIn,
    rearIn,
    frontIn,
    skirtIn,
    spacingIn,
    spanIn,
    baffles,
    expansion,
    cavityIn3,
    freeIn3,
    massOz,
    hoopPsi,
    safetyFactor,
    thinWall,
    issues,
    materialName: mat.name,
    yieldPsi: mat.yieldPsi,
  };
}

export type SweepRow = { wall: number; sf: number; stress: number };

export function wallSweep(project: Project): SweepRow[] {
  const mat = materialById(project.materialId);
  const rows: SweepRow[] = [];
  for (let i = 0; i <= 28; i++) {
    const wall = 0.03 + i * 0.005;
    const id = project.odIn - 2 * wall;
    if (id <= 0.15) break;
    const stress = (project.assumedPressurePsi * (id / 2)) / wall;
    rows.push({
      wall: Math.round(wall * 1000) / 1000,
      stress: Math.round(stress),
      sf: Math.round((mat.yieldPsi / stress) * 100) / 100,
    });
  }
  return rows;
}

export function fmtLen(inches: number, unit: Unit, digits = 3) {
  if (!Number.isFinite(inches)) return "—";
  if (unit === "mm") return `${(inches * 25.4).toFixed(Math.max(1, digits - 1))} mm`;
  return `${inches.toFixed(digits)} in`;
}

export function fmtIn3(inches3: number, unit: Unit) {
  if (unit === "mm") return `${(inches3 * 16.387064).toFixed(1)} cm³`;
  return `${inches3.toFixed(2)} in³`;
}

export function fmtPsi(psi: number) {
  if (!Number.isFinite(psi)) return "—";
  return `${Math.round(psi).toLocaleString("en-US")} psi`;
}

export const PRESETS: { id: string; name: string; blurb: string; patch: Partial<Project> }[] = [
  {
    id: "30",
    name: ".30 rifle study",
    blurb: "Longer tube, seven cones",
    patch: {
      caliberId: "308",
      lengthIn: 8,
      odIn: 1.5,
      wallIn: 0.065,
      blastIn: 1.9,
      baffleCount: 7,
      coneDepthIn: 0.36,
      style: "cone",
      assumedPressurePsi: 15000,
    },
  },
  {
    id: "556",
    name: "5.56 study",
    blurb: "Slimmer tube, clipped cones",
    patch: {
      caliberId: "556",
      lengthIn: 6.5,
      odIn: 1.375,
      wallIn: 0.065,
      blastIn: 1.6,
      baffleCount: 6,
      coneDepthIn: 0.32,
      boreClearanceIn: 0.04,
      style: "clipped",
      assumedPressurePsi: 18000,
    },
  },
  {
    id: "9",
    name: "9mm study",
    blurb: "Short envelope, wider aperture",
    patch: {
      caliberId: "9mm",
      lengthIn: 5.4,
      odIn: 1.375,
      wallIn: 0.055,
      blastIn: 1.25,
      baffleCount: 6,
      coneDepthIn: 0.28,
      boreClearanceIn: 0.035,
      style: "cone",
      assumedPressurePsi: 10000,
    },
  },
  {
    id: "22",
    name: ".22 study",
    blurb: "Small bore, disk stack",
    patch: {
      caliberId: "22lr",
      lengthIn: 5,
      odIn: 1.05,
      wallIn: 0.05,
      blastIn: 1.05,
      baffleCount: 8,
      coneDepthIn: 0.12,
      boreClearanceIn: 0.03,
      style: "radial",
      assumedPressurePsi: 8000,
    },
  },
];

export const SEED_PROJECTS: Project[] = [
  defaultProject({
    id: "study-30-demo",
    name: ".30 cal envelope",
    caliberId: "308",
    lengthIn: 8,
    odIn: 1.5,
    wallIn: 0.065,
    blastIn: 1.9,
    baffleCount: 7,
    coneDepthIn: 0.36,
    style: "cone",
    notes: "Compare free volume against baffle count. Classroom sketch only — not a build sheet.",
    updatedAt: Date.UTC(2026, 9, 18),
  }),
  defaultProject({
    id: "study-9-demo",
    name: "9mm short stack",
    caliberId: "9mm",
    lengthIn: 5.4,
    odIn: 1.375,
    wallIn: 0.055,
    blastIn: 1.25,
    baffleCount: 6,
    coneDepthIn: 0.28,
    boreClearanceIn: 0.035,
    style: "clipped",
    assumedPressurePsi: 10000,
    notes: "Short pistol-caliber envelope. Aperture is wider, so expansion ratio drops.",
    updatedAt: Date.UTC(2026, 9, 24),
  }),
];

function mapCaliber(v: string) {
  if (CALIBERS.some((c) => c.id === v)) return v;
  if (v === "0.224") return "556";
  if (v === "0.355") return "9mm";
  if (v === "0.308") return "308";
  if (v === "0.452" || v === "0.45") return "45";
  if (v === "0.223" || v === "0.22") return "22lr";
  if (v === "0.264") return "65";
  return "308";
}

export function coerceProject(raw: unknown, index: number): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" && o.id.trim() ? o.id.slice(0, 80) : `imported-${index}-${Date.now()}`;
  const name = typeof o.name === "string" && o.name.trim() ? o.name : `Imported study ${index + 1}`;
  return sanitize(
    defaultProject({
      id,
      name,
      updatedAt: typeof o.updatedAt === "number" ? o.updatedAt : Date.now(),
      caliberId: mapCaliber(String(o.caliberId ?? o.caliber ?? "308")),
      lengthIn: num(o.lengthIn ?? o.length, 8),
      odIn: num(o.odIn ?? o.od, 1.5),
      wallIn: num(o.wallIn ?? o.wall, 0.065),
      blastIn: num(o.blastIn ?? o.blast, 1.9),
      baffleCount: num(o.baffleCount ?? o.baffles, 7),
      coneDepthIn: num(o.coneDepthIn, 0.36),
      boreClearanceIn: num(o.boreClearanceIn, 0.04),
      style: o.style === "clipped" || o.style === "radial" || o.style === "cone" ? o.style : "cone",
      mount: o.mount === "hub" ? "hub" : "direct-thread",
      notes: typeof o.notes === "string" ? o.notes : "",
      assumedPressurePsi: num(o.assumedPressurePsi, 15000),
      materialId: typeof o.materialId === "string" ? o.materialId : "17-4",
    }),
  );
}

export function parseBackup(text: string): Project[] | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { projects?: unknown }).projects)
      ? (data as { projects: unknown[] }).projects
      : null;
  if (!list) return null;
  const projects = list.map((item, i) => coerceProject(item, i)).filter((p): p is Project => p !== null);
  return projects.length ? projects : null;
}

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `study-${crypto.randomUUID()}`;
  return `study-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}
