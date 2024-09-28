"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { trpc } from "@/server/client";

export default function ShowOrganizationsOnMapButton() {
  const router = useRouter();
  const user = trpc.user.getUser.useQuery();

  const { mutate: createChat } = trpc.ai.createChat.useMutation({
    onSuccess: (res) => {
      router.push(`/organizations-map/${res.id}`);
    },
    onError: (err) => {
      toast.error(`Coś poszło nie tak, spróbuj ponownie`);
    },
  });

  async function onClick() {
    createChat({
      name: Date.now().toString(),
    });
  }

  if (user.isLoading) return null;
  if (user.isError) return null;
  if (!user.data) return null;

  return <Button onClick={onClick}>Zobacz na mapie</Button>;
}
