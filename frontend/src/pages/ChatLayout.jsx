import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

function ChatLayout() {
  const [activeChat, setActiveChat] = useState(null);
  return (
    <div className="flex w-full h-screen">
      <Sidebar onSelectUser={setActiveChat} />
      <ChatWindow activeChat={activeChat} />
    </div>
  );
}

export default ChatLayout;
