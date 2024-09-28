import InitOrganizationForm from "@/components/organization/InitOrganizationForm";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import { $Enums } from "@prisma/client";

export interface InitFormPageProps {
  params: {
    organizationType: $Enums.OrganizationType;
  };
}

export default async function InitOrganizationFormPage({
  params,
}: InitFormPageProps) {
  const organizationType = params.organizationType;

  return (
    <WrapperMaxWidth className="flex justify-center">
      <div className="flex w-full flex-col items-center justify-center text-center md:text-start md:items-start">
        <h1 className="text-2xl font-semibold mt-4 mb-2">Formularz zakładania organizacji</h1>
        <p className="text-sm text-slate-500 mb-4">
          Wypełnij formularz, aby stworzyć swoją własną wizytówkę.
        </p>

        <InitOrganizationForm OrganizationType={organizationType} />
      </div>
    </WrapperMaxWidth>
  );
}
