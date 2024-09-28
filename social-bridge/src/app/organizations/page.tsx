import OrganizationsPublicList from "@/components/organization/OrganizationsPublicList";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";

type Props = {};

export default function OrganizationsPage({}: Props) {
  return (
    <WrapperMaxWidth className="flex flex-col gap-2 pb-12">
      <div className="mt-2 flex items-center justify-end">
        {/* <ShowOnMapButton /> */}
      </div>
      <OrganizationsPublicList />
    </WrapperMaxWidth>
  );
}
