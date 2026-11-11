import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

const project = z.object({
  id: z.string().min(1).max(128),
  name: z.string().max(64),
  updatedAt: z.number().finite().nonnegative(),
  caliberId: z.string().max(32),
  lengthIn: z.number().finite(),
  odIn: z.number().finite(),
  wallIn: z.number().finite(),
  blastIn: z.number().finite(),
  baffleCount: z.number().int(),
  coneDepthIn: z.number().finite(),
  boreClearanceIn: z.number().finite(),
  style: z.enum(["cone", "clipped", "radial"]),
  mount: z.enum(["direct-thread", "hub"]),
  notes: z.string().max(2000),
  assumedPressurePsi: z.number().finite(),
  materialId: z.string().max(32),
});

export const workspaceSchema = z.object({
  projects: z.array(project).max(100),
  activeId: z.string().max(128),
  view: z.enum(["studio", "engineering", "projects"]),
  unit: z.enum(["in", "mm"]),
  renderMode: z.enum(["concept", "blueprint"]),
});

export type CloudWorkspace = z.infer<typeof workspaceSchema>;

const saveInput = z.object({
  expectedRevision: z.number().int().min(0),
  snapshot: workspaceSchema,
});

type StoredRow = { snapshot: unknown; revision: number };

export const getCloudWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<StoredRow>`
      select snapshot, revision from quietforge_workspaces
      where user_id = ${context.userId}
    `;
    const row = rows[0];
    return row
      ? { snapshot: workspaceSchema.parse(row.snapshot), revision: Number(row.revision) }
      : { snapshot: null, revision: 0 };
  });

export const saveCloudWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((value: unknown) => saveInput.parse(value))
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const { userPlan } = await import("@/lib/quietforge/plans.server");
    const { PLAN_LIMITS } = await import("@/lib/quietforge/plans");
    const plan = await userPlan(context.userId);
    if (data.snapshot.projects.length > PLAN_LIMITS[plan].cloudStudies) {
      throw new Error(`Your ${plan} plan supports up to ${PLAN_LIMITS[plan].cloudStudies} cloud studies. Export or remove some studies before syncing.`);
    }
    const sql = await getSql();
    const rows = await sql.query<{ revision: number }>(
      `insert into quietforge_workspaces (user_id, snapshot, revision)
       values ($1, $2::jsonb, 1)
       on conflict (user_id) do update set
         snapshot = excluded.snapshot,
         revision = quietforge_workspaces.revision + 1,
         updated_at = now()
       where quietforge_workspaces.revision = $3
       returning revision`,
      [context.userId, JSON.stringify(data.snapshot), data.expectedRevision],
    );
    if (rows[0]) return { saved: true as const, revision: Number(rows[0].revision), snapshot: null };

    // The server's revision check prevents a stale tab from silently
    // overwriting a newer device's work. Return only THIS user's snapshot.
    const existing = await sql<StoredRow>`
      select snapshot, revision from quietforge_workspaces
      where user_id = ${context.userId}
    `;
    return {
      saved: false as const,
      revision: Number(existing[0]?.revision ?? 0),
      snapshot: existing[0] ? workspaceSchema.parse(existing[0].snapshot) : null,
    };
  });
