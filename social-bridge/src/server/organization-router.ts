import {
  CreateOrganizationValidator,
  GetOrganizationValidator,
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
          message: "User not found",
        });
      }

      console.log(input);

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
          message: "Geocoding failed - response status not OK",
        });
      }

      const { lat, lng } = data.results[0].geometry.location;

      if (!lat || !lng) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Geocoding failed - no coordinates found",
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
});
