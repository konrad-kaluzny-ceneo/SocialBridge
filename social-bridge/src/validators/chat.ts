import { z } from "zod";

export const ChatCreateValidator = z.object({
  name: z.string().min(1, { message: "Chat name should be provided" }),
  partnershipId: z
    .string()
    .min(1, { message: "Partnership id should be provided" }),
});

export const GetChatValidator = z.object({
  id: z.string().min(1, { message: "Chat id should be provided" }),
});

export const GetMessagesValidator = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  chatId: z.string().min(1, { message: "Chat id should be provided" }),
});

export const SendMessageValidator = z.object({
  chatId: z.string(),
  message: z.string(),
});

export type SendMessageRequest = z.infer<typeof SendMessageValidator>;

export type ChatCreateRequest = z.infer<typeof ChatCreateValidator>;

export type GetMessagesRequest = z.infer<typeof GetMessagesValidator>;
