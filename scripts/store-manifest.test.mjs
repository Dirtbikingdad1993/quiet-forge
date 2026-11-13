import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, "public/manifest.webmanifest"), "utf8"));
const source = readFileSync(join(root, "src/routes/__root.tsx"), "utf8");

test("install manifest uses Suppressor Studio branding, not the platform placeholder", () => {
  assert.equal(manifest.name, "Suppressor Studio");
  assert.equal(manifest.id, "/");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "standalone");
  assert.ok(!JSON.stringify(manifest).includes("Grok App"));
  assert.match(source, /rel: "manifest", href: "\/manifest.webmanifest"/);
  assert.match(source, /rel: "apple-touch-icon", href: "\/icons\/icon-180.png"/);
});
test("required PNG icons exist with the sizes advertised by the manifest", () => {
  const iconList = [...manifest.icons, {src:"/icons/icon-180.png",sizes:"180x180"}, {src:"/icons/icon-1024.png",sizes:"1024x1024"}];
  for (const icon of iconList) {
    const bytes = readFileSync(join(root,"public",icon.src));
    assert.equal(bytes.toString("hex",0,8), "89504e470d0a1a0a", icon.src);
    assert.equal(bytes.readUInt32BE(16), Number(icon.sizes.split("x")[0]));
    assert.equal(bytes.readUInt32BE(20), Number(icon.sizes.split("x")[1]));
  }
  assert.ok(manifest.icons.some((icon) => icon.purpose==="maskable"));
});
test("app PWA links do not use generic platform branding", () => {
  assert.doesNotMatch(source, /__grok\/manifest.webmanifest|__grok\/icon-180.png/);
  assert.match(source, /apple-mobile-web-app-title/);
});
