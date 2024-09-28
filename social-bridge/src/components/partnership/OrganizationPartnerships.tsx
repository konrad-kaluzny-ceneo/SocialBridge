"use client";

import { trpc } from "@/server/client";
import InitPartnershipProcessDialog from "./InitPartnershipProcessDialog";

type Props = {
  organizationId: string;
};

export default function OrganizationPartnerships({ organizationId }: Props) {
  const {
    data: partners,
    isLoading,
    isError,
  } = trpc.partnership.getOrganizationPartners.useQuery({
    organizationId,
  });

  if (isLoading) return null;
  if (isError) return null;
  if (!partners) return null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold">Aktywne współprace</p>
      <div>
        {partners
          .filter((partner) => partner !== null)
          .map((partner) => (
            <div key={partner.id}>
              <p>{partner.name}</p>
            </div>
          ))}
      </div>
      <InitPartnershipProcessDialog organizationId={organizationId} />
    </div>
  );
}
