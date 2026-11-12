import { createFileRoute } from "@tanstack/react-router";
import { GunCadIndexGuide } from "@/components/quietforge/community-browser";

export const Route = createFileRoute("/guncad-index")({
  component: GunCadIndexGuide,
  head: () => ({
    meta: [
      { title: "GunCAD Index Guide | Suppressor Studio" },
      { name: "description", content: "Learn about CAD formats, catalog provenance, and non-weapon sample files." },
    ],
  }),
});
