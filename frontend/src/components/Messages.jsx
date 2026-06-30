import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useState } from "react";

function Messages({ messages, activeChat, fetchOlderMessages }) {
  const userAuth = useAuth();
  const currentUser = userAuth.currentUser;

  const chatEndRef = useRef(null);
  const topSensorRef = useRef(null);

  // state to track if we are currently loading older messages
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);

  const scrollToBottom = function () {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Intersection observer logic
  useEffect(() => {
    // if there are no messages don't observe
    if (!topSensorRef.current || messages.length === 0) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const firstEntry = entries[0];

        // if the top sensor is visible on the screen and we are not loading
        if (firstEntry.isIntersecting && !isLoadingOlderMessages) {
          setIsLoadingOlderMessages(true);

          await fetchOlderMessages();

          setIsLoadingOlderMessages(false);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    // start observing the sensor
    observer.observe(topSensorRef.current);

    // clean up
    return () => {
      observer.disconnect();
    };
  }, [fetchOlderMessages, isLoadingOlderMessages, messages]);

  useEffect(() => {
    if (!isLoadingOlderMessages) {
      scrollToBottom();
    }
  }, [messages, isLoadingOlderMessages]);

  return (
    <main className="flex-1 px-4 py-3 overflow-y-auto  flex flex-col gap-2">
      {messages.map((message) => {
        const isMyMessage = currentUser.id === message.senderId;
        return (
          <div
            key={message.id}
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
