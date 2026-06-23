import { useEffect, useState } from "react";

import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { fetchChatHistory } from "../api/chat";
import GroupChat from "../components/GroupChat";

function ChatLayout() {
  console.log("chat layout component rendered");
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);

  // fetch initial sidebar chats on load
  useEffect(() => {
    const loadInitialChats = async function () {
      try {
        const chatData = await fetchChatHistory();
        // console.log("ChatLayout.jsx, fetchChatHistory=", chatData);
        console.log("use effect executed");
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
    // console.log("chatLayout.jsx, chatData=", chatData);
    console.log("handle select chat executed");
    const existingChat = chats.find((chat) => chat.chatId === chatData.chatId);
    console.log("chatLayout.jsx, existingChat=", existingChat);
    // 2. if chat is new, add it to the top of the sidebar list
    if (!existingChat) {
      console.log("existing chat is undefined");
      console.log("existing chat undefined, chatData=", chatData);
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
      <Sidebar
        onSelectChat={handleSelectChat}
        chats={chats}
        onSelectGroupChatModal={setShowGroupChatModal}
      />
      {showGroupChatModal && (
        <GroupChat
          onSelectGroupChatModal={setShowGroupChatModal}
          onSelectChat={handleSelectChat}
        />
      )}
      <ChatWindow activeChat={activeChat} />
    </div>
  );
}

export default ChatLayout;
