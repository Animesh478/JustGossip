import { useEffect, useState } from "react";

import { fetchMessagesForChat, sendMessage } from "../api/message";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useSocket } from "./SocketContext";
// import { useAuth } from "./AuthContext";

function ChatWindow({ activeChat }) {
  // const userAuth = useAuth();
  const [messages, setMessages] = useState([]);
  console.log("chat window messages=", messages);
  // console.log("chatWindow.jsx, active chat = ", activeChat);

  const { socket } = useSocket();

  // --- SOCKET.IO ROOM LOGIC ---
  useEffect(() => {
    // if no chat is selected or the global socket is not ready, do nothing
    if (!activeChat || !socket) return;

    // 1. Join the specific chat room using the chat id
    // we have to wait for the socket to successfully connect before joining
    socket.emit("join_chat", { chatId: activeChat.chatId });
    console.log(
      "🟢 Socket officially connected! Joining room...",
      activeChat.chatId,
    );

    // 2. Fetch the historical messages for this specific chat from the db
    const fetchHistoricalMessages = async function () {
      try {
        const initialMessages = await fetchMessagesForChat(
          activeChat.chatId,
          "",
        );
        setMessages(initialMessages); // populating the state with the chat history
        console.log("chatWindow.jsx, messages=", initialMessages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistoricalMessages();

    // 3. listen for the incoming live messages from the other user
    const handleReceiveMessage = function (incomingMessage) {
      // only append message if it belongs to the currently active chat window
      console.log("chatWindow.jsx, message received");
      if (incomingMessage.chatId === activeChat.chatId) {
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      }
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      // if (socketRef.current) {
      //   socketRef.current.disconnect();
      // }
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeChat, socket]);

  const handleSendMessage = async function (message) {
    if (!socket) return;
    try {
      // 1. save the message to the database
      const newMessage = await sendMessage(message, activeChat.chatId);
      // newMessage : {id, senderId, message, chatId, createdAt, updatedAt}
      console.log("message chat window =", newMessage);

      // 2. update the ui immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 3. emit the message to the other user
      socket.emit("send_message", newMessage);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const fetchOlderMessages = async function () {
    if (messages.length === 0) return;

    const oldestMessage = messages[0];
    try {
      const olderMessages = await fetchMessagesForChat(
        activeChat.chatId,
        oldestMessage.createdAt,
      );
      setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
    } catch (error) {
      console.error(error);
    }
  };

  if (!activeChat) {
    return (
      <div className="w-2/3 flex items-center justify-center text-secondary font-xl font-semibold font-poppins">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 border-l border-stone-300 bg-primary-light">
      <ChatHeader activeChat={activeChat} />
      <Messages
        messages={messages}
        activeChat={activeChat}
        fetchOlderMessages={fetchOlderMessages}
      />
      <MessageInput
        onSendMessage={handleSendMessage}
        messages={messages}
        userTone="casual"
        activeChat={activeChat}
      />
    </div>
  );
}

export default ChatWindow;
