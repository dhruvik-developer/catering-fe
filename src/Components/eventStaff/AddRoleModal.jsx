/* eslint-disable react/prop-types */
import FormModal from "../common/FormModal";

function AddRoleModal({
  isOpen,
  formData,
  errors,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}) {
  const footer = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isSaving}
        className="rounded-xl border border-gray-200 px-5 py-2.5 font-semibold text-gray-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        form="add-role-form"
        disabled={isSaving}
        className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 font-bold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      title="Add New Role"
      subtitle="Create a role without leaving the staff form."
      onClose={onClose}
      footer={footer}
      widthClass="max-w-lg"
      closeDisabled={isSaving}
    >
      <form id="add-role-form" onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="e.g., Chef" autoFocus
            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all ${
              errors.name
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50 focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20"
            }`}
          />
          {errors.name ? (
            <p className="mt-2 text-xs font-medium text-red-500">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={3}
            placeholder="Optional details about this role"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all resize-none ${
              errors.description
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50 focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20"
            }`}
          />
          {errors.description ? (
            <p className="mt-2 text-xs font-medium text-red-500">
              {errors.description}
            </p>
          ) : null}
        </div>

        {errors.general ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errors.general}
          </div>
        ) : null}
      </form>
    </FormModal>
  );
}

export default AddRoleModal;
