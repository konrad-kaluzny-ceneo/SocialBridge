import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { AddReviewValidator, GetReviewValidator } from "@/validators/review";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = router({
  addReview: privateProcedure
    .input(AddReviewValidator)
    .mutation(async ({ input, ctx }) => {
      const user = await db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Użytkownik nie został znaleziony",
        });
      }

      const review = await db.review.create({
        data: {
          eventId: input.eventId,
          reviewerId: ctx.user.id,
          reviewedUserId: input.reviewedUserId,
          value: input.value,
          comment: input.comment ?? "",
        },
      });

      return review;
    }),

  getUserReview: privateProcedure
    .input(GetReviewValidator)
    .query(async ({ input, ctx }) => {
      const user = await db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Użytkownik nie został znaleziony",
        });
      }

      const review = await db.review.findFirst({
        where: {
          eventId: input.eventId,
          reviewerId: user.id,
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recenzja nie została znaleziona",
        });
      }

      return review;
    }),
});
