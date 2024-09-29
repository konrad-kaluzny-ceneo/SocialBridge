"use client";

import { trpc } from "@/server/client";
import {
  UpdateVolunteerProfileRequest,
  UpdateVolunteerProfileValidator,
} from "@/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  initialUser: User;
  onUserUpdate: (user: User) => void;
};

export default function VolunteerEditButton({ userId, initialUser, onUserUpdate }: Props) {
  const form = useForm<UpdateVolunteerProfileRequest>({
    resolver: zodResolver(UpdateVolunteerProfileValidator),
    defaultValues: {
      userId,
      volunteerExperience: initialUser.volunteerExperience || "",
      volunteerSkills: initialUser.volunteerSkills || "",
      volunteerProjects: initialUser.volunteerProjects || "",
      volunteerRole: initialUser.volunteerRole || "",
      volunteerStrengths: initialUser.volunteerStrengths || "",
    },
  });

  useEffect(() => {
    form.reset({
      userId,
      volunteerExperience: initialUser.volunteerExperience || "",
      volunteerSkills: initialUser.volunteerSkills || "",
      volunteerProjects: initialUser.volunteerProjects || "",
      volunteerRole: initialUser.volunteerRole || "",
      volunteerStrengths: initialUser.volunteerStrengths || "",
    });
  }, [initialUser, form, userId]);

  useEffect(() => {
    if (Object.keys(form.formState.errors).length) {
      for (const [key, value] of Object.entries(form.formState.errors)) {
        toast.error(`Błąd w formularzu: ${value.message}`);
      }
    }
  }, [form.formState.errors]);

  const { mutate: updateVolunteerProfile, isLoading: isUpdating } =
    trpc.user.updateVolunteerProfile.useMutation({
      onSuccess: (res) => {
        onUserUpdate(res);
        toast.success("Profil wolontariusza zaktualizowany pomyślnie");
        closeDialogButtonRef.current?.click();
      },
      onError: (err) => {
        toast.error(`Coś poszło nie tak. Spróbuj ponownie później.`);
      },
    });

  const onSubmit = (data: UpdateVolunteerProfileRequest) => {
    updateVolunteerProfile(data);
  };

  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="button-default-size"
          data-test="edit-volunteer-modal-trigger"
        >
          <EditIcon className="button-default-icon-size" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj profil wolontariusza</DialogTitle>
          <DialogDescription>
            Wprowadź zmiany w swoim profilu wolontariusza. Kliknij Zapisz, gdy skończysz.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="volunteerExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doświadczenie wolontariusza</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Opisz swoje doświadczenie jako wolontariusz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volunteerSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Umiejętności wolontariusza</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Wymień swoje umiejętności"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volunteerProjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projekty wolontariusza</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Opisz projekty, w których brałeś udział"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volunteerRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rola wolontariusza</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Twoja rola jako wolontariusz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volunteerStrengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mocne strony wolontariusza</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Opisz swoje mocne strony jako wolontariusz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2 gap-2">
              <DialogClose asChild ref={closeDialogButtonRef}>
                <Button
                  variant="secondary"
                  data-test="volunteer-edit-cancel-button"
                >
                  Anuluj
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isUpdating}
                data-test="volunteer-edit-button"
              >
                {isUpdating ? "Zapisywanie..." : "Zapisz zmiany"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}