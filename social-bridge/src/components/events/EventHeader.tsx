import { getEventTypeName } from "@/lib/translates";
import { Event } from "@prisma/client";
import Image from "next/image";

type Props = {
  event: Event;
};

export default function EventHeader({ event }: Props) {
  const photoUrl = `/images/eventTypes/${event.eventType}.jpg`;

  return ( 
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-semibold">
        {getEventTypeName(event.eventType)}: {event.title}
      </p>

      <div className="w-full">
        <Image
          src={photoUrl}
          alt={event.eventType}
          width={2000}
          height={2000}
          priority
          className="h-[40vh] w-full rounded-md object-cover"
        />
      </div>
    </div>
  );
}
