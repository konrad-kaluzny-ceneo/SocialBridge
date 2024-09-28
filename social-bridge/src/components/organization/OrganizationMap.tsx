"use client";

import dynamic from "next/dynamic";
import { trpc } from "@/server/client";
import { MapLocation } from "@/types/mapLocation";

const DynamicMap = dynamic(
  () => import("@/components/map/organization/MapSingleLocation"),
  {
    ssr: false,
  },
);

type Props = {
  organizationId: string;
};

export default function OrganizationMap({ organizationId }: Props) {
  const {
    data: organization,
    isLoading,
    error,
  } = trpc.organization.getOrganization.useQuery({ organizationId });

  if (isLoading) return null;
  if (error) return null;
  if (
    !organization ||
    !organization.Address ||
    !organization.Address.lat ||
    !organization.Address.lng
  )
    return null;

  const MapLocation: MapLocation = {
    id: organization.id,
    lat: -(-organization.Address.lat),
    lng: -(-organization.Address.lng),
    title: organization.name,
    VisibleAddress: `${organization.Address.street}, ${organization.Address.city}`,
  };

  return (
    <div>
      <p className="mb-4 mt-2 text-xl font-semibold">Lokalizacja organizacji</p>
      <div className="items-center rounded-md p-3 shadow-md">
        <DynamicMap MapLocation={MapLocation} />
      </div>
    </div>
  );
}
