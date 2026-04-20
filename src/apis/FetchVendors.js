import ApiInstance from "../services/ApiInstance";
import toast from "react-hot-toast";

export const fetchVendors = async () => {
  try {
    const response = await ApiInstance.get("/vendors/");
    return response.data;
  } catch (error) {
    toast.error("Error fetching vendors");
    console.error("Error fetching vendors:", error);
    return null;
  }
};
