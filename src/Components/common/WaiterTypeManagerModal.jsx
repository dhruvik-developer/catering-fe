import { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  createWaiterType,
  updateWaiterType,
  deleteWaiterType,
} from "../../api/EventStaffApis";

export default function WaiterTypeManagerModal({
  isOpen,
  onClose,
  waiterTypes,
  onUpdated,
}) {
  const [localTypes, setLocalTypes] = useState([]);

  useEffect(() => {
    setLocalTypes(
      (waiterTypes || []).map((item) => ({
        ...item,
        editName: item.name,
        editRate: item.per_person_rate?.toString() || "0",
      }))
    );
  }, [waiterTypes]);

  if (!isOpen) return null;

  const handleCreateRow = () => {
    setLocalTypes((prev) => [
      ...prev,
      {
        id: null,
        name: "",
        per_person_rate: "0",
        editName: "",
        editRate: "0",
        isNew: true,
      },
    ]);
  };

  const handleUpdateLocal = (idx, field, value) => {
    setLocalTypes((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], [field]: value };
      return clone;
    });
  };

  const saveType = async (type) => {
    if (!type.editName.trim()) {
      toast.error("Waiter type name is required");
      return;
    }

    if (!type.editRate || isNaN(Number(type.editRate))) {
      toast.error("Rate must be a number");
      return;
    }

    const payload = {
      name: type.editName.trim(),
      per_person_rate: Number(type.editRate),
      description: type.description || "",
      is_active: type.is_active ?? true,
    };

    try {
      if (type.id) {
        await updateWaiterType(type.id, payload);
        toast.success("Waiter type updated");
      } else {
        await createWaiterType(payload);
        toast.success("Waiter type created");
      }
      onUpdated?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save waiter type");
    }
  };

  const removeType = async (type) => {
    if (!type.id) {
      setLocalTypes((prev) => prev.filter((item) => item !== type));
      return;
    }

    try {
      await deleteWaiterType(type.id);
      toast.success("Waiter type deleted");
      onUpdated?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete waiter type");
    }
  };

  const localRendered = localTypes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-lg font-bold text-gray-800">Manage Waiter Types</h3>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-5 space-y-3 overflow-y-auto max-h-[60vh]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-600">Add/Update/Delete waiter type list used in waiter service selectors</p>
            <button
              type="button"
              onClick={handleCreateRow}
              className="inline-flex items-center gap-1 rounded-lg bg-[#845cbd] px-3 py-1.5 text-white hover:bg-[#6a3faf]"
            >
              <FiPlus size={14} /> New Type
            </button>
          </div>

          {localRendered.length === 0 && (
            <p className="text-sm text-gray-400">No waiter types found yet.</p>
          )}

          <div className="space-y-2">
            {localRendered.map((type, idx) => (
              <div key={`${type.id ?? "new"}-${idx}`} className="grid grid-cols-12 gap-2 rounded-lg border px-3 py-2">
                <input
                  type="text"
                  className="col-span-4 rounded-md border border-gray-300 p-2 text-sm"
                  placeholder="Type name"
                  value={type.editName}
                  onChange={(e) => handleUpdateLocal(idx, "editName", e.target.value)}
                />
                <input
                  type="text"
                  className="col-span-3 rounded-md border border-gray-300 p-2 text-sm"
                  placeholder="Rate"
                  value={type.editRate}
                  onChange={(e) => handleUpdateLocal(idx, "editRate", e.target.value)}
                />
                <input
                  type="text"
                  className="col-span-4 rounded-md border border-gray-300 p-2 text-sm"
                  placeholder="Description (optional)"
                  value={type.description || ""}
                  onChange={(e) => handleUpdateLocal(idx, "description", e.target.value)}
                />
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    className="rounded-md p-2 text-green-600 hover:bg-green-100"
                    onClick={() => saveType(type)}
                    title="Save"
                  >
                    <FiCheck size={16} />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 text-red-600 hover:bg-red-100"
                    onClick={() => removeType(type)}
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
