import { EventType } from "@prisma/client";
import { z } from "zod";

export const GetEventValidator = z.object({
  eventId: z.string(),
});

export const GetEventsValidator = z.object({
  incoming: z.boolean().optional(),
  last: z.boolean().optional(),
  organizationId: z.string().optional(),
});

export const GetParticipantsValidator = z.object({
  eventId: z.string(),
});

export const SignToEventValidator = z.object({
  eventId: z.string(),
});

export const EventCreateValidator = z.object({
  eventType: z.nativeEnum(EventType),
  title: z.string().min(3).max(60),
  description: z.string().min(3).max(255),
  startEventDate: z.date({
    required_error: "Data rozpoczęcia jest wymagana",
  }),
  startEventTime: z.string().refine(
    (val) => {
      const time = new Date(`2000-01-01T${val}`);
      return time instanceof Date && !Number.isNaN(time.getTime());
    },
    {
      message: "nieprawidłowa godzina",
    },
  ),

  budget: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "budżet musi być liczbą",
    })
    .refine((val) => parseInt(val, 10) >= 0, {
      message: "budżet musi być większy lub równy 0",
    }),

  street: z.string().min(3).max(60),
  city: z.string().min(3).max(60),
  zipCode: z
    .string()
    .min(5)
    .max(6)
    .refine((val) => /^\d{2}-\d{3}$/.test(val), {
      message: "nieprawidłowy kod pocztowy",
    }),
});

export type GetEventRequest = z.infer<typeof GetEventValidator>;
export type GetEventsRequest = z.infer<typeof GetEventsValidator>;
export type EventCreateRequest = z.infer<typeof EventCreateValidator>;

export const GetEventsOrganizedByUserValidator = z.object({
  incoming: z.boolean().optional(),
  last: z.boolean().optional(),
  userId: z.string(),
});

export type GetEventsOrganizedByUserRequest = z.infer<
  typeof GetEventsOrganizedByUserValidator
>;
