"use client";

import { getEventTypeName } from "@/lib/translates";
import { Event, Review } from "@prisma/client";
import { formatDate } from "date-fns";
import { trpc } from "@/server/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import EventAddReviewButtonWrapper from "./EventAddReviewButtonWrapper";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";

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

  const {
    data: userCanAddReview,
    isLoading: userCanAddReviewLoading,
    isError: userCanAddReviewError,
  } = trpc.events.userCanAddReview.useQuery({
    eventId: event.id,
  });

  if (isLoading || !eventDb) return null;
  if (isError) return null;

  return (
    <Link href={`/events/${event.id}`} className="block w-full">
      <Card className="w-full transition-shadow duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-start gap-6">
          {showImages && (
            <Image
              src={`/images/eventTypes/${eventDb.eventType}.jpg`}
              alt={eventDb.eventType ?? "zdjęcie wydarzenia"}
              width={120}
              height={120}
              priority
              className="h-32 w-32 rounded-md object-cover"
            />
          )}
          <div className="flex flex-col gap-3 flex-grow">
            <CardTitle className="text-xl font-bold">
              <p>{eventDb.title}</p>
              <Badge variant="secondary" className="mt-2">
                {getEventTypeName(eventDb.eventType)}
              </Badge>
            </CardTitle>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {formatDate(event.startEvent, "dd.MM.yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                {eventDb.Address.city}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{eventDb.description}</p>
          {userCanAddReview && (
            <div className="mt-4">
              <EventAddReviewButtonWrapper
                eventId={event.id}
                onReviewAdded={onReviewAdded}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
