function Sidebar() {
  return (
    <aside className="w-1/3  flex flex-col gap-3 px-4 py-2">
      {/* Header */}
      <div className="font-semibold font-poppins text-primary text-2xl  ">
        Chats
      </div>

      {/* Search */}
      <div className="flex gap-2 border-2 border-stone-500 rounded-xl px-4 py-2 focus-within:border-secondary focus-within:border-2 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <form className="w-full">
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full focus:outline-none"
          />
        </form>
      </div>

      {/* Chat list */}
      <ul>
        {[1, 2, 3, 4].map((chat) => {
          return (
            <li
              key={chat}
              className="flex hover:bg-primary-light hover:rounded-xl cursor-pointer px-3 py-2"
            >
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <h3 className="font-semibold font-poppins text-primary">
                  Jon Doe
                </h3>
                <p className="font-roboto text-sm text-secondary">
                  Last message ...
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
