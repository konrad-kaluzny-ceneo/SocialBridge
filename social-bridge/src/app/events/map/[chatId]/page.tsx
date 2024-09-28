import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { checkRole } from "@/lib/server-utils";
import { auth } from "@clerk/nextjs/server";
import ChatAiWrapper from "@/components/map/event/ChatAiWrapper";

type Props = {
  params: {
    chatId: string;
  };
};

export default async function MapPage({ params }: Props) {
  const { chatId } = params;
  const { userId } = auth();

  if (!userId || !checkRole("admin")) {
    redirect("/");
  }

  const chat = await db.chatWithAi.findUnique({
    where: {
      id: chatId,
      userId: userId,
    },
  });

  if (!chat) notFound();

  return (
    <div className="relative">
      <div className="flex items-center absolute z-20 right-2 mt-2">
        <Link
          href="/events"
          className={cn(
            buttonVariants({
              size: "icon",
            }),
          )}
        >
          <MoveLeft size={24} />
        </Link>
      </div>
      <ChatAiWrapper chatId={chatId} />
    </div>
  );
}
