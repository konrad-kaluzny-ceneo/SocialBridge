"use client";

import { trpc } from "@/server/client";

type Props = {
  eventId: string;
};

export default function EventPartners({ eventId }: Props) {
  const {
    data: partners,
    isLoading,
    error,
  } = trpc.partnership.getPartners.useQuery({ eventId });

  if (isLoading) return null;
  if (error) return null;
  if (!partners) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="mh-2">Współorganizatorzy</h2>
      <div className="flex flex-col gap-2">
        {partners.map((partner) => (
          <div key={partner.id}>{partner.name}</div>
        ))}
      </div>
    </div>
  );
}
