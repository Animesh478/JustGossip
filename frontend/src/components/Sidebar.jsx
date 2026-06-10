import { useState } from "react";
import { fetchUser } from "../api/user";
import { accessOrCreateChat } from "../api/chat";

function Sidebar({ onSelectUser }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showModal, setShowModal] = useState(true); // for the contact modal

  const handleFetchTargetUser = async function (e) {
    e.preventDefault();

    if (!phoneNumber.trim()) return;

    const data = await fetchUser(phoneNumber);
    // data = {id: "", username: "", phoneNumber: "+91"}
    setShowModal(true);
    setSearchResult(data);
  };

  const handleSelectUser = async function () {
    try {
      // send the target user's ID to the backend to get/create the chat
      const chatData = await accessOrCreateChat(searchResult.id);
      console.log("chat data=", chatData);
      onSelectUser(chatData);
      setPhoneNumber("");
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-1/3  flex flex-col gap-3 px-4 py-2">
      {/* Header */}
      <div className="font-semibold font-poppins text-primary text-2xl  ">
        JustGossip
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

        <form className="w-full flex" onSubmit={handleFetchTargetUser}>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full focus:outline-none"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button
            type="submit"
            className="cursor-pointer hover:text-primary font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Result */}
      {searchResult && showModal && (
        <div
          onClick={handleSelectUser}
          className="rounded-lg shadow-md shadow-primary cursor-pointer px-3 flex"
        >
          <div>
            <img src="" alt="" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{searchResult.username}</h3>
            <p className="text-gray-500 font-medium text-sm">
              {searchResult.phoneNumber}
            </p>
          </div>
        </div>
      )}

      {/* Chat list */}
      <ul>
        {[1, 2, 3, 4].map((chat) => {
          return (
            <li
              key={chat}
              className="flex hover:bg-primary-light hover:rounded-xl cursor-pointer px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

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
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
