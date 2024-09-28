import { db } from "@/db";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { GetUserValidator } from "@/validators/user";

export const userRouter = router({
  getUser: privateProcedure.input(GetUserValidator).query(async ({ input }) => {
    const user = await db.user.findUnique({
      where: {
        id: input.userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    return user;
  }),
});
