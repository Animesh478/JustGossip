import apiClient from "./axios";

export const fetchChatHistory = async function () {
  try {
    const res = await apiClient.get("/chats/all-chats");
    // console.log("chat.js, fetchChatHistory=", res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const accessOrCreateChat = async function (targetUserId) {
  try {
    const res = await apiClient.post("/chats/access", { targetUserId });
    // console.log("chat.js, /chats/access res = ", res);
    // returns the chat object with chatID and Users
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createGroupChat = async function (groupName, memberIds) {
  try {
    const res = await apiClient.post("/chats/groupChat", {
      groupName,
      memberIds,
    });
    // console.log("chat.js group chat data=", res);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
