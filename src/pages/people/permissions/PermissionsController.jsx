import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { logError } from "../../../utils/logger";
import { 
    getPermissionModules, 
    getPermissionUsers, 
    getUserPermissions, 
    updateUserPermissions
} from "../../../api/AccessControlApis";
import { getCollectionResponse } from "../../../utils/apiResponse";
import { mergePermissionModules } from "../../../config/permissionModules";
import PermissionsComponent from "./PermissionsComponent";

const normalizePermissionsFromResponse = (payload = {}) => {
    const normalizeList = (arr = []) =>
        [...new Set(
            arr
                .map((item) => {
                    if (typeof item === "string") return item;
                    if (item && typeof item === "object") {
                        return item.code || item.permission_code || item.permission || null;
                    }
                    return null;
                })
                .filter(Boolean)
        )];

    const directPermissions = Array.isArray(payload?.direct_permissions)
        ? payload.direct_permissions
        : [];
    const allowedFromDirect = directPermissions
        .filter((perm) => {
            if (typeof perm === "string") return true;
            return Boolean(perm?.is_allowed);
        });

    const directCodes = normalizeList(allowedFromDirect);
    if (directCodes.length > 0) {
        return directCodes;
    }

    if (Array.isArray(payload?.allowed_permissions)) {
        return normalizeList(payload.allowed_permissions);
    }

    if (Array.isArray(payload?.effective_permissions)) {
        return normalizeList(payload.effective_permissions);
    }

    if (Array.isArray(payload?.permission_codes)) {
        return normalizeList(payload.permission_codes);
    }

    return [];
};

function PermissionsController() {
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState("staff"); // 'staff' or 'vendor'
    const [currentPermissions, setCurrentPermissions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [modulesResult, staffResult] = await Promise.allSettled([
            getPermissionModules(),
            getPermissionUsers("staff")
        ]);

        if (modulesResult.status === "fulfilled") {
            setModules(mergePermissionModules(getCollectionResponse(modulesResult.value)));
        } else {
            console.error("Error fetching permission modules:", modulesResult.reason);
            setModules(mergePermissionModules());
            toast.error("Using local permission modules");
        }

        if (staffResult.status === "fulfilled") {
            setUsers(getCollectionResponse(staffResult.value));
        } else {
            console.error("Error fetching permission users:", staffResult.reason);
            setUsers([]);
            toast.error("Failed to load staff list");
        }

        setLoading(false);
    };

    const handleTypeChange = async (type) => {
        setSelectedType(type);
        setSelectedId(null);
        setCurrentPermissions([]);

        setLoading(true);
        try {
            const res = await getPermissionUsers(type);
            setUsers(getCollectionResponse(res));
        } catch (error) {
            logError(`Error fetching ${type} permission users:`, error);
            toast.error(`Failed to load ${type} list`);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSubject = async (id) => {
        setSelectedId(id);
        setLoading(true);
        try {
            const res = await getUserPermissions(id);
            const normalizedPermissions = normalizePermissionsFromResponse(
                res?.data?.data || res?.data || {}
            );
            setCurrentPermissions(normalizedPermissions);
        } catch (error) {
            logError("Error fetching selected user permissions:", error);
            toast.error("Failed to fetch permissions for selection");
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (code) => {
        setCurrentPermissions(prev => 
            prev.includes(code) 
                ? prev.filter(c => c !== code) 
                : [...prev, code]
        );
    };

    const handleSave = async () => {
        if (!selectedId) return;
        setIsSaving(true);
        try {
            await updateUserPermissions(selectedId, {
                allowed_permissions: currentPermissions,
                denied_permissions: [] // Reset denied for now or handle separately
            });
            toast.success("Permissions updated successfully");
        } catch (error) {
            logError("Error updating permissions:", error);
            toast.error("Failed to update permissions");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <PermissionsComponent
            loading={loading}
            isSaving={isSaving}
            modules={modules}
            users={users} selectedType={selectedType} selectedId={selectedId}
            currentPermissions={currentPermissions}
            onTypeChange={handleTypeChange}
            onSelectSubject={handleSelectSubject}
            togglePermission={togglePermission}
            onSave={handleSave}
        />
    );
}

export default PermissionsController;
