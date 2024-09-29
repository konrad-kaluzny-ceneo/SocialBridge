"use client";

import { Event, Organization, Review } from "@prisma/client";
import { useEffect, useState } from "react";
import OrganizationRow from "@/components/organization/OrganizationRow";

type Props = {
  organizationsInit: Organization[];
  showImages?: boolean;
};

export default function OrganizationsList({
  organizationsInit,
  showImages = false,
}: Props) {
  const [organizations, setOrganizations] = useState(organizationsInit);

  useEffect(() => {
    setOrganizations(organizationsInit);
  }, [organizationsInit]);

  return (
    <>
      {organizations.map((organization) => (
        <OrganizationRow
          key={organization.id}
          organizationId={organization.id}
          showImages={showImages}
        />
      ))}
    </>
  );
}
