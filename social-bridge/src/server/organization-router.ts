import {
  AcceptJoinToOrganizationRequestValidator,
  CreateOrganizationValidator,
  GetOrganizationValidator,
  JoinToOrganizationValidator,
  RejectJoinToOrganizationRequestValidator,
} from "@/validators/organization";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const organizationRouter = router({
  createOrganization: privateProcedure
    .input(CreateOrganizationValidator)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const user = await db.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Użytkownik nie został znaleziony",
        });
      }

      // console.log(input);

      const {
        name,
        OrganizationType,
        shortDescription,
        longDescription,
        socialGoals,
        sociamImpactStrategy,
        businessGoals,
        previousExperience,
        projectsToRealize,
        searchPartnershipTags,
        givePartnershipTags,
        street,
        city,
        zipCode,
      } = input;

      const address = `${street}, ${zipCode} ${city}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();

      if (data.status !== "OK") {
        console.error("data error", data);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Błąd podczas wyszukiwania współrzędnych",
        });
      }

      const { lat, lng } = data.results[0].geometry.location;

      if (!lat || !lng) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Obliczone współrzędne są nieprawidłowe",
        });
      }

      const addressDb = await db.address.create({
        data: {
          street,
          city,
          zipCode,
          lat,
          lng,
        },
      });

      const organization = await db.organization.create({
        data: {
          name,
          OrganizationType,
          shortDescription,
          longDescription,
          socialGoals,
          sociamImpactStrategy,
          businessGoals,
          previousExperience,
          projectsToRealize,
          searchPartnershipTags,
          givePartnershipTags,
          addressId: addressDb.id,
          Team: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return organization;
    }),

  getOrganization: publicProcedure
    .input(GetOrganizationValidator)
    .query(async ({ input }) => {
      const { organizationId } = input;
      const organization = await db.organization.findFirst({
        where: { id: organizationId },
        include: {
          Address: true,
          Photos: true,
          Team: true,
          PartnerRelations: true,
          OrganizerRelations: true,
        },
      });
      return organization;
    }),

  getOrganizations: publicProcedure.query(async () => {
    const organizations = await db.organization.findMany({
      include: {
        Address: true,
        Photos: true,
      },
    });
    return organizations;
  }),

  getUserOrganization: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const organization = await db.organization.findFirst({
      where: {
        Team: {
          some: { id: userId },
        },
      },
    });
    return organization;
  }),

  getOrganizationsByUser: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const organizations = await db.organization.findMany({
      where: {
        Team: {
          none: { id: userId }, // dont show user his own organization
        },
      },
      include: {
        Address: true,
        Photos: true,
      },
    });

    return organizations;
  }),

  getOrganizationsWithCoordinates: publicProcedure.query(async () => {
    const organizations = await db.organization.findMany({
      include: {
        Address: true,
      },
    });

    const organizationsWithCoordinates = organizations.filter(
      (organization) => organization.Address?.lat && organization.Address?.lng,
    );

    return organizationsWithCoordinates;
  }),

  joinToOrganization: privateProcedure
    .input(JoinToOrganizationValidator)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const user = await db.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Użytkownik nie został znaleziony",
        });
      }

      const { organizationId } = input;

      const organization = await db.organization.findFirst({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organizacja nie została znaleziona",
        });
      }

      if (user.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Użytkownik już jest członkiem innej organizacji",
        });
      }

      await db.organization.update({
        where: { id: organizationId },
        data: {
          Team: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return {
        success: true,
      };
    }),

  getJoinToOrganizationPending: privateProcedure
    .input(JoinToOrganizationValidator)
    .query(async ({ input }) => {
      const { organizationId } = input;

      const usersOrganization = await db.organization.findMany({
        where: {
          id: organizationId,
        },
        include: {
          Team: true,
        },
      });

      const usersWithPendingStatus = usersOrganization
        .map((organization) => organization.Team)
        .flat()
        .filter((user) => !user.isApprovedMember);

      return usersWithPendingStatus;
    }),

  acceptJoinToOrganizationRequest: privateProcedure
    .input(AcceptJoinToOrganizationRequestValidator)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const userAdmin = await db.user.findFirst({
        where: { id: userId },
      });

      if (!userAdmin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Użytkownik nie został znaleziony",
        });
      }

      const organization = await db.organization.findFirst({
        where: { id: input.organizationId },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organizacja nie została znaleziona",
        });
      }

      if (userAdmin.organizationId !== organization.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Użytkownik nie jest administratorem organizacji",
        });
      }

      await db.user.update({
        where: { id: input.userId },
        data: {
          isApprovedMember: true,
        },
      });

      return {
        success: true,
      };
    }),

  rejectJoinToOrganizationRequest: privateProcedure
    .input(RejectJoinToOrganizationRequestValidator)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const userAdmin = await db.user.findFirst({
        where: { id: userId },
      });

      if (!userAdmin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Użytkownik nie został znaleziony",
        });
      }

      const organization = await db.organization.findFirst({
        where: { id: input.organizationId },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organizacja nie została znaleziona",
        });
      }

      if (userAdmin.organizationId !== organization.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Użytkownik nie jest administratorem organizacji",
        });
      }

      await db.user.update({
        where: { id: input.userId },
        data: {
          isApprovedMember: false,
          organizationId: null,
        },
      });

      return {
        success: true,
      };
    }),
});
