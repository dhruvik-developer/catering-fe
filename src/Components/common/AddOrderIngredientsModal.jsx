/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import FormModal from "./FormModal";
import Button from "./Button";

const UNITS = ["kg", "g", "L", "mL", "pcs"];

const emptyRow = () => ({
  ingredient: "",
  quantity: "",
  unit: "g",
  category: "Other",
});

/**
 * Modal for adding (or editing) ingredients that apply only to a specific
 * order/session. Rows returned contain: { ingredient, quantity, unit, category }.
 */
function AddOrderIngredientsModal({
  isOpen,
  onClose,
  dishName,
  sessionLabel,
  initialRows,
  onSave,
  mode = "add",
}) {
  const [rows, setRows] = useState([emptyRow()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRows(
        initialRows && initialRows.length > 0
          ? initialRows.map((r) => ({ ...r }))
          : [emptyRow()]
      );
      setSaving(false);
    }
  }, [isOpen, initialRows]);

  if (!isOpen) return null;

  const updateRow = (idx, changes) =>
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...changes } : r))
    );
  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (idx) =>
    setRows((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    const valid = rows
      .map((r) => ({
        ingredient: String(r.ingredient || "").trim(),
        quantity: String(r.quantity ?? "").trim(),
        unit: r.unit || "g",
        category: String(r.category || "").trim() || "Other",
      }))
      .filter((r) => r.ingredient && r.quantity);
    if (valid.length === 0) return;
    setSaving(true);
    try {
      await onSave(valid);
    } finally {
      setSaving(false);
    }
  };

  const title =
    mode === "edit"
      ? `Edit Ingredients for "${dishName}"`
      : `Add Ingredients for "${dishName}"`;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={saving ? () => {} : onClose}
      closeDisabled={saving}
      title={title}
      subtitle={
        sessionLabel
          ? `Session: ${sessionLabel} • applies only to this order`
          : "Applies only to this order"
      }
      widthClass="max-w-2xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {mode === "edit" ? "Save Changes" : "Add Ingredients"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {/* Table-style header row — visible only on sm+. On mobile each row
            stacks vertically and placeholder text inside the inputs already
            tells the user what the field is. */}
        <div
          className="hidden sm:grid items-end gap-2 px-3 pb-1"
          style={{
            gridTemplateColumns: "minmax(0,1fr) 6rem 6rem 8rem 2rem",
          }}
        >
          <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            Ingredient
          </div>
          <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            Qty
          </div>
          <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            Unit
          </div>
          <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            Category
          </div>
          <div />
        </div>

        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 sm:grid items-center gap-2 p-3 border border-gray-100 rounded-lg bg-gray-50/50"
            style={{
              gridTemplateColumns:
                "minmax(0,1fr) 6rem 6rem 8rem 2rem",
            }}
          >
            <input
              type="text"
              value={row.ingredient}
              onChange={(e) =>
                updateRow(idx, { ingredient: e.target.value })
              }
              placeholder="Ingredient (e.g. Turmeric)"
              aria-label="Ingredient"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
            />
            <input
              type="number"
              step="any"
              min="0"
              value={row.quantity}
              onChange={(e) =>
                updateRow(idx, { quantity: e.target.value })
              }
              placeholder="Qty"
              aria-label="Quantity"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
            />
            <select
              value={row.unit}
              onChange={(e) => updateRow(idx, { unit: e.target.value })}
              aria-label="Unit"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)]"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={row.category}
              onChange={(e) =>
                updateRow(idx, { category: e.target.value })
              }
              placeholder="Category"
              aria-label="Category"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)]"
            />
            {rows.length > 1 ? (
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="justify-self-end sm:justify-self-center p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                title="Remove row"
                aria-label="Remove row"
              >
                <FiTrash2 size={16} />
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        ))}
        <div>
          <Button
            variant="soft"
            size="sm"
            onClick={addRow}
            leftIcon={<FiPlus size={14} />}
          >
            Add another ingredient
          </Button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          These ingredients will be saved only for this order. Your global recipe
          list is not affected.
        </p>
      </div>
    </FormModal>
  );
}

export default AddOrderIngredientsModal;
