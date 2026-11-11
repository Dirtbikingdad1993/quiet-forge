import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AccountControl() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-11 animate-pulse rounded-md bg-surface-2" aria-label="Checking account" />;
  }
  if (user) {
    return <div className="flex min-w-0 flex-wrap items-center gap-3 [&_span]:truncate"><UserButton /><Link to="/plans" className="text-xs text-brass underline-offset-2 hover:underline">Free / Pro</Link></div>;
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
    <Link
      to="/login"
      className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-brass/50 px-3 text-sm font-medium text-brass transition-colors hover:bg-brass/10"
    >
      <UserRound className="size-4" /> Sign in / Sign up
    </Link>
    <Link to="/plans" className="text-xs text-brass underline-offset-2 hover:underline">Free / Pro</Link>
    </div>
  );
}
