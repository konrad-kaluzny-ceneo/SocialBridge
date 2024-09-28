import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import {
  AiChatCreateValidator,
  GetAiChatValidator,
  GetMessagesValidator,
} from "@/validators/ai";
import { CoordinateData } from "@/types/coordinateData";

export const aiRouter = router({
  getChats: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return db.chatWithAi.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),

  createChat: privateProcedure
    .input(AiChatCreateValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return db.chatWithAi.create({
        data: {
          userId: user.id,
          name: input.name,
        },
      });
    }),

  getChat: privateProcedure
    .input(GetAiChatValidator)
    .query(async ({ input }) => {
      return db.chat.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  getAiOrganizationsCoordinates: privateProcedure
    .input(GetAiChatValidator)
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;

      const chat = await db.chatWithAi.findFirst({
        where: { id: id, userId },
        include: {
          Messages: true,
        },
      });

      if (!chat) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = chat.Messages;

      const coordinateMessage = messages.find(
        (message) => message.isCoordinatesData,
      );

      if (!coordinateMessage) {
        return [];
      }

      const possibleCoordinates: CoordinateData[] = JSON.parse(
        coordinateMessage.text,
      );

      const entityId = possibleCoordinates.map((coordinate) => coordinate.id);

      const organizations = await db.organization.findMany({
        where: {
          id: {
            in: entityId,
          },
        },
        include: {
          Address: true,
        },
      });

      return organizations;
    }),

  getMessages: privateProcedure
    .input(GetMessagesValidator)
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { cursor, chatId } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;
      const chat = await db.chatWithAi.findFirst({
        where: { id: chatId, userId },
      });
      if (!chat) throw new TRPCError({ code: "NOT_FOUND" });
      const messages = await db.messageWithAi.findMany({
        where: { chatId },
        orderBy: { createdAt: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        select: {
          id: true,
          createdAt: true,
          text: true,
          isUserMessage: true,
          isCoordinatesData: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      if (nextCursor) {
        return {
          messages: messages,
          nextCursor,
        };
      } else {
        return {
          messages: messages,
        };
      }
    }),
});
