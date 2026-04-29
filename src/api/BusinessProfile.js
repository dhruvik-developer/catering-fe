import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import { isPlatformAdminHost } from "../services/tenantRuntime";

let businessProfilesInFlightRequest = null;
let businessProfilesCache = null;

const EMPTY_PROFILES_RESPONSE = { status: true, data: [] };

const toMultipartFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  return formData;
};

export const createBusinessProfile = async (payload) => {
  try {
    const response = await ApiInstance.post(
      "/business-profiles/",
      toMultipartFormData(payload)
    );
    businessProfilesCache = null;
    return response.data;
  } catch (error) {
    toast.error("Error creating business profile");
    console.error("API Error:", error);
  }
};

export const updateBusinessProfile = async (id, payload) => {
  try {
    const response = await ApiInstance.put(
      `/business-profiles/${id}/`,
      toMultipartFormData(payload)
    );
    businessProfilesCache = null;
    return response.data;
  } catch (error) {
    toast.error("Error updating business profile");
    console.error("API Error:", error);
  }
};

export const getAllBusinessProfiles = async () => {
  // Business profiles are tenant-scoped; the platform admin schema doesn't
  // expose this endpoint, so skip the network call entirely on admin.* hosts.
  if (isPlatformAdminHost()) {
    return EMPTY_PROFILES_RESPONSE;
  }

  if (businessProfilesCache) {
    return businessProfilesCache;
  }

  if (businessProfilesInFlightRequest) {
    return businessProfilesInFlightRequest;
  }

  try {
    businessProfilesInFlightRequest = ApiInstance.get("/business-profiles/")
      .then((response) => {
        businessProfilesCache = response.data;
        return response.data;
      })
      .catch((error) => {
        // Suppress error toast here as it might be empty on first load.
        console.error("API Error:", error);
        return { status: false, data: [] };
      })
      .finally(() => {
        businessProfilesInFlightRequest = null;
      });

    return await businessProfilesInFlightRequest;
  } catch (error) {
    // Suppress error toast here as it might be empty on first load.
    console.error("API Error:", error);
    return { status: false, data: [] };
  }
};
