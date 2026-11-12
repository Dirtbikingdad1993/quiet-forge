import test from "node:test";
import assert from "node:assert/strict";
import { ftnReferences, referenceCategories, ftnReferenceById, ftnUploadedDocuments, ftnUploadedFileCount } from "./ftn-references.ts";
import { readFileSync } from "node:fs";

test("all 13 original chart labels and 12 uploaded STL filenames are present", () => {
  assert.equal(ftnUploadedFileCount, 12);
  assert.equal(ftnReferences.length, 25);
  assert.equal(ftnUploadedDocuments.length, 4);
  assert.equal(new Set(ftnReferences.map((x) => x.id)).size, ftnReferences.length);
  assert.equal(new Set(ftnReferences.map((x) => x.label)).size, ftnReferences.length);
  for (const item of ftnReferences) {
    assert.ok(referenceCategories.includes(item.category));
    assert.equal(ftnReferenceById(item.id)?.label, item.label);
  }
  for (const token of ["Rimfire Flow", "Rimfire Tesla", "Rifle Baffled", "White Monster",
    "PCC Flow", "Five Baffles", "30 Cal", "Purple Drank"]) {
    assert.ok(ftnReferences.some((item) => item.label.includes(token)), token);
  }
});
test("reference records contain no fabrication-ready dimensions or file locations", () => {
  for (const item of ftnReferences) {
    assert.equal("lengthIn" in item, false);
    assert.equal("diameterIn" in item, false);
    assert.equal("mesh" in item, false);
    assert.equal("path" in item, false);
    assert.ok(!item.note.includes("https://"));
    assert.ok(!item.filename || item.filename.endsWith(".stl"));
  }
});
test("Sketch selection never mutates design geometry or project settings", () => {
  const source = readFileSync(new URL("../../components/quietforge/ftn-reference-picker.tsx", import.meta.url), "utf8");
  assert.match(source, /writeReferenceSelection/);
  assert.doesNotMatch(source, /onChange\(\{/);
  assert.doesNotMatch(source, /setProjects|updateActive|setState\(/);
});

test("uploaded references remain filename-only and preserve document credits", () => {
  const filenames = ftnReferences.filter(x => x.filename);
  assert.equal(filenames.length, ftnUploadedFileCount);
  assert.equal(new Set(filenames.map(x => x.filename)).size, filenames.length);
  assert.equal(new Set(ftnUploadedDocuments.map(x => x.filename)).size, 4);
  assert.ok(ftnUploadedDocuments.every(x => x.filename.endsWith(".pdf") && x.creditedTo.includes("Coprolite")));
  for (const ref of filenames) {
    assert.equal("content" in ref, false);
    assert.equal("url" in ref, false);
  }
});
