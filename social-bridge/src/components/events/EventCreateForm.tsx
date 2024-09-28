"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { trpc } from "@/server/client";
import { EventCreateRequest, EventCreateValidator } from "@/validators/event";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { getEventTypeName } from "@/lib/translates";
import { $Enums } from "@prisma/client";

export default function EventCreateForm() {
  const router = useRouter();

  const form = useForm<EventCreateRequest>({
    resolver: zodResolver(EventCreateValidator),
    defaultValues: {
      eventType: undefined,
      title: "",
      description: "",
      startEventDate: undefined,
      startEventTime: "",
      budget: "",

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

  async function onSubmit(data: EventCreateRequest) {
    createEvent(data);
  }

  const { mutate: createEvent } = trpc.events.createEvent.useMutation({
    onSuccess: (res) => {
      router.push(`/events`);
    },
    onError: (err) => {
      toast.error(`Coś poszło nie tak. Spróbuj ponownie później.`);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Nazwa wydarzenia</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nazwa wydarzenia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ wydarzenia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ wydarzenia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={$Enums.EventType.GROUP_WORKSHOP}>
                    {getEventTypeName($Enums.EventType.GROUP_WORKSHOP)}
                  </SelectItem>
                  <SelectItem value={$Enums.EventType.MENTORING}>
                    {getEventTypeName($Enums.EventType.MENTORING)}
                  </SelectItem>
                  <SelectItem value={$Enums.EventType.SCHOLARSHIP}>
                    {getEventTypeName($Enums.EventType.SCHOLARSHIP)}
                  </SelectItem>
                  <SelectItem value={$Enums.EventType.SHELTERED_WORKSHOP}>
                    {getEventTypeName($Enums.EventType.SHELTERED_WORKSHOP)}
                  </SelectItem>
                  <SelectItem value={$Enums.EventType.FUNDRAISER}>
                    {getEventTypeName($Enums.EventType.FUNDRAISER)}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budżet</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startEventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1.5 mt-1">Data rozpoczęcia</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Wybierz datę</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startEventTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Czas rozpoczęcia</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea {...field}></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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
            <FormItem>
              <FormLabel>Kod pocztowy</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Kod pocztowy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex justify-end gap-2">
          <Button type="submit" variant={"default"}>
            Utwórz wydarzenie
          </Button>
        </div>
      </form>
    </Form>
  );
}
