"use client";

import { ChatAiContextProvider } from "@/components/map/organization/ChatAiContext";
import ChatAiMessages from "@/components/map/organization/ChatAiMessages";
import ChatAiInput from "@/components/map/organization/ChatAiInput";
import ChatAiMapRendererAiCoordinates from "@/components/map/organization/ChatAiMapRendererAiCoordinates";

type Props = {
  chatId: string;
};

export default function ChatAiWrapper({ chatId }: Props) {
  return (
    <ChatAiContextProvider chatId={chatId}>
      <div className="flex flex-col md:flex-row w-full">
        {/* left side */}
        <div className="w-full xl:w-2/3">
          <ChatAiMapRendererAiCoordinates chatId={chatId} />
        </div>

        {/* right side */}
        <div className="relative mt-3 flex h-[59vh] w-full md:h-[88vh] md:w-1/3">
          <div className="flex h-[47vh] w-full md:h-[78vh]">
            <ChatAiMessages chatId={chatId} />
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4">
            <ChatAiInput isDisabled={false} />
          </div>
        </div>
      </div>
    </ChatAiContextProvider>
  );
}
