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
import { z } from "zod";
import { GetFileValidator } from "@/validators/files";

export const filesRouter = router({
  getFile: publicProcedure
    .input(GetFileValidator)
    .mutation(async ({ input }) => {
      const file = await db.file.findFirst({
        where: { key: input.key },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      return file;
    }),

  getFilesByOrganizationId: publicProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input }) => {
      const files = await db.file.findMany({
        where: { organizationId: input.organizationId },
      });
      return files;
    }), 
});
