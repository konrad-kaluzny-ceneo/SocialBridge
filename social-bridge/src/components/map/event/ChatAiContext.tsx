import React from "react";
import { useMutation } from "@tanstack/react-query";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { toast } from "sonner";
import { trpc } from "@/server/client";

type StreamResponse = {
  addMessage: (message: string) => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatAiContext = React.createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  chatId: string;
  children: React.ReactNode;
}

export const ChatAiContextProvider = ({ chatId, children }: Props) => {
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const utils = trpc.useUtils();

  const backupMessage = React.useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch(`/api/message-ai-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas wysyłania wiadomości.");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await utils.ai.getMessages.cancel();

      const previousMessages = utils.ai.getMessages.getInfiniteData();

      utils.ai.getMessages.setInfiniteData(
        { chatId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          const newPages = [...old.pages];
          const latestPage = newPages[0]!;
          latestPage.messages = [
            {
              createdAt: new Date(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
              isCoordinatesData: false,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast.error(
          "Pojawił się błąd podczas wysyłania wiadomości. Spróbuj ponownie.",
        );
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";
      let isCoordinatesData = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value);
          const combinedChunkValue = chunkValue
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => line.replace(/0:"/, "").replace(/"/, ""))
            .join("");
          accResponse += combinedChunkValue;
          if (accResponse.startsWith("[")) isCoordinatesData = true;
        }

        // append to actual message
        utils.ai.getMessages.setInfiniteData(
          {
            chatId,
            limit: INFINITE_QUERY_LIMIT,
          },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              };
            }

            const isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response"),
            );

            const updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;

                if (isAiResponseCreated) {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }
                    return message;
                  });
                } else {
                  updatedMessages = [
                    {
                      createdAt: new Date(),
                      id: "ai-response",
                      text: accResponse,
                      isUserMessage: false,
                      isCoordinatesData: isCoordinatesData,
                    },
                    ...page.messages,
                  ];
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return {
              ...old,
              pages: updatedPages,
            };
          },
        );
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.ai.getMessages.setData(
        {
          chatId,
        },
        { messages: context?.previousMessages ?? [] },
      );
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.ai.getMessages.invalidate({ chatId });
      await utils.ai.getAiEventsCoordinates.invalidate({ id: chatId });
    },
  });

  const addMessage = (message: string) => {
    sendMessage({ message });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <ChatAiContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatAiContext.Provider>
  );
};
