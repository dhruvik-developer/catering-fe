import { FiUser, FiShield, FiCheckCircle, FiChevronDown, FiChevronRight, FiUsers } from "react-icons/fi";
import { useState } from "react";

function PermissionsComponent({
    loading,
    isSaving,
    modules,
    users,
    selectedType,
    selectedId,
    currentPermissions,
    onTypeChange,
    onSelectSubject,
    togglePermission,
    onSave
}) {
    const [expandedModule, setExpandedModule] = useState(null);

    const subjects = users;

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] gap-6 lg:flex-row">
            {/* Left Sidebar: Type & List */}
            <div className="w-full lg:w-80 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex p-1 bg-white border border-gray-100 rounded-xl">
                        {["staff", "vendor"].map((type) => (
                            <button
                                key={type}
                                onClick={() => onTypeChange(type)}
                                className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                                    selectedType === type 
                                    ? 'bg-[var(--color-primary)] text-white shadow-md' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {subjects.length === 0 && !loading && (
                        <div className="text-center py-10 text-gray-400">
                            <FiUsers className="mx-auto mb-2 opacity-20" size={32} />
                            <p className="text-xs">No {selectedType}s found</p>
                        </div>
                    )}
                    
                    {subjects.map((sub) => (
                        <button
                            key={sub.id}
                            onClick={() => onSelectSubject(sub.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                selectedId === sub.id
                                ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary)]/20 border'
                                : 'hover:bg-gray-50 border-transparent border'
                            }`}
                        >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                selectedId === sub.id ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                                <FiUser size={18} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className={`text-sm font-bold truncate ${selectedId === sub.id ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>
                                    {sub.name || sub.username || "Unnamed"}
                                </p>
                                {sub.phone && <p className="text-[10px] text-gray-400 truncate">{sub.phone}</p>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Area: Permissions Grid */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                {!selectedId ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
                        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FiShield size={40} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Select a {selectedType} to manage permissions</p>
                    </div>
                ) : (
                    <>
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Assign Permissions</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Control what this {selectedType} can see and do.</p>
                            </div>
                            <button
                                onClick={onSave}
                                disabled={isSaving || loading}
                                className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : <FiCheckCircle />}
                                Save Changes
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-50 rounded-2xl w-full" />)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {modules.map((mod) => (
                                        <div key={mod.name} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-[var(--color-primary)]/30 transition-all">
                                            <button
                                                onClick={() => setExpandedModule(expandedModule === mod.name ? null : mod.name)}
                                                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm border border-gray-50">
                                                        <FiLock size={16} />
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-700">{mod.name}</span>
                                                </div>
                                                {expandedModule === mod.name ? <FiChevronDown size={18} className="text-gray-400" /> : <FiChevronRight size={18} className="text-gray-400" />}
                                            </button>

                                            {(expandedModule === mod.name || true) && (
                                                <div className="p-4 bg-white grid grid-cols-1 gap-2">
                                                    {mod.permissions.map((perm) => (
                                                        <label
                                                            key={perm.code}
                                                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                                                currentPermissions.includes(perm.code)
                                                                ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                                                : 'bg-white border-gray-50 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold truncate max-w-[150px]">{perm.name}</span>
                                                                <span className="text-[9px] opacity-60 uppercase tracking-wider">{perm.code}</span>
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                checked={currentPermissions.includes(perm.code)}
                                                                onChange={() => togglePermission(perm.code)}
                                                                className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                                            />
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Re-using icon for layout
const FiLock = ({ size }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default PermissionsComponent;
