/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import Input from "../formInputs/Input";
import { FaPlus, FaTimes } from "react-icons/fa";
import Loader from "../Loader";

function RuleComponent({
  navigate,
  loading,
  title,
  rules,
  is_rule,
  ruleData,
  handleAdd,
  handleRemove,
  handleChange,
  handleSave,
}) {
  if (loading) {
    return <Loader message="Loading Rules..." />;
  }
  return (
    <>
      {/* To display in PDF */}
      {ruleData !== "addrule" && (
        <div className={`${is_rule === false ? "hidden" : "block"}`}>
          <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">
            Terms & Conditions
          </h3>
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
            <ul className="list-decimal list-outside ml-4 text-xs text-gray-600 space-y-1.5 marker:text-gray-400 font-medium">
              {rules.map((r, index) => (
                <li key={index} className="pl-1 leading-relaxed">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* To display in add-rule page */}
      {ruleData === "addrule" && (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <button
            type="button"
            className="px-4 py-2 mb-[10px] font-medium bg-gray-300 border border-gray-300 rounded-md cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Add Rule</h2>
          </div>

          <div className="space-y-2">
            {rules.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500 text-center">
                  No rules yet. Add your first rule to get started.
                </p>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md cursor-pointer hover:bg-[var(--color-primary-dark)]"
                >
                  <FaPlus /> Add First Rule
                </button>
              </div>
            )}
            <AnimatePresence>
              {rules.map((rule, index) => {
                const isLast = index === rules.length - 1;
                const isOnlyOne = rules.length === 1;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-full">
                      <Input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                        value={rule}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder="Add new rule"
                      />
                    </div>

                    {isLast && (
                      <button
                        type="button"
                        onClick={handleAdd}
                        className="p-[12px] bg-green-400 text-white text-xl rounded-md cursor-pointer"
                      >
                        <FaPlus />
                      </button>
                    )}

                    {(!isOnlyOne || rule.trim() !== "") && (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="p-[12px] bg-red-400 text-white text-xl rounded-md cursor-pointer"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md cursor-pointer"
            >
              Save Rules
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RuleComponent;
