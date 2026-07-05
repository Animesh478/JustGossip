import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
// import { useState } from "react";

function Messages({ messages, activeChat, fetchOlderMessages }) {
  const userAuth = useAuth();
  const currentUser = userAuth.currentUser;

  const chatEndRef = useRef(null);
  const topSensorRef = useRef(null);
  const isLoadingRef = useRef(false);
  const scrollContainerRef = useRef(null);

  // state to track if we are currently loading older messages
  // const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);

  const scrollToBottom = function () {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Intersection observer logic
  useEffect(() => {
    // if there are no messages don't observe
    if (!topSensorRef.current || messages.length === 0) return;
    if (messages.length < 50) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const firstEntry = entries[0];

        // if the top sensor is visible on the screen and we are not loading
        if (firstEntry.isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;

          await fetchOlderMessages();

          isLoadingRef.current = false;
        }
      },
      {
        root: scrollContainerRef.current,
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
  }, [fetchOlderMessages, messages]);

  useEffect(() => {
    // when loading older messages and the user receives a new message, it should not scroll to the bottom
    if (!isLoadingRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <main
      className="flex-1 px-4 py-3 overflow-y-auto  flex flex-col gap-2"
      ref={scrollContainerRef}
    >
      {/* Sensor Div */}
      <div ref={topSensorRef} className="h-4 w-full" />

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
              {/* render media if it exists */}
              {message.mediaUrl && (
                <div>
                  <div>
                    {message.mediaType &&
                      message.mediaType.startsWith("image/") && (
                        <img
                          src={message.mediaUrl}
                          alt=""
                          className="rounded-lg max-w-full h-auto object-cover max-h-64"
                          loading="lazy"
                        />
                      )}
                  </div>
                  <a href={message.mediaUrl} target="_blank">
                    See image
                  </a>
                </div>
              )}
              {message.message && <p>{message.message}</p>}
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
