import { PartnershipTag } from "@prisma/client";
import { z } from "zod";

export const GetPartnershipRequestValidator = z.object({
  eventId: z.string(),
});

export type GetPartnershipRequest = z.infer<
  typeof GetPartnershipRequestValidator
>;

export const InitPartnershipProcessValidator = z.object({
  organizationId: z.string().min(1, { message: "ID partnera jest wymagane" }),
  eventId: z.string().optional(),
  message: z.string().min(1, { message: "Wiadomość jest wymagana" }),
  givePartnershipTags: z
    .array(z.nativeEnum(PartnershipTag))
    .min(1, { message: "Tagi oferowanej współpracy są wymagane" }),
  searchPartnershipTags: z
    .array(z.nativeEnum(PartnershipTag))
    .min(1, { message: "Tagi poszukiwanego partnerstwa są wymagane" }),
});

export type InitPartnershipProcessRequest = z.infer<
  typeof InitPartnershipProcessValidator
>;

export const GetOrganizationPartnersValidator = z.object({
  organizationId: z.string().min(1, { message: "ID organizacji jest wymagane" }),
});

export type GetOrganizationPartnersRequest = z.infer<
  typeof GetOrganizationPartnersValidator
>;
