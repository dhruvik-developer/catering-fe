/* eslint-disable react/prop-types */
import { Input, Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";

const Dropdown = ({
  options,
  selectedValue,
  onChange,
  placeholder = "Select an option",
  error,
  isSearchable = false,
  disabled = false,
  selectedLabel,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.id === selectedValue);

  // To search & accending order list
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset search input on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  return (
    <Listbox value={selectedValue} onChange={onChange} disabled={disabled}>
      <div className="relative w-full">
        <Listbox.Button
          className={`relative w-full py-2 pl-3 pr-10 text-left border rounded-md focus:outline-none ${
            disabled
              ? "cursor-not-allowed bg-gray-100 opacity-60 border-gray-200"
              : "cursor-pointer bg-white"
          } ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span
            className={`block truncate ${!selectedOption && !selectedLabel ? (error ? "text-red-500" : "text-gray-500") : "text-gray-700"}`}
          >
            {options.find((opt) => opt.id === selectedValue)?.name ||
              selectedLabel ||
              placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {isOpen ? (
              <CgChevronUp
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <CgChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setIsOpen(false)}
        >
          <Listbox.Options 
            anchor="bottom start"
            className="z-[100] mt-1 !max-h-56 w-[var(--button-width)] overflow-auto custom-scrollbar rounded-xl border border-gray-200 bg-white text-base shadow-2xl focus:outline-none ring-1 ring-black/5"
          >
            {isSearchable && (
              <div className="p-1.5 sticky top-0 bg-white z-10 border-b border-gray-100 shadow-sm">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ focus, active }) =>
                      `relative cursor-pointer select-none py-1.5 pl-8 pr-3 mx-1 my-0.5 rounded-md transition-colors text-sm ${
                        focus || active ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-medium" : "text-gray-700 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                      }`
                    }
                  value={option.id}
                  onClick={() => setIsOpen(false)}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-bold text-[var(--color-primary)]" : "font-medium"}`}
                      >
                        {option.name}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-base text-[var(--color-primary)] font-bold">
                          ✓
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 font-semibold">
                No options found
              </div>
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Dropdown;
