import { getSql } from "@/lib/db";
import { PLAN_LIMITS, type AccountPlan } from "./plans";

/** Never accept a client-supplied plan. Entitlements come from the database. */
export async function userPlan(userId: string): Promise<AccountPlan> {
  const sql = await getSql();
  const rows = await sql<{ tier: string; status: string }>`
    select tier, status from quietforge_entitlements where user_id = ${userId}
  `;
  return rows[0]?.tier === "pro" && (rows[0]?.status === "active" || rows[0]?.status === "trialing")
    ? "pro" : "free";
}

export async function planOverview(userId: string) {
  const sql = await getSql();
  const plan = await userPlan(userId);
  const usage = await sql<{ requests: number }>`
    select requests from quietforge_ai_usage
    where user_id = ${userId} and usage_day = (now() at time zone 'utc')::date
  `;
  return {
    plan,
    limits: PLAN_LIMITS[plan],
    aiUsedToday: Number(usage[0]?.requests ?? 0),
    aiAvailable: process.env.QUIETFORGE_AI_ENABLED === "true" && Boolean(process.env.AI_GATEWAY_MODEL),
    checkoutAvailable: false,
  };
}

export async function reserveQuestion(userId: string, plan: AccountPlan) {
  const sql = await getSql();
  const result = await sql.query<{ requests: number }>(
    `insert into quietforge_ai_usage (user_id, usage_day, requests)
     values ($1, (now() at time zone 'utc')::date, 1)
     on conflict (user_id, usage_day) do update
     set requests = quietforge_ai_usage.requests + 1
     where quietforge_ai_usage.requests < $2
     returning requests`,
    [userId, PLAN_LIMITS[plan].aiQuestionsPerDay],
  );
  return Boolean(result[0]);
}

export async function refundQuestion(userId: string) {
  const sql = await getSql();
  await sql`
    update quietforge_ai_usage set requests = greatest(0, requests - 1)
    where user_id = ${userId} and usage_day = (now() at time zone 'utc')::date
  `;
}
