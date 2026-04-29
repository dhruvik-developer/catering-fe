import ApiInstance from "../services/ApiInstance";

export const executeConfirmationRequest = async ({
  apiEndpoint,
  id,
  method = "DELETE",
  payload = {},
}) => {
  const requestUrl = `${apiEndpoint}/${id}/`;
  const normalizedMethod = method.toUpperCase();

  if (normalizedMethod === "DELETE") {
    return ApiInstance.delete(requestUrl);
  }

  if (normalizedMethod === "POST") {
    return ApiInstance.post(requestUrl, payload);
  }

  if (normalizedMethod === "PUT") {
    return ApiInstance.put(requestUrl, payload);
  }

  if (normalizedMethod === "PATCH") {
    return ApiInstance.patch(requestUrl, payload);
  }

  throw new Error(`Unsupported confirmation request method: ${method}`);
};
