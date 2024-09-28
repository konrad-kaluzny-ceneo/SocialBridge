"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { trpc } from "@/server/client";

export default function ShowOnMapButton() {
  const router = useRouter();

  const { mutate: createChat } = trpc.ai.createChat.useMutation({
    onSuccess: (res) => {
      router.push(`/events/map/${res.id}`);
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

  return <Button onClick={onClick}>Zobacz na mapie</Button>;
}
