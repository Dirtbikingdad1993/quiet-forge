import { createFileRoute } from "@tanstack/react-router";
import { CommunityCatalog } from "@/components/quietforge/community-browser";

export const Route = createFileRoute("/community")({
  component: CommunityCatalog,
  head: () => ({
    meta: [
      { title: "Community Designs | Suppressor Studio" },
      { name: "description", content: "Unofficial community-project history and safety-aware educational comparisons." },
    ],
  }),
});
