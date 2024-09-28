import { z } from "zod";

export const GetUserValidator = z.object({
  userId: z.string(),
});

export type GetUserRequest = z.infer<typeof GetUserValidator>;
