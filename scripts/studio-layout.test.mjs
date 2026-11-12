import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const studio = readFileSync(new URL("../src/components/quietforge/studio.tsx", import.meta.url), "utf8");
const controls = readFileSync(new URL("../src/components/quietforge/ui.tsx", import.meta.url), "utf8");

test("preview can be minimized and restored with an accessible toggle", () => {
  assert.match(studio, /aria-controls="studio-preview"/);
  assert.match(studio, /aria-expanded=\{previewVisible\}/);
  assert.match(studio, /Hide preview/);
  assert.match(studio, /Show preview/);
  assert.match(studio, /visible=\{visible && previewVisible\}/);
});

test("expanded controls use wide layout, and mobile favors the controls", () => {
  assert.match(studio, /lg:w-\[62%\]/);
  assert.match(studio, /lg:w-full/);
  assert.match(studio, /max-width: 1023px/);
  assert.match(studio, /h-\[30dvh\]/);
  assert.match(studio, /max-w-5xl/);
});

test("sliders and value fields have larger touch and input areas", () => {
  assert.match(controls, /h-11 min-w-0 flex-1/);
  assert.match(controls, /h-11 w-full/);
  assert.match(controls, /h-12 w-24/);
  assert.match(controls, /text-base font-medium/);
});
