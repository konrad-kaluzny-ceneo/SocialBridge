import ChatWrapper from "@/components/chat/ChatWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import AcceptPartnershipDialog from "@/components/chat/AcceptPartnershipDialog";

type Props = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params }: Props) {
  const { chatId } = params;

  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="relative w-full">
      <div className="absolute right-2 z-20 mt-2 flex gap-2 items-center">
        <AcceptPartnershipDialog chatId={chatId} />
        <Link
          href="/organizations"
          className={cn(
            buttonVariants({
              size: "icon",
              variant: "outline",
            }),
          )}
        >
          <MoveLeft size={24} />
        </Link>
      </div>
      <ChatWrapper chatId={chatId} userId={user.id} />
    </div>
  );
}
