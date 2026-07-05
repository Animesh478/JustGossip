// import button from "daisyui/components/button";
import { useEffect, useRef, useState } from "react";
import { fetchPredictions, fetchSmartReplies } from "../api/aiChat";
import { sendMediaFile } from "../api/message";

// console.log("rendering");

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function MessageInput({
  onSendMessage,
  messages,
  activeChat,
  onSendMediaMessage,
  userTone = "casual",
}) {
  const [newMessage, setNewMessage] = useState("");
  const [smartReplies, setSmartReplies] = useState([]);
  const [predictions, setPredictions] = useState([]);

  // state for uploading media
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // debouncing the input text by 400ms
  const debouncedText = useDebounce(newMessage, 400);

  // fetch smart replies when a new message arrives
  useEffect(() => {
    const fetchReplies = async function () {
      if (messages.length === 0) return;

      // format the messages history into a readable string for AI
      const historyStr = messages
        .slice(-3)
        .map((message) => `${message.senderId}: ${message.message}`)
        .join("\n");

      // console.log("message input.jsx, historyStr = ", historyStr);
      try {
        const { data } = await fetchSmartReplies(historyStr, userTone);
        // console.log("messageInput.jsx, smart replies data = ", data);
        setSmartReplies(data.replies);
      } catch (error) {
        console.error("Smart replies failed", error);
      }
    };

    if (newMessage === "") {
      fetchReplies();
    }
  }, [messages, userTone, newMessage]);

  // fetch predictions when the user types
  useEffect(() => {
    const fetchMessagePredictions = async function () {
      if (debouncedText.length < 3) {
        setPredictions([]);
        return;
      }

      try {
        const { data } = await fetchPredictions(debouncedText, userTone);
        // console.log("messageInput.jsx, predictions data = ", data);
        setPredictions(data.suggestions);
      } catch (error) {
        console.error("Failed to fetch predictions", error);
      }
    };

    fetchMessagePredictions();
  }, [debouncedText, userTone]);

  // Handlers
  const handleSendMessage = function () {
    if (!newMessage.trim()) return;
    // console.log("new message in message input=", newMessage);
    onSendMessage(newMessage);
    setNewMessage("");
    setSmartReplies([]);
    setPredictions([]);
  };

  const handleSmartReplyClick = async function (reply) {
    // instantly send the smart reply as the message
    onSendMessage(reply);
    setSmartReplies([]);
  };

  const handlePredictionCLick = async function (prediction) {
    // append the prediction to the current input text
    setNewMessage((prev) => `${prev.trim()} ${prediction}`);
    setPredictions([]);
  };

  // Media upload handler
  const handleMediaUpload = async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    // const chatId = activeChat.chatId;
    const formData = new FormData();
    formData.append("chatId", activeChat.chatId);
    formData.append("file", file);

    try {
      // send file to the backend
      const result = await sendMediaFile(formData);
      // the backend returns the message object
      // send it to ChatWindow.jsx to update the ui and emit via socket
      onSendMediaMessage(result);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
      fileInputRef.current.value = null;
    }
  };

  return (
    <div>
      {/* AI suggestion space */}
      <div className="flex gap-2 mb-1 overflow-x-auto px-4">
        {/* when user is not typing show smart replies */}
        {newMessage === "" &&
          smartReplies.map((reply, idx) => {
            return (
              <button
                key={idx}
                onClick={() => handleSmartReplyClick(reply)}
                className="px-4 py-1 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 whitespace-nowrap transition-colors cursor-pointer"
              >
                {reply}
              </button>
            );
          })}

        {/* when user is typing show predictive texts */}
        {newMessage !== "" &&
          predictions.map((prediction, idx) => {
            return (
              <button
                key={idx}
                onClick={() => handlePredictionCLick(prediction)}
                className="px-4 py-1 text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 whitespace-nowrap transition-colors cursor-pointer"
              >
                ...{prediction}
              </button>
            );
          })}
      </div>

      <div className="flex items-center gap-2 px-4 py-3">
        {/* Hidden file input */}
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleMediaUpload}
        />

        {/* Attachment button */}
        <button
          className="cursor-pointer bg-primary rounded-full p-2 hover:bg-primary-light border hover:border-primary group transition-colors"
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            className="size-4 stroke-white group-hover:stroke-gray-600 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
        </button>

        {/* Input text box */}
        <input
          type="text"
          placeholder="Type a message"
          className="border border-stone-400 rounded-md px-2 py-1 w-full focus:outline-none focus:border-primary bg-stone-100 font-poppins"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="rounded-md bg-primary font-poppins text-gray-200 px-4 py-1 cursor-pointer border-0"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
