import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { executeConfirmationRequest } from "../../api/requestActions";
import { queryClient } from "../../lib/queryClient";
import i18n from "../../i18n";
import { logError } from "../../utils/logger";

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
  executeRequest,
}) => {
  const itemName = name || i18n.t("common.item");
  const result = await Swal.fire({
    title: i18n.t("confirmDelete.title", { name: itemName }),
    text: i18n.t("confirmDelete.text"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#c2272d",
    cancelButtonColor: "#3085d6",
    confirmButtonText: i18n.t("confirmDelete.confirm"),
    cancelButtonText: i18n.t("common.cancel"),
  });

  if (result.isConfirmed) {
    try {
      const finalResponse = executeRequest
        ? await executeRequest({ apiEndpoint, id, method, payload })
        : await executeConfirmationRequest({
            apiEndpoint,
            id,
            method,
            payload,
          });

      if (finalResponse.data.status) {
        toast.success(successMessage);
        const queryKey = QUERY_KEY_BY_ENDPOINT[apiEndpoint];
        if (queryKey) {
          queryClient.invalidateQueries({ queryKey });
        }
        if (onSuccess) onSuccess();
      } else {
        toast.error(i18n.t("confirmDelete.failed", { name: itemName }));
      }
    } catch (error) {
      toast.error(i18n.t("confirmDelete.error", { name: itemName }));
      logError("Delete API Error:", error);
    }
  }
};

export default DeleteConfirmation;
