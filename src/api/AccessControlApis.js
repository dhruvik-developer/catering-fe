import ApiInstance from "../services/ApiInstance";

/**
 * Access Control & Permissions APIs
 */

// List of all modules and actions available in the system.
// Served from the same path on both admin and tenant hosts.
export const getPermissionModules = async () => {
    return await ApiInstance.get("/access-control/modules/");
};

// List of Staff and Vendors that can be assigned permissions
export const getPermissionUsers = async (type = "") => {
    const params = type ? { user_type: type } : {};
    return await ApiInstance.get("/access-control/users/", { params });
};

// Fetch permissions for an individual user
export const getUserPermissions = async (userId) => {
    return await ApiInstance.get(`/access-control/users/${userId}/permissions/`);
};

// Update permissions for an individual user
export const updateUserPermissions = async (userId, data) => {
    // data: { allowed_permissions: [], denied_permissions: [] }
    return await ApiInstance.put(`/access-control/users/${userId}/permissions/`, data);
};
