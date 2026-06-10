import apiClient from "./axios";

export const fetchUser = async function (phoneNumber) {
  if (phoneNumber.length < 10) return;
  try {
    const res = await apiClient.post("/user", { phoneNumber });
    console.log(res);
    return res.data.user;
  } catch (error) {
    console.error(error.message);
  }
};
