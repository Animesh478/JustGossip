import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

function ChatWindow() {
  return (
    <div className="flex flex-col flex-1 border-l border-stone-300 bg-primary-light">
      <ChatHeader />
      <Messages />
      <MessageInput />
    </div>
  );
}

export default ChatWindow;
