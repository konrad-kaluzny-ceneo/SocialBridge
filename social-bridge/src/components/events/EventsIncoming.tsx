"use client";

import { trpc } from "@/server/client";
import EventsList from "./EventsList";

export default function EventsIncoming() {
  const {
    data: eventsDb,
    isLoading,
    isError,
  } = trpc.events.getIncomingEvents.useQuery();

  if (isLoading) return null;
  if (isError) return null;
  if (!eventsDb) return null;
  if (eventsDb.length === 0) return null;

  return (
    <div>
      <h2 className="mh-2">Twoje nadchodzące wydarzenia</h2>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <EventsList eventsInit={eventsDb} showImages={true} />
      </div>
    </div>
  );
}
