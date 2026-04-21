/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ViewIngredientComponent from "./ViewIngredientComponent";
import { useEffect, useState } from "react";
import {
  fetchEventIngredientList,
  getSingleOrder,
} from "../../api/FetchAllOrder";
import toast from "react-hot-toast";
import { updateOrder } from "../../api/PostAllOrder";

function ViewIngredientController() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // ?session=Lunch — when coming from a session row click on AllOrders page
  const sessionFilter = searchParams.get("session") || null;
  const sessionIdFilter = searchParams.get("session_id") || null;
  const [loading, setLoading] = useState(true);
  const [viewIngredient, setViewIngredient] = useState([]);
  const [eventIngredientsList, setEventIngredientsList] = useState([]);
  const [formValues] = useState({}); // Keep only if used elsewhere, else we just remove set... wait it is used as formValues in lines below! We'll just ignore the setter via eslint-disable.
  // checkedItems: key = "categoryName||itemName", value = true/false
  const [checkedItems, setCheckedItems] = useState({});

  const fetchViewIngredient = async () => {
    try {
      const response = await getSingleOrder(id);
      if (response.data.status) {
        setViewIngredient(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredientList = async () => {
    try {
      const response = await fetchEventIngredientList(id);
      if (response.status) {
        setEventIngredientsList(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchViewIngredient();
      fetchIngredientList();
    }
  }, [id]);

  // Toggle checkbox for ingredients that need to be ordered (not from godown)
  const handleCheckboxChange = (categoryName, itemName) => {
    const key = `${categoryName}||${itemName}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Update ingredient quantity for a specific session
  const handleUpdateQuantity = async (sessionId, ingredientName, newQuantity) => {
    try {
      const response = await getSingleOrder(id);
      if (!response?.data?.status) {
        toast.error("Failed to fetch order data");
        return false;
      }

      const orderData = response.data.data;
      const updatedSessions = orderData.sessions.map((session) => {
        if (String(session.id) !== String(sessionId)) return session;

        const ingredientsRequired = { ...(session.ingredients_required || {}) };
        if (ingredientsRequired[ingredientName] !== undefined) {
          if (typeof ingredientsRequired[ingredientName] === "string") {
            ingredientsRequired[ingredientName] = newQuantity;
          } else {
            ingredientsRequired[ingredientName] = {
              ...ingredientsRequired[ingredientName],
              quantity: newQuantity,
            };
          }
        }

        return {
          ...session,
          ingredients_required: ingredientsRequired,
        };
      });

      await updateOrder(id, { sessions: updatedSessions });
      toast.success("Quantity updated successfully");

      // Re-fetch data to update UI
      fetchViewIngredient();
      fetchIngredientList();
      return true;
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error("Update error:", error);
      return false;
    }
  };

  // sessionLabel: when ShareSession button clicked, filter to only that session's quantities
  const handleShareIngredients = (categoryName, sessionLabel, mode) => {
    const categoryData = eventIngredientsList.find(
      (c) => c.name === categoryName
    );
    if (!categoryData) {
      toast.error("Category data not found!");
      return;
    }

    // Auto-detect which items need to be ordered (not covered by godown)
    const nonGodownItems = (categoryData?.data || [])
      .filter((item) => {
        const godownRaw = parseFloat(item.godown_quantity || 0);
        return godownRaw <= 0;
      })
      .map((item) => item.item);

    const preCheckedItemNames = sessionLabel
      ? (categoryData?.data || []).map((d) => d.item)
      : nonGodownItems;

    const buildPayloadAndNavigate = (selectedVendor) => {
      const selectedIngredients = eventIngredientsList
        .map((category) => ({
          name: category.name,
          data: category.data
            .map((item, i) => {
              const filteredUseItems = sessionIdFilter
                ? item.use_item.filter((u) => String(u.session_id) === String(sessionIdFilter))
                : (sessionLabel
                  ? item.use_item.filter((u) => {
                      const match = (u.item_name || "").match(
                        /\(Session:\s*([^)]+)\)/
                      );
                      return match && match[1].trim() === sessionLabel;
                    })
                  : item.use_item);

              return (() => {
                const unitMatch = (filteredUseItems[0]?.quantity || "").match(
                  /[\d.]+\s*([a-zA-Z]+)/
                );
                const detectedUnit = unitMatch
                  ? unitMatch[1]
                  : item.quantity_type || "";

                const totalVal = filteredUseItems.reduce((total, u, j) => {
                  const userQty =
                    formValues[`${category.name}-${i}-${j}-quantity`] ||
                    u.quantity ||
                    "0";
                  return total + parseFloat(userQty);
                }, 0);

                return {
                  item: item.item,
                  quantity_type: detectedUnit,
                  godown_quantity: String(item.godown_quantity || 0),
                  godown_quantity_type: item.godown_quantity_type || "",
                  use_item: filteredUseItems.map((u, j) => {
                    const useItemData = {
                      item_name: u.item_name,
                      item_category: u.item_category,
                      quantity:
                        formValues[`${category.name}-${i}-${j}-quantity`] !==
                        undefined
                          ? formValues[`${category.name}-${i}-${j}-quantity`]
                          : u.quantity || "",
                    };
                    if (u.party_name) useItemData.party_name = u.party_name;
                    if (u.delivery_date)
                      useItemData.delivery_date = u.delivery_date;
                    if (u.delivery_time)
                      useItemData.delivery_time = u.delivery_time;
                    return useItemData;
                  }),
                  total_quantity: `${totalVal} ${detectedUnit}`.trim(),
                  godown: {},
                };
              })();
            })
            .filter((item) => item.use_item.length > 0 || !sessionLabel),
        }))
        .filter((category) => category.data.length > 0);

      const fullPayload = {
        event_id: id,
        ingridient_list_data: selectedIngredients,
      };
      const selectedCategory = fullPayload.ingridient_list_data.find(
        (cat) => cat.name === categoryName
      );
      const matchedSession = sessionLabel
        ? viewIngredient?.sessions?.find(
            (s) => (s.event_time || "").trim().toLowerCase() === (sessionLabel || "").trim().toLowerCase()
          )
        : null;
      const actualEventAddress =
        matchedSession?.event_address || viewIngredient?.event_address || "";
      const actualEventDate =
        matchedSession?.event_date || viewIngredient?.event_date || "";

      const selectedCategoryPayload = {
        event_id: id,
        eventAddress: actualEventAddress,
        eventDate: actualEventDate,
        ingridient_list_data: selectedCategory,
        preCheckedItemNames,
        sessionLabel: sessionLabel || null,
        sessionIdFilter: sessionIdFilter || null,
        selectedVendor: selectedVendor || null,
      };

      navigate("/share-ingredient", {
        state: {
          ...location.state,
          selectedCategoryPayload,
          fullPayload,
          viewIngredient,
          mode,
          from: "view-ingredient",
          id,
          customParents: {
            ...location.state?.customParents,
            "share-ingredient": "view-ingredient",
          },
        },
      });
    };

    if (mode === "share") {
      // Collect all unique vendors assigned to items in this category
      const vendorMap = new Map();
      (categoryData?.data || []).forEach((item) => {
        if (viewIngredient?.sessions) {
          viewIngredient.sessions.forEach((session) => {
            if (sessionLabel && session.event_time !== sessionLabel) return;
            const req = session.ingredients_required || {};
            if (req[item.item] && req[item.item].vendor) {
              const v = req[item.item].vendor;
              vendorMap.set(v.id || v.name, v);
            }
          });
        }
      });
      const assignedVendors = Array.from(vendorMap.values());

      if (assignedVendors.length === 0) {
        toast.error("No vendor assigned to any item in this category.");
        return;
      }

      if (assignedVendors.length === 1) {
        // Only one vendor — proceed directly
        buildPayloadAndNavigate(assignedVendors[0]);
        return;
      }

      // Multiple vendors — show picker
      import("sweetalert2").then(({ default: Swal }) => {
        const options = assignedVendors
          .map(
            (v) =>
              `<option value="${v.id || v.name}">${v.name || v.id}</option>`
          )
          .join("");
        Swal.fire({
          title: "Select Vendor to Share",
          html: `<select id="vendor-select" class="swal2-input" style="margin:0; width:100%">
                               <option value="">-- Select a Vendor --</option>
                               ${options}
                           </select>`,
          icon: "question",
          confirmButtonColor: "#845cbd",
          confirmButtonText: "Share",
          showCancelButton: true,
          preConfirm: () => {
            const val = document.getElementById("vendor-select").value;
            if (!val) {
              Swal.showValidationMessage("Please select a vendor");
              return false;
            }
            return assignedVendors.find((v) => String(v.id || v.name) === val);
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            buildPayloadAndNavigate(result.value);
          }
        });
      });
    } else {
      buildPayloadAndNavigate(null);
    }
  };

  // Navigate to the Share Outsourced Items flow for a SINGLE item card
  // Only passes that item's data — one vendor, one item, no API call needed
  const handleShareOutsourced = (oi) => {
    const matchedSession = sessionIdFilter
      ? viewIngredient?.sessions?.find((s) => String(s.id) === String(sessionIdFilter))
      : (sessionFilter
          ? viewIngredient?.sessions?.find((s) => s.event_time === sessionFilter)
          : null);
    const eventAddress =
      matchedSession?.event_address || viewIngredient?.event_address || "";
    const matchedSessionId = matchedSession?.id || null;

    const vendorName = oi.vendor?.name || "Unassigned";
    const vendorGroups = [
      {
        vendor_name: vendorName,
        items: [
          {
            item_name: oi.item_name,
            quantity: oi.quantity,
            unit: oi.unit,
            vendor: oi.vendor || null,
          },
        ],
      },
    ];

    navigate("/share-outsourced", {
      state: {
        eventId: id,
        sessionId: matchedSessionId,
        eventAddress,
        vendorGroups,
        from: "view-ingredient",
        customParents: {
          "share-outsourced": "view-ingredient",
        },
      },
    });
  };

  const handleFullShareIngredients = async () => {
    const selectedIngredients = eventIngredientsList
      .map((category) => ({
        name: category.name,
        data: category.data
          .map((item, i) => {
            // Try to find if this item has been assigned a vendor across any sessions
            let assignedVendor = null;
            if (viewIngredient?.sessions) {
              viewIngredient.sessions.forEach((session) => {
                if (sessionFilter && session.event_time !== sessionFilter)
                  return;
                const req = session.ingredients_required || {};
                if (req[item.item] && req[item.item].vendor) {
                  assignedVendor = req[item.item].vendor;
                }
              });
            }

            const filteredUseItems = sessionIdFilter
              ? item.use_item.filter((u) => String(u.session_id) === String(sessionIdFilter))
              : (sessionFilter
                ? item.use_item.filter((u) => {
                    const match = (u.item_name || "").match(
                      /\(Session:\s*([^)]+)\)/
                    );
                    return match && match[1].trim() === sessionFilter;
                  })
                : item.use_item);

            return {
              item: item.item,
              quantity_type: item.quantity_type || "",
              godown_quantity: String(item.godown_quantity || 0),
              use_item: filteredUseItems.map((u, j) => {
                const useItemData = {
                  item_name: u.item_name,
                  item_category: u.item_category,
                  quantity:
                    formValues[`${category.name}-${i}-${j}-quantity`] !==
                    undefined
                      ? formValues[`${category.name}-${i}-${j}-quantity`]
                      : u.quantity || "",
                };

                // Pass along the correctly mapped vendor info if we found one in sessions
                if (assignedVendor) {
                  useItemData.party_name =
                    assignedVendor.name || assignedVendor.id;
                  useItemData.delivery_date =
                    assignedVendor.delivery_date || u.delivery_date || "N/A";
                  useItemData.delivery_time =
                    assignedVendor.delivery_time || u.delivery_time || "N/A";
                } else {
                  if (u.party_name) useItemData.party_name = u.party_name;
                  if (u.delivery_date)
                    useItemData.delivery_date = u.delivery_date;
                  if (u.delivery_time)
                    useItemData.delivery_time = u.delivery_time;
                }

                return useItemData;
              }),
              total_quantity: String(
                filteredUseItems.reduce((total, u, j) => {
                  const userQty =
                    formValues[`${category.name}-${i}-${j}-quantity`] ||
                    u.quantity ||
                    "0";
                  return total + parseFloat(userQty);
                }, 0)
              ),
              godown: {},
            };
          })
          .filter((item) => item.use_item.length > 0),
      }))
      .filter((category) => category.data.length > 0);

    const matchedSession = sessionIdFilter
      ? viewIngredient?.sessions?.find((s) => String(s.id) === String(sessionIdFilter))
      : (sessionFilter
          ? viewIngredient?.sessions?.find((s) => s.event_time === sessionFilter)
          : null);

    const fullPayload = {
      event_id: id,
      eventAddress:
        matchedSession?.event_address ||
        viewIngredient.event_address ||
        "Not Provided",
      eventDate: viewIngredient.event_date || "-",
      eventTime: sessionFilter
        ? sessionFilter
        : viewIngredient.event_time || "-",
      estimatedPersons:
        matchedSession?.estimated_persons ||
        viewIngredient.estimated_persons ||
        0,
      ingridient_list_data: selectedIngredients,
    };

    navigate("/share-full-ingredient-pdf", {
      state: {
        ...location.state,
        fullPayload,
        from: "view-ingredient",
        id,
        customParents: {
          ...location.state?.customParents,
          "share-full-ingredient-pdf": "view-ingredient",
        },
      },
    });
  };

  return (
    <div>
      <ViewIngredientComponent
        viewIngredient={viewIngredient}
        eventIngredientsList={eventIngredientsList}
        formValues={formValues}
        checkedItems={checkedItems}
        handleCheckboxChange={handleCheckboxChange}
        handleShareIngredients={handleShareIngredients}
        handleFullShareIngredients={handleFullShareIngredients}
        handleShareOutsourced={handleShareOutsourced}
        sessionFilter={sessionFilter}
        sessionIdFilter={sessionIdFilter}
        loading={loading}
        navigate={navigate}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}

export default ViewIngredientController;
