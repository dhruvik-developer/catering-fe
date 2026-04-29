import ApiInstance from "../services/ApiInstance";

const PDF_FORMATTERS_ENDPOINT = "/pdf-formatters/";

export const getPdfFormatters = async (params = {}) => {
  const response = await ApiInstance.get(PDF_FORMATTERS_ENDPOINT, { params });
  return response.data;
};

export const getPdfFormatter = async (id) => {
  const response = await ApiInstance.get(`${PDF_FORMATTERS_ENDPOINT}${id}/`);
  return response.data;
};

export const createPdfFormatter = async (payload) => {
  const response = await ApiInstance.post(PDF_FORMATTERS_ENDPOINT, payload);
  return response.data;
};

export const updatePdfFormatter = async (id, payload) => {
  const response = await ApiInstance.put(
    `${PDF_FORMATTERS_ENDPOINT}${id}/`,
    payload
  );
  return response.data;
};

export const patchPdfFormatter = async (id, payload) => {
  const response = await ApiInstance.patch(
    `${PDF_FORMATTERS_ENDPOINT}${id}/`,
    payload
  );
  return response.data;
};

export const deletePdfFormatter = async (id) => {
  const response = await ApiInstance.delete(`${PDF_FORMATTERS_ENDPOINT}${id}/`);
  return response.data;
};

export const getPdfFormatterHtml = async (id) => {
  const response = await ApiInstance.get(
    `${PDF_FORMATTERS_ENDPOINT}${id}/html/`,
    {
      dedupe: false,
      responseType: "text",
      transformResponse: [(data) => data],
    }
  );
  return response.data;
};
