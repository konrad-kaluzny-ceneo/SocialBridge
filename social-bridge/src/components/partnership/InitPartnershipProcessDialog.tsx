"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { trpc } from "@/server/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { buttonVariants } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import {
  InitPartnershipProcessValidator,
  InitPartnershipProcessRequest,
} from "@/validators/partnership";
import { PartnershipTag } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

type Props = {
  organizationId: string;
};

export default function InitPartnershipProcessDialog({
  organizationId,
}: Props) {
  const router = useRouter();
  const form = useForm<InitPartnershipProcessRequest>({
    resolver: zodResolver(InitPartnershipProcessValidator),
    defaultValues: {
      organizationId,
      message: "",
      givePartnershipTags: [],
      searchPartnershipTags: [],
    },
  });

  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate: initPartnershipProcess, isLoading } =
    trpc.partnership.initPartnershipProcess.useMutation({
      onSuccess: (chat) => {
        toast.success("Propozycja współpracy została wysłana");
        closeDialogButtonRef.current?.click();
        router.push(`/chat/${chat.id}`);
      },
      onError: (error) => {
        toast.error("Coś poszło nie tak");
        console.error(error);
      },
    });

  async function onSubmit(data: InitPartnershipProcessRequest) {
    initPartnershipProcess(data);
  }

  const {
    data: hasUserOrganization,
    isLoading: isLoadingHasUserOrganization,
    isError: isErrorHasUserOrganization,
  } = trpc.user.hasUserOrganization.useQuery();

  if (isLoadingHasUserOrganization) return null;
  if (isErrorHasUserOrganization) return null;
  if (!hasUserOrganization) return null;

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants(), "flex items-center xl:w-fit")}
      >
        <PlusIcon className="mr-2" /> Dodaj współpracę
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj współpracę</DialogTitle>
          <DialogDescription>
            Wprowadź dane nowej współpracy. Kliknij zapisz, gdy skończysz.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis proponowanej współpracy</FormLabel>
                  <FormControl>
                    <Textarea rows={4} minRows={2} {...field} />
                  </FormControl>
                  <FormDescription>
                    Krótki opis charakteru proponowanej współpracy
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="searchPartnershipTags"
              render={() => (
                <FormItem className="col-span-2 w-full">
                  <FormLabel>
                    Co możesz zaoferować w ramach współpracy
                  </FormLabel>
                  <div className="space-y-2">
                    {Object.values(PartnershipTag).map((tag) => (
                      <FormField
                        key={tag}
                        control={form.control}
                        name="searchPartnershipTags"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={tag}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tag)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, tag])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== tag,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {tag.replace(/_/g, " ")}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="givePartnershipTags"
              render={() => (
                <FormItem className="col-span-2 w-full">
                  <FormLabel>Co potrzebujesz od partnera</FormLabel>
                  <div className="space-y-2">
                    {Object.values(PartnershipTag).map((tag) => (
                      <FormField
                        key={tag}
                        control={form.control}
                        name="givePartnershipTags"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={tag}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tag)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, tag])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== tag,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {tag.replace(/_/g, " ")}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2 gap-2">
              <Button type="submit" disabled={isLoading}>
                {(isLoading && "Wysyłanie wiadomości...") ||
                  "Zaproponuj współpracę"}
              </Button>
              <DialogClose asChild ref={closeDialogButtonRef}>
                <Button variant="secondary">Anuluj</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
