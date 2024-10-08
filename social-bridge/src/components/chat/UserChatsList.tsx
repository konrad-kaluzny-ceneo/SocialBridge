"use client";

import { trpc } from "@/server/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function UserChatsList() {
  const { data: chats, isLoading, isError } = trpc.chat.getChats.useQuery();

  if (isLoading) return null;
  if (isError) return null;
  if (!chats || chats.length === 0) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Twoje czaty</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "flex h-[20vh] flex-col gap-2 overflow-y-auto p-2 xl:h-[calc(100vh-200px)]",
            "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
          )}
        >
          {chats.map((chat, index) => (
            <Link
              key={index}
              className="mb-2 cursor-pointer rounded-lg p-2 hover:bg-gray-100"
              href={`/chat/${chat?.id}`}
            >
              <h3 className="font-semibold">{chat?.title}</h3>
              <p className="text-sm text-gray-500">
                {chat?.createdAt
                  ? new Date(chat.createdAt).toLocaleDateString()
                  : "Nieznana data"}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
