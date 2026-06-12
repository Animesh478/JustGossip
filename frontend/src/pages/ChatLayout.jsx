import { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { fetchChatHistory } from "../api/chat";

function ChatLayout() {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch initial sidebar chats on load
  useEffect(() => {
    const loadInitialChats = async function () {
      try {
        const chatData = await fetchChatHistory();
        // console.log("chatsss=", chatData);
        setChats(chatData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialChats();
  }, []);

  // this method is called when the user clicks on the contact modal in the sidebar that comes when searching for a contact
  const handleSelectChat = function (chatData) {
    // 1. check if the chat already exists in the sidebar list
    const existingChat = chats.find((chat) => chat.chatId === chatData.chatId);

    // 2. if chat is new, add it to the top of the sidebar list
    if (!existingChat) {
      setChats((prev) => [chatData, ...prev]);
    } else {
      const filteredChats = chats.filter(
        (chat) => chat.chatId !== chatData.chatId,
      );
      setChats([existingChat, ...filteredChats]);
    }

    // 3. Open the chat window
    setActiveChat(chatData);
  };

  if (isLoading) {
    return <div>Loading chats...</div>;
  }

  return (
    <div className="flex w-full h-screen">
      <Sidebar onSelectChat={handleSelectChat} chats={chats} />
      <ChatWindow activeChat={activeChat} />
    </div>
  );
}

export default ChatLayout;
