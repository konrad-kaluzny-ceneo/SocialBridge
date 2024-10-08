"use client";

import { trpc } from "@/server/client";
import EventsList from "./EventsList";

export default function EventsLast() {
  const {
    data: eventsDb,
    isLoading,
    isError,
  } = trpc.events.getEvents.useQuery({ last: true });

  if (isLoading) return null;
  if (isError) return null;
  if (!eventsDb) return null;
  if (eventsDb.length === 0) return null;

  return (
    <>
      {eventsDb.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">
            Wydarzenia, w których brałeś udział
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            <EventsList eventsInit={eventsDb} showImages={true} />
          </div>
        </div>
      )}
    </>
  );
}
