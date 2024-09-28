"use client";

import React from "react";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { toast } from "sonner";
import { trpc } from "@/server/client";

type ChatContextType = {
  addMessage: (message: string) => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = React.createContext<ChatContextType>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  chatId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({ chatId, children }: Props) => {
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: sendMessage } = trpc.chat.sendMessage.useMutation({
    onMutate: async ({ message }) => {
      setMessage("");
      setIsLoading(true);

      await utils.chat.getMessages.cancel();

      const previousMessages = utils.chat.getMessages.getInfiniteData({
        chatId,
      });

      utils.chat.getMessages.setInfiniteData(
        { chatId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) return { pages: [], pageParams: [] };

          const newPages = [...old.pages];
          const latestPage = newPages[0]!;
          latestPage.messages = [
            {
              id: "optimistic-update",
              createdAt: new Date(),
              text: message,
              User: {
                id: "current-user",
                name: "You",
                image: null,
                Organization: null,
              },
            },
            ...latestPage.messages,
          ];

          return { ...old, pages: newPages };
        },
      );

      return { previousMessages };
    },
    onError: (_, __, context) => {
      utils.chat.getMessages.setData(
        { chatId },
        {
          messages:
            context?.previousMessages?.pages.flatMap((page) => page.messages) ??
            [],
        },
      );
      toast.error("Failed to send message. Please try again.");
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.chat.getMessages.invalidate({ chatId });
    },
  });

  const addMessage = (message: string) => {
    sendMessage({ chatId, message });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
