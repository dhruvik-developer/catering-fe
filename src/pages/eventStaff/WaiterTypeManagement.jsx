import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiX, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { logError } from "../../utils/logger";
import {
  getWaiterTypes,
  createWaiterType,
  updateWaiterType,
  deleteWaiterType,
} from "../../api/EventStaffApis";
import Loader from "../../Components/common/Loader";
import PageHero from "../../Components/common/PageHero";

const waitersFromApi = async (setWaiterTypes, setLoading) => {
  setLoading(true);
  try {
    const r = await getWaiterTypes();
    const data = r?.data?.data ?? r?.data;
    if (Array.isArray(data)) {
      setWaiterTypes(data);
    } else {
      setWaiterTypes([]);
      toast.error("Failed to fetch waiter types");
    }
  } catch (err) {
    setWaiterTypes([]);
    toast.error("Error fetching waiter types");
    logError(err);
  } finally {
    setLoading(false);
  }
};

const WaiterTypeManagement = () => {
  const [waiterTypes, setWaiterTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newType, setNewType] = useState({ name: "", per_person_rate: "", description: "", is_active: true });
  const [editMode, setEditMode] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    waitersFromApi(setWaiterTypes, setLoading);
  }, []);

  const onAdd = async () => {
    if (!newType.name.trim()) {
      toast.error("Waiter type name is required");
      return;
    }
    if (newType.per_person_rate === "" || isNaN(Number(newType.per_person_rate))) {
      toast.error("Valid per person rate is required");
      return;
    }

    try {
      await createWaiterType({
        name: newType.name.trim(),
        description: newType.description || "",
        per_person_rate: Number(newType.per_person_rate),
        is_active: newType.is_active,
      });
      toast.success("Waiter type created successfully");
      setNewType({ name: "", per_person_rate: "", description: "", is_active: true });
      setIsAddModalOpen(false);
      waitersFromApi(setWaiterTypes, setLoading);
    } catch (error) {
      logError(error);
      toast.error("Failed to add waiter type");
    }
  };

  const onUpdate = async (type) => {
    if (!type.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (type.per_person_rate === "" || isNaN(Number(type.per_person_rate))) {
      toast.error("Valid per person rate is required");
      return;
    }

    try {
      await updateWaiterType(type.id, {
        name: type.name.trim(),
        description: type.description || "",
        per_person_rate: Number(type.per_person_rate),
        is_active: type.is_active === undefined ? true : type.is_active,
      });
      toast.success("Waiter type updated successfully");
      setEditMode((prev) => ({ ...prev, [type.id]: false }));
      waitersFromApi(setWaiterTypes, setLoading);
    } catch (error) {
      logError(error);
      toast.error("Failed to update waiter type");
    }
  };

  const onDelete = async (type) => {
    import("sweetalert2").then(({ default: Swal }) => {
      Swal.fire({
        title: "Delete Waiter Type?",
        text: `Are you sure you want to delete '${type.name}'?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "var(--color-primary)",
        confirmButtonText: "Yes, delete it",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg px-4 py-2 text-sm font-semibold",
          cancelButton: "rounded-lg px-4 py-2 text-sm font-semibold",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteWaiterType(type.id);
            toast.success("Waiter type deleted successfully");
            waitersFromApi(setWaiterTypes, setLoading);
          } catch (error) {
            logError(error);
            toast.error("Failed to delete waiter type");
          }
        }
      });
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <PageHero
        icon={<FiUsers size={24} />}
        eyebrow="Service team"
        title="Waiter Types"
        subtitle="Manage waiter categories and their per-person pricing for events."
        actions={
          <button
            className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 hover:bg-white/25 px-5 py-2.5 text-white font-semibold transition-all cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus size={18} />
            Add Waiter Type
          </button>
        }
      />

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 py-4 flex items-center justify-between text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FiPlus size={18} /> Add New Waiter Type
              </h3>
              <button
                className="text-white/70 hover:text-white transition-colors cursor-pointer p-1"
                onClick={() => setIsAddModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={newType.name}
                  onChange={(e) => setNewType((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border-gray-300 border focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 p-3 transition-all text-sm font-medium"
                  placeholder="e.g. Captain, Server, Bartender"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <input
                  value={newType.description}
                  onChange={(e) => setNewType((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-xl border-gray-300 border focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 p-3 transition-all text-sm"
                  placeholder="Brief description of responsibilities (optional)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Per Person Rate (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="number"
                    value={newType.per_person_rate}
                    onChange={(e) => setNewType((p) => ({ ...p, per_person_rate: e.target.value }))}
                    className="w-full rounded-xl border-gray-300 border focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 p-3 pl-9 transition-all text-sm font-bold text-gray-700"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={newType.is_active}
                      onChange={(e) => setNewType((p) => ({ ...p, is_active: e.target.checked }))}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)] transition-all"
                    />
                    <FiCheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-700 block">Status Active</span>
                    <span className="text-[10px] text-gray-500">Available for selection in event planning</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white hover:brightness-95 shadow-md shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98] cursor-pointer"
                onClick={onAdd}
              >
                Save Waiter Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lists */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12">
            <Loader message="Loading Waiter Types..." />
          </div>
        ) : waiterTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="p-4 bg-[var(--color-primary-soft)] rounded-full mb-4">
              <FiUsers size={32} className="text-[var(--color-primary-text)]" />
            </div>
            <p className="text-lg font-semibold text-gray-600">No Waiter Types Found</p>
            <p className="text-sm mt-1">Add your first waiter type to start managing event staff.</p>
            <button
              className="mt-6 text-[var(--color-primary)] font-semibold text-sm hover:underline cursor-pointer"
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add Waiter Type Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[25%]">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%] hidden md:table-cell">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">Rate (₹)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {waiterTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50/50 transition-colors group">
                    {editMode[type.id] ? (
                      /* EDIT MODE ROW */
                      <td colSpan={5} className="px-4 py-3 bg-[var(--color-primary-tint)]">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <div className="md:col-span-3">
                            <input
                              type="text"
                              className="w-full p-2.5 border-2 border-[var(--color-primary)]/30 rounded-lg text-sm font-semibold focus:outline-none focus:border-[var(--color-primary)]"
                              placeholder="Name"
                              value={type.name}
                              onChange={(e) =>
                                setWaiterTypes((prev) =>
                                  prev.map((item) =>
                                    item.id === type.id ? { ...item, name: e.target.value } : item
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-4">
                            <input
                              type="text"
                              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                              placeholder="Description"
                              value={type.description || ""}
                              onChange={(e) =>
                                setWaiterTypes((prev) =>
                                  prev.map((item) =>
                                    item.id === type.id ? { ...item, description: e.target.value } : item
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                              <input
                                type="number"
                                className="w-full p-2.5 pl-7 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
                                placeholder="Rate"
                                value={type.per_person_rate}
                                onChange={(e) =>
                                  setWaiterTypes((prev) =>
                                    prev.map((item) =>
                                      item.id === type.id ? { ...item, per_person_rate: e.target.value } : item
                                    )
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="md:col-span-1 flex items-center justify-center">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!!type.is_active}
                                onChange={(e) =>
                                  setWaiterTypes((prev) =>
                                    prev.map((item) =>
                                      item.id === type.id ? { ...item, is_active: e.target.checked } : item
                                    )
                                  )
                                }
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary)] relative"></div>
                            </label>
                          </div>
                          <div className="md:col-span-2 flex items-center justify-end gap-2">
                            <button
                              className="flex-1 flex items-center justify-center gap-1 bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg text-xs font-bold hover:brightness-95 transition-colors"
                              onClick={() => onUpdate(type)}
                            >
                              <FiCheckCircle size={14} /> Save
                            </button>
                            <button
                              className="flex items-center justify-center bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                              onClick={() => setEditMode((prev) => ({ ...prev, [type.id]: false }))}
                              title="Cancel"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      /* VIEW MODE ROW */
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xs flex-shrink-0">
                              {type.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{type.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">
                          {type.description ? (
                            <span className="truncate block max-w-xs">{type.description}</span>
                          ) : (
                            <span className="italic text-gray-400">No description</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-sm font-bold text-gray-700 font-mono">
                            ₹{Number(type.per_person_rate).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {type.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--color-primary-tint)] text-[var(--color-primary)] border border-[var(--color-primary-border)]/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-tint)]" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              className="p-2 bg-[var(--color-primary-tint)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-text)] rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                              onClick={() => setEditMode((prev) => ({ ...prev, [type.id]: true }))}
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                              onClick={() => onDelete(type)}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          {/* Fallback for touch devices (always visible icons on small screens if you want, but row is hover based) */}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterTypeManagement;

