"use client";

import { trpc } from "@/server/client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { User } from "@prisma/client";
import { Badge } from "@nextui-org/react";

type Props = {
  eventId: string;
};

export default function EventTeam({ eventId }: Props) {
  const {
    data: event,
    isLoading,
    isError,
  } = trpc.events.getEvent.useQuery({
    eventId,
  });

  if (isLoading) {
    return <TeamSkeleton />;
  }

  if (isError) {
    return null;
  }

  if (!event) {
    return null;
  }

  const teamMembersInPartnerships = event.Partnerships.flatMap(
    (partnership) => [
      ...(partnership.Partner?.Team.map((member) => ({
        ...member,
      })) || []),
    ],
  );

  const teamMemberOfOrganizer = event.EventOrganizer.Team?.map((member) => ({
    ...member,
  }));

  const teamMembers = [...teamMembersInPartnerships, ...teamMemberOfOrganizer];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Członkowie zespołu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <Link
              key={member.id}
              href={`/volunteers/${member.id}`}
              className="flex items-center space-x-4 rounded-lg border p-4"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.image || ""} alt={member.name || ""} />
                <AvatarFallback>{member.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <Badge>{member.volunteerRole}</Badge>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.volunteerRole}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 rounded-lg border p-4"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
