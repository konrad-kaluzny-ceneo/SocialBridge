"use client";

import { trpc } from "@/server/client";
import MapMultipleLocations from "./MapMultipleLocations";
import { MapLocation } from "@/types/mapLocation";
import { toast } from "sonner";

type Props = {};

export default function ChatMapRendererAll({}: Props) {
  const {
    data: organizations,
    isLoading,
    isError,
  } = trpc.organization.getOrganizationsWithCoordinates.useQuery();

  if (isLoading) return null;
  if (isError) return null;
  if (!organizations || organizations.length === 0) return null;

  const mapLocations: MapLocation[] = organizations.map((organization) => ({
    id: organization.id,
    lat: -(-organization.Address!.lat!),
    lng: -(-organization.Address!.lng!),
    title: organization.name,
    VisibleAddress: `${organization.Address!.city}, ${organization.Address!.street}`,
  }));

  if (mapLocations.length === 0) {
    toast.error("No organizations with coordinates found");
    return null;
  }

  const center = mapLocations[0];

  return (
    <>
      <div className="block xl:hidden">
        <MapMultipleLocations
          MapLocations={mapLocations}
          Center={center}
          maxHeight="30vh"
        />
      </div>
      <div className="hidden xl:block">
        <MapMultipleLocations
          MapLocations={mapLocations}
          Center={center}
          maxHeight="90vh"
        />
      </div>
    </>
  );
}
