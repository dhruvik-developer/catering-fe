import ApiInstance from "../services/ApiInstance";

// These thin wrappers used to wrap each call in `try { ... } catch (e) { throw e; }`
// which adds nothing — re-throwing the same error is what `await` does already
// when no catch is present. Callers handle the error.

export const assignItemVendor = async (data) => {
  const response = await ApiInstance.post("/event-item-configs/", data);
  return response.data;
};

export const assignIngredientVendor = async (data) => {
  const response = await ApiInstance.post(
    "/ingredient-vendor-assignments/",
    data
  );
  return response.data;
};

export const getIngredientVendorAssignments = async (sessionId) => {
  const response = await ApiInstance.get(
    `/ingredient-vendor-assignments/?session=${sessionId}`
  );
  return response.data;
};

export const getItemVendorAssignments = async (sessionId) => {
  const response = await ApiInstance.get(
    `/event-item-configs/?session=${sessionId}`
  );
  return response.data;
};
