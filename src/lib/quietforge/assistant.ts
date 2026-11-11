import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

const askInput = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    text: z.string().min(1).max(2000),
  })).min(1).max(12),
  view: z.enum(["studio", "engineering", "projects"]),
});

export const getMyPlan = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { planOverview } = await import("@/lib/quietforge/plans.server");
    return planOverview(context.userId);
  });

export const askQuietForge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((value: unknown) => askInput.parse(value))
  .handler(async ({ context, data }) => {
    if (process.env.QUIETFORGE_AI_ENABLED !== "true" || !process.env.AI_GATEWAY_MODEL) {
      throw new Error("AI answers are not enabled yet. The owner needs to configure an AI Gateway model and budget.");
    }

    const { userPlan, reserveQuestion, refundQuestion } = await import("@/lib/quietforge/plans.server");
    const plan = await userPlan(context.userId);
    if (!(await reserveQuestion(context.userId, plan))) {
      throw new Error("You have reached your daily AI question allowance. Try again tomorrow.");
    }

    try {
      const { generateText } = await import("ai");
      const result = await generateText({
        model: process.env.AI_GATEWAY_MODEL,
        instructions: [
          "You are QuietForge Guide, a friendly, accurate helper inside a concept-sketch software application.",
          "Help users navigate the app, save/import/export studies, understand materials at a general educational level, troubleshoot browser and cloud syncing, and understand legal/safety considerations.",
          "Offer concise contextual tips when useful. State uncertainty; do not invent app features.",
          "Do not give instructions, dimensions, calculations, material specifications, or optimization guidance that enable building, modifying, or improving firearm suppressors, firearms, or other weapons. Keep discussion of those topics high-level and safety-focused.",
          "Do not provide legal advice as fact; recommend consulting local authorities or qualified counsel for legal specifics.",
          `The user is viewing the ${data.view} section of QuietForge.`,
        ].join("\n"),
        messages: data.messages.map((message) => ({ role: message.role, content: message.text })),
        maxOutputTokens: 450,
        temperature: 0.5,
      });
      return { answer: result.text, plan };
    } catch (error) {
      await refundQuestion(context.userId);
      // Never echo provider credentials or internal details into the UI.
      console.error("[quietforge-ai] provider request failed", error instanceof Error ? error.name : "unknown");
      throw new Error("The AI helper is temporarily unavailable. Your question wasn't counted.");
    }
  });
