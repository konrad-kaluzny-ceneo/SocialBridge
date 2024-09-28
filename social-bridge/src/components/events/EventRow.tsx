"use client";

import { getEventTypeName } from "@/lib/translates";
import { Event, Review } from "@prisma/client";
import { formatDate } from "date-fns";
import { trpc } from "@/server/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import EventAddReviewButtonWrapper from "./EventAddReviewButtonWrapper";
import Link from "next/link";

type Props = {
  event: Event;
  onReviewAdded: (addedReview: Review) => void;
  showImages?: boolean;
};

export default function EventRow({
  event,
  onReviewAdded,
  showImages = false,
}: Props) {
  const {
    data: eventDb,
    isLoading,
    isError,
  } = trpc.events.getEvent.useQuery({
    eventId: event.id,
  });

  if (isLoading) return null;
  if (isError) return null;
  if (!eventDb) return null;

  return (
    <Link
      href={`/events/${event.id}`}
      key={event.id}
      className="w-full rounded-md border border-slate-200 bg-white p-4"
    >
      <div>
        <div className="flex w-full flex-col gap-2">
          <div>
            {showImages && (
              <Image
                src={`/images/eventTypes/${eventDb?.eventType}.jpg`}
                alt={eventDb?.eventType ?? "zdjęcie wydarzenia"}
                width={800}
                height={800}
                priority
                className="h-24 w-full rounded-md object-cover"
              />
            )}

            <div className={cn("flex flex-col")}>
              <p className="text-2xl font-semibold">
                {getEventTypeName(eventDb?.eventType)}
                {eventDb?.title}
              </p>
              <p className="text-sm">
                ({formatDate(event.startEvent, "dd.MM.yyyy")})
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:flex-row">
            <EventAddReviewButtonWrapper
              eventId={event.id}
              reviewedUserId={eventDb?.eventOrganizerId}
              onReviewAdded={onReviewAdded}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
