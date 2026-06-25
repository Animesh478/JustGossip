import apiClient from "./axios";

export const fetchSmartReplies = async function (history, tone) {
  try {
    const res = await apiClient.post("/aiChats/smartReplies", {
      chatHistory: history,
      tone,
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPredictions = async function (draft, tone) {
  try {
    const res = await apiClient.post("/aiChats/predictiveText", {
      draft,
      tone,
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
