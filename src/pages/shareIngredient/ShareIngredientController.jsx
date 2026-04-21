/* eslint-disable no-undef */
import { useLocation, useNavigate } from "react-router-dom";
import ShareIngredientComponent from "./ShareIngredientComponent";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { updateOrder } from "../../api/PostAllOrder";
import { getSingleOrder } from "../../api/FetchAllOrder";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";
import { assignIngredientVendor } from "../../api/VendorAssignmentApis";
import { useVendors } from "../../hooks/useVendors";

function ShareIngredientController() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedCategoryPayload,
    viewIngredient,
    mode = "share",
    id,
    from,
  } = location.state || {};

  // State for selected address
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null); // full vendor object
  const [checkedItems, setCheckedItems] = useState({});
  const [modifiedData, setModifiedData] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [customAddress, setCustomAddress] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [showCustomAddressInput, setShowCustomAddressInput] = useState(false);
  const [businessProfile, setBusinessProfile] = useState(null);
  // 'godown' or 'vendor' per item key "catIndex-itemIndex"
  const [itemSources, setItemSources] = useState({});

  const ingridient_list_data = selectedCategoryPayload?.ingridient_list_data;
  const eventAddress = selectedCategoryPayload?.eventAddress;
  const preCheckedItemNames =
    selectedCategoryPayload?.preCheckedItemNames || [];
  // Vendor chosen when clicking Share from the ingredient view
  const chosenVendor = selectedCategoryPayload?.selectedVendor || null;
  const chosenVendorName =
    chosenVendor?.name ||
    chosenVendor?.vendor_name ||
    chosenVendor?.company_name ||
    "";
  const chosenVendorMobile =
    chosenVendor?.mobile_no || chosenVendor?.mobile || chosenVendor?.phone || "";
  const { data: allVendors = [] } = useVendors();

  const normalizeValue = (val) =>
    (val || "")
      .toString()
      .trim()
      .toLowerCase();

  const resolveVendorMobile = () => {
    const directMobile = chosenVendorMobile || "";
    if (directMobile) return directMobile;

    const selectedVendorId = chosenVendor?.id;
    const selectedVendorLabel = normalizeValue(chosenVendorName);

    const matchedVendor = (vendors || []).find((v) => {
      const vId = v?.id;
      const vLabel = normalizeValue(
        v?.name || v?.vendor_name || v?.company_name || ""
      );

      if (selectedVendorId && String(vId) === String(selectedVendorId)) {
        return true;
      }
      return selectedVendorLabel && vLabel === selectedVendorLabel;
    });

    return (
      matchedVendor?.mobile_no || matchedVendor?.mobile || matchedVendor?.phone || ""
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getAllBusinessProfiles();
        if (response?.status && response?.data?.length > 0) {
          setBusinessProfile(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (ingridient_list_data?.data) {
      let allItems = ingridient_list_data.data;

      // If a vendor was pre-selected, show only items assigned to that vendor
      if (chosenVendor) {
        allItems = allItems.filter((item) => {
          let isForVendor = false;
          if (viewIngredient?.sessions) {
            viewIngredient.sessions.forEach((session) => {
              if (
                selectedCategoryPayload?.sessionLabel &&
                session.event_time !== selectedCategoryPayload.sessionLabel
              )
                return;
              const req = session.ingredients_required || {};
              if (req[item.item] && req[item.item].vendor) {
                const v = req[item.item].vendor;
                if (
                  String(v.id || v.name) ===
                  String(chosenVendor.id || chosenVendor.name)
                ) {
                  isForVendor = true;
                }
              }
            });
          }
          return isForVendor;
        });
      }

      const formattedIngredients =
        allItems.length > 0
          ? [
              {
                categoryName: ingridient_list_data.name,
                items: allItems.map((item) => {
                  let attachedVendor = null;
                  if (viewIngredient?.sessions) {
                    viewIngredient.sessions.forEach((session) => {
                      if (
                        selectedCategoryPayload?.sessionLabel &&
                        session.event_time !==
                          selectedCategoryPayload.sessionLabel
                      )
                        return;
                      const req = session.ingredients_required || {};
                      if (req[item.item] && req[item.item].vendor) {
                        attachedVendor = req[item.item].vendor;
                      }
                    });
                  }

                  return {
                    itemName: item.item,
                    totalQuantity: item.total_quantity,
                    quantityType: item.quantity_type || "",
                    godownQuantity: parseFloat(item.godown_quantity || 0),
                    vendor: attachedVendor,
                  };
                }),
              },
            ]
          : [];

      setIngredients(formattedIngredients);

      // Pre-check only items that are in preCheckedItemNames (non-godown items)
      const initChecked = {};
      const initModified = [];
      allItems.forEach((item, idx) => {
        const key = `0-${idx}`;
        const shouldCheck = preCheckedItemNames.includes(item.item);
        initChecked[key] = shouldCheck;
        if (shouldCheck) {
          initModified.push({
            category: ingridient_list_data.name,
            item: item.item,
          });
        }
      });
      setCheckedItems(initChecked);
      setModifiedData(initModified);
      // Initialise sources: godown items default to 'godown', rest to 'vendor'
      const initSources = {};
      allItems.forEach((item, idx) => {
        const isGodown = parseFloat(item.godown_quantity || 0) > 0;
        initSources[`0-${idx}`] = isGodown ? "godown" : "vendor";
      });
      setItemSources(initSources);

      if (mode === "share") {
        let foundDate = null;
        let foundTime = null;
        let foundAddress = null;

        if (viewIngredient?.sessions) {
          viewIngredient.sessions.forEach((session) => {
            if (
              selectedCategoryPayload?.sessionLabel &&
              session.event_time !== selectedCategoryPayload.sessionLabel
            )
              return;
            if (session.assigned_vendors) {
              for (const itemName of preCheckedItemNames) {
                if (session.assigned_vendors[itemName]) {
                  const v = session.assigned_vendors[itemName];
                  if (!foundDate && v.delivery_date)
                    foundDate = v.delivery_date;
                  if (!foundTime && v.delivery_time)
                    foundTime = v.delivery_time;
                  if (!foundAddress && v.delivery_address)
                    foundAddress = v.delivery_address;
                }
              }
            }
          });
        }

        if (!foundDate && selectedCategoryPayload?.eventDate) {
          foundDate = selectedCategoryPayload.eventDate;
        }

        if (foundDate) {
          const [d, m, y] = foundDate.split("-");
          if (d && m && y) {
            setSelectedDate(new Date(y, m - 1, d));
          }
        }
        if (foundTime) {
          setDeliveryTime(foundTime);
        }
        if (foundAddress) {
          const officeAddress =
            businessProfile?.godown_address ||
            "C1 1201 Pragati IT Park ,Near AR Mall Mota Varaccha, Surat";
          if (foundAddress === eventAddress) {
            setSelectedAddress("event");
            setIsCustomAddress(false);
          } else if (foundAddress === officeAddress) {
            setSelectedAddress("office");
            setIsCustomAddress(false);
          } else {
            setSelectedAddress("custom");
            setIsCustomAddress(true);
            setCustomAddress(foundAddress);
            setShowCustomAddressInput(true);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingridient_list_data]);

  const handleSourceChange = (key, source) => {
    setItemSources((prev) => ({ ...prev, [key]: source }));
  };

  const vendors = useMemo(() => {
    const categoryName = (ingridient_list_data?.name || "").trim().toLowerCase();

    return allVendors.filter((vendor) => {
      if (vendor.vendor_categories && Array.isArray(vendor.vendor_categories)) {
        return vendor.vendor_categories.some(
          (vc) => (vc.category_name || "").trim().toLowerCase() === categoryName
        );
      }

      const vendorCategory = (vendor.category || vendor.category_name || "")
        .trim()
        .toLowerCase();
      return vendorCategory === categoryName;
    });
  }, [allVendors, ingridient_list_data]);

  // Handle address selection (only one at a time)
  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    setIsCustomAddress(address === "custom");
  };

  // Handle checkbox selection
  const handleCheckboxChange = (index, i, itemName, categoryName) => {
    const key = `${index}-${i}`;
    setCheckedItems((prev) => {
      const updatedChecked = { ...prev, [key]: !prev[key] };

      // If checked, add to modified data
      if (updatedChecked[key]) {
        setModifiedData((prevData) => {
          let exists = prevData.some(
            (data) => data.category === categoryName && data.item === itemName
          );
          if (!exists) {
            return [...prevData, { category: categoryName, item: itemName }];
          }
          return prevData;
        });
      } else {
        // Remove from modified data if unchecked
        setModifiedData((prevData) =>
          prevData.filter(
            (data) =>
              !(data.category === categoryName && data.item === itemName)
          )
        );
      }

      return updatedChecked;
    });
  };

  //Handle Form Validation
  const validateForm = ({
    selectedAddress,
    selectedDate,
    deliveryTime,
    vendorName,
    modifiedData,
  }) => {
    if (mode === "share") {
      if (!selectedAddress) {
        toast.error("Please select a delivery address.");
        return false;
      }
      if (!selectedDate) {
        toast.error("Delivery date is required.");
        return false;
      }
      if (!deliveryTime.trim()) {
        toast.error("Delivery time is required.");
        return false;
      }
    }
    if (mode === "assign") {
      // Check if at least one item is sourced from vendor and no vendor is entered
      const hasVendorItem = Object.values(itemSources).some(
        (s) => s === "vendor"
      );
      if (hasVendorItem && !vendorName.trim()) {
        toast.error(
          "Please select or enter a vendor name for vendor-sourced items."
        );
        return false;
      }
    }
    if (modifiedData.length === 0) {
      toast.error("Please select at least one item.");
      return false;
    }
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    // Variables for addresses
    const officeAddress =
      businessProfile?.godown_address ||
      "C1 1201 Pragati IT Park ,Near AR Mall Mota Varaccha, Surat";
    const finalAddress =
      selectedAddress === "custom"
        ? customAddress
        : selectedAddress === "office"
          ? officeAddress
          : eventAddress;

    const isValid = validateForm({
      selectedAddress: finalAddress,
      selectedDate,
      deliveryTime,
      vendorName,
      modifiedData,
    });

    if (!isValid) return;

    const formattedDate = selectedDate
      ? `${selectedDate.getDate().toString().padStart(2, "0")}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getFullYear()}`
      : null;

    if (mode === "share") {
      const event_id = selectedCategoryPayload.event_id;
      const sessionLabel = selectedCategoryPayload.sessionLabel;

      // Fetch fresh order and update delivery details
      const orderResponse = await getSingleOrder(event_id);
      if (orderResponse?.data?.status) {
        const orderData = orderResponse.data.data;
        const newSessions = orderData.sessions.map((session) => {
          if (sessionLabel && session.event_time !== sessionLabel)
            return session;

          const assigned_vendors = session.assigned_vendors || {};

          modifiedData.forEach((selected) => {
            let existing = assigned_vendors[selected.item] || {};
            assigned_vendors[selected.item] = {
              ...existing,
              delivery_date: formattedDate,
              delivery_time: deliveryTime,
              delivery_address: finalAddress,
              mobile_no: resolveVendorMobile() || existing.mobile_no || existing.mobile || "",
            };
          });

          return {
            ...session,
            assigned_vendors,
          };
        });
        await updateOrder(event_id, { sessions: newSessions });
      }

      const statePayload = {
        eventAddress: finalAddress,
        formattedDate,
        deliveryTime,
        vendorName: chosenVendorName,
        mobileNo: resolveVendorMobile(),
        selectedItems: modifiedData.map((selected) => {
          const category = ingredients.find(
            (cat) => cat.categoryName === selected.category
          );
          const item = category?.items.find(
            (i) => i.itemName === selected.item
          );
          return {
            category: selected.category,
            itemName: selected.item,
            totalQuantity: item?.totalQuantity || "0",
          };
        }),
      };
      navigate("/share-ingredient-pdf", {
        state: {
          ...location.state,
          statePayload,
          from: "share-ingredient",
          id,
          customParents: {
            ...location.state?.customParents,
            "share-ingredient-pdf": "share-ingredient",
          },
        },
      });
      return;
    }

    if (mode === "assign") {
      const event_id = selectedCategoryPayload.event_id;
      const sessionLabel = selectedCategoryPayload.sessionLabel;

      if (!sessionLabel) {
         toast.error("Session information is missing.");
         return;
      }
      
      const orderResponse = await getSingleOrder(event_id);
      if (!orderResponse?.data?.status) {
        toast.error("Failed to fetch event booking details.");
        return;
      }
      const orderData = orderResponse.data.data;
      const targetSession = orderData.sessions.find(s => s.event_time === sessionLabel);
      if (!targetSession) {
        toast.error("Could not locate the selected session.");
        return;
      }

      try {
        const payloadPromises = modifiedData.map((selected) => {
          let itemKey = null;
          ingredients.forEach((cat, catIdx) => {
            cat.items.forEach((it, itIdx) => {
              if (it.itemName === selected.item) itemKey = `${catIdx}-${itIdx}`;
            });
          });
          const source = itemKey ? itemSources[itemKey] || "vendor" : "vendor";

          // If godown, vendor is null but let's assume Godown logic will be handled if vendorName is passed as empty, or we pass a specific vendor_id.
          // Wait, the API requires a Vendor ID. Godown is handled via "godown" ID string? No, my schema expects an integer Vendor FK.
          // The backend does not handle "godown" vendor. Let's let the frontend skip assignments for godown, or do what it did before.
          // Wait, if it's "godown", the user just shouldn't use `assignIngredientVendor` if it expects a valid Vendor FK.
          if (source === "godown") {
            // Let the JSON update handle godown
            return Promise.resolve(null);
          }

          const vendorId = selectedVendor?.id;
          if (!vendorId) {
             console.warn("No vendor ID selected for", selected.item);
             return Promise.resolve(null);
          }

          return assignIngredientVendor({
             event: event_id,
             session: targetSession.id,
             ingredient_name: selected.item,
             vendor: vendorId
          });
        });
        
        await Promise.all(payloadPromises);

        // Also update JSON for backwards compatibility and godown
        const newSessions = orderData.sessions.map((session) => {
          if (sessionLabel && session.event_time !== sessionLabel) return session;

          const assigned_vendors = session.assigned_vendors || {};

          modifiedData.forEach((selected) => {
            let itemKey = null;
            ingredients.forEach((cat, catIdx) => {
              cat.items.forEach((it, itIdx) => {
                if (it.itemName === selected.item) itemKey = `${catIdx}-${itIdx}`;
              });
            });
            const source = itemKey ? itemSources[itemKey] || "vendor" : "vendor";
            const existingAssigned = assigned_vendors[selected.item] || {};

            if (source === "godown") {
              assigned_vendors[selected.item] = {
                id: "godown",
                name: "Godown",
                delivery_date: "",
                delivery_time: "",
                delivery_address: "",
              };
            } else {
              assigned_vendors[selected.item] = {
                id: selectedVendor?.id || existingAssigned.id || "",
                name: vendorName || existingAssigned.name || "",
                mobile_no: selectedVendor?.mobile_no || selectedVendor?.mobile || existingAssigned.mobile_no || existingAssigned.mobile || "",
                delivery_date: existingAssigned.delivery_date || "",
                delivery_time: existingAssigned.delivery_time || "",
                delivery_address: existingAssigned.delivery_address || "",
              };
            }
          });

          return {
            ...session,
            assigned_vendors,
          };
        });

        await updateOrder(event_id, { sessions: newSessions });
        toast.success("Vendors assigned successfully!");
        navigate(-1);
      } catch (error) {
         console.error(error);
         toast.error("Failed to assign vendors.");
      }
    }
  };

  return (
    <ShareIngredientComponent
      mode={mode}
      eventAddress={eventAddress}
      ingredients={ingredients}
      navigate={navigate}
      selectedAddress={selectedAddress}
      handleAddressChange={handleAddressChange}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      deliveryTime={deliveryTime}
      setDeliveryTime={setDeliveryTime}
      vendorName={vendorName}
      setVendorName={setVendorName}
      selectedVendor={selectedVendor}
      setSelectedVendor={(vendor) => {
        setSelectedVendor(vendor);
        setVendorName(vendor?.name || vendor?.vendor_name || "");
      }}
      vendors={vendors}
      checkedItems={checkedItems}
      handleCheckboxChange={handleCheckboxChange}
      handleSubmit={handleSubmit}
      customAddress={customAddress}
      setCustomAddress={setCustomAddress}
      isCustomAddress={isCustomAddress}
      showCustomAddressInput={showCustomAddressInput}
      setShowCustomAddressInput={setShowCustomAddressInput}
      itemSources={itemSources}
      handleSourceChange={handleSourceChange}
      businessProfile={businessProfile}
    />
  );
}

export default ShareIngredientController;
