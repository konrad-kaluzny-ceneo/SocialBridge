import { z } from "zod";

export const AiChatCreateValidator = z.object({
  name: z.string().min(1, { message: "Chat name should be provided" }),
});

export const GetAiChatValidator = z.object({
  id: z.string().min(1, { message: "Chat id should be provided" }),
});

export const GetMessagesValidator = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  chatId: z.string(),
});

export const SendAiMessageValidator = z.object({
  chatId: z.string(),
  message: z.string(),
});

export type AiChatCreateRequest = z.infer<typeof AiChatCreateValidator>;
