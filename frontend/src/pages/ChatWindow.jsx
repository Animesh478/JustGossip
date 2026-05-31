function ChatWindow() {
  return (
    <div className="flex w-screen">
      <div>
        <div>Person 1</div>
        <div>Person 2</div>
        <div>Person 3</div>
        <div>Person 4</div>
      </div>
      <div>
        <header>
          <img src="" alt="" />
          <p>name</p>
        </header>
        <main>
          <p>chats...</p>
          <div className="border border-red-500">
            <span>+</span>
            <input type="text" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatWindow;
