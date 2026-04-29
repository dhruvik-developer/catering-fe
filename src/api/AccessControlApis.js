import ApiInstance from "../services/ApiInstance";
import { isPlatformAdminHost } from "../services/tenantRuntime";

/**
 * Access Control & Permissions APIs
 */

// List of all modules and actions available in the system.
// Admin host exposes this catalog at /api/permission-modules/ (public schema),
// tenant hosts expose it under /api/access-control/modules/. We try the
// host-appropriate path first and fall back to the other on a 404 so this
// keeps working if the backend ever consolidates the routes.
export const getPermissionModules = async () => {
    const adminPath = "/permission-modules/";
    const tenantPath = "/access-control/modules/";
    const [primary, fallback] = isPlatformAdminHost()
        ? [adminPath, tenantPath]
        : [tenantPath, adminPath];

    try {
        return await ApiInstance.get(primary);
    } catch (error) {
        if (error?.response?.status === 404) {
            return ApiInstance.get(fallback);
        }
        throw error;
    }
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
