import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import { logError } from "../utils/logger";

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
    logError("Add Rule API Error:", error);
    toast.error("Failed to add rule");
    return null;
  }
};

// Create the first rules row for the tenant. The backend's NoteViewSet
// handles POST on the same /get-note/ path that lists notes.
export const createRule = async (rules) => {
  try {
    const response = await ApiInstance.post(`/get-note/`, rules);
    if (response.data?.status) {
      toast.success(response.data.message || "Rules saved successfully");
      return response;
    } else {
      toast.error(response.data.message || "Failed to save rules");
      return null;
    }
  } catch (error) {
    logError("Create Rule API Error:", error);
    toast.error("Failed to save rules");
    return null;
  }
};
