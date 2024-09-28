"use client";

import ChatWrapper from "@/components/chat/ChatWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/client";
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

  return (
    <div className="relative w-full">
      <div className="absolute right-2 z-20 mt-2 flex items-center">
        <Link
          href="/organizations"
          className={cn(
            buttonVariants({
              size: "icon",
            }),
          )}
        >
          <MoveLeft size={24} />
        </Link>
      </div>
      <ChatWrapper chatId={chatToShow.id} />
    </div>
  );
}
