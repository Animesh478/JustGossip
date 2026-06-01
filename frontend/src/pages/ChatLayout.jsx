import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

function ChatLayout() {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default ChatLayout;
