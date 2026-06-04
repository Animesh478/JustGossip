import { sendMessage } from "../api/message";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

function ChatWindow() {
  const handleSendMessage = async function (message) {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col flex-1 border-l border-stone-300 bg-primary-light">
      <ChatHeader />
      <Messages />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
