"use client";

import { trpc } from "@/server/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrganizationImageBig from "./OrganizationImageBig";

type Props = {
  organizationId: string;
};

export default function OrganizationHeader({ organizationId }: Props) {
  const {
    data: organization,
    isLoading,
    isError,
  } = trpc.organization.getOrganization.useQuery({
    organizationId,
  });

  if (isLoading) return null;
  if (isError) return null;
  if (!organization) return null;

  return (
    <Card className="mt-4 w-full">
      <CardHeader>
        <OrganizationImageBig organizationId={organization.id} />

        <CardTitle className="text-3xl font-bold">
          {organization.name}
        </CardTitle>
        <Badge variant="secondary" className="mt-2 w-fit">
          {organization.shortDescription}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <section className="rounded-md p-4">
          <h2 className="mb-2 text-xl font-semibold">O nas</h2>
          <p className="text-gray-600">{organization.longDescription}</p>
        </section>

        <section className="rounded-md bg-gray-100 p-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-lg font-medium">Cele społeczne</h3>
              <p className="text-gray-600">{organization.socialGoals}</p>
            </div>
            <div>
              <h3 className="mb-1 text-lg font-medium">Cele biznesowe</h3>
              <p className="text-gray-600">{organization.businessGoals}</p>
            </div>
          </div>
        </section>

        <section className="rounded-md p-4">
          <h2 className="mb-2 text-xl font-semibold">Strategia wpływu</h2>
          <p className="text-gray-600">{organization.sociamImpactStrategy}</p>
        </section>

        <section className="rounded-md bg-gray-100 p-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-lg font-medium">
                Poprzednie doświadczenia
              </h3>
              <p className="text-gray-600">{organization.previousExperience}</p>
            </div>
            <div>
              <h3 className="mb-1 text-lg font-medium">
                Projekty do realizacji
              </h3>
              <p className="text-gray-600">{organization.projectsToRealize}</p>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
