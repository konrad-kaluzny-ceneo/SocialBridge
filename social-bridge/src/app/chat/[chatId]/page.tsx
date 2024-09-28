import { trpc } from "@/server/client";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

export default function ChatPage({ params }: Props) {
  const { chatId } = params;

  const { data: chat, isLoading: isLoadingChat } = trpc.chat.getChat.useQuery({
    chatId,
  });

  if (isLoadingChat) return null;

  return <div>ChatPage</div>;
}
