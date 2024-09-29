"use client";

import { Button } from "@nextui-org/react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import UploadDropzone from "@/components/files/UploadDropzone";

type Props = {
  organizationId: string;
};

export default function OrganizationFileUploadButton({
  organizationId,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone
          organizationId={organizationId}
          closeDialogButtonRef={undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
