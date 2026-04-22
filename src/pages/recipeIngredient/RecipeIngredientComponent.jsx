/* eslint-disable react/prop-types */
import { useState } from "react";
import Loader from "../../Components/common/Loader";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiBookOpen,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { IoIosWarning } from "react-icons/io";

function RecipeIngredientComponent({ loading, navigate, recipe }) {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // Helper to get ingredients as entries array from object or array
  const getIngredientEntries = (ingredients) => {
    if (!ingredients) return [];
    if (typeof ingredients === "object" && !Array.isArray(ingredients)) {
      return Object.entries(ingredients); // [[name, qty], ...]
    }
    // Fallback for old array format
    if (Array.isArray(ingredients)) {
      return ingredients.map((name) => [name, null]);
    }
    return [];
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiBookOpen className="text-[var(--color-primary)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Recipe Ingredient
            </h2>
            <p className="text-sm text-gray-400">
              {recipe?.length || 0} recipe{recipe?.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create-ingredient")}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
        >
          <FiPlus size={15} />
          Add Ingredient
        </button>
      </div>

      {loading ? (
        <Loader message="Loading Recipes..." />
      ) : (
        <div className="space-y-3">
          {recipe.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <IoIosWarning size={48} className="text-yellow-400 mb-3" />
              <p className="text-lg font-semibold text-gray-500">
                No Recipe Ingredient Available
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first recipe ingredient to get started
              </p>
            </div>
          ) : (
            recipe.map((rec) => {
              const ingredientEntries = getIngredientEntries(rec.ingredients);
              return (
                <div
                  key={rec.id}
                  className="rounded-xl overflow-hidden border border-[var(--color-primary-border)] transition-all duration-200 hover:shadow-md"
                >
                  <div
                    className="flex justify-between items-center bg-[var(--color-primary-soft)] px-5 py-4 cursor-pointer transition-colors duration-200 hover:brightness-95"
                    onClick={() => toggleExpand(rec.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                        {rec.item?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {rec.item.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {rec.person_count && (
                        <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                          <FiUsers size={12} />
                          {rec.person_count}
                        </span>
                      )}
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white text-[var(--color-primary)] border border-[var(--color-primary-border)]">
                        {ingredientEntries.length} items
                      </span>
                      <button
                        className="p-2 rounded-lg text-gray-400 hover:text-[var(--color-primary)] hover:bg-white transition-colors duration-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-ingredient/${rec.id}`, {
                            state: rec,
                          });
                        }}
                        title="Edit Ingredient"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      {expanded === rec.id ? (
                        <FiChevronUp size={18} className="text-[var(--color-primary)]" />
                      ) : (
                        <FiChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                      expanded === rec.id
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-[var(--color-primary-tint)] border-t border-[var(--color-primary-border)]">
                      {ingredientEntries.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {ingredientEntries.map(([name, qty], index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-lg px-3 py-2 border border-[var(--color-primary-border)]"
                            >
                              <span className="w-5 h-5 rounded bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="font-medium flex-1">{name}</span>
                              {qty && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary-border)]">
                                  {qty}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                          <IoIosWarning
                            size={32}
                            className="text-yellow-400 mb-2"
                          />
                          <p className="text-sm font-medium text-gray-500">
                            No Ingredients Available
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeIngredientComponent;
