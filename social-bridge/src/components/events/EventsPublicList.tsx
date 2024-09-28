"use client";

import { trpc } from "@/server/client";
import EventsList from "./EventsList";

interface EventsPublicListProps {
  future: boolean;
}

export default function EventsPublicList({ future }: EventsPublicListProps) {
  const {
    data: eventsDb,
    isLoading,
    isError,
  } = trpc.events.getEvents.useQuery({ future });

  if (isLoading) return null;
  if (isError) return null;
  if (!eventsDb) return null;
  if (eventsDb.length === 0) return null;

  return (
    <div className="flex w-full flex-col">
      <h2 className="mh-2">Sprawdź nadchodzące wydarzenia</h2>
      <div className="mt-4 flex w-full gap-4">
        <EventsList eventsInit={eventsDb} showImages={true} />
      </div>
    </div>
  );
}
