import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

function Messages({ messages }) {
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
        return (
          <div
            key={message.id}
            className={`max-w-[70%] min-w-[30%] wrap-break-word p-2 rounded-lg font-roboto ${currentUser.id === message.senderId ? "bg-blue-500 text-white self-end text-right rounded-tl-none" : "bg-gray-200 text-gray-900 self-start rounded-tr-none"}`}
          >
            {message.message}
          </div>
        );
      })}
      <div ref={chatEndRef}></div>
    </main>
  );
}

export default Messages;
