import { useState } from "react";

import { fetchTargetUser } from "../api/user";
import { createGroupChat } from "../api/chat";

function GroupChat({ onSelectGroupChat }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  //   const [error, setError] = useState("")

  const handleFetchGroupMember = async function () {
    if (!phoneNumber.trim()) return;

    try {
      const userData = await fetchTargetUser(phoneNumber);

      // prevent adding the same member
      if (groupMembers.some((member) => member.id === userData.id)) {
        alert("User is already in the group");
        setPhoneNumber("");
        return;
      }

      setGroupMembers((prev) => [userData, ...prev]);
      setPhoneNumber("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveMember = function (userToRemove) {
    setGroupMembers(
      groupMembers.filter((member) => member.id !== userToRemove.id),
    );
  };

  const handleCreateGroup = async function () {
    // const groupName = formData.get("groupName");
    if (!groupName.trim() || groupMembers.length < 2) {
      alert("Please enter the group name and select atleast 2 members.");
      return;
    }
    try {
      const memberIds = groupMembers.map((member) => member.id);
      await createGroupChat(groupName, memberIds); // we are sending the member ids and group name to the backend
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className=" border border-primary rounded-md px-2 py-4 min-w-[30%] bg-gray-100">
        <form className="flex flex-col gap-2" action={handleCreateGroup}>
          <input
            type="text"
            placeholder="Enter the group name"
            className="border border-gray-400 w-full px-1.5 py-1 bg-white"
            value={groupName}
            name="groupName"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for contacts"
              className="border border-gray-400 w-full px-1.5 py-1 bg-white"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              type="button"
              className="border border-primary font-poppins font-semibold text-primary rounded-md px-1 cursor-pointer hover:bg-primary hover:text-white"
              onClick={handleFetchGroupMember}
            >
              Search
            </button>
          </div>

          {/* it will hold the list of contacts */}
          <ul className="flex flex-col gap-1.5">
            {groupMembers.map((groupMember) => {
              return (
                <li
                  key={groupMember?.id}
                  className="flex justify-between items-center bg-primary-light px-2"
                >
                  <div className="flex gap-3 items-center bg-primary-light py-1">
                    <p className="font-poppins ">{groupMember?.username}</p>
                    <p className="font-poppins ">{groupMember?.phoneNumber}</p>
                  </div>
                  <div
                    onClick={() => handleRemoveMember(groupMember)}
                    className="bg-primary/25"
                  >
                    <p className="font-semibold cursor-pointer hover:text-primary font-poppins px-3">
                      X
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* buttons */}
          <div className="flex gap-2">
            <button className="bg-primary text-white font-poppins py-1.5 w-[60%] m-auto rounded-md cursor-pointer">
              Create Group Chat
            </button>
            <button
              type="button"
              onClick={() => onSelectGroupChat(false)}
              className="bg-primary text-white font-poppins py-1.5 w-[60%] m-auto rounded-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GroupChat;
