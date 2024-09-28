import {
  CreateOrganizationValidator,
  GetOrganizationValidator,
} from "@/validators/organization";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

      const addressDb = await db.address.create({
        data: {
          street,
          city,
          zipCode,
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
});
