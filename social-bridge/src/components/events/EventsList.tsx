"use client";

import { Event, Review } from "@prisma/client";
import { useEffect, useState } from "react";
import EventRow from "./EventRow";

type Props = {
  eventsInit: (Event & { Reviews: Review[] })[];
  showImages?: boolean;
};

export default function EventsList({ eventsInit, showImages = false }: Props) {
  const [events, setEvents] = useState(eventsInit);

  function onReviewAdded(addedReview: Review) {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === addedReview.eventId) {
          return { ...event, Reviews: [...event.Reviews, addedReview] };
        }
        return event;
      }),
    );
  }

  useEffect(() => {
    setEvents(eventsInit);
  }, [eventsInit]);

  return (
    <>
      {events
        .toSorted((a, b) => a.startEvent.getTime() - b.startEvent.getTime())
        .map((event) => (
          <EventRow
            key={event.id}
            event={event}
            onReviewAdded={onReviewAdded}
            showImages={showImages}
          />
        ))}
    </>
  );
}
