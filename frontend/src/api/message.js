import apiClient from "./axios";

export const sendMessage = async function (message) {
  try {
    const res = await apiClient.post("/chats/messages", { message });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
