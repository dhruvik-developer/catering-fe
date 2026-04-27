import { useContext, useMemo } from "react";
import { UserContext } from "../context/UserContext";
import {
    hasEnabledModule,
    hasPermissionForCodes,
    normalizeAccessList,
} from "../utils/accessControl";

/**
 * Custom hook to check if the current user has specific permissions.
 * Supports checking for a single permission or multiple permissions (any or all).
 */
export const usePermissions = () => {
    const { permissions, enabledModules } = useContext(UserContext);

    const isSuperUser = useMemo(() => {
        return normalizeAccessList(permissions).includes('*');
    }, [permissions]);

    /**
     * Check if user has a specific permission code.
     * @param {string|string[]} codes - Single code or array of codes to check.
     * @param {string} mode - 'any' (default) or 'all'.
     * @returns {boolean}
     */
    const hasPermission = (codes, mode = 'any') => {
        return hasPermissionForCodes(permissions, enabledModules, codes, mode);
    };

    const isModuleEnabled = (moduleName) => {
        return hasEnabledModule(enabledModules, moduleName);
    };

    return {
        permissions,
        enabledModules,
        isSuperUser,
        hasPermission,
        isModuleEnabled
    };
};

export default usePermissions;
