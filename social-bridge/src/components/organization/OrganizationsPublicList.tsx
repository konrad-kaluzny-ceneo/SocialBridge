"use client";

import { trpc } from "@/server/client";
import OrganizationsList from "@/components/organization/OrganizationList";

export default function OrganizationsPublicList() {
  const {
    data: organizationsDb,
    isLoading,
    isError,
  } = trpc.organization.getOrganizations.useQuery();

  if (isLoading) return null;
  if (isError) return null;
  if (!organizationsDb) return null;
  if (organizationsDb.length === 0) return null;

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-xl font-semibold mt-4 mb-2">Lista organizacji</h2>
      <div className="mt-4 flex flex-col w-full gap-4">
        <OrganizationsList
          organizationsInit={organizationsDb}
          showImages={true}
        />
      </div>
    </div>
  );
}
