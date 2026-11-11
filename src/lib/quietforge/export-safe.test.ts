import test from "node:test";
import assert from "node:assert/strict";
import { makeCalibrationStl, makeCalibration3mf, makeConceptPdf, makeConceptSvg } from "./export-safe.ts";

test("binary STL is a watertight 12-triangle solid calibration cube", async () => {
  const blob = makeCalibrationStl();
  const bytes = new DataView(await blob.arrayBuffer());
  assert.equal(bytes.byteLength, 684);
  assert.equal(bytes.getUint32(80, true), 12);
  const xs = [], ys = [], zs = [];
  for (let face = 0; face < 12; face++) {
    for (let v = 0; v < 3; v++) {
      const p = 84 + face * 50 + 12 + v * 12;
      xs.push(bytes.getFloat32(p, true));
      ys.push(bytes.getFloat32(p + 4, true));
      zs.push(bytes.getFloat32(p + 8, true));
    }
  }
  assert.deepEqual([Math.min(...xs), Math.max(...xs)], [-10, 10]);
  assert.deepEqual([Math.min(...ys), Math.max(...ys)], [-10, 10]);
  assert.deepEqual([Math.min(...zs), Math.max(...zs)], [0, 20]);
});

test("3MF ZIP has required OPC parts, mm unit, 8 vertices and 12 triangles", async () => {
  const bytes = new Uint8Array(await makeCalibration3mf().arrayBuffer());
  const view = new DataView(bytes.buffer);
  assert.equal(view.getUint32(0, true), 0x04034b50);
  const names = [];
  let offset = 0;
  while (view.getUint32(offset, true) === 0x04034b50) {
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);
    const size = view.getUint32(offset + 18, true);
    const start = offset + 30 + nameLen + extraLen;
    const name = new TextDecoder().decode(bytes.slice(offset + 30, offset + 30 + nameLen));
    names.push(name);
    if (name === "3D/3dmodel.model") {
      const model = new TextDecoder().decode(bytes.slice(start, start + size));
      assert.match(model, /unit="millimeter"/);
      assert.equal((model.match(/<vertex /g) ?? []).length, 8);
      assert.equal((model.match(/<triangle /g) ?? []).length, 12);
    }
    offset = start + size;
  }
  assert.deepEqual(names, ["[Content_Types].xml", "_rels/.rels", "3D/3dmodel.model"]);
  assert.equal(view.getUint32(offset, true), 0x02014b50);
});

test("concept reports contain only a non-dimensional cover, never printable geometry", async () => {
  const svg = makeConceptSvg("Example & <test>");
  assert.match(svg, /Example &amp; &lt;test&gt;/);
  assert.match(svg, /not to scale/i);
  assert.doesNotMatch(svg, /<mesh|<triangle|<vertex/);
  const pdf = await makeConceptPdf("Test (1)").text();
  assert.match(pdf, /^%PDF-1\.4/);
  assert.ok(pdf.includes("Study: Test "));
});
