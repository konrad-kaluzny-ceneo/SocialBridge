import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function ChooseOrganizationTypeForm() {
  return (
    <div className="mb-12 flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="mt-12 text-2xl font-bold">Wybierz typ konta</h1>
        <p className="text-balance text-sm text-slate-500">
          Wybierz typ konta, który najlepiej pasuje do Twoich potrzeb.
        </p>
      </div>
      <div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-2">
        <OrganizationTypeCard
          organizationType={$Enums.OrganizationType.BUSINESS}
          image="/images/business-meeting1.jpg"
          title="Firma"
          description="Masz firmę i chcesz pomagać innym dzięki platformie współpracując z innymi firmami i organizacjami pozarządowymi"
        />
        <OrganizationTypeCard
          organizationType={$Enums.OrganizationType.NGO}
          image="/images/hands2.jpg"
          title="Organizacja pozarządowa"
          description="Masz organizację pozarządową i chcesz pomagać innym dzięki platformie współpracując z innymi firmami i organizacjami pozarządowymi"
        />
      </div>
    </div>
  );
}

function OrganizationTypeCard({
  organizationType,
  image,
  title,
  description,
}: {
  organizationType: $Enums.OrganizationType;
  image: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={`/init-organization/${organizationType}`}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md bg-white p-4 shadow-md",
      )}
    >
      <Image
        src={image}
        alt={title}
        width={500}
        height={500}
        className="rounded-md h-96 w-full object-cover"
      />
      <div className="flex min-h-32 flex-col items-center justify-center gap-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </Link>
  );
}
