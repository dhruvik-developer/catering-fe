import ApiInstance from "../services/ApiInstance";

/**
 * Access Control & Permissions APIs
 */

// List of all modules and actions available in the system
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

// Fetch permissions for an entire staff role
export const getRolePermissions = async (roleId) => {
    return await ApiInstance.get(`/access-control/staff-roles/${roleId}/permissions/`);
};

// Update permissions for an entire staff role
export const updateRolePermissions = async (roleId, data) => {
    // data: { permission_codes: [] }
    return await ApiInstance.put(`/api/access-control/staff-roles/${roleId}/permissions/`, data);
};

// Check logged-in user's permissions
export const getMyPermissions = async () => {
    return await ApiInstance.get("/api/me/permissions/");
};
