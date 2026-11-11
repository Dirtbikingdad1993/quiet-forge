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
    return <div className="min-w-0 [&_span]:truncate"><UserButton /></div>;
  }
  return (
    <Link
      to="/login"
      className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-brass/50 px-3 text-sm font-medium text-brass transition-colors hover:bg-brass/10"
    >
      <UserRound className="size-4" /> Sign in / Sign up
    </Link>
  );
}
