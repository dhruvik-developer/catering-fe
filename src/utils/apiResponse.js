export function getResponsePayload(response) {
  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }

  return response ?? null;
}

export function getResponseData(response) {
  const payload = getResponsePayload(response);

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload
  ) {
    return payload.data;
  }

  return payload;
}

export function getCollectionResponse(response) {
  const data = getResponseData(response);
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

export function getEntityResponse(response) {
  const data = getResponseData(response);
  return data && typeof data === "object" && !Array.isArray(data) ? data : null;
}

export function getApiMessage(source, fallbackMessage = "Request failed") {
  const payload = getResponsePayload(source);

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.detail === "string" && payload.detail.trim()) {
      return payload.detail;
    }

    if (Array.isArray(payload.detail) && payload.detail[0]) {
      return payload.detail[0];
    }

    if (Array.isArray(payload.non_field_errors) && payload.non_field_errors[0]) {
      return payload.non_field_errors[0];
    }

    const [firstKey] = Object.keys(payload);
    if (firstKey) {
      const firstValue = payload[firstKey];

      if (Array.isArray(firstValue) && firstValue[0]) {
        return firstValue[0];
      }

      if (typeof firstValue === "string" && firstValue.trim()) {
        return firstValue;
      }
    }
  }

  if (source instanceof Error && source.message) {
    return source.message;
  }

  return fallbackMessage;
}

export function isSuccessfulResponse(response) {
  const payload = getResponsePayload(response);

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    typeof payload.status === "boolean"
  ) {
    return payload.status;
  }

  const statusCode = response?.status;
  return typeof statusCode === "number"
    ? statusCode >= 200 && statusCode < 300
    : Boolean(payload);
}

export function ensureSuccessfulResponse(
  response,
  fallbackMessage = "Request failed"
) {
  if (isSuccessfulResponse(response)) {
    return response;
  }

  throw new Error(getApiMessage(response, fallbackMessage));
}

export function getApiErrorMessage(error, fallbackMessage) {
  return getApiMessage(error?.response ?? error, fallbackMessage);
}
