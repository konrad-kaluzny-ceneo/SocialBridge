"use client";

import { trpc } from "@/server/client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  organizationId: string;
};

export default function OrganizationTeam({ organizationId }: Props) {
  const { data: organization, isLoading } =
    trpc.organization.getOrganization.useQuery({
      organizationId,
    });

  if (isLoading) {
    return <TeamSkeleton />;
  }

  if (!organization) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aktywne współprace</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {organization.Team.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-4 rounded-lg border p-4"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.image || ""} alt={member.name || ""} />
                <AvatarFallback>{member.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.volunteerRole}</p>
              </div>
            </div>
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
