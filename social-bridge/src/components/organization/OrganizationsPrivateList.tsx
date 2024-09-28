"use client";

import { trpc } from "@/server/client";
import OrganizationsList from "@/components/organization/OrganizationList";
import ShowOrganizationsOnMapButton from "../map/organization/ShowOrganizationsOnMapButton";

export default function OrganizationsPrivateList() {
  const {
    data: organizationsDb,
    isLoading,
    isError,
  } = trpc.organization.getOrganizationsByUser.useQuery();

  if (isLoading) return null;
  if (isError) return null;
  if (!organizationsDb) return null;
  if (organizationsDb.length === 0) return null;

  return (
    <div className="flex w-full flex-col">
      <div className="mt-4 flex w-full flex-col gap-4">
        <OrganizationsList
          organizationsInit={organizationsDb}
          showImages={true}
        />
      </div>
    </div>
  );
}
