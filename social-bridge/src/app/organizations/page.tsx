import ShowOrganizationsOnMapButton from "@/components/map/organization/ShowOrganizationsOnMapButton";
import OrganizationsPrivateList from "@/components/organization/OrganizationsPrivateList";
import OrganizationsPublicList from "@/components/organization/OrganizationsPublicList";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import { currentUser } from "@clerk/nextjs/server";

type Props = {};

export default async function OrganizationsPage({}: Props) {
  const user = await currentUser();

  return (
    <WrapperMaxWidth className="flex flex-col gap-2 pb-12">
      <div className="mt-6 flex justify-between">
        <h2 className="text-xl font-semibold">Lista organizacji</h2>
        <ShowOrganizationsOnMapButton />
      </div>
      {user?.id ? <OrganizationsPrivateList /> : <OrganizationsPublicList />}
    </WrapperMaxWidth>
  );
}
