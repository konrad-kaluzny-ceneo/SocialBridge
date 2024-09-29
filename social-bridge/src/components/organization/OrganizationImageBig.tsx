"use client";

import { trpc } from "@/server/client";
import Image from "next/image";
import React from "react";

type Props = {
  organizationId: string;
};

export default function OrganizationImage({ organizationId }: Props) {
  const {
    data: organization,
    isLoading,
    isError,
  } = trpc.organization.getOrganization.useQuery({
    organizationId,
  });

  if (isLoading) return null;
  if (isError) return null;
  if (!organization) return null;
  if (!organization.Photos || organization.Photos.length === 0) {
    return null; // ToDo: Add button for adding image if its organizator
  }

  return (
    <div className="w-full h-52">
      <Image
        src={organization.Photos[0]?.url ?? ""}
        alt={organization.name ?? ""}
        width={1000}
        height={1000}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
