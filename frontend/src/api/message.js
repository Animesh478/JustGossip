import apiClient from "./axios";

export const sendMessage = async function (message, chatId) {
  try {
    const res = await apiClient.post("/messages", { message, chatId });
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

export const sendMediaFile = async function (formData) {
  try {
    const result = await apiClient.post(`/messages/media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
