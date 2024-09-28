import { router } from "./trpc";
import { userRouter } from "./user-router";
import { organizationRouter } from "./organization-router";

export const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  
});

export type AppRouter = typeof appRouter;
