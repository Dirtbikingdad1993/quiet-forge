import test from "node:test";
import assert from "node:assert/strict";
import { ftnReferences, referenceCategories, ftnReferenceById } from "./ftn-references.ts";
import { readFileSync } from "node:fs";

test("all 13 chart labels are present, with distinct IDs and broad categories", () => {
  assert.equal(ftnReferences.length, 13);
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
  }
});
test("Sketch selection never mutates design geometry or project settings", () => {
  const source = readFileSync(new URL("../../components/quietforge/ftn-reference-picker.tsx", import.meta.url), "utf8");
  assert.match(source, /writeReferenceSelection/);
  assert.doesNotMatch(source, /onChange\(\{/);
  assert.doesNotMatch(source, /setProjects|updateActive|setState\(/);
});
