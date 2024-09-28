import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import {
  ChatCreateValidator,
  GetChatValidator,
  GetMessagesValidator,
  SendMessageValidator,
} from "@/validators/chat";

export const chatRouter = router({
  getChats: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Użytkownik nie został znaleziony",
      });
    }

    const userWithChats = await db.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        Organization: {
          include: {
            PartnerRelations: {
              include: {
                Chat: true,
              },
            },
            OrganizerRelations: {
              include: {
                Chat: true,
              },
            },
          },
        },
      },
    });

    const chats = [
      ...(userWithChats?.Organization?.PartnerRelations?.map(
        (partnership) => partnership.Chat,
      ) || []),
      ...(userWithChats?.Organization?.OrganizerRelations?.map(
        (partnership) => partnership.Chat,
      ) || []),
    ];

    return chats;
  }),

  createChat: privateProcedure
    .input(ChatCreateValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Użytkownik nie został znaleziony",
        });
      }

      const chat = await db.chat.create({
        data: {
          title: input.name,
          Partnership: {
            connect: {
              id: input.partnershipId,
            },
          },
        },
      });

      return chat;
    }),

  getChat: privateProcedure.input(GetChatValidator).query(async ({ input }) => {
    return db.chat.findFirst({
      where: {
        id: input.id,
      },
      include: {
        Messages: true,
        Partnership: true,
      },
    });
  }),

  getMessages: privateProcedure
    .input(GetMessagesValidator)
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { cursor, chatId } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const chat = await db.chat.findFirst({
        where: { id: chatId },
        include: {
          Partnership: {
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

      if (!chat)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat nie został znaleziony",
        });

      const isUserOrganizer = chat.Partnership.some((partnership) =>
        partnership.Organizer?.Team.some(
          (teamMember) => teamMember.id === userId,
        ),
      );

      const isUserPartner = chat.Partnership.some((partnership) =>
        partnership.Partner?.Team.some(
          (teamMember) => teamMember.id === userId,
        ),
      );

      if (!isUserOrganizer && !isUserPartner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Nie masz dostępu do tego chatu",
        });
      }

      const messages = await db.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        select: {
          id: true,
          createdAt: true,
          text: true,
          isUserMessage: true,
          User: {
            select: {
              id: true,
              name: true,
              image: true,
              Organization: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
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

  sendMessage: privateProcedure
    .input(SendMessageValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { chatId, message } = input;

      const chat = await db.chat.findFirst({
        where: { id: chatId },
        include: {
          Partnership: true,
        },
      });

      if (!chat)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat nie został znaleziony",
        });

      const newMessage = await db.message.create({
        data: {
          text: message,
          isUserMessage: true,
          Chat: {
            connect: {
              id: chatId,
            },
          },
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return newMessage;
    }),
});
