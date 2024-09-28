import React, { useContext } from "react";
import { trpc } from "@/server/client";
import { ChatContext } from "./ChatContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function UserChatsList() {
  const { data: chats, isLoading, isError } = trpc.chat.getChats.useQuery();
  const { addMessage } = useContext(ChatContext);

  if (isLoading) return null;
  if (isError) return null;
  if (!chats || chats.length === 0) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Chats</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "flex h-[20vh] xl:h-[calc(100vh-200px)] flex-col gap-2 overflow-y-auto p-2",
            "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
          )}
        >
          {chats.map((chat, index) => (
            <div
              key={index}
              className="mb-2 cursor-pointer rounded-lg p-2 hover:bg-gray-100"
              onClick={() => addMessage(`Switched to chat: ${chat?.title}`)}
            >
              <h3 className="font-semibold">{chat?.title}</h3>
              <p className="text-sm text-gray-500">
                {chat?.createdAt
                  ? new Date(chat.createdAt).toLocaleDateString()
                  : "Nieznana data"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
