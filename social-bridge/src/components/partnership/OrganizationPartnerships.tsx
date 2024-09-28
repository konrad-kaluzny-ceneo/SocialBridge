"use client";

import { trpc } from "@/server/client";
import InitPartnershipProcessDialog from "./InitPartnershipProcessDialog";
import OrganizationRow from "../organization/OrganizationRow";

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
      <div className="flex flex-col gap-4">
        {partners
          .filter((partner) => partner !== null)
          .map((partner) => (
            <OrganizationRow
              key={partner.id}
              organization={partner}
              showImages={true}
            />
          ))}
      </div>
      <InitPartnershipProcessDialog organizationId={organizationId} />
    </div>
  );
}
