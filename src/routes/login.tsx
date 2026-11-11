import { useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck, UserRoundPlus } from "lucide-react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

type AccountMode = "register" | "login";

function Login() {
  const [mode, setMode] = useState<AccountMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, isPending } = useCurrentUserState();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");

    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail || password.length < 8) {
      setError("Enter a valid email and a password of at least 8 characters.");
      return;
    }
    if (mode === "register" && (!name.trim() || password !== confirmPassword)) {
      setError(!name.trim() ? "Please enter your name." : "Your passwords don't match.");
      return;
    }

    setBusy(true);
    try {
      const result = mode === "register"
        ? await authClient.signUp.email({ name: name.trim(), email: cleanedEmail, password })
        : await authClient.signIn.email({ email: cleanedEmail, password });

      if (result.error) {
        setError(result.error.status === 503
          ? "Accounts aren't available yet. The server needs a persistent database."
          : result.error.message ?? "Unable to continue. Please try again.");
        return;
      }
      // A full navigation immediately refreshes the session-aware app shell.
      window.location.assign("/");
    } catch {
      setError("Couldn't reach the account service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col bg-bg px-5 py-8 text-fg">
      <div className="mx-auto w-full max-w-5xl">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
          <ArrowLeft className="size-4" /> Back to concept studio
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 py-10 md:grid-cols-2">
        <section className="hidden max-w-md space-y-5 md:block">
          <div className="inline-flex size-12 items-center justify-center rounded-xl border border-brass/40 bg-brass/10 text-brass">
            <ShieldCheck className="size-6" />
          </div>
          <p className="font-mono text-xs tracking-widest text-brass">SUPPRESSOR STUDIO / ACCOUNTS</p>
          <h1 className="text-4xl font-semibold tracking-tight">Your workspace. Your account.</h1>
          <p className="leading-relaxed text-muted">
            Join Suppressor Studio with an individual account, or sign back in whenever you return.
          </p>
          <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
            Your studies sync securely across your signed-in devices. You can keep working offline, and changes will upload when you reconnect.
          </div>
        </section>

        <section className="w-full max-w-md justify-self-center rounded-xl border border-border bg-surface p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex size-11 items-center justify-center rounded-lg bg-brass/10 text-brass md:hidden">
            <UserRoundPlus className="size-5" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Suppressor Studio account</p>
          {isPending ? (
            <div className="mt-6 h-72 animate-pulse rounded-lg bg-surface-2" aria-label="Checking your account" />
          ) : user ? (
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-semibold">You're signed in</h2>
              <p className="text-sm text-muted">Welcome back, {user.displayName ?? user.primaryEmail}.</p>
              <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brass px-4 font-medium text-brass-ink">
                Open studio <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : !authEnabled ? (
            <p className="mt-6 text-sm text-muted">Account registration is currently unavailable.</p>
          ) : (
            <>
              <h2 className="mt-2 text-2xl font-semibold">{mode === "register" ? "Create an account" : "Welcome back"}</h2>
              <p className="mt-2 text-sm text-muted">
                {mode === "register" ? "Registration is open to everyone." : "Sign in with your email and password."}
              </p>

              <div className="mt-6 grid grid-cols-2 rounded-md border border-border bg-bg p-1" aria-label="Account action">
                {(["register", "login"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { setMode(option); setError(""); setPassword(""); setConfirmPassword(""); }}
                    aria-pressed={mode === option}
                    className={mode === option
                      ? "min-h-10 rounded bg-surface-2 text-sm font-medium text-fg"
                      : "min-h-10 rounded text-sm text-muted hover:text-fg"}
                  >
                    {option === "register" ? "Sign up" : "Sign in"}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-5 space-y-4">
                {mode === "register" && (
                  <Field label="Your name" id="account-name" autoComplete="name" value={name} onChange={setName} minLength={1} />
                )}
                <Field label="Email address" id="account-email" type="email" autoComplete="email" value={email} onChange={setEmail} />
                <Field label="Password" id="account-password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={setPassword} minLength={8} />
                {mode === "register" && (
                  <Field label="Confirm password" id="account-password-confirm" type="password" autoComplete="new-password" value={confirmPassword} onChange={setConfirmPassword} minLength={8} />
                )}
                {error && <p role="alert" className="rounded-md border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brass px-4 font-semibold text-brass-ink transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                >
                  {busy ? "Please wait…" : mode === "register" ? "Create my account" : "Sign in"}
                  {!busy && <ArrowRight className="size-4" />}
                </button>
              </form>
              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted">
                <LockKeyhole className="mt-0.5 size-4 shrink-0" />
                Your password is handled securely. Your studies are private to your account and sync to the cloud.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label, id, value, onChange, type = "text", autoComplete, minLength,
}: {
  label: string; id: string; value: string; onChange: (value: string) => void;
  type?: string; autoComplete: string; minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        maxLength={type === "password" ? 128 : 254}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-muted focus:border-brass"
      />
    </div>
  );
}
