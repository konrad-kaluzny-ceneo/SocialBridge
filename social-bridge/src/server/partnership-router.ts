import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import {
  InitPartnershipProcessValidator,
  GetPartnershipRequestValidator,
  GetOrganizationPartnersValidator,
  AcceptPartnershipByChatValidator,
  UserCanAcceptPartnershipValidator,
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
      const {
        organizationId,
        message,
        givePartnershipTags,
        searchPartnershipTags,
      } = input;

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

      const organization = await db.organization.findUnique({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organizacja nie została znaleziona",
        });
      }

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
          title: `Propozycja współpracy między ${userWithOrganization.Organization.name} i ${organization.name}`,
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
          userId: userId,
        },
      });

      return chat;
    }),

  acceptPartnershipByChat: privateProcedure
    .input(AcceptPartnershipByChatValidator)
    .mutation(async ({ ctx, input }) => {
      const { chatId } = input;
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

      const partnership = await db.partnership.findFirst({
        where: { chatId },
      });

      if (!partnership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Współpraca nie została znaleziona",
        });
      }

      await db.partnership.update({
        where: { id: partnership.id },
        data: {
          isAccepted: true,
        },
      });

      return partnership;
    }),

  userCanAcceptPartnership: privateProcedure
    .input(UserCanAcceptPartnershipValidator)
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { chatId } = input;

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

      const organization = await db.organization.findUnique({
        where: { id: userWithOrganization.Organization.id },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organizacja nie została znaleziona",
        });
      }

      const chat = await db.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat nie został znaleziony",
        });
      }

      const partnership = await db.partnership.findFirst({
        where: { chatId },
      });

      if (!partnership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Współpraca nie została znaleziona",
        });
      }

      if (partnership.isAccepted) {
        return false;
      }

      if (partnership.partnerId === organization.id) {
        return true;
      }

      return false;
    }),
});
