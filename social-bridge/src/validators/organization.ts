import { OrganizationType, PartnershipTag } from "@prisma/client";
import { z } from "zod";

export const CreateOrganizationValidator = z.object({
  name: z.string().min(1, { message: "Nazwa organizacji jest wymagana" }),

  OrganizationType: z.nativeEnum(OrganizationType),

  shortDescription: z
    .string()
    .min(1, { message: "Opis organizacji jest wymagany" }),

  longDescription: z
    .string()
    .min(1, { message: "Cel organizacji jest wymagany" }),

  socialGoals: z
    .string()
    .min(1, { message: "Cele społeczne organizacji są wymagane" }),

  sociamImpactStrategy: z
    .string()
    .min(1, { message: "Strategia wpływu społecznego organizacji jest wymagana" }),

  businessGoals: z
    .string()
    .min(1, { message: "Cele biznesowe organizacji są wymagane" }),

  previousExperience: z
    .string()
    .min(1, { message: "Poprzednie doświadczenie organizacji jest wymagane" }),

  projectsToRealize: z
    .string()
    .min(1, { message: "Projekty do realizacji przez organizację są wymagane" }),

  searchPartnershipTags: z
    .array(z.nativeEnum(PartnershipTag))
    .min(1, { message: "Tagi wyszukiwania partnerstwa organizacji są wymagane" }),

  givePartnershipTags: z
    .array(z.nativeEnum(PartnershipTag))
    .min(1, { message: "Tagi oferowanego partnerstwa organizacji są wymagane" }),

  street: z.string().min(3).max(60),
  city: z.string().min(3).max(60),
  zipCode: z
    .string()
    .min(5)
    .max(6)
    .refine((val) => /^\d{2}-\d{3}$/.test(val), {
      message: "Nieprawidłowy kod pocztowy",
    }),
});

export const GetOrganizationValidator = z.object({
  organizationId: z.string(),
});

export type CreateOrganizationRequest = z.infer<
  typeof CreateOrganizationValidator
>;

export type GetOrganizationRequest = z.infer<typeof GetOrganizationValidator>;
