import apiClient from "./axios";

export const sendMessage = async function (message) {
  try {
    const res = await apiClient.post("/chats/messages", { message });
    // console.log("res=", res);
    const newMessage = res.data.data;
    return newMessage;
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async function () {
  try {
    const res = await apiClient.get("/chats/messages");
    const messages = res.data.messages;
    return messages;
  } catch (error) {
    console.log(error);
  }
};
