import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { ChatAiContext } from "@/components/map/event/ChatAiContext";

type Props = {
  isDisabled: boolean;
};

export default function ChatAiInput({ isDisabled }: Props) {
  const { addMessage, handleInputChange, isLoading, message } =
    React.useContext(ChatAiContext);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  return (
    <div className="relative">
      <Textarea
        rows={1}
        maxRows={4}
        autoFocus
        placeholder="Czego potrzebujesz?"
        ref={textareaRef}
        onChange={handleInputChange}
        value={message}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            addMessage(message);
            textareaRef.current?.focus();
          }
        }}
        className={cn(
          "resize-none py-3.5 pr-12 text-sm",
          "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
        )}
      />

      <Button
        disabled={isDisabled || isLoading}
        aria-label="wyślij wiadomość"
        className="absolute bottom-1.5 right-[8px]"
        size={"sm"}
        onClick={() => {
          addMessage(message);
          textareaRef.current?.focus();
        }}
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
