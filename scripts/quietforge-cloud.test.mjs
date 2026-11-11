import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const migrationFiles = ["0001_auth.sql", "0002_user_workspaces.sql", "0003_plans.sql"];

async function fixture() {
  const db = new PGlite();
  for (const filename of migrationFiles) {
    await db.exec(await readFile(new URL(`../migrations/${filename}`, import.meta.url), "utf8"));
  }
  await db.query(`insert into "user" ("id", "name", "email", "emailVerified") values
    ('user-a', 'First', 'first@example.test', false),
    ('user-b', 'Second', 'second@example.test', false)`);
  return db;
}

const query = `insert into quietforge_workspaces (user_id, snapshot, revision)
  values ($1, $2::jsonb, 1)
  on conflict (user_id) do update set
    snapshot = excluded.snapshot,
    revision = quietforge_workspaces.revision + 1,
    updated_at = now()
  where quietforge_workspaces.revision = $3
  returning revision`;

test("each account owns a separate cloud snapshot and cannot overwrite with a stale revision", async () => {
  const db = await fixture();
  try {
    const first = await db.query(query, ["user-a", JSON.stringify({ name: "A1" }), 0]);
    const second = await db.query(query, ["user-b", JSON.stringify({ name: "B1" }), 0]);
    assert.equal(first.rows[0].revision, 1);
    assert.equal(second.rows[0].revision, 1);
    const update = await db.query(query, ["user-a", JSON.stringify({ name: "A2" }), 1]);
    assert.equal(update.rows[0].revision, 2);
    const stale = await db.query(query, ["user-a", JSON.stringify({ name: "stale" }), 1]);
    assert.equal(stale.rows.length, 0);
    const rows = await db.query("select user_id, snapshot, revision from quietforge_workspaces order by user_id");
    assert.deepEqual(rows.rows.map(({ user_id, snapshot, revision }) => ({ user_id, name: snapshot.name, revision })), [
      { user_id: "user-a", name: "A2", revision: 2 },
      { user_id: "user-b", name: "B1", revision: 1 },
    ]);
  } finally { await db.close(); }
});

test("Free tier is implicit and Pro requires active entitlement", async () => {
  const db = await fixture();
  try {
    const user = "user-a";
    let rows = await db.query("select tier, status from quietforge_entitlements where user_id=$1", [user]);
    assert.equal(rows.rows.length, 0); // Implicit Free; no self-upgrade API.
    await db.query("insert into quietforge_entitlements (user_id, tier, status) values ($1, 'pro', 'inactive')", [user]);
    rows = await db.query("select tier, status from quietforge_entitlements where user_id=$1", [user]);
    assert.deepEqual(rows.rows[0], { tier: "pro", status: "inactive" });
    await db.query("update quietforge_entitlements set status='active' where user_id=$1", [user]);
    rows = await db.query("select tier, status from quietforge_entitlements where user_id=$1", [user]);
    assert.deepEqual(rows.rows[0], { tier: "pro", status: "active" });
  } finally { await db.close(); }
});

test("AI question allowance increments atomically and stops at the limit", async () => {
  const db = await fixture();
  try {
    const statement = `insert into quietforge_ai_usage (user_id, usage_day, requests)
      values ($1, (now() at time zone 'utc')::date, 1)
      on conflict (user_id, usage_day) do update
      set requests = quietforge_ai_usage.requests + 1
      where quietforge_ai_usage.requests < $2
      returning requests`;
    for (let count = 1; count <= 5; count++) {
      const result = await db.query(statement, ["user-a", 5]);
      assert.equal(result.rows[0].requests, count);
    }
    assert.equal((await db.query(statement, ["user-a", 5])).rows.length, 0);
    assert.equal((await db.query(statement, ["user-b", 5])).rows[0].requests, 1);
  } finally { await db.close(); }
});
