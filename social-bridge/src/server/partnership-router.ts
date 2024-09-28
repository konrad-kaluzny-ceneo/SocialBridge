import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import {
  InitPartnershipProcessValidator,
  GetPartnershipRequestValidator,
  GetOrganizationPartnersValidator,
} from "@/validators/partnership";

export const partnershipRouter = router({
  getPartners: privateProcedure
    .input(GetPartnershipRequestValidator)
    .query(async ({ ctx, input }) => {
      const { eventId } = input;

      const partnerships = await db.partnership.findMany({
        where: { eventId },
      });

      const partners = await db.organization.findMany({
        where: {
          id: {
            in: partnerships
              .map((partnership) => partnership.partnerId)
              .filter((id): id is string => id !== null),
          },
        },
      });

      return partners;
    }),

  getOrganizationPartners: publicProcedure
    .input(GetOrganizationPartnersValidator)
    .query(async ({ input }) => {
      const { organizationId } = input;

      const partnershipsAsOrganizer = await db.partnership.findMany({
        where: { organizerId: organizationId },
      });

      const partnershipsAsPartner = await db.partnership.findMany({
        where: { partnerId: organizationId },
      });

      const partnerships = [
        ...partnershipsAsOrganizer,
        ...partnershipsAsPartner,
      ];

      const partners = await db.organization.findMany({
        where: {
          id: {
            in: partnerships
              .filter((partnership) => partnership.partnerId !== null)
              .filter((partnership) => partnership.partnerId !== organizationId)
              .map((partnership) => partnership.partnerId)
              .filter((id): id is string => id !== null),
          },
        },
        include: {
          Address: true,
          Photos: true,
        },
      });

      return partners;
    }),

  initPartnershipProcess: privateProcedure
    .input(InitPartnershipProcessValidator)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const userWithOrganization = await db.user.findUnique({
        where: { id: userId },
        include: { Organization: true },
      });

      if (!userWithOrganization?.Organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organizacja użytkownika nie została znaleziona",
        });
      }

      const {
        organizationId,
        message,
        givePartnershipTags,
        searchPartnershipTags,
      } = input;

      const partnership = await db.partnership.create({
        data: {
          organizerId: userWithOrganization.Organization.id,
          partnerId: organizationId,

          givePartnershipTags,
          searchPartnershipTags,
        },
      });

      const chat = await db.chat.create({
        data: {
          title: `Propozycja współpracy między ${userWithOrganization.Organization.name} i ${organizationId}`,
        },
      });

      await db.partnership.update({
        where: {
          id: partnership.id,
        },
        data: {
          chatId: chat.id,
        },
      });

      await db.message.create({
        data: {
          text: message,
          chatId: chat.id,
          userId: userWithOrganization.Organization.id,
        },
      });

      return chat;
    }),
});
