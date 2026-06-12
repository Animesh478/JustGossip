import apiClient from "./axios";

export const fetchChatHistory = async function () {
  try {
    const res = await apiClient.get("/chats/all-chats");
    console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const accessOrCreateChat = async function (targetUserId) {
  try {
    const res = await apiClient.post("/chats/access", { targetUserId });
    console.log(res);
    // returns the chat object with chatID and Users
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
