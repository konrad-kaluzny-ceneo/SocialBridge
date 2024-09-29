"use client";

import { trpc } from "@/server/client";
import VolunteerEditButton from "./VolunteerEditButton";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  BriefcaseIcon,
  StarIcon,
  FolderIcon,
} from "lucide-react";

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

  const onUserUpdate = (user: User) => {
    setVolunteer(user);
  };

  if (isLoading) {
    return <VolunteerHeaderSkeleton />;
  }

  if (isError) {
    return null;
  }

  if (!volunteer) {
    return null;
  }

  return (
    <Card className="mt-4 w-full overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-primary/10 to-secondary/10 pb-32">
        {volunteer.image && (
          <Image
            src={volunteer.image}
            alt={`Zdjęcie wolontariusza`}
            width={100}
            height={100}
            className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full border-4 border-white object-cover shadow-lg"
          />
        )}
      </CardHeader>
      <CardContent className="pt-16">
        <div className="text-center">
          <CardTitle className="text-3xl font-bold">{volunteer.name}</CardTitle>
          <Badge variant="secondary" className="mt-2">
            {volunteer.volunteerRole || "Wolontariusz"}
          </Badge>
        </div>

        {isThisUser && (
          <div className="mt-4 text-center">
            <VolunteerEditButton
              userId={userId}
              initialUser={volunteer}
              onUserUpdate={onUserUpdate}
            />
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <VolunteerInfoSection
            icon={<CalendarIcon className="h-5 w-5" />}
            title="Doświadczenie"
            content={volunteer.volunteerExperience}
          />
          <VolunteerInfoSection
            icon={<BriefcaseIcon className="h-5 w-5" />}
            title="Umiejętności"
            content={volunteer.volunteerSkills}
          />
          <VolunteerInfoSection
            icon={<StarIcon className="h-5 w-5" />}
            title="Mocne strony"
            content={volunteer.volunteerStrengths}
          />
          <VolunteerInfoSection
            icon={<FolderIcon className="h-5 w-5" />}
            title="Projekty"
            content={volunteer.volunteerProjects}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type VolunteerInfoSectionProps = {
  icon: React.ReactNode;
  title: string;
  content: string | null | undefined;
};

function VolunteerInfoSection({
  icon,
  title,
  content,
}: VolunteerInfoSectionProps) {
  return (
    <section className="rounded-lg bg-muted/50 p-4">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        {icon}
        {title}
      </h2>
      {content ? (
        <p className="text-muted-foreground">{content}</p>
      ) : (
        <p className="italic text-muted-foreground">Brak informacji</p>
      )}
    </section>
  );
}

function VolunteerHeaderSkeleton() {
  return (
    <Card className="mt-4 w-full overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-primary/10 to-secondary/10 pb-32">
        <Skeleton className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full" />
      </CardHeader>
      <CardContent className="pt-16">
        <div className="text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto mt-2 h-6 w-32" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
