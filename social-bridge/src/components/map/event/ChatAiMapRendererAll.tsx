"use client";

import { trpc } from "@/server/client";
import MapMultipleLocations from "./MapMultipleLocations";
import { MapLocation } from "@/types/mapLocation";
import { toast } from "sonner";
import ChatMapRendererSkeleton from "./ChatAiMapRendererSkeleton";

type Props = {};

export default function ChatMapRendererAll({}: Props) {
  const {
    data: events,
    isLoading,
    error,
  } = trpc.events.getEvents.useQuery({
    incoming: true,
  });

  if (isLoading) {
    return <ChatMapRendererSkeleton />;
  }

  if (error) {
    toast.error("Failed to load events");
    return <div>Failed to load events</div>;
  }

  if (!events || events.length === 0) {
    return <div>No events found</div>;
  }

  const mapLocations: MapLocation[] = events
    .filter((event) => event.Address.lat && event.Address.lng)
    .map((event) => ({
      id: event.id,
    lat: -(-event.Address.lat!),
    lng: -(-event.Address.lng!),
    title: event.title,
    VisibleAddress: `${event.Address.city}, ${event.Address.street}`,
  }));

  const center = mapLocations[0];

  return (
    <>
      <div className="block md:hidden">
        <MapMultipleLocations
          MapLocations={mapLocations}
          Center={center}
          maxHeight="30vh"
        />
      </div>
      <div className="hidden md:block">
        <MapMultipleLocations
          MapLocations={mapLocations}
          Center={center}
          maxHeight="90vh"
        />
      </div>
    </>
  );
}
