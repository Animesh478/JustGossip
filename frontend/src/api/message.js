import apiClient from "./axios";

export const sendMessage = async function (message) {
  try {
    const res = await apiClient.post("/messages", { message });
    // console.log("res=", res);
    const newMessage = res.data.data;
    return newMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// this function is not needed anymore
// export const getMessage = async function () {
//   try {
//     const res = await apiClient.get("/messages");
//     const messages = res.data.messages;
//     return messages;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export const fetchMessagesForChat = async function (chatId) {
  try {
    const res = await apiClient.get(`/messages/${chatId}`);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
