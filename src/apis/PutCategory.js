import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const editCategory = async (categoryId, newName) => {
  try {
    const response = await ApiInstance.put(`/categories/${categoryId}/`, {
      name: newName,
    });
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Category updated successfully!");
      return response;
    } else {
      toast.error("Failed to update category");
      return null;
    }
  } catch (error) {
    console.error("Category Update API Error:", error);
    toast.error("Error updating category");
    return null;
  }
};
