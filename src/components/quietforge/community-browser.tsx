import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, BookOpen, ChevronRight, Download, FileArchive, FileCode2,
  FileText, FolderOpen, Info, Layers3, Search, ShieldAlert
} from "lucide-react";
import {
  communityEntries, fileFormats,
  type CommunityEntry, type FormatEntry,
} from "@/lib/quietforge/community-catalog";
import { useEffect } from "react";
import {
  ftnReferences, referenceCategories,
  readReferenceSelection, writeReferenceSelection,
  type ReferenceCategory,
} from "@/lib/quietforge/ftn-references";
import {
  makeCalibrationStl, makeCalibration3mf, makeConceptPdf
} from "@/lib/quietforge/export-safe";

const panel = "rounded-xl border border-border bg-surface p-4 sm:p-5";
const anchor = "inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-fg hover:border-brass/60 hover:bg-surface-2";

function OverviewNav({ current }: { current: "community" | "index" }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link to="/community" className={current === "community" ? "inline-flex min-h-11 items-center gap-2 rounded-md bg-brass px-3 text-sm font-semibold text-brass-ink" : anchor}>
        <BookOpen className="size-4"/>Community Designs
      </Link>
      <Link to="/guncad-index" className={current === "index" ? "inline-flex min-h-11 items-center gap-2 rounded-md bg-brass px-3 text-sm font-semibold text-brass-ink" : anchor}>
        <FolderOpen className="size-4"/>GunCAD Index Guide
      </Link>
      <Link to="/learn" className={anchor}><Layers3 className="size-4"/>Materials library</Link>
    </div>
  );
}

function CatalogHeader({
  eyebrow, title, description, current,
}: {
  eyebrow: string;
  title: string;
  description: string;
  current: "community" | "index";
}) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <Link to="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-fg">
          <ArrowLeft className="size-4"/>Back to Suppressor Studio
        </Link>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brass">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
        </div>
        <OverviewNav current={current}/>
      </div>
    </header>
  );
}

function ResearchNotice() {
  return (
    <aside className="flex items-start gap-3 rounded-xl border border-brass/25 bg-brass/5 p-4 text-sm leading-6">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-brass"/>
      <p className="text-muted">
        <span className="font-semibold text-fg">Reference-only directory. </span>
        This is an independent educational overview, not an official GunCAD Index mirror or a repository of downloadable firearm designs.
        Project names and provenance are not verified. Digital availability does not establish legal permission,
        material suitability, or safety. Manufacturing files and instructions are not provided.
      </p>
    </aside>
  );
}

function CommunityCard({ entry, selected, onClick }: {
  entry: CommunityEntry; selected: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-current={selected ? "true" : undefined}
      className={"w-full rounded-lg border p-4 text-left transition-colors " +
        (selected ? "border-brass/60 bg-brass/10" : "border-border bg-surface hover:border-brass/30 hover:bg-surface-2")}>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wide text-brass">{entry.kind}</p>
          <h3 className="mt-1 font-semibold">{entry.name}</h3>
        </div>
        <ChevronRight className="mt-3 size-4 shrink-0 text-brass"/>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{entry.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {entry.tags.slice(0,3).map((tag) => <span className="rounded border border-border px-2 py-1 text-[11px] text-muted" key={tag}>{tag}</span>)}
      </div>
    </button>
  );
}

function CommunityDetail({ entry }: { entry: CommunityEntry }) {
  return (
    <article className={panel + " space-y-5"}>
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-brass">{entry.status}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{entry.name}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{entry.context}</p>
      </div>
      <section>
        <h3 className="text-base font-semibold">Research themes</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
          {entry.discussion.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>
      <section>
        <h3 className="text-base font-semibold">How to evaluate claims</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
          {entry.evaluation.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>
      <div className="rounded-lg border border-border bg-bg p-3 text-sm leading-6 text-muted">
        <Info className="mr-2 inline size-4 text-brass"/>
        This entry contains non-dimensional descriptions only. No files, parts lists, assembly instructions, or direct manufacturing-CAD links are supplied.
      </div>
      <Link to="/guncad-index" className={anchor}>Learn about common CAD file formats<ChevronRight className="size-4"/></Link>
    </article>
  );
}


function FtnReferenceCatalog() {
  const [filter, setFilter] = useState<"All" | ReferenceCategory>("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("rimfire");
  const [keptId, setKeptId] = useState("");
  useEffect(() => { setKeptId(readReferenceSelection()); }, []);
  const visible = ftnReferences.filter((entry) =>
    (filter === "All" || entry.category === filter) &&
    (entry.label + " " + entry.note).toLowerCase().includes(query.toLowerCase().trim())
  );
  const selected = visible.find((entry) => entry.id === selectedId) ?? visible[0];
  const keep = (id: string) => { writeReferenceSelection(id); setKeptId(id); };
  return (
    <section className={panel + " space-y-4"} aria-label="FTN project names from submitted chart">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-brass">USER-SUBMITTED FTN.5 CHART</p>
        <h2 className="mt-2 text-xl font-semibold">Browse 13 project names</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          These are chart labels, not authenticated design specifications. Select an entry for an informational
          card or keep its name open as a research reference on the Sketch page. No CAD, dimensions,
          suppressor-part files, or buildable presets are loaded.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-44 flex-1 text-sm font-medium text-fg">
          Search FTN entries
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rimfire, PCC, Flow…"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-brass"/>
        </label>
        <label className="text-sm font-medium text-fg">
          Category
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="mt-2 block min-h-11 rounded-md border border-border bg-bg px-3 text-sm text-fg">
            <option>All</option>
            {referenceCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
      </div>
      <div className="grid items-start gap-3 md:grid-cols-[1fr_1fr]">
        <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-border bg-bg p-2">
          {visible.map((entry) => (
            <button key={entry.id} type="button"
              onClick={() => setSelectedId(entry.id)}
              aria-current={selected?.id === entry.id ? "true" : undefined}
              className={"flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm " +
                (selected?.id === entry.id ? "bg-brass/10 font-semibold text-brass" : "text-fg hover:bg-surface-2")}>
              <span className="min-w-0">{entry.label}</span>
              <span className="shrink-0 font-mono text-[11px] text-muted">{entry.category}</span>
            </button>
          ))}
          {!visible.length && <p className="px-3 py-2 text-sm text-muted">No matching entries.</p>}
        </div>
        {selected && (
          <article className="space-y-3 rounded-lg border border-border bg-bg p-4" aria-live="polite">
            <p className="font-mono text-xs uppercase tracking-wider text-brass">{selected.category} · Reference only</p>
            <h3 className="text-lg font-semibold">{selected.label}</h3>
            <p className="text-sm leading-6 text-muted">{selected.note}</p>
            <p className="text-xs leading-6 text-muted">Names come from your uploaded chart; compatibility,
              construction claims, and measurements have not been verified.</p>
            <button type="button" onClick={() => keep(selected.id)}
              className="min-h-11 w-full rounded-md border border-brass/50 px-3 text-sm font-semibold text-brass hover:bg-brass/10">
              {keptId === selected.id ? "Selected as research reference" : "Keep name as research reference"}
            </button>
            {keptId === selected.id && (
              <Link to="/" className="inline-flex min-h-10 items-center text-sm font-medium text-brass hover:underline">
                Open Sketch to view this reference
              </Link>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

export function CommunityCatalog() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | CommunityEntry["kind"]>("All");
  const [selectedId, setSelectedId] = useState("ftn");
  const result = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return communityEntries.filter((entry) =>
      (type === "All" || entry.kind === type) &&
      [entry.name, entry.summary, entry.context, ...entry.tags, ...entry.discussion, ...entry.evaluation]
        .some((value) => value.toLowerCase().includes(needle)));
  }, [query, type]);
  const selected = result.find((entry) => entry.id === selectedId) ?? result[0];

  return (
    <main className="min-h-dvh bg-bg pb-12 text-fg">
      <CatalogHeader current="community" eyebrow="COMMUNITY / RESEARCH" title="Community Designs"
        description="A searchable reference to community project names, their documentation context, and broader safety and materials questions. FTN and HTN are listed by name without unverified build claims."/>
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <ResearchNotice/>
        <FtnReferenceCatalog/>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-48 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"/>
            <span className="sr-only">Search community profiles</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search FTN, HTN, materials, topics…"
              className="min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 pl-10 text-sm text-fg outline-none focus:border-brass"/>
          </label>
          <label className="text-sm text-muted">
            <span className="mr-2">Show</span>
            <select value={type} onChange={(event) => setType(event.target.value as typeof type)}
              className="min-h-11 rounded-md border border-border bg-surface px-2 text-sm text-fg">
              <option>All</option>
              <option>Named community project</option>
              <option>Research topic</option>
            </select>
          </label>
        </div>
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
          <div className="space-y-3" aria-label="Community topics">
            <p className="font-mono text-xs text-muted">{result.length} entries</p>
            {result.map((entry) => (
              <CommunityCard key={entry.id} entry={entry} selected={selected?.id===entry.id} onClick={() => setSelectedId(entry.id)} />
            ))}
            {!result.length && <p className={panel+" text-sm text-muted"}>No profiles match your search.</p>}
          </div>
          {selected ? <CommunityDetail key={selected.id} entry={selected}/> :
            <div className={panel+" text-sm text-muted"}>Select a different filter or clear your search.</div>}
        </div>
      </div>
    </main>
  );
}

function FileFormatCard({ format }: { format: FormatEntry }) {
  return (
    <article className={panel+" space-y-3"}>
      <div className="flex items-center gap-3">
        {format.family==="3D geometry" ? <FileCode2 className="size-6 text-brass"/> : <FileText className="size-6 text-brass"/>}
        <div>
          <h3 className="text-lg font-semibold">{format.name}</h3>
          <p className="font-mono text-xs text-muted">{format.ext} · {format.family}</p>
        </div>
      </div>
      <p className="text-sm leading-7 text-muted">{format.details}</p>
      <div className="rounded-md border border-border bg-bg p-3 text-xs leading-6 text-muted">
        <span className="font-semibold text-brass">Remember: </span>{format.caution}
      </div>
    </article>
  );
}

function saveFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function GunCadIndexGuide() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<"All" | FormatEntry["family"]>("All");
  const [message, setMessage] = useState<string|null>(null);
  const matches = useMemo(() => fileFormats.filter((entry) =>
    (family==="All" || entry.family===family) &&
    [entry.name,entry.ext,entry.family,entry.details,entry.caution].some((s)=>s.toLowerCase().includes(query.toLowerCase().trim()))),
  [query,family]);
  const exportSample = async (type: "stl" | "3mf" | "pdf") => {
    setMessage(null);
    try {
      if(type==="stl") saveFile(makeCalibrationStl(),"generic-20mm-calibration-cube.stl");
      else if(type==="3mf") saveFile(makeCalibration3mf(),"generic-20mm-calibration-cube.3mf");
      else saveFile(makeConceptPdf("Community catalog research guide"),"community-reference-overview.pdf");
      setMessage("Sample file prepared for download. It contains no firearm or suppressor geometry.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not export the sample.");
    }
  };

  return (
    <main className="min-h-dvh bg-bg pb-12 text-fg">
      <CatalogHeader current="index" eyebrow="GUNCAD / FILE-FORMAT EDUCATION" title="GunCAD Index Guide"
        description="Browse descriptions of common CAD and documentation formats, learn how to assess source claims, and download harmless demonstration files. This is not a GunCAD mirror or access point for firearm parts."/>
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <ResearchNotice/>
        <section className={panel+" space-y-3"}>
          <h2 className="flex items-center gap-2 text-lg font-semibold"><FileArchive className="size-5 text-brass"/>Understanding a file catalog</h2>
          <p className="text-sm leading-7 text-muted">
            Public CAD catalogs sometimes contain a mix of README documents, reference images, meshes, CAD solids, license files,
            and unverified remixes. A file name or thumbnail cannot show authorship, licensing rights, physical safety, or legal authorization.
            The format browser below explains what these file types mean; it does not connect to third-party firearm manufacturing files.
          </p>
          <div className="grid gap-3 text-xs text-muted sm:grid-cols-3">
            <div className="rounded-md border border-border bg-bg p-3"><strong className="block text-fg">Provenance</strong>Who published the record, when, and under what license?</div>
            <div className="rounded-md border border-border bg-bg p-3"><strong className="block text-fg">Verification</strong>Are factual claims independently documented?</div>
            <div className="rounded-md border border-border bg-bg p-3"><strong className="block text-fg">Context</strong>Does current law or the manufacturer impose restrictions?</div>
          </div>
        </section>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-48 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"/>
            <span className="sr-only">Search CAD file formats</span>
            <input value={query} onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search STL, STEP, README, 3MF…"
              className="min-h-11 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-fg outline-none focus:border-brass"/>
          </label>
          <label className="text-sm text-muted">
            <span className="mr-2">Format</span>
            <select value={family} onChange={(e)=>setFamily(e.target.value as typeof family)}
              className="min-h-11 rounded-md border border-border bg-surface px-2 text-sm text-fg">
              <option>All</option>
              <option>3D geometry</option>
              <option>Documents</option>
              <option>Metadata</option>
            </select>
          </label>
        </div>
        <p className="font-mono text-xs text-muted">{matches.length} file-format entries</p>
        <div className="grid items-start gap-4 md:grid-cols-2">
          {matches.map((format)=><FileFormatCard format={format} key={format.name}/>)}
          {!matches.length&&<p className={panel+" text-sm text-muted"}>No formats match your search.</p>}
        </div>
        <section className={panel+" space-y-4"}>
          <div>
            <h2 className="text-lg font-semibold">Try harmless sample files</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              These samples are created within Suppressor Studio. The STL and 3MF files contain the same generic solid
              20 mm calibration cube, not any gun or suppressor component. The PDF is a non-dimensional reference cover.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className={anchor} type="button" onClick={()=>void exportSample("stl")}><Download className="size-4"/>Download demo STL</button>
            <button className={anchor} type="button" onClick={()=>void exportSample("3mf")}><Download className="size-4"/>Download demo 3MF</button>
            <button className={anchor} type="button" onClick={()=>void exportSample("pdf")}><Download className="size-4"/>Download reference PDF</button>
          </div>
          {message&&<p role="status" className="text-xs text-muted">{message}</p>}
          <p className="text-xs leading-6 text-muted">For the generic cube, import STL or 3MF in OrcaSlicer using File → Open. Slicer compatibility does not validate a mechanical design.</p>
        </section>
        <div className="flex flex-wrap gap-2">
          <Link to="/community" className={anchor}>View FTN / HTN research profiles<ChevronRight className="size-4"/></Link>
          <Link to="/learn" className={anchor}>Open the materials reference<ChevronRight className="size-4"/></Link>
        </div>
      </div>
    </main>
  );
}
