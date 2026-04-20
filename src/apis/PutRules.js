import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const updateRule = async (id, rules) => {
  try {
    const response = await ApiInstance.put(`/update-note/${id}/`, rules);
    if (response.data?.status) {
      toast.success(response.data.message);
      return response;
    } else {
      toast.error(response.data.message || "Failed to add rule");
      return null;
    }
  } catch (error) {
    console.error("Add Rule API Error:", error);
    toast.error("Failed to add rule");
    return null;
  }
};
