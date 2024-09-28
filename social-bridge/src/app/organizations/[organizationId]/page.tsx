import OrganizationHeader from "@/components/organization/OrganizationHeader";
import OrganizationImage from "@/components/organization/OrganizationImage";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
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
  });

  if (!organization) {
    redirect("/");
  }

  return (
    <WrapperMaxWidth className="flex flex-col gap-4">
      <OrganizationImage
        organizationId={organization.id}
      />

      <OrganizationHeader
        organizationId={organization.id}
      />
    </WrapperMaxWidth>
  );
}
