import ApiInstance from "../services/ApiInstance";

export const postLogin = async (data) => {
  try {
    const response = await ApiInstance.post("/login/", data);
    if (response.data?.status) {
      return response;
    } else {
      const errorMessage = response.data?.message || "Invalid username or password";
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Invalid username or password";
    throw new Error(errorMessage);
  }
};
