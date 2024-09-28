import ShowOrganizationsOnMapButton from "@/components/map/organization/ShowOrganizationsOnMapButton";
import OrganizationsPublicList from "@/components/organization/OrganizationsPublicList";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";

type Props = {};

export default function OrganizationsPage({}: Props) {
  return (
    <WrapperMaxWidth className="flex flex-col gap-2 pb-12">
      <div className="mt-6 flex justify-between">
        <h2 className="text-xl font-semibold">Lista organizacji</h2>
        <ShowOrganizationsOnMapButton />
      </div>
      <OrganizationsPublicList />
    </WrapperMaxWidth>
  );
}
