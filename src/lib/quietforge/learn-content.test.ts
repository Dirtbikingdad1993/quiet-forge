import test from "node:test";
import assert from "node:assert/strict";
import {
  lessons, lessonCategories, materials, designFamilies, glossary,
  sources, knowledgeQuestions, getLesson,
} from "./learn-content.ts";

test("the public learning library has substantial, navigable coverage", () => {
  assert.ok(lessons.length >= 15);
  assert.ok(materials.length >= 12);
  assert.ok(designFamilies.length >= 7);
  assert.ok(glossary.length >= 20);
  assert.ok(knowledgeQuestions.length >= 6);
  for (const cat of lessonCategories) {
    assert.ok(lessons.some((lesson) => lesson.category === cat), `Missing category ${cat}`);
  }
});

test("lesson IDs, references, materials and questions have valid distinct targets", () => {
  assert.equal(new Set(lessons.map((x) => x.id)).size, lessons.length);
  assert.equal(new Set(materials.map((x) => x.id)).size, materials.length);
  assert.equal(new Set<string>(sources.map((x) => x.id)).size, sources.length);
  assert.equal(new Set(knowledgeQuestions.map((x) => x.id)).size, knowledgeQuestions.length);
  const ids = new Set(sources.map((x) => x.id));
  for (const lesson of lessons) {
    assert.ok(lesson.sections.length >= 2, lesson.title);
    assert.ok(lesson.keyPoints.length >= 2, lesson.title);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length || section.bullets?.length);
    for (const source of lesson.sources) assert.ok(ids.has(source), `Bad reference ${source}`);
    assert.equal(getLesson(lesson.id)?.title, lesson.title);
  }
  for (const q of knowledgeQuestions) {
    assert.ok(q.choices.length >= 3);
    assert.ok(q.correct >= 0 && q.correct < q.choices.length);
    assert.ok(getLesson(q.lessonId), q.id);
  }
  for (const src of sources) {
    assert.equal(new URL(src.url).protocol, "https:");
  }
});

test("materials display qualitative context and caveats, not numeric build specifications", () => {
  for (const m of materials) {
    assert.ok(m.context.length > 20);
    assert.ok(m.strengths.length >= 2);
    assert.ok(m.limitations.length >= 2);
    assert.ok(m.misconception.length > 20);
  }
  assert.ok(getLesson("ownership")?.summary.includes("ATF") || getLesson("ownership")?.sections.some((s) => s.paragraphs.join(" ").includes("October 9, 2026")));
});
