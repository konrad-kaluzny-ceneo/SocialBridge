"use client";

import React, { useContext, useState } from "react";
import { ChatAiContext } from "@/components/map/event/ChatAiContext";
import { trpc } from "@/server/client";
import MapMultipleLocations from "./MapMultipleLocations";
import { MapLocation } from "@/types/mapLocation";
import ChatMapRendererSkeleton from "./ChatAiMapRendererSkeleton";
import ChatMapRendererAll from "./ChatAiMapRendererAll";

type Props = {
  chatId: string;
};

export default function ChatAiMapRendererAiCoordinates({ chatId }: Props) {
  const { data: events } = trpc.ai.getAiEventsCoordinates.useQuery({
    id: chatId,
  });

  if (!events) {
    return <ChatMapRendererAll />;
  }

  const mapLocations: MapLocation[] = events
    .filter((event) => event.Address.lat !== null && event.Address.lng !== null)
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
          maxHeight="88vh"
        />
      </div>
    </>
  );
}
