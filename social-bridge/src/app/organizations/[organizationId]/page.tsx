import JoinToOrganizationRequestsList from "@/components/organization/JoinToOrganizationRequestsList";
import OrganizationHeader from "@/components/organization/OrganizationHeader";
import OrganizationImageBig from "@/components/organization/OrganizationImageBig";
import OrganizationTeam from "@/components/organization/OrganizationTeam";
import OrganizationPartnerships from "@/components/partnership/OrganizationPartnerships";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import JoinToOrganizationButton from "@/components/volunteers/JoinToOrganizationButton";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export interface OrganizationPageProps {
  params: {
    organizationId: string;
  };
}

// Wizytówka firmy
export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const user = await currentUser();

  const organization = await db.organization.findUnique({
    where: { id: params.organizationId },
    include: {
      Team: true,
    },
  });

  if (!organization) {
    redirect("/");
  }

  const isAdminOfOrganization = organization.Team.some(
    (team) => team.id === user?.id,
  );

  return (
    <WrapperMaxWidth className="mb-12 flex flex-col gap-4">

      <OrganizationHeader organizationId={organization.id} />

      <JoinToOrganizationButton organizationId={organization.id} />

      <OrganizationPartnerships organizationId={organization.id} />

      <OrganizationTeam organizationId={organization.id} />

      {isAdminOfOrganization && (
        <JoinToOrganizationRequestsList organizationId={organization.id} />
      )}
    </WrapperMaxWidth>
  );
}
