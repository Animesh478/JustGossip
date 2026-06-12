import { useEffect, useState } from "react";

import { fetchMessagesForChat, sendMessage } from "../api/message";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { createSocketConnection } from "../../utils/socket";

const socket = createSocketConnection();

function ChatWindow({ activeChat }) {
  const [messages, setMessages] = useState([]);

  // --- SOCKET.IO ROOM LOGIC ---
  useEffect(() => {
    if (activeChat) {
      // 1. Join the specific chat room using the chat id
      socket.emit("join_chat", activeChat.chatId);

      // 2. Fetch the historical messages for this specific chat from the db
      const fetchHistoricalMessages = async function () {
        try {
          const data = await fetchMessagesForChat(activeChat.chatId);
          console.log("messages=", data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchHistoricalMessages();
    }
  }, [activeChat]);

  // --- SOCKET.IO LIVE MESSAGE LOGIC ---

  const handleSendMessage = async function (message) {
    try {
      const newMessage = await sendMessage(message);
      // console.log("message=", newMessage);
      setMessages((prevMessage) => [...prevMessage, newMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   const fetchMessages = async function () {
  //     try {
  //       const data = await getMessage();
  //       setMessages(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchMessages();
  // }, []);

  if (!activeChat) {
    return (
      <div className="w-2/3 flex items-center justify-center text-secondary">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 border-l border-stone-300 bg-primary-light">
      <ChatHeader activeChat={activeChat} />
      <Messages messages={messages} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
