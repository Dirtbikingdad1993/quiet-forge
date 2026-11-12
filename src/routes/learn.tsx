import { createFileRoute } from "@tanstack/react-router";
import { LearnLibrary } from "@/components/quietforge/learn-library";

export const Route = createFileRoute("/learn")({
  component: LearnLibrary,
  head: () => ({
    meta: [
      { title: "Learn | Suppressor Studio" },
      { name: "description", content: "Educational library about suppressor sound science, materials, design terminology, safety, and current laws." },
    ],
  }),
});
