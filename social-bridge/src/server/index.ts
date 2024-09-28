import { router } from "./trpc";
import { userRouter } from "./user-router";
import { organizationRouter } from "./organization-router";
import { aiRouter } from "./ai-router";
import { partnershipRouter } from "./partnership-router";
import { chatRouter } from "./chat-router";
export const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  ai: aiRouter,
  partnership: partnershipRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
