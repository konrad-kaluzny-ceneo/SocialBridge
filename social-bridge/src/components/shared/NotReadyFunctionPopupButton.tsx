import React from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
};

export default function NotReadyFunctionPopupButton({ text }: Props) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: "secondary",
          }),
          "text-slate-600"
        )}
      >
        {text}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text}</DialogTitle>
          <DialogDescription>
            Ups! Ta funkcja nie jest jeszcze dostępna.
          </DialogDescription>
          <Image
            src={"/images/under_construction.jpg"}
            alt="Not ready function"
            width={500}
            height={500}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
