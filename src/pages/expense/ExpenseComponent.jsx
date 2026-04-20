/* eslint-disable react/prop-types */
import { IoIosWarning } from "react-icons/io";
import Loader from "../../Components/common/Loader";
import { FiDollarSign, FiPlus, FiTag, FiTrash2, FiEdit2 } from "react-icons/fi";

function ExpenseComponent({
  expenses,
  categories,
  loading,
  totalExpense,
  filterCategory,
  setFilterCategory,
  handleAddExpense,
  handleEditExpense,
  handleDeleteExpense,
  handleAddCategory,
  handleDeleteCategory,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiDollarSign className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
            <p className="text-sm text-gray-400">
              {expenses?.length || 0} expense{expenses?.length !== 1 ? "s" : ""}{" "}
              recorded
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
            onClick={handleAddExpense}
          >
            <FiPlus size={15} />
            Add Expense
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#f4effc] text-[#845cbd] text-sm font-medium rounded-lg border border-[#845cbd] cursor-pointer transition-colors duration-200"
            onClick={handleAddCategory}
          >
            <FiTag size={15} />
            Add Category
          </button>
        </div>
      </div>

      {/* Total Expense Card */}
      <div className="p-5 bg-[#f4effc] rounded-xl mb-5 border border-[#ede7f6]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#845cbd] flex items-center justify-center">
            <FiDollarSign size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Expense</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹ {totalExpense.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <button
          className={`px-4 py-1.5 rounded-full font-medium text-sm cursor-pointer transition-all duration-200 ${
            filterCategory === ""
              ? "bg-[#845cbd] text-white shadow-sm"
              : "bg-[#f4effc] text-[#845cbd] hover:bg-[#e8ddf5]"
          }`}
          onClick={() => setFilterCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-1">
            <button
              className={`px-4 py-1.5 rounded-full font-medium text-sm cursor-pointer transition-all duration-200 ${
                filterCategory == cat.id
                  ? "bg-[#845cbd] text-white shadow-sm"
                  : "bg-[#f4effc] text-[#845cbd] hover:bg-[#e8ddf5]"
              }`}
              onClick={() => setFilterCategory(cat.id)}
            >
              {cat.name}
            </button>
            <button
              onClick={() => handleDeleteCategory(cat.id, cat.name)}
              title="Delete Category"
              className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full cursor-pointer transition-colors duration-200"
            >
              <FiTrash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader message="Loading Expenses..." />
      ) : expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <IoIosWarning size={48} className="text-yellow-400 mb-3" />
          <p className="text-lg font-semibold text-gray-500">
            No Expenses Available
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first expense to get started
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e8e0f3]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f4effc]">
                <th className="p-3 text-left text-sm font-semibold text-[#845cbd]">
                  #
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[#845cbd]">
                  Title
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[#845cbd]">
                  Category
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[#845cbd]">
                  Description
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[#845cbd]">
                  Amount
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[#845cbd]">
                  Payment Mode
                </th>
                <th className="p-3 text-center text-sm font-semibold text-[#845cbd]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr
                  key={expense.id}
                  className="border-b border-[#ede7f6] hover:bg-[#faf8fd] transition-colors duration-200"
                >
                  <td className="p-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="p-3 text-sm font-medium text-gray-800">
                    {expense.title}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {expense.category_name || expense.category}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {expense.description}
                  </td>
                  <td className="p-3 text-sm font-semibold text-gray-800">
                    ₹ {parseFloat(expense.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        expense.payment_mode === "CASH"
                          ? "bg-green-50 text-green-600"
                          : expense.payment_mode === "ONLINE"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-[#f4effc] text-[#845cbd]"
                      }`}
                    >
                      {expense.payment_mode}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#845cbd] hover:bg-[#f4effc] transition-colors duration-200 cursor-pointer"
                        title="Edit Expense"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        title="Delete Expense"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseComponent;
