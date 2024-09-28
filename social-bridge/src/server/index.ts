import { router } from "./trpc";
import { userRouter } from "./user-router";
import { organizationRouter } from "./organization-router";
import { aiRouter } from "./ai-router";

export const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
