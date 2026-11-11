-- Plans are server-controlled. Sign-up has an implicit Free plan.
-- Only verified payment webhooks (once configured) may grant paid access.
create table if not exists quietforge_entitlements (
  user_id text primary key references "user" ("id") on delete cascade,
  tier text not null check (tier in ('free', 'pro')) default 'free',
  status text not null check (status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')) default 'inactive',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  updated_at timestamptz not null default now()
);

create table if not exists quietforge_ai_usage (
  user_id text not null references "user" ("id") on delete cascade,
  usage_day date not null default (now() at time zone 'utc')::date,
  requests integer not null default 0 check (requests >= 0),
  primary key (user_id, usage_day)
);
