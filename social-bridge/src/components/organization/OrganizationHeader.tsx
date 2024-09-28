"use client";

import { trpc } from "@/server/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading organization data</div>;
  if (!organization) return <div>Organization not found</div>;

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{organization.name}</CardTitle>
        <Badge variant="secondary" className="mt-2">
          {organization.shortDescription}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">O nas</h2>
          <p className="text-gray-600">{organization.longDescription}</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Nasze cele</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Cele społeczne</h3>
              <p className="text-gray-600">{organization.socialGoals}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Cele biznesowe</h3>
              <p className="text-gray-600">{organization.businessGoals}</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Strategia wpływu</h2>
          <p className="text-gray-600">{organization.sociamImpactStrategy}</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Doświadczenie i projekty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Poprzednie doświadczenia</h3>
              <p className="text-gray-600">{organization.previousExperience}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Projekty do realizacji</h3>
              <p className="text-gray-600">{organization.projectsToRealize}</p>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
