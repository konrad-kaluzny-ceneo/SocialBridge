import EventInfo from "@/components/events/EventInfo";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import { notFound } from "next/navigation";
import EventPartners from "@/components/events/EventPartners";
import { db } from "@/db";
import EventHeader from "@/components/events/EventHeader";
import EventMap from "@/components/events/EventMap";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: {
    eventId: string; // remember: same name like [eventId] folder
  };
};

export default async function EventPage({ params }: Props) {
  const { eventId } = params;

  if (!eventId) {
    return notFound();
  }

  const user = await currentUser();

  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return notFound();
  }

  let isOrganizer = false;

  if (user?.id) {
    if (event.eventOrganizerId === user.id) {
      isOrganizer = true;
    }
  }

  return (
    <WrapperMaxWidth className="my-6 gap-4">
      <EventHeader event={event} />

      <EventInfo eventId={eventId} />

      <EventPartners eventId={eventId} />

      <EventMap eventId={eventId} />
    </WrapperMaxWidth>
  );
}
