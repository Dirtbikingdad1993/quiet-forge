import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, c as FolderKanban, d as Copy, f as Compass, i as Search, l as Download, o as Minus, p as Calculator, r as Trash2, s as Maximize2, t as Upload, u as Crosshair } from "../_libs/lucide-react.mjs";
import { a as CartesianGrid, c as Tooltip, i as Line, n as YAxis, o as ReferenceLine, r as XAxis, s as ResponsiveContainer, t as LineChart } from "../_libs/recharts+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CY4HYO--.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Drawing colors. Chrome uses the same values as Tailwind tokens in styles.css. */
var ink = {
	bg: "#0a0d12",
	surface: "#12171f",
	surface2: "#1a212c",
	fg: "#e7edf5",
	muted: "#8b97a8",
	brass: "#e0a322",
	brassDeep: "#8a6414",
	blueprint: "#5ec8e0",
	line: "#3a4658",
	danger: "#e15b4c",
	ok: "#3cba8c",
	lumen: "#07090c"
};
var CALIBERS = [
	{
		id: "22lr",
		label: ".22 LR",
		diameterIn: .223,
		group: "Rimfire"
	},
	{
		id: "556",
		label: "5.56 / .223",
		diameterIn: .224,
		group: "Rifle"
	},
	{
		id: "65",
		label: "6.5 Creedmoor",
		diameterIn: .264,
		group: "Rifle"
	},
	{
		id: "300blk",
		label: ".300 BLK",
		diameterIn: .308,
		group: "Rifle"
	},
	{
		id: "308",
		label: ".308 Win",
		diameterIn: .308,
		group: "Rifle"
	},
	{
		id: "9mm",
		label: "9mm",
		diameterIn: .355,
		group: "Pistol"
	},
	{
		id: "45",
		label: ".45 ACP",
		diameterIn: .452,
		group: "Pistol"
	}
];
var MATERIALS = [
	{
		id: "17-4",
		name: "17-4 PH, H900",
		yieldPsi: 17e4,
		densityLbPerIn3: .282,
		note: "Typical aged room-temp yield, not a cert."
	},
	{
		id: "316",
		name: "316L annealed",
		yieldPsi: 25e3,
		densityLbPerIn3: .289,
		note: "Annealed minimum. Cold work is higher."
	},
	{
		id: "ti64",
		name: "Ti-6Al-4V",
		yieldPsi: 12e4,
		densityLbPerIn3: .16,
		note: "Typical annealed room-temp yield."
	},
	{
		id: "718",
		name: "Inconel 718",
		yieldPsi: 15e4,
		densityLbPerIn3: .296,
		note: "Typical aged room-temp yield."
	}
];
var REAR_CAP_IN = .22;
var FRONT_CAP_IN = .2;
var LIMITS = {
	lengthIn: [3, 16],
	odIn: [.85, 2.6],
	wallIn: [.025, .28],
	blastIn: [.3, 10],
	baffleCount: [1, 14],
	coneDepthIn: [.08, 1.1],
	boreClearanceIn: [.015, .12],
	assumedPressurePsi: [1e3, 7e4]
};
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function caliberById(id) {
	return CALIBERS.find((c) => c.id === id) ?? CALIBERS[4];
}
function materialById(id) {
	return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}
function defaultProject(over = {}) {
	return sanitize({
		id: over.id ?? "study-untitled",
		name: "Untitled study",
		updatedAt: Date.now(),
		caliberId: "308",
		lengthIn: 8,
		odIn: 1.5,
		wallIn: .065,
		blastIn: 1.9,
		baffleCount: 7,
		coneDepthIn: .36,
		boreClearanceIn: .04,
		style: "cone",
		mount: "direct-thread",
		notes: "",
		assumedPressurePsi: 15e3,
		materialId: "17-4",
		...over
	});
}
function sanitize(p) {
	const lengthIn = clamp(num(p.lengthIn, 8), LIMITS.lengthIn[0], LIMITS.lengthIn[1]);
	const odIn = clamp(num(p.odIn, 1.5), LIMITS.odIn[0], LIMITS.odIn[1]);
	let wallIn = clamp(num(p.wallIn, .065), LIMITS.wallIn[0], LIMITS.wallIn[1]);
	const maxWall = (odIn - .12) / 2;
	if (wallIn > maxWall) wallIn = Math.max(LIMITS.wallIn[0], maxWall);
	const style = p.style === "clipped" || p.style === "radial" ? p.style : "cone";
	const mount = p.mount === "hub" ? "hub" : "direct-thread";
	const caliberId = CALIBERS.some((c) => c.id === p.caliberId) ? p.caliberId : "308";
	const materialId = MATERIALS.some((m) => m.id === p.materialId) ? p.materialId : "17-4";
	return {
		...p,
		name: (p.name || "Untitled study").slice(0, 64),
		notes: (p.notes || "").slice(0, 2e3),
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
		coneDepthIn: clamp(num(p.coneDepthIn, .36), LIMITS.coneDepthIn[0], LIMITS.coneDepthIn[1]),
		boreClearanceIn: clamp(num(p.boreClearanceIn, .04), LIMITS.boreClearanceIn[0], LIMITS.boreClearanceIn[1]),
		assumedPressurePsi: clamp(num(p.assumedPressurePsi, 15e3), LIMITS.assumedPressurePsi[0], LIMITS.assumedPressurePsi[1])
	};
}
function num(v, fallback) {
	const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
	return Number.isFinite(n) ? n : fallback;
}
function derive(project) {
	const p = sanitize(project);
	const cal = caliberById(p.caliberId);
	const mat = materialById(p.materialId);
	const boreIn = cal.diameterIn + p.boreClearanceIn;
	const idIn = p.odIn - 2 * p.wallIn;
	const rearIn = REAR_CAP_IN;
	const frontIn = FRONT_CAP_IN;
	const skirtIn = p.style === "radial" ? p.coneDepthIn : .045;
	const depth = p.coneDepthIn;
	const spanIn = p.lengthIn - frontIn - depth - p.blastIn;
	const spacingIn = p.baffleCount <= 1 ? 0 : spanIn / (p.baffleCount - 1);
	const baffles = [];
	for (let i = 0; i < p.baffleCount; i++) {
		const x = p.baffleCount === 1 ? p.blastIn : p.blastIn + i * spacingIn;
		baffles.push({
			index: i,
			x
		});
	}
	const cavityLen = Math.max(0, p.lengthIn - rearIn - frontIn);
	const cavityIn3 = Math.PI * (idIn / 2) ** 2 * cavityLen;
	const disk = Math.PI * Math.max(0, (idIn / 2) ** 2 - (Math.min(boreIn, idIn) / 2) ** 2) * Math.max(skirtIn, 0);
	const freeIn3 = Math.max(0, cavityIn3 - disk * p.baffleCount);
	const massOz = (Math.PI * Math.max(0, (p.odIn / 2) ** 2 - (idIn / 2) ** 2) * p.lengthIn + disk * p.baffleCount) * mat.densityLbPerIn3 * 16;
	const expansion = boreIn > 0 && idIn > 0 ? (idIn / 2) ** 2 / (boreIn / 2) ** 2 : 0;
	const hoopPsi = idIn > 0 && p.wallIn > 0 ? p.assumedPressurePsi * (idIn / 2) / p.wallIn : Infinity;
	const safetyFactor = hoopPsi > 0 && Number.isFinite(hoopPsi) ? mat.yieldPsi / hoopPsi : 0;
	const thinWall = p.wallIn < idIn / 10;
	const issues = [];
	if (!(idIn > boreIn + .02)) issues.push({
		level: "bad",
		text: "Interior does not clear the aperture. Lower the wall, the clearance, or the caliber."
	});
	if (p.blastIn < .3) issues.push({
		level: "warn",
		text: "Blast chamber is shorter than the rear cap, so the first cone collides with it in this sketch."
	});
	if (spanIn < .04) issues.push({
		level: "bad",
		text: "The stack does not fit. Lengthen the tube, shorten the blast chamber, or reduce cone depth."
	});
	else if (p.baffleCount > 1 && p.style !== "radial" && spacingIn < depth * .98) issues.push({
		level: "warn",
		text: "Cones overlap on the axis. Add length, or reduce count or cone depth."
	});
	if (p.wallIn < .04) issues.push({
		level: "note",
		text: "Wall is thin for a tube sketch. That is a proportion note, not a pressure rating."
	});
	if (!thinWall && idIn > 0) issues.push({
		level: "note",
		text: "Wall is thick relative to the inner radius. A thin-wall hoop formula is a weak model here."
	});
	if (issues.length === 0) issues.push({
		level: "ok",
		text: "The sketch fits: aperture, caps, and stack clear each other. Fit is not a safety approval."
	});
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
		yieldPsi: mat.yieldPsi
	};
}
function wallSweep(project) {
	const mat = materialById(project.materialId);
	const rows = [];
	for (let i = 0; i <= 28; i++) {
		const wall = .03 + i * .005;
		const id = project.odIn - 2 * wall;
		if (id <= .15) break;
		const stress = project.assumedPressurePsi * (id / 2) / wall;
		rows.push({
			wall: Math.round(wall * 1e3) / 1e3,
			stress: Math.round(stress),
			sf: Math.round(mat.yieldPsi / stress * 100) / 100
		});
	}
	return rows;
}
function fmtLen(inches, unit, digits = 3) {
	if (!Number.isFinite(inches)) return "—";
	if (unit === "mm") return `${(inches * 25.4).toFixed(Math.max(1, digits - 1))} mm`;
	return `${inches.toFixed(digits)} in`;
}
function fmtIn3(inches3, unit) {
	if (unit === "mm") return `${(inches3 * 16.387064).toFixed(1)} cm³`;
	return `${inches3.toFixed(2)} in³`;
}
function fmtPsi(psi) {
	if (!Number.isFinite(psi)) return "—";
	return `${Math.round(psi).toLocaleString("en-US")} psi`;
}
var PRESETS = [
	{
		id: "30",
		name: ".30 rifle study",
		blurb: "Longer tube, seven cones",
		patch: {
			caliberId: "308",
			lengthIn: 8,
			odIn: 1.5,
			wallIn: .065,
			blastIn: 1.9,
			baffleCount: 7,
			coneDepthIn: .36,
			style: "cone",
			assumedPressurePsi: 15e3
		}
	},
	{
		id: "556",
		name: "5.56 study",
		blurb: "Slimmer tube, clipped cones",
		patch: {
			caliberId: "556",
			lengthIn: 6.5,
			odIn: 1.375,
			wallIn: .065,
			blastIn: 1.6,
			baffleCount: 6,
			coneDepthIn: .32,
			boreClearanceIn: .04,
			style: "clipped",
			assumedPressurePsi: 18e3
		}
	},
	{
		id: "9",
		name: "9mm study",
		blurb: "Short envelope, wider aperture",
		patch: {
			caliberId: "9mm",
			lengthIn: 5.4,
			odIn: 1.375,
			wallIn: .055,
			blastIn: 1.25,
			baffleCount: 6,
			coneDepthIn: .28,
			boreClearanceIn: .035,
			style: "cone",
			assumedPressurePsi: 1e4
		}
	},
	{
		id: "22",
		name: ".22 study",
		blurb: "Small bore, disk stack",
		patch: {
			caliberId: "22lr",
			lengthIn: 5,
			odIn: 1.05,
			wallIn: .05,
			blastIn: 1.05,
			baffleCount: 8,
			coneDepthIn: .12,
			boreClearanceIn: .03,
			style: "radial",
			assumedPressurePsi: 8e3
		}
	}
];
var SEED_PROJECTS = [defaultProject({
	id: "study-30-demo",
	name: ".30 cal envelope",
	caliberId: "308",
	lengthIn: 8,
	odIn: 1.5,
	wallIn: .065,
	blastIn: 1.9,
	baffleCount: 7,
	coneDepthIn: .36,
	style: "cone",
	notes: "Compare free volume against baffle count. Classroom sketch only — not a build sheet.",
	updatedAt: Date.UTC(2026, 9, 18)
}), defaultProject({
	id: "study-9-demo",
	name: "9mm short stack",
	caliberId: "9mm",
	lengthIn: 5.4,
	odIn: 1.375,
	wallIn: .055,
	blastIn: 1.25,
	baffleCount: 6,
	coneDepthIn: .28,
	boreClearanceIn: .035,
	style: "clipped",
	assumedPressurePsi: 1e4,
	notes: "Short pistol-caliber envelope. Aperture is wider, so expansion ratio drops.",
	updatedAt: Date.UTC(2026, 9, 24)
})];
function mapCaliber(v) {
	if (CALIBERS.some((c) => c.id === v)) return v;
	if (v === "0.224") return "556";
	if (v === "0.355") return "9mm";
	if (v === "0.308") return "308";
	if (v === "0.452" || v === "0.45") return "45";
	if (v === "0.223" || v === "0.22") return "22lr";
	if (v === "0.264") return "65";
	return "308";
}
function coerceProject(raw, index) {
	if (!raw || typeof raw !== "object") return null;
	const o = raw;
	return sanitize(defaultProject({
		id: typeof o.id === "string" && o.id.trim() ? o.id.slice(0, 80) : `imported-${index}-${Date.now()}`,
		name: typeof o.name === "string" && o.name.trim() ? o.name : `Imported study ${index + 1}`,
		updatedAt: typeof o.updatedAt === "number" ? o.updatedAt : Date.now(),
		caliberId: mapCaliber(String(o.caliberId ?? o.caliber ?? "308")),
		lengthIn: num(o.lengthIn ?? o.length, 8),
		odIn: num(o.odIn ?? o.od, 1.5),
		wallIn: num(o.wallIn ?? o.wall, .065),
		blastIn: num(o.blastIn ?? o.blast, 1.9),
		baffleCount: num(o.baffleCount ?? o.baffles, 7),
		coneDepthIn: num(o.coneDepthIn, .36),
		boreClearanceIn: num(o.boreClearanceIn, .04),
		style: o.style === "clipped" || o.style === "radial" || o.style === "cone" ? o.style : "cone",
		mount: o.mount === "hub" ? "hub" : "direct-thread",
		notes: typeof o.notes === "string" ? o.notes : "",
		assumedPressurePsi: num(o.assumedPressurePsi, 15e3),
		materialId: typeof o.materialId === "string" ? o.materialId : "17-4"
	}));
}
function parseBackup(text) {
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		return null;
	}
	const list = Array.isArray(data) ? data : data && typeof data === "object" && Array.isArray(data.projects) ? data.projects : null;
	if (!list) return null;
	const projects = list.map((item, i) => coerceProject(item, i)).filter((p) => p !== null);
	return projects.length ? projects : null;
}
function newId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `study-${crypto.randomUUID()}`;
	return `study-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}
function Scene({ derived, mode, unit, zoom, showDims, showLabels }) {
	const uid = (0, import_react.useId)().replace(/:/g, "");
	const p = derived.project;
	const yO = p.odIn / 2;
	const yI = Math.max(derived.idIn / 2, .02);
	const yB = Math.min(derived.boreIn / 2, yI - .01);
	const L = p.lengthIn;
	const concept = mode === "concept";
	const stroke = concept ? ink.line : ink.blueprint;
	const metal = concept ? ink.surface2 : `url(#hatch-${uid})`;
	const cap = concept ? ink.surface : "none";
	const baffleFill = concept ? ink.brass : "none";
	const baffleStroke = concept ? ink.brassDeep : ink.blueprint;
	const px = (n) => n / zoom;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
			id: `hatch-${uid}`,
			width: "0.12",
			height: "0.12",
			patternUnits: "userSpaceOnUse",
			patternTransform: "rotate(40)",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "0.12",
				stroke: ink.blueprint,
				strokeWidth: "0.012",
				strokeOpacity: "0.55"
			})
		}) }),
		p.mount === "hub" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: -.34,
			y: -(yO + .09),
			width: .52,
			height: (yO + .09) * 2,
			fill: concept ? ink.surface : "none",
			stroke,
			strokeWidth: 1,
			vectorEffect: "non-scaling-stroke"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: -.36,
			y: -yB,
			width: .4,
			height: yB * 2,
			fill: concept ? ink.lumen : ink.bg
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: 0,
			y: -yO,
			width: L,
			height: p.odIn,
			fill: metal,
			stroke,
			strokeWidth: 1.4,
			vectorEffect: "non-scaling-stroke"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: derived.rearIn,
			y: -yI,
			width: Math.max(.02, L - derived.rearIn - derived.frontIn),
			height: yI * 2,
			fill: ink.bg
		}),
		concept && derived.spanIn > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: derived.rearIn,
			y: -yI,
			width: Math.max(0, Math.min(p.blastIn, L - derived.frontIn) - derived.rearIn),
			height: yI * 2,
			fill: ink.brass,
			opacity: .08
		}),
		derived.spanIn > -.2 && derived.baffles.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baffle, {
			x: b.x,
			depth: p.coneDepthIn,
			yI,
			yB: Math.max(yB, .02),
			style: p.style,
			fill: baffleFill,
			stroke: baffleStroke
		}, b.index)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: 0,
			y: -yO,
			width: derived.rearIn,
			height: p.odIn,
			fill: cap,
			stroke,
			vectorEffect: "non-scaling-stroke"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: L - derived.frontIn,
			y: -yO,
			width: derived.frontIn,
			height: p.odIn,
			fill: cap,
			stroke,
			vectorEffect: "non-scaling-stroke"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: -.02,
			y: -yB,
			width: derived.rearIn + .04,
			height: yB * 2,
			fill: concept ? ink.lumen : ink.bg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: L - derived.frontIn - .01,
			y: -yB,
			width: derived.frontIn + .04,
			height: yB * 2,
			fill: concept ? ink.lumen : ink.bg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: -.45,
			y1: 0,
			x2: L + .55,
			y2: 0,
			stroke: concept ? ink.brass : ink.blueprint,
			strokeOpacity: .7,
			strokeDasharray: `${px(5)} ${px(4)}`,
			strokeWidth: 1,
			vectorEffect: "non-scaling-stroke"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: derived.rearIn,
			y1: -yI,
			x2: L - derived.frontIn,
			y2: -yI,
			stroke,
			strokeWidth: 1,
			vectorEffect: "non-scaling-stroke"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: derived.rearIn,
			y1: yI,
			x2: L - derived.frontIn,
			y2: yI,
			stroke,
			strokeWidth: 1,
			vectorEffect: "non-scaling-stroke"
		}),
		showLabels && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: concept ? ink.muted : ink.blueprint,
			fontFamily: "IBM Plex Mono, ui-monospace, monospace",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: derived.rearIn + .08,
					y: -yI + px(14),
					fontSize: px(11),
					children: "BLAST"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: L - derived.frontIn - .05,
					y: -yO - px(8),
					fontSize: px(11),
					textAnchor: "end",
					children: "MUZZLE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: p.mount === "hub" ? -.34 : 0,
					y: yO + px(16),
					fontSize: px(11),
					children: "REAR"
				})
			]
		}),
		showDims && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimH, {
				x1: 0,
				x2: L,
				y: yO + .55,
				label: fmtLen(L, unit, 2),
				zoom
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimH, {
				x1: 0,
				x2: Math.min(p.blastIn, L),
				y: -yO - .42,
				label: `blast ${fmtLen(p.blastIn, unit, 2)}`,
				zoom
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimV, {
				x: L + .48,
				y1: -yO,
				y2: yO,
				label: `OD ${fmtLen(p.odIn, unit, 2)}`,
				zoom
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimV, {
				x: -.42,
				y1: -yO,
				y2: -yI,
				label: fmtLen(p.wallIn, unit, 3),
				zoom
			}),
			derived.baffles.length > 1 && derived.spacingIn > .15 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimH, {
				x1: derived.baffles[0].x,
				x2: derived.baffles[1].x,
				y: yI - px(14),
				label: fmtLen(derived.spacingIn, unit, 2),
				zoom
			})
		] })
	] });
}
function Baffle({ x, depth, yI, yB, style, fill, stroke }) {
	const common = {
		fill,
		stroke,
		strokeWidth: 1,
		vectorEffect: "non-scaling-stroke",
		fillOpacity: fill === "none" ? 0 : .92
	};
	if (style === "radial") {
		const h = Math.max(.02, yI - yB);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x,
			y: -yI,
			width: depth,
			height: h,
			...common
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x,
			y: yB,
			width: depth,
			height: h,
			...common
		})] });
	}
	const topApex = -(yB + (style === "clipped" ? (yI - yB) * .42 : 0));
	const botApex = yB;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
		points: `${x},${-yI} ${x + depth},${topApex} ${x},${topApex}`,
		...common
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
		points: `${x},${yI} ${x + depth},${botApex} ${x},${botApex}`,
		...common
	})] });
}
function DimH({ x1, x2, y, label, zoom }) {
	const tick = 7 / zoom;
	const mid = (x1 + x2) / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		fill: ink.blueprint,
		stroke: ink.blueprint,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1,
				y1: y,
				x2,
				y2: y,
				strokeWidth: 1,
				vectorEffect: "non-scaling-stroke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1,
				y1: y - tick,
				x2: x1,
				y2: y + tick,
				strokeWidth: 1,
				vectorEffect: "non-scaling-stroke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x2,
				y1: y - tick,
				x2,
				y2: y + tick,
				strokeWidth: 1,
				vectorEffect: "non-scaling-stroke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: mid,
				y: y - 5 / zoom,
				textAnchor: "middle",
				fontSize: 11 / zoom,
				fontFamily: "IBM Plex Mono, ui-monospace, monospace",
				stroke: "none",
				children: label
			})
		]
	});
}
function DimV({ x, y1, y2, label, zoom }) {
	const tick = 7 / zoom;
	const mid = (y1 + y2) / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		fill: ink.blueprint,
		stroke: ink.blueprint,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x,
				y1,
				x2: x,
				y2,
				strokeWidth: 1,
				vectorEffect: "non-scaling-stroke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - tick,
				y1,
				x2: x + tick,
				y2: y1,
				strokeWidth: 1,
				vectorEffect: "non-scaling-stroke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x - tick,
				y1: y2,
				x2: x + tick,
				y2,
				strokeWidth: 1,
				vectorEffect: "non-scaling-stroke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: x + 8 / zoom,
				y: mid,
				dominantBaseline: "middle",
				fontSize: 11 / zoom,
				fontFamily: "IBM Plex Mono, ui-monospace, monospace",
				stroke: "none",
				children: label
			})
		]
	});
}
function CardSketch({ derived, mode }) {
	const p = derived.project;
	const padX = p.mount === "hub" ? .5 : .18;
	const padY = .22;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `${-padX} ${-p.odIn / 2 - padY} ${p.lengthIn + padX + .2} ${p.odIn + padY * 2}`,
		className: "h-full w-full",
		role: "img",
		"aria-label": `${p.name} cross-section`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: -padX,
			y: -p.odIn / 2 - padY,
			width: p.lengthIn + padX + .2,
			height: p.odIn + padY * 2,
			fill: ink.bg
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {
			derived,
			mode,
			unit: "in",
			zoom: 70,
			showDims: false,
			showLabels: false
		})]
	});
}
function Modal({ open, title, onClose, children }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center",
		onMouseDown: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "qf-dialog-title",
			className: "w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-2xl",
			onMouseDown: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "qf-dialog-title",
				className: "text-lg font-semibold text-fg",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children
			})]
		})
	});
}
function LengthControl({ label, inches, minIn, maxIn, stepIn, unit, digits = 3, onChange }) {
	const scale = unit === "mm" ? 25.4 : 1;
	const shown = inches * scale;
	const [focused, setFocused] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	const id = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		if (!focused) setText(shown.toFixed(unit === "mm" ? Math.max(1, digits - 1) : digits));
	}, [
		shown,
		focused,
		unit,
		digits
	]);
	const commit = (raw) => {
		const n = Number(raw);
		if (!Number.isFinite(n)) return;
		onChange(n / scale);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		htmlFor: id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 flex items-baseline justify-between gap-3 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-brass",
				children: fmtLen(inches, unit, digits)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type: "range",
				min: minIn * scale,
				max: maxIn * scale,
				step: unit === "mm" ? Math.max(.1, stepIn * scale) : stepIn,
				value: shown,
				onChange: (e) => onChange(Number(e.target.value) / scale),
				className: "w-full"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": `${label} value`,
				inputMode: "decimal",
				value: text,
				onFocus: () => setFocused(true),
				onBlur: () => {
					setFocused(false);
					commit(text);
				},
				onChange: (e) => {
					setText(e.target.value);
					commit(e.target.value);
				},
				className: "w-20 rounded-md border border-border bg-bg px-2 py-2 text-right font-mono text-xs text-fg outline-none focus:border-brass"
			})]
		})]
	});
}
function CountControl({ label, value, min, max, onChange }) {
	const id = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		htmlFor: id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 flex items-baseline justify-between text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-brass",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			type: "range",
			min,
			max,
			step: 1,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "w-full"
		})]
	});
}
function SelectField({ label, value, onChange, children }) {
	const id = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm text-muted",
		htmlFor: id,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			id,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-brass",
			children
		})]
	});
}
function Dashboard({ projects, unit, mode, visible, onOpen, onCreate, onDuplicate, onRemove, onReplace }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("New envelope");
	const [preset, setPreset] = (0, import_react.useState)(PRESETS[0].id);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const needle = query.trim().toLowerCase();
	const shown = projects.filter((p) => {
		if (!needle) return true;
		const cal = derive(p).caliberLabel.toLowerCase();
		return p.name.toLowerCase().includes(needle) || cal.includes(needle);
	});
	const exportJson = () => {
		const blob = new Blob([JSON.stringify({
			version: 3,
			projects
		}, null, 2)], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "quietforge-studies.json";
		a.click();
		URL.revokeObjectURL(a.href);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: visible ? "min-h-0 flex-1 overflow-y-auto" : "hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight",
							children: "Studies"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xl text-sm text-muted",
							children: "Parametric cross-sections saved on this device. Open one to edit the sketch."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setCreating(true),
									className: "inline-flex min-h-11 items-center gap-2 rounded-md bg-brass px-3 text-sm font-semibold text-brass-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New study"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: exportJson,
									className: "inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Export"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => fileRef.current?.click(),
									className: "inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Restore"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "application/json,.json",
									className: "hidden",
									onChange: async (e) => {
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
									}
								})
							]
						})]
					}),
					notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg",
						children: notice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search by name or caliber",
							className: "w-full rounded-md border border-border bg-surface py-3 pr-3 pl-10 text-sm text-fg outline-none focus:border-brass"
						})]
					}),
					shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-dashed border-border px-6 py-16 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-medium",
							children: "No matching studies"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Clear the search, or start a new envelope."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2",
						children: shown.map((project) => {
							const d = derive(project);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "overflow-hidden rounded-lg border border-border bg-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onOpen(project.id),
									className: "block h-36 w-full bg-bg text-left",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardSketch, {
										derived: d,
										mode
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base font-semibold",
											children: project.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 font-mono text-xs text-muted",
											children: [
												d.caliberLabel,
												" · ",
												fmtLen(project.lengthIn, unit, 2),
												" · ",
												project.baffleCount,
												" baffles"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
											className: "font-mono text-xs text-muted",
											dateTime: new Date(project.updatedAt).toISOString(),
											children: new Intl.DateTimeFormat("en-US", {
												month: "short",
												day: "numeric",
												timeZone: "UTC"
											}).format(project.updatedAt)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onOpen(project.id),
												className: "min-h-11 flex-1 rounded-md bg-brass/15 text-sm font-semibold text-brass",
												children: "Open"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `Duplicate ${project.name}`,
												onClick: () => onDuplicate(project.id),
												className: "inline-flex size-11 items-center justify-center rounded-md border border-border text-fg",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `Delete ${project.name}`,
												onClick: () => setPendingDelete(project),
												className: "inline-flex size-11 items-center justify-center rounded-md border border-border text-danger",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									})]
								})]
							}, project.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open: creating,
				title: "New study",
				onClose: () => setCreating(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						const chosen = PRESETS.find((p) => p.id === preset) ?? PRESETS[0];
						onCreate(chosen.patch, name.trim() || chosen.name);
						setCreating(false);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-muted",
							children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-brass"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-sm text-muted",
								children: "Starting envelope"
							}), PRESETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "preset",
									checked: preset === item.id,
									onChange: () => setPreset(item.id),
									className: "mt-1 accent-brass"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm text-fg",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted",
									children: item.blurb
								})] })]
							}, item.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCreating(false),
								className: "min-h-11 rounded-md px-3 text-sm text-muted",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "min-h-11 rounded-md bg-brass px-4 text-sm font-semibold text-brass-ink",
								children: "Create"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				open: pendingDelete !== null,
				title: "Delete study?",
				onClose: () => setPendingDelete(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: pendingDelete ? `“${pendingDelete.name}” is removed from this device. Export first if you want a copy.` : ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPendingDelete(null),
						className: "min-h-11 rounded-md px-3 text-sm text-muted",
						children: "Keep"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (pendingDelete) onRemove(pendingDelete.id);
							setPendingDelete(null);
						},
						className: "min-h-11 rounded-md bg-danger px-4 text-sm font-semibold text-fg",
						children: "Delete"
					})]
				})]
			})
		]
	});
}
function Engineering({ project, unit, visible, onChange }) {
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: visible ? "min-h-0 flex-1 overflow-y-auto" : "hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-6 py-16 text-sm text-muted",
			children: "Open a study to run the classroom screen."
		})
	});
	const d = derive(project);
	const rows = wallSweep(project).map((row) => ({
		wall: unit === "mm" ? Math.round(row.wall * 25.4 * 10) / 10 : row.wall,
		sf: row.sf,
		stress: row.stress
	}));
	const wallNow = unit === "mm" ? Math.round(project.wallIn * 25.4 * 10) / 10 : Math.round(project.wallIn * 1e3) / 1e3;
	const domainMax = Math.max(2, Math.min(20, (Number.isFinite(d.safetyFactor) ? d.safetyFactor : 2) * 1.8));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: visible ? "min-h-0 flex-1 overflow-y-auto" : "hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Classroom screen"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
					children: "A thin-wall hoop check and a rough internal volume. Gas in a suppressor is a blast, not a steady pressure in a pipe. These figures never clear a design to be built or fired."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid grid-cols-2 gap-3 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Free volume",
							value: fmtIn3(d.freeIn3, unit),
							hint: "Cavity minus a flat-disk allowance per baffle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Expansion",
							value: `${d.expansion.toFixed(1)}×`,
							hint: "Inner area ÷ aperture area. Not decibels."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Mean spacing",
							value: d.spacingIn > 0 ? fmtLen(d.spacingIn, unit, 2) : "—",
							hint: "Axis pitch of the stack"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Sketch mass",
							value: `${d.massOz.toFixed(1)} oz`,
							hint: "Tube shell plus disk allowance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Hoop stress",
							value: fmtPsi(d.hoopPsi),
							hint: "P × inner radius ÷ wall, at your assumption"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Yield ÷ hoop",
							value: Number.isFinite(d.safetyFactor) ? d.safetyFactor.toFixed(2) : "—",
							hint: d.materialName
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-4 lg:grid-cols-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-4 lg:col-span-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Hoop screen versus wall"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Same outer diameter and assumed pressure. The brass line is this sketch."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-56 w-full min-w-0",
								children: visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: rows,
										margin: {
											top: 8,
											right: 8,
											left: 0,
											bottom: 0
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												stroke: ink.line,
												strokeOpacity: .45
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												type: "number",
												dataKey: "wall",
												domain: ["dataMin", "dataMax"],
												stroke: ink.muted,
												tick: {
													fill: ink.muted,
													fontSize: 11
												},
												tickLine: false,
												axisLine: false,
												unit: unit === "mm" ? " mm" : " in"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												stroke: ink.muted,
												tick: {
													fill: ink.muted,
													fontSize: 11
												},
												tickLine: false,
												axisLine: false,
												domain: [0, domainMax],
												width: 36
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												contentStyle: {
													background: ink.surface,
													border: `1px solid ${ink.line}`,
													borderRadius: 8,
													fontSize: 12
												},
												labelStyle: { color: ink.fg },
												itemStyle: { color: ink.brass },
												formatter: (value) => {
													const n = typeof value === "number" ? value : Number(value);
													return [Number.isFinite(n) ? n.toFixed(2) : "—", "Yield / hoop"];
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
												y: 1,
												stroke: ink.danger,
												strokeDasharray: "4 4"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
												x: wallNow,
												stroke: ink.brass
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "sf",
												stroke: ink.blueprint,
												strokeWidth: 2,
												dot: false
											})
										]
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-md bg-bg" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 rounded-lg border border-border bg-surface p-4 lg:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm text-muted",
								children: ["Material, room-temp yield", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: project.materialId,
									onChange: (e) => onChange({ materialId: e.target.value }),
									className: "mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-brass",
									children: MATERIALS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m.id,
										children: m.name
									}, m.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-muted",
								children: MATERIALS.find((m) => m.id === project.materialId)?.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-baseline justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Assumed pressure" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-brass",
										children: fmtPsi(project.assumedPressurePsi)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 2e3,
									max: 6e4,
									step: 500,
									value: project.assumedPressurePsi,
									onChange: (e) => onChange({ assumedPressurePsi: Number(e.target.value) }),
									className: "mt-2 w-full"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									[8e3, "8k"],
									[15e3, "15k"],
									[35e3, "35k"],
									[55e3, "55k"]
								].map(([psi, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onChange({ assumedPressurePsi: Number(psi) }),
									className: "min-h-10 rounded-md border border-border px-3 font-mono text-xs text-fg hover:border-brass",
									children: label
								}, label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-relaxed text-muted",
								children: [
									"Rifle chamber pressure is often near 55,000 psi at the case. Pressure along a tube is lower and uneven. This slider is your assumption, not a prediction.",
									" ",
									d.thinWall ? "Thin-wall formula is in range." : "Wall is thick enough that the thin-wall formula is weak."
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "What this screen ignores"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Blast reflection and the load on each baffle face" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Heat, erosion, and carbon packing" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Threads, shoulders, welds, and sharp corners" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cone buckling and real baffle thickness" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ammunition, barrel length, and firing schedule" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Any path from a sketch to a finished part" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-fg",
							children: screenSentence(d.safetyFactor)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm text-muted",
					htmlFor: "study-notes",
					children: [
						"Notes on ",
						project.name,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "study-notes",
							value: project.notes,
							onChange: (e) => onChange({ notes: e.target.value }),
							rows: 4,
							className: "mt-1.5 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-fg outline-none focus:border-brass"
						})
					]
				}) })
			]
		})
	});
}
function screenSentence(sf) {
	if (!Number.isFinite(sf)) return "The hoop estimate is not available for this geometry.";
	const base = `Published yield divided by the assumed hoop stress is ${sf.toFixed(2)}.`;
	if (sf < 1) return `${base} That assumption is past the published yield on a static screen. Clearing the screen the other way would still not approve anything.`;
	return `${base} A larger number is not permission to manufacture or fire. The load this formula skips is the one that matters.`;
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-lg text-fg",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-snug text-muted",
				children: hint
			})
		]
	});
}
function Viewport({ derived, mode, unit, visible }) {
	const wrapRef = (0, import_react.useRef)(null);
	const svgRef = (0, import_react.useRef)(null);
	const [zoom, setZoom] = (0, import_react.useState)(80);
	const [pan, setPan] = (0, import_react.useState)({
		x: 40,
		y: 180
	});
	const drag = (0, import_react.useRef)(null);
	const xRef = (0, import_react.useRef)(null);
	const yRef = (0, import_react.useRef)(null);
	const fitted = (0, import_react.useRef)("");
	const fit = () => {
		const el = wrapRef.current;
		if (!el) return false;
		const rect = el.getBoundingClientRect();
		if (rect.width < 40 || rect.height < 40) return false;
		const p = derived.project;
		const padL = mode === "blueprint" ? 1.15 : p.mount === "hub" ? .7 : .4;
		const padR = mode === "blueprint" ? 2.1 : .55;
		const padY = mode === "blueprint" ? 1.15 : .45;
		const worldW = p.lengthIn + padL + padR;
		const worldH = p.odIn + padY * 2;
		const z = Math.min(rect.width / worldW, rect.height / worldH) * .92;
		setZoom(z);
		setPan({
			x: (rect.width - p.lengthIn * z) / 2 + (padL - padR) * .12 * z,
			y: rect.height / 2
		});
		return true;
	};
	(0, import_react.useEffect)(() => {
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
	}, [
		visible,
		derived.project.id,
		mode,
		derived.project.mount
	]);
	const onWheel = (e) => {
		e.preventDefault();
		const rect = e.currentTarget.getBoundingClientRect();
		const px = e.clientX - rect.left;
		const py = e.clientY - rect.top;
		const wx = (px - pan.x) / zoom;
		const wy = (py - pan.y) / zoom;
		const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
		const next = Math.min(720, Math.max(18, zoom * factor));
		setZoom(next);
		setPan({
			x: px - wx * next,
			y: py - wy * next
		});
	};
	const track = (clientX, clientY) => {
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
		const clone = src.cloneNode(true);
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
		for (let x = -2; x <= 18; x += 1) lines.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x,
			y1: -8,
			x2: x,
			y2: 8,
			stroke: ink.blueprint,
			strokeOpacity: .16,
			vectorEffect: "non-scaling-stroke"
		}, `vx${x}`));
		for (let y = -6; y <= 6; y += 1) lines.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: -4,
			y1: y,
			x2: 20,
			y2: y,
			stroke: ink.blueprint,
			strokeOpacity: .16,
			vectorEffect: "non-scaling-stroke"
		}, `hy${y}`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: mode === "blueprint" ? "qf-blueprint relative h-full min-h-64 w-full cursor-grab touch-none overflow-hidden bg-bg active:cursor-grabbing" : "qf-dots relative h-full min-h-64 w-full cursor-grab touch-none overflow-hidden bg-bg active:cursor-grabbing",
		onWheel,
		onDoubleClick: fit,
		onPointerDown: (e) => {
			if (e.button !== 0) return;
			drag.current = {
				dx: e.clientX - pan.x,
				dy: e.clientY - pan.y
			};
			e.currentTarget.setPointerCapture(e.pointerId);
		},
		onPointerMove: (e) => {
			track(e.clientX, e.clientY);
			if (!drag.current) return;
			setPan({
				x: e.clientX - drag.current.dx,
				y: e.clientY - drag.current.dy
			});
		},
		onPointerUp: () => {
			drag.current = null;
		},
		onPointerLeave: () => {
			drag.current = null;
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				ref: svgRef,
				className: "h-full w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `translate(${pan.x} ${pan.y}) scale(${zoom})`,
					children: [lines, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {
						derived,
						mode,
						unit,
						zoom,
						showDims: mode === "blueprint",
						showLabels: true
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute left-3 top-3 flex items-center gap-3 rounded-md border border-border bg-surface/90 px-3 py-2 font-mono text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3.5 text-brass" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["X ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						ref: xRef,
						className: "text-brass",
						children: "0.000 in"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Y ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						ref: yRef,
						className: "text-brass",
						children: "0.000 in"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-fg",
						children: [Math.round(zoom), " px/in"]
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-3 left-3 hidden font-mono text-xs text-muted sm:block",
				children: "Drag to pan · scroll to zoom · double-click to fit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-border bg-surface/95 p-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Zoom out",
						onClick: () => setZoom((z) => Math.max(18, z / 1.15)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Zoom in",
						onClick: () => setZoom((z) => Math.min(720, z * 1.15)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Fit sketch",
						onClick: fit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Download SVG sketch",
						onClick: exportSvg,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
					})
				]
			})
		]
	});
}
function IconButton({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		title: label,
		onClick,
		className: "inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors hover:bg-surface-2 hover:text-brass",
		children
	});
}
var LEVEL = {
	ok: "text-ok",
	note: "text-muted",
	warn: "text-brass",
	bad: "text-danger"
};
function Studio({ project, unit, mode, visible, onChange, onMode }) {
	const derived = derive(project);
	const depthLabel = project.style === "radial" ? "Disk thickness" : "Cone depth";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: visible ? "flex min-h-0 flex-1 flex-col" : "hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 sm:px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Study name",
					value: project.name,
					onChange: (e) => onChange({ name: e.target.value }),
					className: "min-w-0 flex-1 bg-transparent text-base font-semibold text-fg outline-none placeholder:text-muted sm:max-w-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-mono text-xs text-muted md:inline",
					children: derived.caliberLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex rounded-md border border-border bg-bg p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
						active: mode === "concept",
						onClick: () => onMode("concept"),
						children: "Concept"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
						active: mode === "blueprint",
						onClick: () => onMode("blueprint"),
						children: "Blueprint"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[46dvh] min-h-64 lg:h-auto lg:min-h-0 lg:flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
					derived,
					mode,
					unit,
					visible
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "min-h-0 flex-1 overflow-y-auto border-t border-border bg-surface lg:w-80 lg:flex-none lg:border-l lg:border-t-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-mono text-xs tracking-wide text-brass",
									children: "ENVELOPE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
									label: "Caliber",
									value: project.caliberId,
									onChange: (caliberId) => onChange({ caliberId }),
									children: [
										"Rimfire",
										"Rifle",
										"Pistol"
									].map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: group,
										children: CALIBERS.filter((c) => c.group === group).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: c.id,
											children: [
												c.label,
												" · ",
												c.diameterIn.toFixed(3),
												" in"
											]
										}, c.id))
									}, group))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LengthControl, {
									label: "Tube length",
									inches: project.lengthIn,
									minIn: 3,
									maxIn: 14,
									stepIn: .05,
									unit,
									digits: 2,
									onChange: (lengthIn) => onChange({ lengthIn })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LengthControl, {
									label: "Outer diameter",
									inches: project.odIn,
									minIn: .9,
									maxIn: 2.4,
									stepIn: .025,
									unit,
									digits: 3,
									onChange: (odIn) => onChange({ odIn })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LengthControl, {
									label: "Wall thickness",
									inches: project.wallIn,
									minIn: .03,
									maxIn: .2,
									stepIn: .005,
									unit,
									digits: 3,
									onChange: (wallIn) => onChange({ wallIn })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-mono text-xs tracking-wide text-brass",
									children: "STACK"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LengthControl, {
									label: "Blast chamber",
									inches: project.blastIn,
									minIn: .4,
									maxIn: 6,
									stepIn: .05,
									unit,
									digits: 2,
									onChange: (blastIn) => onChange({ blastIn })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountControl, {
									label: "Baffle count",
									value: project.baffleCount,
									min: 1,
									max: 12,
									onChange: (baffleCount) => onChange({ baffleCount })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LengthControl, {
									label: depthLabel,
									inches: project.coneDepthIn,
									minIn: .08,
									maxIn: .9,
									stepIn: .02,
									unit,
									digits: 2,
									onChange: (coneDepthIn) => onChange({ coneDepthIn })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LengthControl, {
									label: "Aperture over bullet",
									inches: project.boreClearanceIn,
									minIn: .02,
									maxIn: .1,
									stepIn: .005,
									unit,
									digits: 3,
									onChange: (boreClearanceIn) => onChange({ boreClearanceIn })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
									label: "Baffle sketch",
									value: project.style,
									onChange: (style) => onChange({ style }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "cone",
											children: "Coaxial cone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "clipped",
											children: "Clipped cone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "radial",
											children: "Flat disk"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
									label: "Rear interface",
									value: project.mount,
									onChange: (mount) => onChange({ mount }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "direct-thread",
										children: "Direct-thread shoulder"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hub",
										children: "Hub flange"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackBudget, { derived })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-mono text-xs tracking-wide text-brass",
									children: "FIT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2",
									children: derived.issues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: `text-sm leading-snug ${LEVEL[issue.level]}`,
										children: issue.text
									}, issue.text))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "grid grid-cols-2 gap-2 pt-2 font-mono text-xs text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md border border-border bg-bg px-2 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
												className: "text-fg",
												children: [derived.idIn.toFixed(3), " in"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md border border-border bg-bg px-2 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Aperture" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
												className: "text-fg",
												children: [derived.boreIn.toFixed(3), " in"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md border border-border bg-bg px-2 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Spacing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
												className: "text-fg",
												children: [derived.spacingIn > 0 ? derived.spacingIn.toFixed(3) : "—", " in"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md border border-border bg-bg px-2 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Expansion" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
												className: "text-fg",
												children: [derived.expansion.toFixed(1), "×"]
											})]
										})
									]
								})
							]
						})
					]
				})
			})]
		})]
	});
}
function ModeButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: active ? "min-h-10 rounded px-3 text-sm font-medium bg-brass text-brass-ink" : "min-h-10 rounded px-3 text-sm font-medium text-muted hover:text-fg",
		children
	});
}
function StackBudget({ derived }) {
	const L = derived.project.lengthIn;
	const rear = derived.rearIn / L;
	const blast = Math.max(0, derived.project.blastIn - derived.rearIn) / L;
	const front = derived.frontIn / L;
	const stack = Math.max(.02, 1 - rear - blast - front);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1.5 text-sm text-muted",
			children: "Length budget"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-3 overflow-hidden rounded-sm bg-bg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-line",
					style: { width: `${rear * 100}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-brass/40",
					style: { width: `${blast * 100}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-brass",
					style: { width: `${stack * 100}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-line",
					style: { width: `${front * 100}%` }
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1.5 font-mono text-xs text-muted",
			children: "Cap · blast · stack · cap"
		})
	] });
}
var useForge = create()(persist((set, get) => ({
	projects: SEED_PROJECTS,
	activeId: SEED_PROJECTS[0].id,
	view: "studio",
	unit: "in",
	renderMode: "concept",
	setView: (view) => set({ view }),
	setUnit: (unit) => set({ unit }),
	setRenderMode: (renderMode) => set({ renderMode }),
	open: (id) => set({
		activeId: id,
		view: "studio"
	}),
	updateActive: (patch) => set((state) => ({ projects: state.projects.map((p) => p.id === state.activeId ? sanitize({
		...p,
		...patch,
		id: p.id,
		updatedAt: Date.now()
	}) : p) })),
	create: (patch, name) => {
		const project = defaultProject({
			...patch,
			id: newId(),
			name,
			updatedAt: Date.now()
		});
		set((state) => ({
			projects: [project, ...state.projects],
			activeId: project.id,
			view: "studio"
		}));
	},
	duplicate: (id) => {
		const source = get().projects.find((p) => p.id === id);
		if (!source) return;
		const copy = sanitize({
			...source,
			id: newId(),
			name: `${source.name} copy`.slice(0, 64),
			updatedAt: Date.now()
		});
		set((state) => ({
			projects: [copy, ...state.projects],
			activeId: copy.id
		}));
	},
	remove: (id) => set((state) => {
		const projects = state.projects.filter((p) => p.id !== id);
		return {
			projects,
			activeId: state.activeId === id ? projects[0]?.id ?? "" : state.activeId
		};
	}),
	replaceAll: (projects) => set({
		projects,
		activeId: projects[0]?.id ?? "",
		view: "projects"
	})
}), {
	name: "quietforge.v1",
	version: 1,
	partialize: (state) => ({
		projects: state.projects,
		activeId: state.activeId,
		view: state.view,
		unit: state.unit,
		renderMode: state.renderMode
	}),
	merge: (persisted, current) => {
		try {
			const saved = persisted ?? {};
			const incoming = Array.isArray(saved.projects) ? saved.projects : null;
			const projects = incoming ? incoming.map((p) => {
				try {
					return sanitize(p);
				} catch {
					return null;
				}
			}).filter((p) => p !== null && Boolean(p.id)) : current.projects;
			const list = projects.length ? projects : current.projects;
			const activeId = list.some((p) => p.id === saved.activeId) ? saved.activeId : list[0].id;
			const view = saved.view === "projects" || saved.view === "engineering" || saved.view === "studio" ? saved.view : current.view;
			return {
				...current,
				projects: list,
				activeId,
				view,
				unit: saved.unit === "mm" ? "mm" : "in",
				renderMode: saved.renderMode === "blueprint" ? "blueprint" : "concept"
			};
		} catch {
			return current;
		}
	}
}));
function activeProject(state) {
	return state.projects.find((p) => p.id === state.activeId) ?? null;
}
var NAV = [
	{
		id: "studio",
		label: "Sketch",
		icon: Compass
	},
	{
		id: "engineering",
		label: "Screen",
		icon: Calculator
	},
	{
		id: "projects",
		label: "Studies",
		icon: FolderKanban
	}
];
function Shell() {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bg text-fg lg:flex-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-4 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tracking-wide",
							children: "QuietForge"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-brass",
							children: "CONCEPT STUDIO"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-1 px-3",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
							item,
							active: view === item.id,
							onClick: () => setView(item.id)
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-t border-border px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitToggle, {
							unit,
							onChange: setUnit
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: "Saved on this device"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "QuietForge"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-brass",
									children: "Concept studio"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitToggle, {
								unit,
								onChange: setUnit
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "border-b border-border px-4 py-2 text-xs leading-relaxed text-muted",
						children: "Concept sketches only. In the US a silencer is an NFA firearm — making one without an approved Form 1 is a federal felony. This is not a manufacturing drawing, a print file, or a safety approval."
					}),
					active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {
						project: active,
						unit,
						mode: renderMode,
						visible: view === "studio",
						onChange: updateActive,
						onMode: setRenderMode
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: view === "studio" ? "flex flex-1 items-center justify-center px-6" : "hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No study is open. Start one from Studies."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Engineering, {
						project: active,
						unit,
						visible: view === "engineering",
						onChange: updateActive
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
						projects,
						unit,
						mode: renderMode,
						visible: view === "projects",
						onOpen: open,
						onCreate: create,
						onDuplicate: duplicate,
						onRemove: remove,
						onReplace: replaceAll
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "grid grid-cols-3 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setView(item.id),
					className: view === item.id ? "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium text-brass" : "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
				}, item.id))
			})
		]
	});
}
function NavButton({ item, active, onClick }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: active ? "flex min-h-11 items-center gap-3 rounded-md bg-brass/10 px-3 text-sm font-medium text-brass" : "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
	});
}
function UnitToggle({ unit, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "inline-flex rounded-md border border-border p-0.5",
		children: ["in", "mm"].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-pressed": unit === option,
			onClick: () => onChange(option),
			className: unit === option ? "min-h-9 min-w-10 rounded px-2 font-mono text-xs text-brass-ink bg-brass" : "min-h-9 min-w-10 rounded px-2 font-mono text-xs text-muted",
			children: option
		}, option))
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-9 shrink-0",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: ink.surface,
				stroke: ink.line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "8",
				fill: "none",
				stroke: ink.brass,
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 8.5 V16 L21.5 19.5",
				fill: "none",
				stroke: ink.brass,
				strokeWidth: "1.6",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "1.3",
				fill: ink.blueprint
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {});
}
//#endregion
export { Home as component };
