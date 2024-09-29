import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { AddReviewRequest, AddReviewValidator } from "@/validators/review";
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
import { Input } from "@/components/ui/input";
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
import { Review } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  eventId: string;
  onReviewAdded: (addedReview: Review) => void;
};

export default function EventAddReviewButton({
  eventId,
  onReviewAdded,
}: Props) {
  const form = useForm<AddReviewRequest>({
    resolver: zodResolver(AddReviewValidator),
    defaultValues: {
      eventId,
      value: 0,
      comment: "",
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length) {
      const errors = form.formState.errors;
      for (const [key, value] of Object.entries(errors)) {
        toast.error(`Błąd: ${value.message}`);
        console.error(errors);
      }
    }
  }, [form.formState.errors]);

  async function onSubmit(newReviewFormData: AddReviewRequest) {
    addReview(newReviewFormData);
    closeDialogButtonRef.current?.click();
  }

  const { mutate: addReview, isLoading: addReviewLoading } =
    trpc.reviews.addReview.useMutation({
      onSuccess: (addedReview) => {
        toast.success("Ocena dodana pomyślnie");
        onReviewAdded(addedReview);
      },
      onError: (error) => {
        toast.error("Coś poszło nie tak");
        console.error(error);
      },
    });

  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants(), "flex items-center lg:w-fit")}
      >
        <PlusIcon className="mr-2" /> Recenzja
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj recenzję</DialogTitle>
          <DialogDescription>
            Oceń wydarzenie, które organizowałeś.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="value">Ocena</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      min="1"
                      max="6"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Ocena od 1 do 6 (można użyć połówek)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="comment">Komentarz</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormDescription>
                    Opisz swoje doświadczenie z organizacji tego wydarzenia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2 gap-2">
              <Button type="submit" disabled={addReviewLoading}>
                {(addReviewLoading && "Zapisywanie...") || "Dodaj opinię"}
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
