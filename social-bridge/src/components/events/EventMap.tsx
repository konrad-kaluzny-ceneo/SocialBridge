"use client";

import dynamic from "next/dynamic";
import { trpc } from "@/server/client";
import { MapLocation } from "@/types/mapLocation";

const DynamicMap = dynamic(() => import("@/components/map/event/MapSingleLocation"), {
  ssr: false,
});

type Props = {
  eventId: string;
};

export default function EventMap({ eventId }: Props) {
  const {
    data: event,
    isLoading,
    error,
  } = trpc.events.getEvent.useQuery({ eventId });

  if (isLoading) return null;
  if (error) return null;
  if (!event) return null;

  if (!event.Address) return null;
  if (!event.Address.lat || !event.Address.lng) return null;

  const MapLocation: MapLocation = {
    id: event.id,
    lat: -(-event.Address.lat),
    lng: -(-event.Address.lng),
    title: event.title,
    VisibleAddress: `${event.Address.street}, ${event.Address.city}`,
  };

  return (
    <div>
      <p className="mb-4 mt-2 text-xl font-semibold">Lokalizacja wydarzenia</p>
      <div className="items-center rounded-md p-3 shadow-md">
        <DynamicMap MapLocation={MapLocation} />
      </div>
    </div>
  );
}
