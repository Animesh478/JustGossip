import { useEffect, useRef, useState } from "react";

import { fetchMessagesForChat, sendMessage } from "../api/message";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { createSocketConnection } from "../../utils/socket";
// import { useAuth } from "./AuthContext";

function ChatWindow({ activeChat }) {
  // const userAuth = useAuth();
  const [messages, setMessages] = useState([]);
  // console.log("chat window messages=", messages);

  // use this ref to hold the socket, so we can access it outside the useEffect
  const socketRef = useRef();

  // --- SOCKET.IO ROOM LOGIC ---
  useEffect(() => {
    if (activeChat) {
      // create a socket connection as soon as the chat window loads
      socketRef.current = createSocketConnection();

      // 1. Join the specific chat room using the chat id
      // we have to wait for the socket to successfully connect before joining
      socketRef.current.on("connect", () => {
        console.log(
          "🟢 Socket officially connected! Joining room...",
          activeChat.chatId,
        );
        socketRef.current.emit("join_chat", { chatId: activeChat.chatId });
      });

      // 2. Fetch the historical messages for this specific chat from the db
      const fetchHistoricalMessages = async function () {
        try {
          const data = await fetchMessagesForChat(activeChat.chatId);
          setMessages(data); // populating the state with the chat history
          // console.log("messages=", data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchHistoricalMessages();

      // 3. listen for the incoming live messages from the other user
      socketRef.current.on("receive_message", (incomingMessage) => {
        console.log("receive message=", incomingMessage);
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeChat]);

  // --- SOCKET.IO LIVE MESSAGE LOGIC ---

  const handleSendMessage = async function (message) {
    try {
      // 1. save the message to the database
      const newMessage = await sendMessage(message, activeChat.chatId);
      // newMessage : {id, senderId, message, chatId, createdAt, updatedAt}
      console.log("message chat window =", newMessage);

      // 2. update the ui immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 3. emit the message to the other user
      socketRef.current.emit("send_message", newMessage);
    } catch (error) {
      console.error("Failed to send message", error);
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
      <Messages messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
