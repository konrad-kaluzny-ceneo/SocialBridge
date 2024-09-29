import { OrganizationType, PartnershipTag } from "@prisma/client";
import { z } from "zod";

export const GetFileValidator = z.object({
  key: z.string(),
});
