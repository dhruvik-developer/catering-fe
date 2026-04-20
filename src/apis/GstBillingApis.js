import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import Swal from "sweetalert2";

const formatError = (error) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === "object") {
      let errorMessages = [];
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((msg) => {
            if (typeof msg === "object") {
              Object.entries(msg).forEach(([subKey, subValue]) => {
                errorMessages.push(`<b>${key} -> ${subKey}</b>: ${subValue}`);
              });
            } else {
              errorMessages.push(`<b>${key}</b>: ${msg}`);
            }
          });
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            errorMessages.push(`<b>${key} -> ${subKey}</b>: ${subValue}`);
          });
        } else {
          errorMessages.push(`<b>${key}</b>: ${value}`);
        }
      });
      return errorMessages.join("<br/>");
    }
    return JSON.stringify(data);
  }
  return error.message;
};

const showValidationError = (msg) => {
  Swal.fire({
    icon: "warning",
    title: "Validation Error",
    html: `<div style="text-align: left; font-size: 14px; line-height: 1.5;">${msg}</div>`,
    confirmButtonColor: "#4f46e5",
    customClass: {
      popup: "rounded-xl shadow-2xl",
    },
  });
};

export const getInvoiceSetup = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/invoice-setup/", { params });
    return response;
  } catch (error) {
    console.error("Error fetching invoice setup", error);
    toast.error("Error fetching invoice setup");
    throw error;
  }
};


export const createInvoiceSetup = async (data) => {
  try {
    const response = await ApiInstance.post("/invoice-setup/", data);
    return response;
  } catch (error) {
    const errorMsg = formatError(error);
    showValidationError(errorMsg);
    throw error;
  }
};


export const updateInvoiceSetup = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/invoice-setup/${id}/`, data);
    return response;
  } catch (error) {
    const errorMsg = formatError(error);
    showValidationError(errorMsg);
    throw error;
  }
};

export const deleteInvoiceSetup = async (id) => {
  try {
    const response = await ApiInstance.delete(`/invoice-setup/${id}/`);
    return response;
  } catch (error) {
    console.error("Error deleting invoice setup", error);
    toast.error("Error deleting invoice setup");
    throw error;
  }
};

export const getPartyInformation = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/party-information/", { params });
    return response;
  } catch (error) {
    console.error("Error fetching party information", error);
    toast.error("Error fetching party information");
    throw error;
  }
};

export const createPartyInformation = async (data) => {
  try {
    const response = await ApiInstance.post("/party-information/", data);
    return response;
  } catch (error) {
    const errorMsg = formatError(error);
    showValidationError(errorMsg);
    throw error;
  }
};

export const updatePartyInformation = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/party-information/${id}/`, data);
    return response;
  } catch (error) {
    const errorMsg = formatError(error);
    showValidationError(errorMsg);
    throw error;
  }
};

export const deletePartyInformation = async (id) => {
  try {
    const response = await ApiInstance.delete(`/party-information/${id}/`);
    return response;
  } catch (error) {
    console.error("Error deleting party information", error);
    toast.error("Error deleting party information");
    throw error;
  }
};

export const getGlobalConfig = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/global-config/", { params });
    return response;
  } catch (error) {
    console.error("Error fetching global config", error);
    toast.error("Error fetching global config");
    throw error;
  }
};

export const updateGlobalConfig = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/global-config/${id}/`, data);
    return response;
  } catch (error) {
    const errorMsg = formatError(error);
    showValidationError(errorMsg);
    throw error;
  }
};

export const createBranchBill = async (data) => {
  try {
    const response = await ApiInstance.post("/branch-bills/", data);
    return response;
  } catch (error) {
    const errorMsg = formatError(error);
    showValidationError(errorMsg);
    throw error;
  }
};

export const getBranchBills = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/branch-bills/", { params });
    return response;
  } catch (error) {
    console.error("Error fetching branch bills", error);
    toast.error("Error fetching branch bills");
    throw error;
  }
};

export const updateBranchBill = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/branch-bills/${id}/`, data);
    return response;
  } catch (error) {
    const errorMsg = formatError(error);
    showValidationError(errorMsg);
    throw error;
  }
};
