import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
    getPermissionModules, 
    getPermissionUsers, 
    getUserPermissions, 
    updateUserPermissions
} from "../../../api/AccessControlApis";
import { getCollectionResponse } from "../../../utils/apiResponse";
import PermissionsComponent from "./PermissionsComponent";

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
        try {
            const [modulesRes, staffRes] = await Promise.all([
                getPermissionModules(),
                getPermissionUsers("staff")
            ]);

            setModules(getCollectionResponse(modulesRes));
            setUsers(getCollectionResponse(staffRes));
        } catch (error) {
            console.error("Error fetching permission data:", error);
            toast.error("Failed to load permission management data");
        } finally {
            setLoading(false);
        }
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
            // User API returns { allowed_permissions: [], denied_permissions: [] }
            // For simplicity, we'll focus on allowed_permissions in this UI
            setCurrentPermissions(res.data?.data?.allowed_permissions || []);
        } catch (error) {
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
            users={users}
            selectedType={selectedType}
            selectedId={selectedId}
            currentPermissions={currentPermissions}
            onTypeChange={handleTypeChange}
            onSelectSubject={handleSelectSubject}
            togglePermission={togglePermission}
            onSave={handleSave}
        />
    );
}

export default PermissionsController;
