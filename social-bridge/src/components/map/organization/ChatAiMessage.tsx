import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message-ai";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { BotIcon, UserIcon } from "lucide-react";

type Props = {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
};

const ChatAiMessage = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center rounded-sm p-1 text-white",
            {
              "order-2 bg-primary": message.isUserMessage,
              "order-1 bg-slate-600": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            },
          )}
        >
          {message.isUserMessage ? <UserIcon /> : <BotIcon />}
        </div>

        <div
          className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("inline-block rounded-lg px-4 py-2", {
              "bg-primary text-white": message.isUserMessage,
              "bg-slate-600 text-white": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {message.isCoordinatesData ? (
              <>
                {message.id !== "loading" ? (
                  <>
                    <div className="text-xs font-bold">
                      Umieściłem dla Ciebie na mapie kilka propozycji
                      organizacji.
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {typeof message.text === "string" ? (
                  <ReactMarkdown
                    className={cn("prose text-xs", {
                      "text-white": message.isUserMessage,
                    })}
                  >
                    {message.text}
                  </ReactMarkdown>
                ) : (
                  message.text
                )}
              </>
            )}

            {message.id !== "loading" ? (
              <div
                className={cn(
                  "mt-2 w-full select-none text-right text-xs text-white",
                  {
                    "": !message.isUserMessage,
                    "": message.isUserMessage,
                  },
                )}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

ChatAiMessage.displayName = "ChatAiMessage";

export default ChatAiMessage;
