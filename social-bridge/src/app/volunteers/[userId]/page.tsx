import OrganizationRow from "@/components/organization/OrganizationRow";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import VolunteerHeader from "@/components/volunteers/VolunteerHeader";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: {
    userId: string;
  };
};

// Wizytówka wolontariusza
export default async function VolunteersPage({ params }: Props) {
  const { userId } = params;

  const user = await currentUser();

  const isThisUser = user?.id === userId;

  const dbUser = await db.user.findUnique({
    where: { id: userId },
  });

  return (
    <WrapperMaxWidth className="mb-12 flex flex-col gap-4">
      <VolunteerHeader userId={userId} isThisUser={isThisUser} />
      {dbUser?.organizationId && dbUser.isApprovedMember && (
        <OrganizationRow organizationId={dbUser.organizationId} showImages />
      )}
    </WrapperMaxWidth>
  );
}
