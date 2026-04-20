import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getRules = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/get-note/", { params });
    return response;
  } catch {
    toast.error("Error fetching rules");
  }
};
