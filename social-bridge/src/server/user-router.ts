import { db } from "@/db";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { GetUserValidator } from "@/validators/user";

export const userRouter = router({
  getUser: privateProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: {
        id: ctx.userId,
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

  getUserOrganizationId: privateProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: {
        id: ctx.userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    return user.organizationId;
  }),

  hasUserOrganization: privateProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: {
        id: ctx.userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    return user?.organizationId !== null;
  }),
});
