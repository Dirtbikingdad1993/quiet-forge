import { useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, Check, ChevronRight, ClipboardList, ExternalLink,
  GraduationCap, Layers3, LibraryBig, Microscope, Search, ShieldAlert
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  designFamilies, glossary, knowledgeQuestions,
  lessonCategories, lessons, materials, sources, type MaterialCard,
} from "@/lib/quietforge/learn-content";

type Tab = "lessons" | "materials" | "families" | "glossary" | "quiz" | "sources";
const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "materials", label: "Materials", icon: Layers3 },
  { id: "families", label: "Design families", icon: LibraryBig },
  { id: "glossary", label: "Glossary", icon: ClipboardList },
  { id: "quiz", label: "Knowledge check", icon: GraduationCap },
  { id: "sources", label: "Sources", icon: Microscope },
];
const panelClass = "rounded-xl border border-border bg-surface p-4 sm:p-5";
const actionClass = "inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-fg hover:border-brass/60 hover:bg-surface-2";

function References({ ids }: { ids: readonly string[] }) {
  const items = sources.filter((source) => ids.includes(source.id));
  if (!items.length) return null;
  return (
    <div className="space-y-2 border-t border-border pt-4">
      <h3 className="font-mono text-xs uppercase tracking-wider text-muted">Read the original sources</h3>
      {items.map((item) => (
        <a key={item.id} href={item.url} target="_blank" rel="noreferrer noopener" className="flex items-start gap-2 text-sm text-brass underline-offset-2 hover:underline">
          <ExternalLink className="mt-1 size-3.5 shrink-0" />{item.name}
        </a>
      ))}
    </div>
  );
}

function LessonViewer({ search }: { search: string }) {
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState("how-it-works");
  const [completed, setCompleted] = useState<string[]>([]);
  const matches = useMemo(() => lessons.filter((lesson) => {
    const q = search.toLowerCase();
    if (category !== "All" && lesson.category !== category) return false;
    return [lesson.title, lesson.summary, lesson.category,
      ...lesson.keyPoints, ...lesson.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])])]
      .some((text) => text.toLowerCase().includes(q));
  }), [category, search]);
  const selected = matches.find((x) => x.id === selectedId) ?? matches[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-muted">
          Category
          <select aria-label="Filter lessons by category" value={category} onChange={(e) => setCategory(e.target.value)}
            className="min-h-10 rounded-md border border-border bg-surface px-3 text-sm text-fg">
            <option value="All">All categories</option>
            {lessonCategories.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
        <span className="text-xs text-muted">{completed.length} of {lessons.length} lessons marked read (this session)</span>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(13rem,0.78fr)_minmax(0,2fr)]">
        <aside aria-label="Lesson list" className={panelClass + " max-h-[60dvh] overflow-y-auto"}>
          <h2 className="mb-3 font-semibold">Browse lessons</h2>
          <div className="space-y-1.5">
            {matches.map((lesson) => (
              <button type="button" key={lesson.id} onClick={() => setSelectedId(lesson.id)}
                aria-current={selected?.id === lesson.id ? "true" : undefined}
                className={"flex w-full items-start gap-2 rounded-md px-3 py-2.5 text-left text-sm " +
                  (selected?.id === lesson.id ? "border border-brass/40 bg-brass/10 text-brass" : "border border-transparent text-fg hover:bg-surface-2")}>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{lesson.title}</span>
                  <span className="mt-1 block font-mono text-[11px] text-muted">{lesson.category} · {lesson.minutes} min</span>
                </span>
                {completed.includes(lesson.id) ? <Check className="mt-1 size-4 shrink-0 text-ok" /> : <ChevronRight className="mt-1 size-4 shrink-0 text-muted" />}
              </button>
            ))}
            {!matches.length && <p className="text-sm text-muted">No lessons match. Try another search or category.</p>}
          </div>
        </aside>
        {selected ? (
          <article className={panelClass + " space-y-5"} key={selected.id}>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brass">{selected.category} · {selected.minutes} min read</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{selected.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{selected.summary}</p>
            </div>
            <div className="rounded-lg border border-brass/20 bg-brass/5 p-4">
              <h3 className="text-sm font-semibold text-brass">What you will learn</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-fg">
                {selected.keyPoints.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
            {selected.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h3 className="text-lg font-semibold">{section.heading}</h3>
                {section.paragraphs.map((p) => <p key={p} className="text-sm leading-7 text-muted">{p}</p>)}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
                    {section.bullets.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                )}
              </section>
            ))}
            <References ids={selected.sources} />
            <button type="button" onClick={() => setCompleted((list) => list.includes(selected.id) ? list.filter(x => x !== selected.id) : [...list, selected.id])}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brass px-4 text-sm font-semibold text-brass-ink">
              <Check className="size-4" />{completed.includes(selected.id) ? "Marked as read · Undo" : "Mark lesson as read"}
            </button>
          </article>
        ) : (
          <div className={panelClass}><p className="text-sm text-muted">Select a different category or clear the search to see lessons.</p></div>
        )}
      </div>
    </div>
  );
}

function MaterialInfo({ material }: { material: MaterialCard }) {
  return (
    <article className={panelClass + " space-y-4"}>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brass">{material.family}</p>
        <h3 className="mt-1 text-lg font-semibold">{material.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{material.context}</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-fg">Broad advantages</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{material.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-fg">Limitations and trade-offs</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{material.limitations.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <div className="rounded-md border border-border bg-bg px-3 py-3 text-sm leading-6">
        <span className="font-semibold text-brass">Common misconception: </span>
        <span className="text-muted">{material.misconception}</span>
      </div>
    </article>
  );
}

function MaterialsViewer({ search }: { search: string }) {
  const [family, setFamily] = useState("All");
  const [leftId, setLeftId] = useState(materials[4].id);
  const [rightId, setRightId] = useState(materials[8].id);
  const [compare, setCompare] = useState(false);
  const families = [...new Set(materials.map((m) => m.family))];
  const matched = materials.filter((m) => (
    (family === "All" || m.family === family) &&
    [m.name, m.family, m.context, m.misconception, ...m.strengths, ...m.limitations].some((s) => s.toLowerCase().includes(search.toLowerCase()))
  ));
  const left = materials.find((m) => m.id === leftId) ?? materials[0];
  const right = materials.find((m) => m.id === rightId) ?? materials[1];
  return (
    <div className="space-y-4">
      <div className={panelClass + " space-y-3"}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Materials reference</h2>
          <label className="flex items-center gap-2 text-sm text-muted">
            Family
            <select aria-label="Filter material family" value={family} onChange={(e) => setFamily(e.target.value)}
              className="min-h-10 rounded-md border border-border bg-bg px-3 text-sm text-fg">
              <option>All</option>{families.map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>
        </div>
        <p className="text-sm leading-relaxed text-muted">Explore qualitative properties of common engineering metals, composites, and finishes. These cards describe industrial materials generally and do not recommend any material for manufacturing a suppressor.</p>
        <button type="button" onClick={() => setCompare(!compare)} aria-expanded={compare} className={actionClass}>
          <Layers3 className="size-4" /> {compare ? "Hide comparison" : "Compare two materials"}
        </button>
        {compare && (
          <div className="space-y-3 border-t border-border pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[{label:"First material",value:leftId,change:setLeftId},{label:"Second material",value:rightId,change:setRightId}].map((field) => (
                <label key={field.label} className="text-sm text-muted">{field.label}
                  <select value={field.value} onChange={(e) => field.change(e.target.value)}
                    className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg">
                    {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </label>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2"><MaterialInfo material={left}/><MaterialInfo material={right}/></div>
            <p className="text-xs text-muted">Not a numerical ranking, engineering design calculator, or substitute for independent testing.</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted">{matched.length} material profiles</p>
      {matched.length ? <div className="grid items-start gap-3 md:grid-cols-2">{matched.map((m) => <MaterialInfo key={m.id} material={m}/>)}</div> : <div className={panelClass}>No material matches that filter.</div>}
    </div>
  );
}

function FamiliesViewer({ search }: { search: string }) {
  const matching = designFamilies.filter((d) =>
    [d.name, d.summary, d.remember, ...d.typicalClaims, ...d.questions].some(x => x.toLowerCase().includes(search.toLowerCase())));
  return (
    <div className="space-y-3">
      <div className={panelClass}>
        <h2 className="text-lg font-semibold">Commercial design families</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Examples of categories you may see in manufacturer catalogs, without construction diagrams, component specifications, or assembly instructions. Product descriptions vary between manufacturers.</p>
      </div>
      {matching.map((d) => (
        <details key={d.name} className={panelClass + " group"}>
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold">
            {d.name}<ChevronRight className="size-5 shrink-0 text-brass transition-transform group-open:rotate-90" />
          </summary>
          <div className="mt-3 space-y-4 border-t border-border pt-4 text-sm leading-6 text-muted">
            <p>{d.summary}</p>
            <div><h3 className="font-semibold text-fg">Common product descriptions</h3>
              <ul className="mt-1 list-disc pl-5">{d.typicalClaims.map(x=><li key={x}>{x}</li>)}</ul>
            </div>
            <div className="rounded-md border border-border bg-bg p-3">
              <span className="font-semibold text-brass">Remember: </span>{d.remember}
            </div>
            <div><h3 className="font-semibold text-fg">Questions for a manufacturer</h3>
              <ul className="mt-1 list-disc pl-5">{d.questions.map(x=><li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </details>
      ))}
      {!matching.length && <p className="text-sm text-muted">No design-family entries match your search.</p>}
    </div>
  );
}

function GlossaryViewer({ search }: { search: string }) {
  const matched = glossary.filter(([term, definition]) =>
    (term + " " + definition).toLowerCase().includes(search.toLowerCase()));
  return <div className="grid gap-3 md:grid-cols-2">
    {matched.map(([term, definition]) => (
      <article key={term} className={panelClass}>
        <h3 className="font-semibold text-brass">{term}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{definition}</p>
      </article>
    ))}
    {!matched.length && <p className="text-sm text-muted">No matching terms.</p>}
  </div>;
}

function QuizViewer() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const q = knowledgeQuestions[current];
  const answer = answers[q.id];
  const score = knowledgeQuestions.filter((x) => answers[x.id] === x.correct).length;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className={panelClass}>
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Knowledge check</p>
          <p className="text-xs text-muted">{current+1} / {knowledgeQuestions.length}</p>
        </div>
        <div aria-hidden="true" className="mt-3 h-2 overflow-hidden rounded-full bg-bg"><div className="h-full bg-brass" style={{width: `${((current+1)/knowledgeQuestions.length)*100}%`}}/></div>
        <h2 className="mt-5 text-xl font-semibold">{q.prompt}</h2>
        <div className="mt-5 space-y-2">
          {q.choices.map((choice, i) => (
            <button type="button" key={choice} disabled={answer !== undefined} onClick={() => setAnswers((old) => ({...old,[q.id]:i}))}
              className={"flex min-h-12 w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm " +
                (answer !== undefined && i===q.correct ? "border-ok/60 bg-ok/10" :
                  answer === i ? "border-danger/60 bg-danger/10" : "border-border bg-bg hover:border-brass/40")}>
              {choice}{answer !== undefined && i===q.correct && <Check className="size-4 text-ok" />}
            </button>
          ))}
        </div>
        {answer !== undefined && (
          <div className="mt-5 space-y-3 rounded-md border border-border bg-bg p-4" role="status">
            <p className="font-semibold">{answer===q.correct?"Correct":"Not quite"} · {score} correct so far</p>
            <p className="text-sm leading-6 text-muted">{q.explanation}</p>
            <button type="button" onClick={() => setCurrent((i) => (i+1)%knowledgeQuestions.length)} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-brass px-4 font-semibold text-brass-ink">
              {current===knowledgeQuestions.length-1?"Back to first question":"Next question"}<ChevronRight className="size-4"/>
            </button>
          </div>
        )}
      </div>
      <p className="text-center text-sm text-muted">These questions check general understanding, not design or fabrication proficiency.</p>
      <div className="text-center">
        <button type="button" onClick={() => {setCurrent(0);setAnswers({});}} className={actionClass}>Restart quiz</button>
      </div>
    </div>
  );
}

export function LearnLibrary() {
  const [tab, setTab] = useState<Tab>("lessons");
  const [search, setSearch] = useState("");

  const counts = [
    { value: lessons.length, label: "in-depth lessons" },
    { value: materials.length, label: "material profiles" },
    { value: designFamilies.length, label: "design families" },
    { value: glossary.length, label: "glossary terms" },
  ];
  const chooseTab = (next: Tab) => { setTab(next); setSearch(""); };

  return (
    <main className="min-h-dvh bg-bg pb-12 text-fg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-fg"><ArrowLeft className="size-4" /> Back to Suppressor Studio</Link>
            <p className="font-mono text-xs tracking-widest text-brass">LEARN / REFERENCE LIBRARY</p>
          </div>
          <div className="mt-5 flex gap-4">
            <div className="hidden shrink-0 items-center sm:flex"><BookOpen className="size-9 text-brass" /></div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Learn the science and terminology</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                An accessible reference covering sound, materials, commercial design approaches, ownership, and evidence.
                Educational examples and practical research questions—not how-to-build instructions.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {counts.map((c) => <div key={c.label} className="rounded-md border border-border bg-bg px-3 py-3"><span className="text-xl font-semibold text-brass">{c.value}</span><p className="mt-1 text-xs text-muted">{c.label}</p></div>)}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3 rounded-lg border border-brass/25 bg-brass/5 px-4 py-3 text-sm leading-6">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-brass" />
          <p className="text-muted">
            <span className="font-semibold text-fg">Current-law alert (November 2026): </span>
            ATF changed its NFA enforcement approach in October 2026, but other federal and state rules still apply.
            Check the original <a className="text-brass underline" href="https://www.atf.gov/firearms/update-to-nfa-transfer-guidance" target="_blank" rel="noopener noreferrer">ATF guidance</a> before relying on old legal summaries.
            This library cannot provide a legal determination or authorize manufacturing.
          </p>
        </div>
        <nav aria-label="Learning library sections" className="-mx-4 flex gap-2 overflow-x-auto border-b border-border px-4 pb-3 sm:mx-0 sm:px-0">
          {tabs.map((item) => {
            const Icon=item.icon; const active=tab===item.id;
            return <button key={item.id} type="button" aria-current={active?"page":undefined} onClick={()=>chooseTab(item.id)}
              className={"inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold " +
                (active?"bg-brass text-brass-ink":"border border-border bg-surface text-muted hover:text-fg")}>
              <Icon className="size-4"/>{item.label}
            </button>;
          })}
        </nav>
        {tab!=="quiz" && tab!=="sources" && (
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"/>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} aria-label="Search learning content"
              placeholder="Search materials, topics, terms, concepts…"
              className="min-h-12 w-full rounded-md border border-border bg-surface py-3 pr-4 pl-10 text-sm text-fg outline-none focus:border-brass"/>
          </div>
        )}
        {tab==="lessons" && <LessonViewer search={search}/>}
        {tab==="materials" && <MaterialsViewer search={search}/>}
        {tab==="families" && <FamiliesViewer search={search}/>}
        {tab==="glossary" && <GlossaryViewer search={search}/>}
        {tab==="quiz" && <QuizViewer/>}
        {tab==="sources" && (
          <div className="space-y-3">
            <div className={panelClass}>
              <h2 className="text-lg font-semibold">Original research and regulatory sources</h2>
              <p className="mt-2 text-sm leading-7 text-muted">The resources below support key sound, hearing, and law sections. Material properties are qualitative summaries; for critical engineering work, consult certified specifications and qualified professionals. Legal content was reviewed against ATF guidance issued in October 2026 and can become outdated.</p>
            </div>
            {sources.map((s) => (
              <article key={s.id} className={panelClass}>
                <a className="inline-flex items-start gap-2 text-base font-semibold text-brass hover:underline" href={s.url} rel="noopener noreferrer" target="_blank">
                  {s.name}<ExternalLink className="mt-1 size-4 shrink-0"/>
                </a>
                <p className="mt-2 text-sm text-muted">{s.note}</p>
              </article>
            ))}
          </div>
        )}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted">
          <p>Suppressor Studio · Educational reference, not engineering approval, legal advice, or fabrication guidance.</p>
          <Link to="/" className="inline-flex min-h-10 items-center gap-2 text-brass hover:underline"><ArrowLeft className="size-4"/>Return to workspace</Link>
        </footer>
      </div>
    </main>
  );
}
