"use client";

import { trpc } from "@/server/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  chatId: string;
};

export default function AcceptPartnershipDialog({ chatId }: Props) {
  const { data: userCanAcceptPartnership } =
    trpc.partnership.userCanAcceptPartnership.useQuery({
      chatId,
    });

  const { mutate: acceptPartnership, isLoading } =
    trpc.partnership.acceptPartnershipByChat.useMutation({
      onSuccess: () => {
        toast.success("Współpraca została zaakceptowana");
      },
    });

  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    acceptPartnership({ chatId });
    closeDialogButtonRef.current?.click();
  };

  if (!userCanAcceptPartnership) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Zaakceptuj współpracę</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zaakceptuj współpracę</DialogTitle>
          <DialogDescription>
            <p>Czy na pewno chcesz zaakceptować współpracę?</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleSubmit}>Zaakceptuj</Button>
          <DialogClose asChild ref={closeDialogButtonRef}>
            <Button variant="secondary">Anuluj</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
