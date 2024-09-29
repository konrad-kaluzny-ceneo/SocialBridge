import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import {
  EventCreateValidator,
  GetEventsOrganizedByUserValidator,
  GetEventsValidator,
  GetEventValidator,
} from "@/validators/event";
import { TRPCError } from "@trpc/server";
import { getDateTime } from "@/lib/utils";
import { $Enums } from "@prisma/client";

export const eventsRouter = router({
  getEvent: publicProcedure
    .input(GetEventValidator)
    .query(async ({ input }) => {
      const event = await db.event.findUnique({
        where: { id: input.eventId },
        include: {
          Reviews: true,
          Address: true,
          Photos: true,
          EventOrganizer: {
            include: {
              Team: true,
            },
          },
          Partnerships: {
            include: {
              Partner: {
                include: {
                  Team: true,
                },
              },
              Organizer: {
                include: {
                  Team: true,
                },
              },
            },
          },
        },
      });
      return event;
    }),

  getEvents: publicProcedure
    .input(GetEventsValidator)
    .query(async ({ input }) => {
      const { incoming, last, organizationId } = input;
      // console.log("incoming", incoming);
      // console.log("last", last);
      // console.log("organizationId", organizationId);

      const events = await db.event.findMany({
        where: {
          startEvent: {
            gte: incoming ? new Date() : undefined,
            lte: last ? new Date() : undefined,
          },
          eventOrganizerId: organizationId ? organizationId : undefined,
        },
        include: {
          Reviews: true,
          Address: true,
          Photos: true,
        },
      });

      // console.log("events", events);

      return events;
    }),

  createEvent: privateProcedure
    .input(EventCreateValidator)
    .mutation(async ({ input, ctx }) => {
      const {
        eventType,
        title,
        startEventDate,
        startEventTime,
        street,
        city,
        zipCode,
        description,
        budget,
      } = input;
      const { user } = ctx;

      if (!user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      const address = `${street}, ${zipCode} ${city}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();

      if (data.status !== "OK") {
        console.error("data error", data);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Geocoding failed - response status not OK",
        });
      }

      const { lat, lng } = data.results[0].geometry.location;

      if (!lat || !lng) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Geocoding failed - no coordinates found",
        });
      }

      const startEvent = getDateTime(startEventDate, startEventTime);

      const addressDb = await db.address.create({
        data: {
          street,
          city,
          zipCode,
          lat,
          lng,
        },
      });

      const event = await db.event.create({
        data: {
          eventOrganizerId: user.id,
          eventType,
          title,
          startEvent,
          description,
          budget: parseInt(budget),
          addressId: addressDb.id,
        },
      });

      return event;
    }),

  userCanAddReview: privateProcedure
    .input(GetEventValidator)
    .query(async ({ input, ctx }) => {
      const { eventId } = input;
      const { user } = ctx;

      const event = await db.event.findUnique({
        where: { id: eventId },
        include: {
          Partnerships: {
            include: {
              Organizer: true,
              Partner: true,
            },
          },
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const isPastEvent = new Date(event.startEvent) < new Date();
      const isOrganizer = event.Partnerships.some(
        (partnership) => partnership.Organizer?.id === user.id,
      );

      const isPartner = event.Partnerships.some(
        (partnership) => partnership.Partner?.id === user.id,
      );

      if (!isPastEvent || (!isOrganizer && !isPartner)) {
        return false;
      }

      const userReviews = await db.review.findMany({
        where: {
          eventId,
          userId: user.id,
        },
      });

      return userReviews.length === 0;
    }),

  getEventsOrganizedByUser: publicProcedure
    .input(GetEventsOrganizedByUserValidator)
    .query(async ({ input }) => {
      const { userId, incoming, last } = input;

      const events = await db.event.findMany({
        where: {
          eventOrganizerId: userId,
          startEvent: {
            gte: incoming ? new Date() : undefined,
            lte: last ? new Date() : undefined,
          },
        },
        include: {
          Reviews: true,
          Address: true,
          Photos: true,
        },
      });

      return events;
    }),
});
