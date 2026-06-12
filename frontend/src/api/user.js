import apiClient from "./axios";

export const fetchTargetUser = async function (phoneNumber) {
  if (phoneNumber.length < 10) return;
  try {
    const res = await apiClient.post("/user", { phoneNumber });
    console.log(res);
    return res.data.user;
  } catch (error) {
    console.error(error.message);
  }
};

export const fetchCurrentUser = async function () {
  try {
    const res = await apiClient.get("/user-auth/me");
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
