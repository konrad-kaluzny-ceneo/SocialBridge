import ChatSkeleton from "@/components/chat/ChatSkeleton";
import UserChatsList from "@/components/chat/UserChatsList";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";

export default function ChatUndefinedPage() {
  return (
    <WrapperMaxWidth>
      <div className="flex flex-col gap-4">
        <h1>Chat</h1>
        <div className="flex flex-col gap-4 xl:flex-row">
          <UserChatsList />
          <ChatSkeleton />
        </div>
      </div>
    </WrapperMaxWidth>
  );
}
