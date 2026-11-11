import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";

// Never create public accounts in Vercel's throwaway filesystem-backed fallback.
// The local preview intentionally uses the embedded PGLite database.
const databaseReady = () => !process.env.VERCEL || Boolean(process.env.DATABASE_URL);

const handle = (request: Request) => {
  if (!databaseReady()) {
    return Response.json(
      { message: "Account service is awaiting its persistent database." },
      { status: 503 },
    );
  }
  return auth.handler(request);
};

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
