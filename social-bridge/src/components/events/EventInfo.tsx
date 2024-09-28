"use client";

import { trpc } from "@/server/client";
import { formatDateTime } from "@/lib/utils";

type Props = {
  eventId: string;
};

export default function EventInfo({ eventId }: Props) {
  const {
    data: event,
    isLoading,
    error,
  } = trpc.events.getEvent.useQuery({ eventId });

  if (isLoading) return null;
  if (error) return null;
  if (!event) return null;

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold">
          {event.Address.street}, {event.Address.city} -{" "}
          {formatDateTime(event.startEvent)}
        </p>
        <p>{event.description}</p>
      </div>
    </div>
  );
}
