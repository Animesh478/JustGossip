function Messages({ messages }) {
  return (
    <main className="flex-1 px-4 py-3 overflow-y-auto ">
      {messages.map((message) => {
        return <div key={message.id}>{message.message}</div>;
      })}
    </main>
  );
}

export default Messages;
