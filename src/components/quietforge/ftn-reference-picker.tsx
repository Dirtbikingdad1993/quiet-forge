import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  ftnReferences, ftnReferenceById, referenceCategories,
  readReferenceSelection, writeReferenceSelection,
} from "@/lib/quietforge/ftn-references";

export function FtnReferencePicker() {
  const [selectedId, setSelectedId] = useState("");
  useEffect(() => { setSelectedId(readReferenceSelection()); }, []);
  const reference = ftnReferenceById(selectedId);
  const select = (value: string) => {
    setSelectedId(value);
    writeReferenceSelection(value);
  };
  return (
    <details className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <summary className="flex min-h-10 cursor-pointer items-center gap-3 text-sm font-semibold text-brass">
        <BookOpen className="size-4" /> FTN.5 research references ({ftnReferences.length} names)
      </summary>
      <div className="space-y-3 border-t border-border pt-4">
        <p className="text-sm leading-relaxed text-muted">
          Select a project name to keep its informational card handy while studying concepts.
          This does not load geometry, alter the sliders, set specifications, or produce printable files.
        </p>
        <label className="block text-sm font-medium text-fg" htmlFor="ftn-reference-name">
          Research reference
          <select
            id="ftn-reference-name"
            value={selectedId}
            onChange={(event) => select(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-md border border-border bg-bg px-3 text-base text-fg outline-none focus:border-brass"
          >
            <option value="">No reference selected</option>
            {referenceCategories.map((category) => (
              <optgroup key={category} label={category}>
                {ftnReferences.filter((item) => item.category === category).map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {reference && (
          <div className="rounded-lg border border-brass/30 bg-brass/5 p-3 text-sm leading-relaxed" role="status">
            <p className="font-semibold text-fg">{reference.label}</p>
            <p className="mt-1 font-mono text-xs text-brass">{reference.category} · {reference.filename ? "Uploaded filename" : "User-submitted chart"}</p>
            <p className="mt-2 text-muted">{reference.note}</p>
            {reference.filename && <p className="mt-2 break-all text-xs text-muted">Recorded filename: {reference.filename}</p>}
          </div>
        )}
        <p className="text-xs leading-relaxed text-muted">
          Reference choices are kept on this browser only, not added to your design, cloud records, or exports.
          No uploaded suppressor-part STL files are imported.
        </p>
        <Link to="/community" className="inline-flex min-h-10 items-center text-sm font-medium text-brass hover:underline">
          Open Community Designs catalog
        </Link>
      </div>
    </details>
  );
}
