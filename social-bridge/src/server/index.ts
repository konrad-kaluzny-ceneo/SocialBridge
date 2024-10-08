import { router } from "./trpc";
import { userRouter } from "./user-router";
import { organizationRouter } from "./organization-router";
import { aiRouter } from "./ai-router";
import { partnershipRouter } from "./partnership-router";
import { chatRouter } from "./chat-router";
import { eventsRouter } from "./events-router";
import { reviewsRouter } from "./reviews-router";
import { filesRouter } from "./files";

export const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  ai: aiRouter,
  partnership: partnershipRouter,
  chat: chatRouter,
  events: eventsRouter,
  reviews: reviewsRouter,
  files: filesRouter,
});

export type AppRouter = typeof appRouter;
