export type AccountPlan = "free" | "pro";

export const PLAN_LIMITS = {
  free: { cloudStudies: 10, aiQuestionsPerDay: 5 },
  pro: { cloudStudies: 100, aiQuestionsPerDay: 100 },
} as const;
