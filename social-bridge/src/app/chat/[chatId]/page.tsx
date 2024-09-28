import ChatWrapper from "@/components/chat/ChatWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

export default function ChatPage({ params }: Props) {
  const { chatId } = params;

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
      <ChatWrapper chatId={chatId} />
    </div>
  );
}
