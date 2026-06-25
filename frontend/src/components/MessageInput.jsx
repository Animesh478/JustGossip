// import button from "daisyui/components/button";
import { useEffect, useState } from "react";
import { fetchPredictions, fetchSmartReplies } from "../api/aiChat";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function MessageInput({ onSendMessage, messages, userTone = "casual" }) {
  const [newMessage, setNewMessage] = useState("");
  const [smartReplies, setSmartReplies] = useState([]);
  const [predictions, setPredictions] = useState([]);

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

      console.log("message input.jsx, historyStr = ", historyStr);
      try {
        const { data } = await fetchSmartReplies(historyStr, userTone);
        console.log("messageInput.jsx, smart replies data = ", data);
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
        console.log("messageInput.jsx, predictions data = ", data);
        setPredictions(data.suggestions);
      } catch (error) {
        console.error("Failed to fetch predictions", error);
      }
    };

    fetchMessagePredictions();
  }, [debouncedText, userTone]);

  const handleSendMessage = function () {
    if (!newMessage.trim()) return;
    console.log("new message in message input=", newMessage);
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
