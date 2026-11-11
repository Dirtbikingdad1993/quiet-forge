-- Each authenticated account owns exactly one current workspace snapshot.
-- Access is always scoped to a verified Better Auth user ID server-side.
create table if not exists quietforge_workspaces (
  user_id text primary key references "user" ("id") on delete cascade,
  snapshot jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
