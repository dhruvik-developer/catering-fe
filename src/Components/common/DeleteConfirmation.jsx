import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { executeConfirmationRequest } from "../../api/requestActions";
import { queryClient } from "../../lib/queryClient";

const QUERY_KEY_BY_ENDPOINT = {
  "/categories": ["categories"],
  "/items": ["categories"],
  "/vendors": ["vendors"],
  "/recipes": ["recipes"],
};

const DeleteConfirmation = async ({
  id,
  apiEndpoint,
  name,
  successMessage,
  onSuccess,
  method = "DELETE",
  payload = {},
}) => {
  const result = await Swal.fire({
    title: `Are you sure you want to delete this ${name}?`,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#c2272d",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const response = await executeConfirmationRequest({
        apiEndpoint,
        id,
        method,
        payload,
      });

      if (response.data.status) {
        toast.success(successMessage);
        const queryKey = QUERY_KEY_BY_ENDPOINT[apiEndpoint];
        if (queryKey) {
          queryClient.invalidateQueries({ queryKey });
        }
        if (onSuccess) onSuccess();
      } else {
        toast.error(`Failed to delete ${name}`);
      }
    } catch (error) {
      toast.error(`Error deleting ${name}`);
      console.error("Delete API Error:", error);
    }
  }
};

export default DeleteConfirmation;
