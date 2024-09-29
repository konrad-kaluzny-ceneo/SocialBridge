"use client";

import ChatSkeleton from "@/components/chat/ChatSkeleton";
import { trpc } from "@/server/client";
import { redirect } from "next/navigation";

export default function ChatUndefinedPage() {
  const { data: chats, isLoading, isError } = trpc.chat.getChats.useQuery();

  if (isLoading) return null;
  if (isError) return null;

  if (chats.length === 0) {
    return <ChatSkeleton />;
  }

  const chatToShow = chats[0];
  if (!chatToShow) {
    return <ChatSkeleton />;
  }

  redirect(`/chat/${chatToShow.id}`);
}
