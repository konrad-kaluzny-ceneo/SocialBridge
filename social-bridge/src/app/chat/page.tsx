"use client";

import ChatWrapper from "@/components/chat/ChatWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/client";
import { currentUser } from "@clerk/nextjs/server";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ChatUndefinedPage() {
  const { data: chats, isLoading, isError } = trpc.chat.getChats.useQuery();

  if (isLoading) return null;
  if (isError) return null;

  if (chats.length === 0) {
    redirect("/organizations");
  }

  const chatToShow = chats[0];
  if (!chatToShow) {
    redirect("/organizations");
  }

  redirect(`/chat/${chatToShow.id}`);
}
