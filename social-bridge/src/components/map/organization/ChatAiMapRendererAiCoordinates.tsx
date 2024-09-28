"use client";

import { trpc } from "@/server/client";
import MapMultipleLocations from "./MapMultipleLocations";
import { MapLocation } from "@/types/mapLocation";
import ChatMapRendererAll from "./ChatAiMapRendererAll";

type Props = {
  chatId: string;
};

export default function ChatAiMapRendererAiCoordinates({ chatId }: Props) {
  const { data: organizations } =
    trpc.ai.getAiOrganizationsCoordinates.useQuery({
      id: chatId,
    });

  if (!organizations) {
    return <ChatMapRendererAll />;
  }

  const mapLocations: MapLocation[] = organizations
    .filter(
      (organization) =>
        organization.Address &&
        organization.Address.lat &&
        organization.Address.lng,
    )
    .map((organization) => ({
      id: organization.id,
      lat: -(-organization.Address!.lat!),
      lng: -(-organization.Address!.lng!),
      title: organization.name,
      VisibleAddress: `${organization.Address!.city}, ${organization.Address!.street}`,
    }));

  if (mapLocations.length === 0) {
    return null;
  }

  const center = mapLocations[0];

  return (
    <>
      <div className="block w-full md:hidden">
        <MapMultipleLocations
          MapLocations={mapLocations}
          Center={center}
          maxHeight="30vh"
        />
      </div>
      <div className="hidde w-full md:block">
        <MapMultipleLocations
          MapLocations={mapLocations}
          Center={center}
          maxHeight="88vh"
        />
      </div>
    </>
  );
}
