"use client";

import { trpc } from "@/server/client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventRow from "./EventRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@prisma/client";

type Props = {
  userId: string;
};

export default function EventsOrganizedByUser({ userId }: Props) {
  const {
    data: eventsDb,
    isLoading,
    isError,
  } = trpc.events.getEventsOrganizedByUser.useQuery({
    userId,
  });

  const [events, setEvents] = useState<typeof eventsDb>([]);

  useEffect(() => {
    if (eventsDb) {
      setEvents(eventsDb);
    }
  }, [eventsDb]);

  if (isLoading) return <EventsSkeleton />;
  if (isError) return null;

  const upcomingEvents =
    events?.filter((event) => new Date(event.startEvent) > new Date()) || [];
  const pastEvents =
    events?.filter((event) => new Date(event.startEvent) <= new Date()) || [];

  const handleReviewAdded = (addedReview: Review) => {
    setEvents((prevEvents) =>
      prevEvents?.map((event) =>
        event.id === addedReview.eventId
          ? { ...event, Reviews: [...event.Reviews, addedReview] }
          : event,
      ),
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Organized Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Nadchodzące wydarzenia</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-gray-500">Brak nadchodzących wydarzeń</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  onReviewAdded={handleReviewAdded}
                  showImages
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Poprzednie wydarzenia</h3>
          {pastEvents.length === 0 ? (
            <p className="text-center text-gray-500">Brak poprzednich wydarzeń</p>
          ) : (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  onReviewAdded={handleReviewAdded}
                  showImages
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EventsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-4 h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
