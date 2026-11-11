import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, LockKeyhole, Sparkles } from "lucide-react";
import { getMyPlan } from "@/lib/quietforge/assistant";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PLAN_LIMITS } from "@/lib/quietforge/plans";

export const Route = createFileRoute("/plans")({ component: Plans });

function Plans() {
  const { user, isPending } = useCurrentUserState();
  const [current, setCurrent] = useState<"free" | "pro">("free");
  const [usage, setUsage] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.isDevFallback || isPending) return;
    let live = true;
    void getMyPlan().then((overview) => {
      if (live) { setCurrent(overview.plan); setUsage(overview.aiUsedToday); }
    }).catch(() => { /* The public plan comparison still works offline. */ });
    return () => { live = false; };
  }, [user, isPending]);

  return (
    <main className="min-h-dvh bg-bg px-5 py-8 text-fg">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"><ArrowLeft className="size-4" /> Back to QuietForge</Link>
        <div className="mb-8 mt-8 space-y-3 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-brass">QuietForge / Membership</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Free to start. Pro when you're ready.</h1>
          <p className="mx-auto max-w-xl text-muted">Both plans include private accounts and device syncing. Pro offers more space and more AI assistance.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <PlanCard
            title="Free" price="Free forever" current={Boolean(user) && current === "free"}
            features={[`${PLAN_LIMITS.free.cloudStudies} cloud-synced studies`, `${PLAN_LIMITS.free.aiQuestionsPerDay} AI questions per day when enabled`, "Local backups and offline editing", "Guide tips and help articles"]}
            action={user ? "Your included plan" : "Create a free account"}
            href={user ? undefined : "/login"}
          />
          <PlanCard
            title="Pro" price="Price to be announced" current={Boolean(user) && current === "pro"}
            features={[`${PLAN_LIMITS.pro.cloudStudies} cloud-synced studies`, `${PLAN_LIMITS.pro.aiQuestionsPerDay} AI questions per day when enabled`, "Everything included in Free", "Priority access to new productivity features"]}
            action={current === "pro" && user ? "Your Pro plan" : "Checkout setup pending"}
            highlighted
          />
        </div>
        {usage !== null && <p className="mt-5 text-center text-sm text-muted">AI questions used today: {usage} of {PLAN_LIMITS[current].aiQuestionsPerDay}</p>}
        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed text-muted">
          Pro billing is not taking payments yet. AI answers will activate once a model and spending budget are configured. Basic Guide help remains available without AI.
        </p>
      </div>
    </main>
  );
}

function PlanCard({ title, price, current, features, action, href, highlighted = false }: {
  title: string; price: string; current: boolean; features: string[]; action: string; href?: "/login"; highlighted?: boolean;
}) {
  return (
    <section className={`flex flex-col rounded-xl border p-6 ${highlighted ? "border-brass/60 bg-brass/5" : "border-border bg-surface"}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {highlighted && <Sparkles className="size-5 text-brass" />}
      </div>
      <p className="mt-3 text-lg font-medium text-brass">{price}</p>
      <ul className="my-8 flex flex-1 flex-col gap-4">
        {features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brass" /> {feature}</li>)}
      </ul>
      {href ? (
        <Link to={href} className="flex min-h-11 items-center justify-center rounded-md bg-brass px-4 font-semibold text-brass-ink">{action}</Link>
      ) : (
        <button type="button" disabled className="flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm text-muted">
          {!current && <LockKeyhole className="size-4" />}{action}
        </button>
      )}
    </section>
  );
}
