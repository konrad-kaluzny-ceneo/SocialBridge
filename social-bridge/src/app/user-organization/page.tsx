import OrganizationHeader from "@/components/organization/OrganizationHeader";
import OrganizationImage from "@/components/organization/OrganizationImage";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Wizytówka firmy
export default async function UserOrganizationPage() {
  const user = await currentUser();

  const userWithOrganization = await db.user.findFirst({
    where: { id: user?.id },
    include: { Organization: true },
  });

  if (!userWithOrganization?.Organization) {
    redirect("/init-organization");
  }

  return (
    <WrapperMaxWidth className="flex flex-col gap-4">
      <OrganizationImage
        organizationId={userWithOrganization.Organization.id}
      />

      <OrganizationHeader
        organizationId={userWithOrganization.Organization.id}
      />
    </WrapperMaxWidth>
  );
}
