import ChooseOrganizationTypeForm from "@/components/organization/ChooseOrganizationTypeForm";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Formularz zakładania wizytówki firmy
export default async function InitOrganizationPage() {
  const user = await currentUser();

  const userWithOrganization = await db.user.findFirst({
    where: { id: user?.id },
    include: { Organization: true },
  });

  if (userWithOrganization?.Organization) {
    redirect(`/organizations/${userWithOrganization.Organization.id}`);
  }

  return (
    <WrapperMaxWidth>
      <ChooseOrganizationTypeForm />
    </WrapperMaxWidth>
  );
}
