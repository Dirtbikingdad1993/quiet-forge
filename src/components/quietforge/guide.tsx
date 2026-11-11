import { useState, type FormEvent } from "react";
import { Bot, ChevronDown, Send, Sparkles, X } from "lucide-react";
import { askQuietForge } from "@/lib/quietforge/assistant";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { ViewId } from "@/lib/quietforge/model";

type Message = { role: "user" | "assistant"; text: string };

const TIPS: Record<ViewId, string> = {
  studio: "Tip: Use Sketch to review a concept visually. Save a copy before making major changes.",
  engineering: "Tip: The Screen tab is for educational estimates only, not validated manufacturing or safety data.",
  projects: "Tip: Export a JSON backup from Studies before deleting or replacing your work.",
};

const QUICK_HELP = [
  { question: "How do I save my studies?", answer: "Changes save automatically in your browser. Sign in to sync studies to your account, and wait for the Cloud synced indicator before switching devices." },
  { question: "How do I restore a backup?", answer: "Open Studies, choose Restore, and select a JSON backup previously exported from Suppressor Studio. Restoring replaces the current study list, so export a backup first." },
  { question: "What can the AI help with?", answer: "Suppressor Studio Guide can explain app features, help with backup or sync issues, and discuss general engineering and safety concepts. It cannot provide instructions to manufacture or optimize a weapon." },
];

export function Guide({ view }: { view: ViewId }) {
  const { user } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const [expandedTip, setExpandedTip] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickHelp = (question: string, answer: string) => {
    setMessages((previous) => [...previous, { role: "user", text: question }, { role: "assistant", text: answer }]);
    setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy || text.length > 2000) return;
    const next: Message[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);
    if (!user || user.isDevFallback) {
      setError("Sign in with a Suppressor Studio account to ask live AI questions. Quick help works without an account.");
      setBusy(false);
      return;
    }
    try {
      const result = await askQuietForge({ data: { messages: next.slice(-12), view } });
      setMessages((previous) => [...previous, { role: "assistant", text: result.answer }]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to get an AI answer right now.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-20 right-3 z-40 flex max-h-[calc(100dvh-7rem)] w-[min(24rem,calc(100vw-1.5rem))] flex-col items-end gap-2 lg:bottom-5 lg:right-5">
      {open && (
        <section aria-label="Suppressor Studio AI guide" className="pointer-events-auto flex max-h-[min(75dvh,41rem)] w-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Bot className="size-5 text-brass" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold">Suppressor Studio Guide</h2>
              <p className="text-xs text-muted">App help, useful tips, and AI questions</p>
            </div>
            <button aria-label="Close guide" type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-md hover:bg-surface-2"><X className="size-4" /></button>
          </header>

          <div className="space-y-4 overflow-y-auto p-4 text-sm" aria-live="polite">
            <div className="rounded-md border border-brass/30 bg-brass/10 p-3">
              <button className="flex w-full items-center justify-between gap-2 text-left font-medium text-brass" type="button" onClick={() => setExpandedTip(!expandedTip)}>
                <span className="flex items-center gap-2"><Sparkles className="size-4" /> Tip for this tab</span>
                <ChevronDown className={`size-4 transition-transform ${expandedTip ? "rotate-180" : ""}`} />
              </button>
              {expandedTip && <p className="mt-2 leading-relaxed text-fg">{TIPS[view]}</p>}
            </div>

            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted">Try a quick answer:</p>
                {QUICK_HELP.map((help) => (
                  <button key={help.question} type="button" onClick={() => pickHelp(help.question, help.answer)} className="block w-full rounded-md border border-border px-3 py-2 text-left hover:bg-surface-2">
                    {help.question}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`max-w-[92%] rounded-lg px-3 py-2 leading-relaxed whitespace-pre-wrap ${message.role === "user" ? "ml-auto bg-brass/10" : "border border-border bg-bg"}`}>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">{message.role === "user" ? "You" : "Suppressor Studio Guide"}</p>
                {message.text}
              </div>
            ))}
            {busy && <p className="text-xs text-muted">Guide is thinking…</p>}
            {error && <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 p-2 text-xs text-danger">{error}</p>}
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-border p-3">
            <label htmlFor="guide-question" className="sr-only">Ask Suppressor Studio Guide</label>
            <input id="guide-question" value={input} onChange={(event) => setInput(event.target.value)} maxLength={2000} placeholder="Ask a question…" className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-brass" />
            <button type="submit" disabled={!input.trim() || busy} aria-label="Ask guide" className="flex min-h-11 min-w-11 items-center justify-center rounded-md bg-brass text-brass-ink disabled:opacity-50"><Send className="size-4" /></button>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} className="pointer-events-auto flex min-h-12 items-center gap-2 rounded-full border border-brass/50 bg-surface px-4 text-sm font-semibold text-brass shadow-xl hover:bg-surface-2" aria-expanded={open}>
        <Bot className="size-5" /> {open ? "Hide guide" : "AI Guide"}
      </button>
    </div>
  );
}
