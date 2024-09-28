"use client";

import { trpc } from "@/server/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { cn } from "@/lib/utils";
import { Loader2Icon, MessageSquareIcon } from "lucide-react";
import Message from "./ChatMessage";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef } from "react";

type Props = {
  chatId: string;
};

export default function ChatMessages({ chatId }: Props) {
  const { data, isLoading, fetchNextPage } =
    trpc.ai.getMessages.useInfiniteQuery(
      {
        chatId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      },
    );

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  const loadingMeessage = {
    createdAt: new Date(),
    id: "loading",
    isUserMessage: false,
    isCoordinatesData: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2Icon className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [...messages];

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div
      className={cn(
        "flex flex-1 flex-col-reverse gap-4 overflow-y-auto p-3",
        "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
      )}
    >
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage === message.isUserMessage;

          if (i === combinedMessages.length - 1)
            return (
              <Message
                ref={ref}
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          else
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
        })
      ) : isLoading ? (
        <div className="mx-auto flex h-full flex-col items-center justify-center">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          <h3 className="text-xl font-semibold">Ładowanie...</h3>
          <p className="text-sm text-zinc-500">
            Przygotowujemy dla Ciebie czat...
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessageSquareIcon className="h-8 w-8 text-blue-500" />
          <h3 className="text-xl font-semibold">Wszystko gotowe!</h3>
          <p className="text-sm text-zinc-500">
            Określ jakiego typu organizacje chcesz znaleźć lub jakie wydarzenie
            chcesz zorganizować.
          </p>
        </div>
      )}
    </div>
  );
}
