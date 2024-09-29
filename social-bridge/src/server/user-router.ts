import { db } from "@/db";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import {
  UpdateVolunteerProfileValidator,
  GetUserValidator,
} from "@/validators/user";

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

  getVolunteerProfile: privateProcedure
    .input(GetUserValidator)
    .query(async ({ input }) => {
      const { userId } = input;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          Organization: {
            include: {
              Team: true,
            },
          },
        },
      });

      return user;
    }),

  updateVolunteerProfile: privateProcedure
    .input(UpdateVolunteerProfileValidator)
    .mutation(async ({ input }) => {
      const {
        userId,
        volunteerExperience,
        volunteerSkills,
        volunteerProjects,
        volunteerRole,
        volunteerStrengths,
      } = input;

      const user = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          volunteerExperience: volunteerExperience ?? undefined,
          volunteerSkills: volunteerSkills ?? undefined,
          volunteerProjects: volunteerProjects ?? undefined,
          volunteerRole: volunteerRole ?? undefined,
          volunteerStrengths: volunteerStrengths ?? undefined,
        },
      });

      return user;
    }),

  userCanBeAddedToOrganization: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const user = await db.user.findFirst({
      where: { id: userId },
      include: {
        Organization: true,
      },
    });

    if (!user) {
      return false;
    }

    if (user.Organization) {
      return false;
    }

    return true;
  }),
});
