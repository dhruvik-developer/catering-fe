import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getUsers = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/users/", { params });
    return response;
  } catch {
    toast.error("Error fetching users");
  }
};
