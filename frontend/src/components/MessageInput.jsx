import { useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = function () {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <input
        type="text"
        placeholder="Type a message"
        className="border border-stone-400 rounded-md px-2 py-1 w-full focus:outline-none focus:border-primary bg-stone-100"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="rounded-md bg-primary text-gray-200 px-4 py-1 cursor-pointer border-0"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
