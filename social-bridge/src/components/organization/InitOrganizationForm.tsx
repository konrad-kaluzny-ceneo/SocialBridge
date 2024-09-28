"use client";

import { trpc } from "@/server/client";
import {
  CreateOrganizationRequest,
  CreateOrganizationValidator,
} from "@/validators/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums, PartnershipTag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Checkbox } from "../ui/checkbox";

export interface InitOrganizationFormProps {
  OrganizationType: $Enums.OrganizationType;
}

export default function InitOrganizationForm({
  OrganizationType,
}: InitOrganizationFormProps) {
  const router = useRouter();

  const form = useForm<CreateOrganizationRequest>({
    resolver: zodResolver(CreateOrganizationValidator),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      OrganizationType,

      socialGoals: "",
      sociamImpactStrategy: "",
      businessGoals:
        OrganizationType == $Enums.OrganizationType.BUSINESS ? "" : undefined,

      previousExperience: "",
      projectsToRealize: "",

      searchPartnershipTags: [],
      givePartnershipTags: [],

      street: "",
      city: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length) {
      for (const [key, value] of Object.entries(form.formState.errors)) {
        toast.error(`Błąd w formularzu: ${value.message}`);
      }
    }
  }, [form.formState.errors]);

  const onSubmit = (data: CreateOrganizationRequest) => {
    createOrganization(data);
  };

  const { mutate: createOrganization } =
    trpc.organization.createOrganization.useMutation({
      onSuccess: (res) => {
        router.push(`/organizations/${res.id}`);
      },
      onError: (err) => {
        toast.error(`Coś poszło nie tak. Spróbuj ponownie później.`);
      },
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4 flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Nazwa organizacji</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nazwa organizacji" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Krótki opis organizacji</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Opis organizacji w kilku słowach"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Długi opis organizacji</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  minRows={3}
                  placeholder="Opisz swoją organizację w tylu słowach, ile potrzebujesz"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="socialGoals"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Cele społeczne</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  minRows={3}
                  placeholder="Cele społeczne organizacji"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sociamImpactStrategy"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Strategia wpływu społecznego organizacji</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  minRows={3}
                  placeholder="Strategia wpływu społecznego organizacji"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessGoals"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Cele biznesowe</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  minRows={3}
                  placeholder="Cele biznesowe organizacji"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {OrganizationType == $Enums.OrganizationType.BUSINESS && (
          <FormField
            control={form.control}
            name="previousExperience"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel>Poprzednie doświadczenie</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    minRows={3}
                    placeholder="Poprzednie doświadczenie organizacji"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="projectsToRealize"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Projekty do realizacji</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  minRows={3}
                  placeholder="Projekty do realizacji organizacji"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="searchPartnershipTags"
          render={() => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Tagi wyszukiwania partnerstwa</FormLabel>
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
              <FormLabel>Tagi oferowanego partnerstwa</FormLabel>
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

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel>Ulica</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Ulica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel>Miasto</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Miasto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel>Kod pocztowy</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Kod pocztowy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Utwórz organizację</Button>
      </form>
    </Form>
  );
}
