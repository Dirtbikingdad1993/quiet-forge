import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
const root = readFileSync(new URL("../src/routes/__root.tsx", import.meta.url), "utf8");
const registrar = readFileSync(new URL("../src/components/service-worker-registrar.tsx", import.meta.url), "utf8");

test("service worker only caches public assets, never account or API responses", () => {
  assert.match(src, /request\.method !== "GET"/);
  assert.match(src, /path\.startsWith\("\/api\/"\)/);
  assert.match(src, /path\.startsWith\("\/auth\/"\)/);
  assert.match(src, /request\.mode === "navigate"/);
  assert.match(src, /fetch\(request\)\.catch/);
  assert.doesNotMatch(src, /cache\.put\(request, response\.clone\(\)\)[\s\S]*cache\.put\(request, response\.clone\(\)\)/);
});
test("service worker registers only on HTTPS and offline fallback is static", () => {
  assert.match(registrar, /window\.location\.protocol !== "https:"/);
  assert.match(registrar, /register\("\/sw\.js"/);
  assert.match(root, /<ServiceWorkerRegistrar \/>/);
  const offline = readFileSync(new URL("../public/offline.html", import.meta.url), "utf8");
  assert.match(offline, /Suppressor Studio is offline/);
});
