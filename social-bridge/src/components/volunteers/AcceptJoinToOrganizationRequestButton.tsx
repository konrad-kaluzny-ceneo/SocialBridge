"use client";

import { trpc } from "@/server/client";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type Props = {
  userId: string;
  organizationId: string;
  onUserAccepted: () => void;
};

export default function AcceptJoinToOrganizationRequestButton({
  userId,
  organizationId,
  onUserAccepted,
}: Props) {
  const { mutate: acceptJoinRequest, isLoading } =
    trpc.organization.acceptJoinToOrganizationRequest.useMutation({
      onSuccess: () => {
        toast.success("Użytkownik został zaakceptowany do organizacji");
        onUserAccepted();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleOptimisticAccept = async () => {
    acceptJoinRequest({ userId, organizationId });
    closeDialogButtonRef.current?.click();
  };

  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="button-default-size"
          disabled={isLoading}
        >
          <CheckIcon className="button-default-icon-size" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zaakceptuj prośbę o dołączenie</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz zaakceptować tego użytkownika do organizacji?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button onClick={handleOptimisticAccept} disabled={isLoading}>
            {isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Zaakceptuj"
            )}
          </Button>
          <DialogClose asChild ref={closeDialogButtonRef}>
            <Button variant="secondary" disabled={isLoading}>
              Anuluj
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
