import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { BotIcon, UserIcon } from "lucide-react";

type Props = {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
  currentUserId: string;
};

const ChatMessage = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMessageSamePerson, currentUserId }, ref) => {
    const isCurrentUser = message.User.id === currentUserId;

    // console.log("message", message);
    // console.log("isCurrentUser", isCurrentUser);
    // console.log("currentUserId", currentUserId);

    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": isCurrentUser,
        })}
      >
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center rounded-sm p-1 text-white",
            {
              "order-2 bg-primary": isCurrentUser,
              "order-1 bg-slate-600": !isCurrentUser,
              invisible: isNextMessageSamePerson,
            },
          )}
        >
          {currentUserId ? <UserIcon /> : <BotIcon />}
        </div>

        <div
          className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
            "order-1 items-end":isCurrentUser,
            "order-2 items-start": !isCurrentUser,
          })}
        >
          <div
            className={cn("inline-block rounded-lg px-4 py-2", {
              "bg-primary/30 text-slate-800": isCurrentUser,
              "bg-slate-200 text-slate-800": !isCurrentUser,
              "rounded-br-none":
                !isNextMessageSamePerson && isCurrentUser,
              "rounded-bl-none":
                !isNextMessageSamePerson && !isCurrentUser,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose text-sm", {
                  "text-slate-800": isCurrentUser,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}

            {message.id !== "loading" ? (
              <div
                className={cn(
                  "mt-2 w-full select-none text-right text-sm text-slate-800",
                  {
                    "": !currentUserId,
                    "": currentUserId,
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

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
