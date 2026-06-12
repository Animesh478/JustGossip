import { useState } from "react";

function MessageInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = function () {
    if (!newMessage.trim()) return;
    console.log("new message in message input=", newMessage);
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <input
        type="text"
        placeholder="Type a message"
        className="border border-stone-400 rounded-md px-2 py-1 w-full focus:outline-none focus:border-primary bg-stone-100 font-poppins"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="rounded-md bg-primary font-poppins text-gray-200 px-4 py-1 cursor-pointer border-0"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
