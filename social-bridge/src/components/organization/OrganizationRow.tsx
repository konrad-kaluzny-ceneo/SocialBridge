"use client";

import { Organization } from "@prisma/client";
import { trpc } from "@/server/client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  organization: Organization;
  showImages?: boolean;
};

export default function OrganizationRow({
  organization,
  showImages = false,
}: Props) {
  const {
    data: organizationDb,
    isLoading,
    isError,
  } = trpc.organization.getOrganization.useQuery({
    organizationId: organization.id,
  });

  if (isLoading) return null;
  if (isError) return null;
  if (!organizationDb) return null;

  return (
    <Link href={`/organizations/${organization.id}`} className="block w-full">
      <Card className="w-full transition-shadow duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          {showImages && (
            <Image
              src={organizationDb.Photos[0]?.url || "/images/default.jpg"}
              alt={`Logo ${organizationDb.name}`}
              width={100}
              height={100}
              priority
              className="h-24 w-24 rounded-md object-cover"
            />
          )}
          <div>
            <CardTitle className="text-xl font-bold">
              {organizationDb.name}
            </CardTitle>
            <Badge variant="secondary" className="mt-2">
              {organizationDb.shortDescription}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <section>
              <h3 className="mb-1 text-lg font-semibold">Cele społeczne</h3>
              <p className="text-sm text-gray-600">
                {organizationDb.socialGoals}
              </p>
            </section>
            {organizationDb.businessGoals && (
              <section>
                <h3 className="mb-1 text-lg font-semibold">Cele biznesowe</h3>
                <p className="text-sm text-gray-600">
                  {organizationDb.businessGoals}
                </p>
              </section>
            )}
            <section>
              <h3 className="mb-1 text-lg font-semibold">Strategia wpływu</h3>
              <p className="text-sm text-gray-600">
                {organizationDb.sociamImpactStrategy}
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
