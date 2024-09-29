import { z } from "zod";

export const AddReviewValidator = z.object({
  eventId: z.string(),
  value: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const GetReviewValidator = z.object({
  eventId: z.string(),
});

export type AddReviewRequest = z.infer<typeof AddReviewValidator>;
export type GetReviewRequest = z.infer<typeof GetReviewValidator>;
