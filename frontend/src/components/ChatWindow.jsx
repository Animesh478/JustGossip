import { useEffect, useState } from "react";
import { getMessage, sendMessage } from "../api/message";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

function ChatWindow() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async function (message) {
    try {
      const newMessage = await sendMessage(message);
      // console.log("message=", newMessage);
      setMessages((prevMessage) => [...prevMessage, newMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchMessages = async function () {
      try {
        const data = await getMessage();
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col flex-1 border-l border-stone-300 bg-primary-light">
      <ChatHeader />
      <Messages messages={messages} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
