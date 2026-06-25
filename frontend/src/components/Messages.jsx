import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

function Messages({ messages, activeChat }) {
  const userAuth = useAuth();
  const currentUser = userAuth.currentUser;

  const chatEndRef = useRef(null);

  const scrollToBottom = function () {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // console.log("messages.jsx user auth = ", userAuth);
  // console.log("messages messages.jsx=", messages);
  return (
    <main className="flex-1 px-4 py-3 overflow-y-auto  flex flex-col gap-2">
      {messages.map((message) => {
        const isMyMessage = currentUser.id === message.senderId;
        return (
          <div
            key={message.id}
            // className={`max-w-[70%] min-w-[30%] wrap-break-word p-2 rounded-lg font-poppins ${isMyMessage ? "bg-blue-500 text-white self-end text-right rounded-tl-none" : "bg-gray-200 text-gray-900 self-start rounded-tr-none"}`}
            className={` flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
          >
            {/* Sender name */}
            {activeChat.isGroup && !isMyMessage && (
              <span className="text-[0.7rem] font-poppins capitalize font-semibold text-primary">
                {message.sender.username}
              </span>
            )}

            {/* Message Bubble */}
            <div
              className={`wrap-break-word p-2 rounded-2xl font-poppins ${isMyMessage ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-stone-200 text-stone-800 rounded-bl-none"}`}
            >
              <p>{message.message}</p>
            </div>

            {/* Timestamp */}
            <span className="text-[10px] text-stone-400 mt-1">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      })}
      <div ref={chatEndRef}></div>
    </main>
  );
}

export default Messages;
