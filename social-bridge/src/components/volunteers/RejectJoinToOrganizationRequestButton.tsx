"use client";

import { trpc } from "@/server/client";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
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
  onUserRejected: () => void;
};

export default function RejectJoinToOrganizationRequestButton({
  userId,
  organizationId,
  onUserRejected,
}: Props) {
  const { mutate: rejectJoinRequest, isLoading } =
    trpc.organization.rejectJoinToOrganizationRequest.useMutation({
      onSuccess: () => {
        toast.success("Prośba o dołączenie została odrzucona");
        onUserRejected();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleReject = async () => {
    rejectJoinRequest({ userId, organizationId });
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
          variant="destructive"
        >
          <XIcon className="button-default-icon-size" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Odrzuć prośbę o dołączenie</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz odrzucić prośbę tego użytkownika o dołączenie do
            organizacji?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Odrzuć"}
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
