import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../../Components/common/Loader";
import { getGroundItems, getGroundCategories } from "../../../api/GroundApis";
import AddGroundItem from "./AddGroundItem";
import { HugeiconsIcon } from "@hugeicons/react";
import { StickyNote02Icon } from "@hugeicons/core-free-icons";

const GroundItemMaster = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [itemsRes, catRes] = await Promise.all([
        getGroundItems(),
        getGroundCategories()
      ]);

      if (itemsRes?.data?.status) {
        setItems(itemsRes.data.data);
      } else {
        toast.error(itemsRes?.data?.message || "Failed to fetch items");
      }

      if (catRes?.data?.status) {
        setCategories(catRes.data.data.filter(c => c.is_active));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getGroundItems();
      if (res?.data?.status) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? String(item.category) === String(selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchItems();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <HugeiconsIcon icon={StickyNote02Icon} size={22} color="var(--color-primary)" className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ground Items</h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage inventory items and equipment used on the ground
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium shadow-sm whitespace-nowrap"
          >
            + Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader message="Loading Items..." />
            </div>
          ) : filteredItems.length > 0 ? (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Item Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--color-primary)]">
                      {item.category_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.unit || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-sm">
                      {item.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiSearch size={48} className="mb-4 opacity-20" />
              <p className="text-lg">No ground items found</p>
              <p className="text-sm mt-1">Try adjusting your filters or adding a new item</p>
            </div>
          )}
        </div>
      </div>

      <AddGroundItem
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        categories={categories}
      />
    </div>
  );
};

export default GroundItemMaster;
