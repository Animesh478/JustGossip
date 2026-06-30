import apiClient from "./axios";

export const sendMessage = async function (message, chatId) {
  try {
    const res = await apiClient.post("/messages", { message, chatId });
    console.log("new message=", res);
    // const newMessage = res.data.data;
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchMessagesForChat = async function (chatId, cursorDate) {
  try {
    const res = await apiClient.get(
      `/messages/${chatId}?cursorDate=${cursorDate}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
