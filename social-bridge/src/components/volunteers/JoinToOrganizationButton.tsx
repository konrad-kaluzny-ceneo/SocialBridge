"use client";

import { trpc } from "@/server/client";
import { Button } from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";

type Props = {
  organizationId: string;
};

export default function JoinToOrganizationButton({ organizationId }: Props) {
  const {
    data: userCanBeAddedToOrganization,
    isLoading,
    isError,
  } = trpc.user.userCanBeAddedToOrganization.useQuery();

  if (isLoading) return null;
  if (isError) return null;
  if (!userCanBeAddedToOrganization) return null;

  const { mutate: joinToOrganization, isLoading: isJoiningToOrganization } =
    trpc.organization.joinToOrganization.useMutation({
      onSuccess: () => {
        toast.success("Wysłano prośbę o dołączenie do organizacji");
      },
      onError: () => {
        toast.error("Coś poszło nie tak. Spróbuj ponownie później.");
      },
    });

  const onSubmit = () => {
    joinToOrganization({ organizationId });
  };

  return <Button onClick={onSubmit}>Dołącz do organizacji</Button>;
}
