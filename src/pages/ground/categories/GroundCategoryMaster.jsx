import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../../Components/common/Loader";
import { getGroundCategories, createGroundCategory } from "../../../api/GroundApis";
import AddGroundCategory from "./AddGroundCategory";
import { HugeiconsIcon } from "@hugeicons/react";
import { MenuRestaurantIcon } from "@hugeicons/core-free-icons";

const GroundCategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getGroundCategories();
      if (res?.data?.status) {
        setCategories(res.data.data);
      } else {
        toast.error(res?.data?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchCategories();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <HugeiconsIcon icon={MenuRestaurantIcon} size={22} color="#845cbd" className="text-[#845cbd]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ground Categories</h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage categories for ground items and equipment
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium shadow-sm whitespace-nowrap"
          >
            + Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center sm:flex-row flex-col gap-4">
          <div className="relative w-full sm:max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#845cbd] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader message="Loading Categories..." />
            </div>
          ) : filteredCategories.length > 0 ? (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Category Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold w-24 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-sm">
                      {cat.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          cat.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiSearch size={48} className="mb-4 opacity-20" />
              <p className="text-lg">No categories found</p>
            </div>
          )}
        </div>
      </div>

      <AddGroundCategory
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default GroundCategoryMaster;
