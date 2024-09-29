"use client";

import { trpc } from "@/server/client";
import VolunteerEditButton from "./VolunteerEditButton";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type Props = {
  userId: string;
  isThisUser: boolean;
};

export default function VolunteerHeader({ userId, isThisUser }: Props) {
  const {
    data: volunteerDb,
    isLoading,
    isError,
  } = trpc.user.getVolunteerProfile.useQuery({ userId });

  const [volunteer, setVolunteer] = useState<User | null>(null);

  useEffect(() => {
    if (volunteerDb) {
      setVolunteer(volunteerDb);
    }
  }, [volunteerDb]);

  if (isLoading) return null;
  if (isError) return null;
  if (!volunteer) return null;

  const onUserUpdate = (user: User) => {
    setVolunteer(user);
  };

  return (
    <Card className="mt-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          {volunteer.image && (
            <Image
              src={volunteer.image}
              alt={`Zdjęcie wolontariusza`}
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
          <div>
            <CardTitle className="text-3xl font-bold">
              {volunteer.name}
            </CardTitle>
            <Badge variant="secondary" className="mt-2 w-fit">
              {volunteer.volunteerRole || "Wolontariusz"}
            </Badge>
          </div>
        </div>
        {isThisUser && (
          <VolunteerEditButton
            userId={userId}
            initialUser={volunteer}
            onUserUpdate={onUserUpdate}
          />
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {volunteer.volunteerExperience && (
          <section className="rounded-md p-4">
            <h2 className="mb-2 text-xl font-semibold">Doświadczenie</h2>
            <p className="text-gray-600">{volunteer.volunteerExperience}</p>
          </section>
        )}

        {volunteer.volunteerSkills && (
          <section className="rounded-md p-4">
            <h2 className="mb-2 text-xl font-semibold">Umiejętności</h2>
            <p className="text-gray-600">{volunteer.volunteerSkills}</p>
          </section>
        )}

        {volunteer.volunteerSkills && (
          <section className="rounded-md p-4">
            <h2 className="mb-2 text-xl font-semibold">Mocne strony</h2>
            <p className="text-gray-600">{volunteer.volunteerStrengths}</p>
          </section>
        )}

        {volunteer.volunteerProjects && (
          <section className="rounded-md p-4">
            <h2 className="mb-2 text-xl font-semibold">Projekty</h2>
            <p className="text-gray-600">{volunteer.volunteerProjects}</p>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
