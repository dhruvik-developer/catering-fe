/* eslint-disable react/prop-types */
import Input from "../../common/formInputs/Input";
import { FiArrowLeft, FiFolder } from "react-icons/fi";

function AddCategoryComponent({
  categoryName,
  setCategoryName,
  navigate,
  handleSubmit,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-auto mx-auto mt-10">
      <button
        type="button"
        className="px-4 py-2 mb-4 font-medium bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm text-gray-600"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
          <FiFolder className="text-[var(--color-primary)]" size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create Category</h2>
          <p className="text-sm text-gray-400">
            Add a new category to organize your items
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Name Input */}
        <div>
          <Input
            label="Category Name *"
            type="text"
            placeholder="Please Enter Category Name"
            name="name"
            value={categoryName}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center pt-3">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white font-semibold rounded-lg cursor-pointer shadow-md shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98]"
          >
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategoryComponent;
