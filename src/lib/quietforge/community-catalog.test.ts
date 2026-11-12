import test from "node:test";
import assert from "node:assert/strict";
import { communityEntries, fileFormats, getCommunityEntry } from "./community-catalog.ts";

test("named FTN/HTN projects and useful general topics are findable", () => {
  assert.ok(communityEntries.length >= 5);
  assert.ok(getCommunityEntry("ftn")?.name.includes("FTN"));
  assert.ok(getCommunityEntry("htn")?.name.includes("HTN"));
  assert.ok(communityEntries.every(e => e.tags.length >= 3 && e.discussion.length >= 3));
  assert.equal(new Set(communityEntries.map(e=>e.id)).size, communityEntries.length);
});
test("file-format reference is substantive and covers common catalog formats", () => {
  assert.ok(fileFormats.length >= 6);
  for(const format of ["STL","3MF","STEP","README","PDF"]) assert.ok(fileFormats.some(e=>e.name===format));
  assert.equal(new Set(fileFormats.map(f=>f.ext)).size,fileFormats.length);
  assert.ok(fileFormats.every(f=>f.details.length>40 && f.caution.length>35));
});
test("community directory is documentation-only, not an external file-link repository", () => {
  const data=JSON.stringify(communityEntries);
  assert.ok(!data.includes("http://") && !data.includes("https://"));
  assert.ok(communityEntries.filter(e=>e.kind==="Named community project").every(e=>e.status==="Name supplied by community"));
});
