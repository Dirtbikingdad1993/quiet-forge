import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SEED_PROJECTS,
  defaultProject,
  newId,
  sanitize,
  type Project,
  type RenderMode,
  type Unit,
  type ViewId,
} from "@/lib/quietforge/model";

type ForgeState = {
  projects: Project[];
  activeId: string;
  view: ViewId;
  unit: Unit;
  renderMode: RenderMode;
  setView: (view: ViewId) => void;
  setUnit: (unit: Unit) => void;
  setRenderMode: (mode: RenderMode) => void;
  open: (id: string) => void;
  updateActive: (patch: Partial<Project>) => void;
  create: (patch: Partial<Project>, name: string) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
  replaceAll: (projects: Project[]) => void;
};

export const useForge = create<ForgeState>()(
  persist(
    (set, get) => ({
      projects: SEED_PROJECTS,
      activeId: SEED_PROJECTS[0].id,
      view: "studio",
      unit: "in",
      renderMode: "concept",
      setView: (view) => set({ view }),
      setUnit: (unit) => set({ unit }),
      setRenderMode: (renderMode) => set({ renderMode }),
      open: (id) => set({ activeId: id, view: "studio" }),
      updateActive: (patch) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeId ? sanitize({ ...p, ...patch, id: p.id, updatedAt: Date.now() }) : p,
          ),
        })),
      create: (patch, name) => {
        const project = defaultProject({ ...patch, id: newId(), name, updatedAt: Date.now() });
        set((state) => ({
          projects: [project, ...state.projects],
          activeId: project.id,
          view: "studio",
        }));
      },
      duplicate: (id) => {
        const source = get().projects.find((p) => p.id === id);
        if (!source) return;
        const copy = sanitize({
          ...source,
          id: newId(),
          name: `${source.name} copy`.slice(0, 64),
          updatedAt: Date.now(),
        });
        set((state) => ({
          projects: [copy, ...state.projects],
          activeId: copy.id,
        }));
      },
      remove: (id) =>
        set((state) => {
          const projects = state.projects.filter((p) => p.id !== id);
          const activeId = state.activeId === id ? (projects[0]?.id ?? "") : state.activeId;
          return { projects, activeId };
        }),
      replaceAll: (projects) =>
        set({
          projects,
          activeId: projects[0]?.id ?? "",
          view: "projects",
        }),
    }),
    {
      name: "quietforge.v1",
      version: 1,
      partialize: (state) => ({
        projects: state.projects,
        activeId: state.activeId,
        view: state.view,
        unit: state.unit,
        renderMode: state.renderMode,
      }),
      merge: (persisted, current) => {
        try {
          const saved = (persisted ?? {}) as Partial<ForgeState>;
          const incoming = Array.isArray(saved.projects) ? saved.projects : null;
          const projects = incoming
            ? incoming
                .map((p) => {
                  try {
                    return sanitize(p);
                  } catch {
                    return null;
                  }
                })
                .filter((p): p is Project => p !== null && Boolean(p.id))
            : current.projects;
          const list = projects.length ? projects : current.projects;
          const activeId = list.some((p) => p.id === saved.activeId) ? (saved.activeId as string) : list[0].id;
          const view: ViewId =
            saved.view === "projects" || saved.view === "engineering" || saved.view === "studio"
              ? saved.view
              : current.view;
          return {
            ...current,
            projects: list,
            activeId,
            view,
            unit: saved.unit === "mm" ? "mm" : "in",
            renderMode: saved.renderMode === "blueprint" ? "blueprint" : "concept",
          };
        } catch {
          return current;
        }
      },
    },
  ),
);

export function activeProject(state: ForgeState) {
  return state.projects.find((p) => p.id === state.activeId) ?? null;
}
