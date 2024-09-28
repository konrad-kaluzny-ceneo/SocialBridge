"use client";

import { ChatContextProvider } from "@/components/chat/ChatContext";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useEffect, useState } from "react";
import UserChatsList from "./UserChatsList";

type Props = {
  chatId: string;
  userId: string;
};

export default function ChatWrapper({ chatId, userId }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ChatContextProvider chatId={chatId}>
      <div className="flex w-full flex-col md:flex-row">
        {/* left side */}
        <div className="w-full xl:w-1/3">
          <UserChatsList />
        </div>

        {/* right side */}
        <div className="relative mt-3 flex h-[59vh] w-full md:h-[88vh] md:w-2/3">
          <div className="flex h-[47vh] w-full md:h-[78vh]">
            <ChatMessages chatId={chatId} userId={userId} />
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4">
            <ChatInput isDisabled={false} />
          </div>
        </div>
      </div>
    </ChatContextProvider>
  );
}
