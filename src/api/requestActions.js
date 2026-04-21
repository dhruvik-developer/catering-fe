import ApiInstance from "../services/ApiInstance";

export const executeConfirmationRequest = async ({
  apiEndpoint,
  id,
  method = "DELETE",
  payload = {},
}) => {
  const requestUrl = `${apiEndpoint}/${id}/`;

  if (method === "DELETE") {
    return ApiInstance.delete(requestUrl);
  }

  if (method === "POST") {
    return ApiInstance.post(requestUrl, payload);
  }

  throw new Error(`Unsupported confirmation request method: ${method}`);
};
