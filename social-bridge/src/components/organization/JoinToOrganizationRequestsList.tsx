"use client";

import { trpc } from "@/server/client";
import React, { useEffect, useState } from "react";
import AcceptJoinToOrganizationRequestButton from "@/components/volunteers/AcceptJoinToOrganizationRequestButton";
import RejectJoinToOrganizationRequestButton from "@/components/volunteers/RejectJoinToOrganizationRequestButton";
import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  organizationId: string;
};

export default function JoinToOrganizationRequestsList({
  organizationId,
}: Props) {
  const {
    data: pendingListDb,
    isLoading,
    isError,
  } = trpc.organization.getJoinToOrganizationPending.useQuery({
    organizationId,
  });
  const [pendingList, setPendingList] = useState<User[]>([]);

  useEffect(() => {
    if (pendingListDb) {
      setPendingList(pendingListDb);
    }
  }, [pendingListDb]);

  function handleUserAccepted(userId: string) {
    setPendingList(pendingList.filter((user) => user.id !== userId));
  }

  function handleUserRejected(userId: string) {
    setPendingList(pendingList.filter((user) => user.id !== userId));
  }

  if (isLoading) return null;
  if (isError) return null;
  if (!pendingList) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Osoby oczekujące na akceptację</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingList.length === 0 ? (
          <p className="text-center text-gray-500">Brak oczekujących próśb</p>
        ) : (
          <ul className="space-y-4">
            {pendingList.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || ""}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <AcceptJoinToOrganizationRequestButton
                    userId={user.id}
                    organizationId={organizationId}
                    onUserAccepted={() => handleUserAccepted(user.id)}
                  />
                  <RejectJoinToOrganizationRequestButton
                    userId={user.id}
                    organizationId={organizationId}
                    onUserRejected={() => handleUserRejected(user.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
