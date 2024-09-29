"use client";

import { trpc } from "@/server/client";
import InitPartnershipProcessDialog from "./InitPartnershipProcessDialog";
import OrganizationRow from "../organization/OrganizationRow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type Props = {
  organizationId: string;
};

export default function OrganizationPartnerships({ organizationId }: Props) {
  const {
    data: partners,
    isLoading,
    isError,
  } = trpc.partnership.getOrganizationPartners.useQuery({
    organizationId,
  });

  const { data: userCanInitPartnership } =
    trpc.partnership.userCanInitPartnership.useQuery({
      organizationId,
    });

  if (isLoading) return <PartnershipsSkeleton />;
  if (isError) return <ErrorMessage />;
  if (!partners) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktywne współprace</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {partners
            .filter((partner) => partner !== null)
            .map((partner) => (
              <OrganizationRow
                key={partner.id}
                organizationId={partner.id}
                showImages={true}
              />
            ))}
          {partners.length === 0 && (
            <p className="py-4 text-center text-gray-500">
              Brak aktywnych współprac
            </p>
          )}
        </motion.div>
        {userCanInitPartnership && (
          <div className="mt-8">
            <InitPartnershipProcessDialog
              organizationId={organizationId}
              eventId={null}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PartnershipsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorMessage() {
  return (
    <Card>
      <CardContent>
        <p className="py-4 text-center text-red-500">
          Wystąpił błąd podczas ładowania współprac. Spróbuj ponownie później.
        </p>
      </CardContent>
    </Card>
  );
}
