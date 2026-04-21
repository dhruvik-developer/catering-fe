/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import EditDishComponent from "./EditDishComponent";
import { getCategory } from "../../../api/FetchCategory";
import { getSingleOrder } from "../../../api/FetchAllOrder";
import { getWaiterTypes } from "../../../api/EventStaffApis";
import toast from "react-hot-toast";

function EditDishContoller() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionIndexParam = searchParams.get("sessionIndex");
  const isSessionMode = sessionIndexParam !== null;

  const [dishesList, setDishesList] = useState([]);
  const [isDishesLoading, setIsDishesLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [waiterTypes, setWaiterTypes] = useState([]);
  const [isLoadingWaiterTypes, setIsLoadingWaiterTypes] = useState(false);

  // Store untouched sessions when in Session-Wise edit mode
  const [hiddenSessionsContext, setHiddenSessionsContext] = useState({
    before: [],
    after: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    reference: "",
    schedule: [],
    grandTotalAmount: 0,
    description: "",
    rule: false,
    fromNavigation: location.state || null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchWaiterTypes();
  }, []);

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id]);

  const fetchWaiterTypes = async () => {
    setIsLoadingWaiterTypes(true);
    try {
      const response = await getWaiterTypes();
      const data = response?.data?.data ?? response?.data;
      if (Array.isArray(data)) setWaiterTypes(data);
    } catch (error) {
      console.error("Error fetching waiter types:", error);
    } finally {
      setIsLoadingWaiterTypes(false);
    }
  };

  const fetchAllData = async () => {
    setIsDishesLoading(true);
    setLoading(true);
    try {
      // 1. Fetch Categories/Dishes
      const dishRes = await getCategory();
      const categories = dishRes?.data?.data || [];
      setDishesList(categories);

      // Helper to resolve dish IDs and selectionRate by name
      const resolveDishes = (selectedItemsObj) => {
        const resolved = [];
        if (!selectedItemsObj) return resolved;
        Object.values(selectedItemsObj)
          .flat()
          .forEach((itemName) => {
            let foundId = null;
            let selectionRate = 0;
            let baseCost = 0;
            const targetName =
              typeof itemName === "string" ? itemName : itemName.name || "";
            if (!targetName) return;
            let categoryName = "Dishes";
            for (const cat of categories) {
              const dish = cat.items?.find((d) => d.name === targetName);
              if (dish) {
                foundId = dish.id;
                selectionRate = parseFloat(dish.selection_rate) || 0;
                baseCost = parseFloat(dish.base_cost) || 0;
                categoryName = cat.name;
                break;
              }
            }
            if (!foundId) {
              // Attempt to find category from the key in selectedItemsObj if it exists
              for (const [catKey, catItems] of Object.entries(
                selectedItemsObj
              )) {
                if (
                  catItems.some(
                    (item) =>
                      (typeof item === "string" ? item : item.name) ===
                      targetName
                  )
                ) {
                  categoryName = catKey;
                  break;
                }
              }
            }
            resolved.push({
              dishId: foundId,
              dishName: targetName,
              categoryName,
              selectionRate,
              baseCost,
              isOriginal: true,
            });
          });
        return resolved;
      };

      // 2. Fetch Order Details
      const response = await getSingleOrder(id);
      if (response?.data?.data) {
        const data = response.data.data;
        const parseDate = (dateStr) => {
          if (!dateStr) return new Date();
          const [day, month, year] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day);
        };

        let parsedSchedule = [];
        if (data.sessions && data.sessions.length > 0) {
          const scheduleMap = {};
          data.sessions.forEach((session) => {
            const sDate = session.event_date
              ? parseDate(session.event_date)
              : new Date();
            const dateKey = sDate.toISOString().split("T")[0];

            if (!scheduleMap[dateKey]) {
              scheduleMap[dateKey] = {
                event_date: sDate,
                timeSlots: [],
                dayTotalAmount: 0,
              };
            }

            const slot = {
              id: session.id,
              timeLabel: session.event_time || "",
              event_address: session.event_address || data.event_address || "",
              estimatedPersons: session.estimated_persons || 0,
              perPlatePrice: session.per_dish_amount || 0,
              dishes: resolveDishes(session.selected_items),
              extraServices: (Array.isArray(session.extra_service)
                ? session.extra_service
                : []
              ).map((ext) => ({
                serviceName: ext.service_name || ext.extra || "",
                price: String(
                  (Number(ext.amount) || 0) / (Number(ext.quantity) || 1)
                ),
                quantity: ext.quantity || 1,
                totalAmount: 0,
              })),
              waiterServices: (() => {
                const wsData = session.waiter_service;
                if (!wsData) return [];
                if (wsData.entries && Array.isArray(wsData.entries)) {
                  return wsData.entries.map((ent) => ({
                    waiterType: ent.type || "",
                    waiterRate: String(ent.rate || 0),
                    waiterCount: String(ent.count || 0),
                    waiterNotes: ent.notes || "",
                  }));
                } else if (wsData.type && wsData.count) {
                  return [{
                    waiterType: wsData.type,
                    waiterRate: String(wsData.rate || 0),
                    waiterCount: String(wsData.count || 0),
                    waiterNotes: wsData.notes || "",
                  }];
                }
                return [];
              })(),
              subtotalAmount: 0,
            };

            scheduleMap[dateKey].timeSlots.push(slot);
          });
          parsedSchedule = Object.values(scheduleMap);
        }

        if (parsedSchedule.length === 0) {
          parsedSchedule = [
            {
              event_date: new Date(),
              timeSlots: [
                {
                  timeLabel: "",
                  estimatedPersons: 0,
                  perPlatePrice: 0,
                  event_address: "",
                  dishes: [],
                  extraServices: [],
                  waiterServices: [],
                  subtotalAmount: 0,
                },
              ],
              dayTotalAmount: 0,
            },
          ];
        }

        if (isSessionMode) {
          const sIndex = parseInt(sessionIndexParam, 10);
          // Extract the specific session based on flat index across days/slots
          let flatIndex = 0;
          let targetDay = null;
          let beforeSessions = [];
          let afterSessions = [];
          let found = false;

          for (let d = 0; d < parsedSchedule.length; d++) {
            const day = parsedSchedule[d];
            for (let s = 0; s < day.timeSlots.length; s++) {
              const slot = day.timeSlots[s];
              const sessionData = {
                dayIdx: d,
                slotIdx: s,
                event_date: day.event_date,
                event_address: slot.event_address,
                ...slot,
              };
              if (flatIndex === sIndex) {
                targetDay = { ...day, timeSlots: [slot] };
                found = true;
              } else if (!found) {
                beforeSessions.push(sessionData);
              } else {
                afterSessions.push(sessionData);
              }
              flatIndex++;
            }
          }

          if (targetDay) {
            parsedSchedule = [targetDay];
            setHiddenSessionsContext({
              before: beforeSessions,
              after: afterSessions,
            });
          }
        }

        setFormData((prev) => ({
          ...prev,
          id: data.id || "",
          name: data.name || "",
          mobile_no: data.mobile_no || "",
          reference: data.reference || "",
          schedule: parsedSchedule,
          description: data.description || "",
          rule: data.rule || false,
          advance_amount: data.advance_amount || 0,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch order details");
      console.error("Fetch Error:", error);
    } finally {
      setIsDishesLoading(false);
      setLoading(false);
    }
  };

  // Live calculation of subtotals, day totals, and grand total whenever schedule changes
  useEffect(() => {
    let grandTotal = 0;
    const updatedSchedule = formData.schedule.map((day) => {
      let dayTotal = 0;
      const updatedTimeSlots = day.timeSlots.map((slot) => {
        let slotSubtotal = 0;

        // subtotal uses whatever perPlatePrice is currently set to
        const currentPlatePrice = Number(slot.perPlatePrice) || 0;
        slotSubtotal +=
          currentPlatePrice * (Number(slot.estimatedPersons) || 0);

        (slot.waiterServices || []).forEach((ws) => {
          slotSubtotal += (Number(ws.waiterRate) || 0) * (Number(ws.waiterCount) || 0);
        });

        slot.extraServices.forEach((srv) => {
          slotSubtotal +=
            (Number(srv.price) || 0) * (Number(srv.quantity) || 0);
        });
        dayTotal += slotSubtotal;
        return { ...slot, subtotalAmount: slotSubtotal };
      });
      grandTotal += dayTotal;
      return { ...day, timeSlots: updatedTimeSlots, dayTotalAmount: dayTotal };
    });

    // Prevent infinite loop by checking if state actually needs an update
    const currentStr = JSON.stringify({
      s: formData.schedule,
      g: formData.grandTotalAmount,
    });
    const newStr = JSON.stringify({ s: updatedSchedule, g: grandTotal });
    if (currentStr !== newStr) {
      setFormData((prev) => ({
        ...prev,
        schedule: updatedSchedule,
        grandTotalAmount: grandTotal,
      }));
    }
  }, [JSON.stringify(formData.schedule)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile_no") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      formattedValue = formattedValue.slice(0, 10);
      setFormData({ ...formData, [name]: formattedValue });
    } else if (["per_dish_amount", "estimated_persons"].includes(name)) {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const getTomorrow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          event_date: getTomorrow(),
          timeSlots: [
            {
              timeLabel: "",
              estimatedPersons: 0,
              perPlatePrice: 0,
              event_address: "",
              dishes: [],
              extraServices: [],
              waiterServices: [],
              subtotalAmount: 0,
            },
          ],
          dayTotalAmount: 0,
        },
      ],
    }));
  };

  const handleRemoveSchedule = (index) => {
    if (formData.schedule.length > 1) {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, schedule: newSchedule }));
    }
  };

  const handleScheduleDateChange = (index, date) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index].event_date = date;
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
    if (errors.schedule) setErrors((prev) => ({ ...prev, schedule: "" }));
  };

  // --- Time Slot Handlers ---
  const handleAddTimeSlot = (dayIndex) => {
    const newSchedule = [...formData.schedule];
    newSchedule[dayIndex].timeSlots.push({
      timeLabel: "",
      estimatedPersons: 0,
      perPlatePrice: 0,
      event_address: "",
      dishes: [],
      extraServices: [],
      waiterServices: [],
      subtotalAmount: 0,
    });
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleRemoveTimeSlot = (dayIndex, slotIndex) => {
    const newSchedule = [...formData.schedule];
    if (newSchedule[dayIndex].timeSlots.length > 1) {
      newSchedule[dayIndex].timeSlots = newSchedule[dayIndex].timeSlots.filter(
        (_, idx) => idx !== slotIndex
      );
      setFormData({ ...formData, schedule: newSchedule });
    }
  };

  const handleSlotChange = (dayIndex, slotIndex, field, value) => {
    const newSchedule = [...formData.schedule];
    if (field === "estimatedPersons") {
      value = value.replace(/[^0-9]/g, "");
      if (Number(value) > 100000) {
        value = "100000";
      }
    } else if (field === "perPlatePrice") {
      value = value.replace(/[^0-9.]/g, "");
      // Prevent multiple decimals
      if ((value.match(/\./g) || []).length > 1) {
        value = value.substring(0, value.lastIndexOf("."));
      }
    }
    newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  // --- Dish Handlers ---
  const handleSlotDishesUpdate = (dayIndex, slotIndex, newDishes) => {
    const newSchedule = [...formData.schedule];
    const slot = newSchedule[dayIndex].timeSlots[slotIndex];
    slot.dishes = newDishes;

    // Auto-calculate per plate price when dishes change
    const calculatedPlatePrice = newDishes.reduce(
      (sum, dish) => sum + (parseFloat(dish.selectionRate) || 0),
      0
    );
    if (calculatedPlatePrice > 0 || newDishes.length === 0) {
      slot.perPlatePrice = parseFloat(calculatedPlatePrice.toFixed(2));
    }

    setFormData({ ...formData, schedule: newSchedule });
  };

  // --- Extra Services Handlers ---
  const handleSlotAddExtra = (dayIndex, slotIndex) => {
    const newSchedule = [...formData.schedule];
    newSchedule[dayIndex].timeSlots[slotIndex].extraServices.push({
      serviceName: "",
      price: "",
      quantity: 1,
      totalAmount: 0,
    });
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleSlotRemoveExtra = (dayIndex, slotIndex, extraIndex) => {
    const newSchedule = [...formData.schedule];
    newSchedule[dayIndex].timeSlots[slotIndex].extraServices = newSchedule[
      dayIndex
    ].timeSlots[slotIndex].extraServices.filter((_, idx) => idx !== extraIndex);
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleSlotExtraChange = (
    dayIndex,
    slotIndex,
    extraIndex,
    field,
    value
  ) => {
    const newSchedule = [...formData.schedule];
    if (["price", "quantity"].includes(field))
      value = value.replace(/[^0-9]/g, "");
    newSchedule[dayIndex].timeSlots[slotIndex].extraServices[extraIndex][
      field
    ] = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  // --- Waiter Services Handlers ---
  const handleSlotAddWaiter = (dayIndex, slotIndex) => {
    const newSchedule = [...formData.schedule];
    const slot = newSchedule[dayIndex].timeSlots[slotIndex];
    slot.waiterServices = slot.waiterServices || [];
    slot.waiterServices.push({
      waiterType: "",
      waiterRate: "0",
      waiterCount: "",
      waiterNotes: "",
    });
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleSlotRemoveWaiter = (dayIndex, slotIndex, waiterIndex) => {
    const newSchedule = [...formData.schedule];
    const slot = newSchedule[dayIndex].timeSlots[slotIndex];
    slot.waiterServices = (slot.waiterServices || []).filter(
      (_, idx) => idx !== waiterIndex
    );
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleSlotWaiterChange = (
    dayIndex,
    slotIndex,
    waiterIndex,
    field,
    value
  ) => {
    const newSchedule = [...formData.schedule];
    const slot = newSchedule[dayIndex].timeSlots[slotIndex];
    slot.waiterServices = slot.waiterServices || [];
    if (field === "waiterCount") {
      value = value.replace(/[^0-9]/g, "");
    } else if (field === "waiterRate") {
      value = value.replace(/[^0-9.]/g, "");
      if ((value.match(/\./g) || []).length > 1)
        value = value.substring(0, value.lastIndexOf("."));
    }
    slot.waiterServices[waiterIndex][field] = value;
    if (field === "waiterType") {
      const typeObj = waiterTypes?.find(
        (t) => t.name?.toLowerCase() === value?.toLowerCase()
      );
      slot.waiterServices[waiterIndex].waiterRate = typeObj
        ? String(typeObj.per_person_rate)
        : "0";
    }
    setFormData({ ...formData, schedule: newSchedule });
  };

  const validateForm = () => {
    let newErrors = {};
    let marginWarnings = [];

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/^[0-9]+$/.test(formData.name.trim())) {
      newErrors.name = "Name cannot contain only numbers. Please enter a valid name.";
    } else if (!/^[A-Za-z]/.test(formData.name.trim())) {
      newErrors.name = "Name must start with an alphabetic character.";
    }

    if (formData.reference && formData.reference.trim() && formData.reference.trim() !== "-") {
      if (/^[0-9]+$/.test(formData.reference.trim())) {
        newErrors.reference = "Reference Name cannot contain only numbers. Please enter a valid name.";
      } else if (!/^[A-Za-z]/.test(formData.reference.trim())) {
        newErrors.reference = "Reference Name must start with an alphabetic character.";
      }
    }
    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = "Mobile number is required";
    } else if (formData.mobile_no.length !== 10) {
      newErrors.mobile_no = "Mobile number must be exactly 10 digits";
    }

    // if (!formData.reference.trim()) newErrors.reference = "Reference is required";

    if (!formData.schedule || formData.schedule.length === 0) {
      newErrors.schedule = "At least one event date is required";
    } else {
      let isScheduleValid = true;
      let isSlotValid = true;
      formData.schedule.forEach((day, dIdx) => {
        if (!day.event_date) isScheduleValid = false;

        if (!day.timeSlots || day.timeSlots.length === 0) {
          isSlotValid = false;
        } else {
          const timeLabelCounts = {};
          day.timeSlots.forEach((slot, sIdx) => {
            const slotName =
              slot.timeLabel || `Slot ${sIdx + 1} (Day ${dIdx + 1})`;
            if (!slot.timeLabel) {
              newErrors[`timeLabel_${dIdx}_${sIdx}`] = "Time slot is required";
            } else {
              timeLabelCounts[slot.timeLabel] =
                (timeLabelCounts[slot.timeLabel] || 0) + 1;
              if (timeLabelCounts[slot.timeLabel] > 3) {
                newErrors[`timeLabel_${dIdx}_${sIdx}`] = `Max 3 limit`;
              }
            }

            if (!slot.estimatedPersons || slot.estimatedPersons <= 0) {
              newErrors[`persons_${dIdx}_${sIdx}`] = "Number of persons is required";
            } else if (Number(slot.estimatedPersons) > 100000) {
              newErrors[`persons_${dIdx}_${sIdx}`] = "Max limit 100,000";
            }

            if (!slot.perPlatePrice || slot.perPlatePrice <= 0) {
              newErrors[`platePrice_${dIdx}_${sIdx}`] = "Price is required";
            } else {
              const minPrice =
                (slot.dishes || []).reduce(
                  (sum, d) => sum + (d.baseCost || 0),
                  0
                ) * 1.2;
              if (Number(slot.perPlatePrice) < minPrice) {
                marginWarnings.push(
                  `${slotName}: Per Plate Price is ₹${slot.perPlatePrice}, but should be at least ₹${minPrice.toFixed(2)} based on base cost + 20% margin.`
                );
              }
            }

            if (!slot.dishes || slot.dishes.length === 0)
              newErrors[`dishes_${dIdx}_${sIdx}`] = "Select dishes";

            if (!slot.event_address || !slot.event_address.trim()) {
              newErrors[`event_address_${dIdx}_${sIdx}`] = "Address is required";
            }
          });
        }
      });

      if (!isScheduleValid)
        newErrors.schedule = "Ensure all schedule dates have a valid Date.";
      if (!isSlotValid)
        newErrors.slots = "Ensure all dates have at least one time slot.";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      const firstErrorKey = Object.keys(newErrors)[0];

      if (firstErrorKey === "name" || firstErrorKey === "reference" || firstErrorKey === "mobile_no") {
        toast.error(newErrors[firstErrorKey]);
      } else if (firstErrorKey.startsWith("event_address")) {
        toast.error("Event venue/address is mandatory. Please enter the venue details.");
      } else if (firstErrorKey.startsWith("persons")) {
        toast.error("Number of persons is mandatory. Please enter a valid number.");
      } else if (firstErrorKey.startsWith("platePrice")) {
        toast.error("Per plate price is mandatory. Please enter a valid price.");
      } else if (firstErrorKey.startsWith("timeLabel")) {
        toast.error("Time slot label is mandatory.");
      } else if (firstErrorKey.startsWith("dishes")) {
        toast.error("Please select items for this event.");
      } else if (firstErrorKey === "schedule" || firstErrorKey === "slots") {
        toast.error(newErrors[firstErrorKey]);
      } else {
        toast.error("Please review all mandatory fields before submitting.");
      }
    }
    return { isValid, marginWarnings };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, marginWarnings } = validateForm();
    if (!isValid) return;

    const formatWaiterService = (waiterServices) => {
      const entries = (waiterServices || []).filter(
        (ws) => ws.waiterType && ws.waiterType.trim() !== ""
      );
      if (entries.length === 0) {
        return { type: "", rate: 0, count: 0, notes: "", amount: "0", entries: [] };
      }
      const totalAmount = entries.reduce(
        (sum, ws) =>
          sum + (Number(ws.waiterRate) || 0) * (Number(ws.waiterCount) || 0),
        0
      );
      return {
        type: entries.map((ws) => ws.waiterType).join(", "),
        rate: entries[0]?.waiterRate || 0,
        count: entries.reduce((s, ws) => s + (Number(ws.waiterCount) || 0), 0),
        notes: entries.map((ws) => ws.waiterNotes).filter(Boolean).join("; "),
        amount: String(totalAmount),
        entries: entries.map((ws) => ({
          type: ws.waiterType,
          rate: ws.waiterRate,
          count: ws.waiterCount,
          notes: ws.waiterNotes,
          amount: String(
            (Number(ws.waiterRate) || 0) * (Number(ws.waiterCount) || 0)
          ),
        })),
      };
    };

    const submitPayload = () => {
      const apiSessions = [];
      formData.schedule.forEach((day) => {
        const dateObj = new Date(day.event_date);
        const pad = (n) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(dateObj.getDate())}-${pad(dateObj.getMonth() + 1)}-${dateObj.getFullYear()}`;

        day.timeSlots.forEach((slot) => {
          apiSessions.push({
            id: slot.id,
            event_date: formattedDate,
            event_time: slot.timeLabel,
            event_address: slot.event_address,
            estimated_persons: slot.estimatedPersons || 0,
            per_dish_amount: slot.perPlatePrice || 0,
            selected_items: slot.dishes.reduce((acc, d) => {
              const cat = d.categoryName || "Dishes";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push({ name: d.dishName });
              return acc;
            }, {}),
            extra_service: slot.extraServices
              .filter((s) => s.serviceName.trim() !== "" && s.price !== "")
              .map((s) => ({
                service_name: s.serviceName,
                amount: String(
                  (Number(s.price) || 0) * (Number(s.quantity) || 1)
                ),
                quantity: s.quantity,
                extra: true,
              })),
            waiter_service: formatWaiterService(slot.waiterServices),
          });
        });
      });

      const pad = (n) => n.toString().padStart(2, "0");
      const formatSessDate = (d) =>
        `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

      // Stitch back hidden sessions if we are in Session-Wise mode
      if (isSessionMode) {
        const formatHiddenSession = (sess) => ({
          id: sess.id,
          event_date: formatSessDate(sess.event_date),
          event_time: sess.timeLabel,
          event_address: sess.event_address,
          estimated_persons: sess.estimatedPersons || 0,
          per_dish_amount: sess.perPlatePrice || 0,
          selected_items: sess.dishes.reduce((acc, d) => {
            const cat = d.categoryName || "Dishes";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ name: d.dishName });
            return acc;
          }, {}),
          extra_service: sess.extraServices
            .filter((s) => s.serviceName.trim() !== "" && s.price !== "")
            .map((s) => ({
              service_name: s.serviceName,
              amount: String(
                (Number(s.price) || 0) * (Number(s.quantity) || 1)
              ),
              quantity: s.quantity,
              extra: true,
            })),
          waiter_service: formatWaiterService(sess.waiterServices),
        });

        const stitchedSessions = [
          ...hiddenSessionsContext.before.map(formatHiddenSession),
          ...apiSessions,
          ...hiddenSessionsContext.after.map(formatHiddenSession),
        ];

        // Recalculate Grand Total across all stitched sessions
        let fullGrandTotal = 0;
        stitchedSessions.forEach((sess) => {
          let sessTotal =
            (Number(sess.estimated_persons) || 0) *
            (Number(sess.per_dish_amount) || 0);
          (sess.extra_service || []).forEach((extra) => {
            sessTotal += Number(extra.amount) || 0;
          });
          const waiterAmt = Number(sess.waiter_service?.amount || 0);
          sessTotal += waiterAmt;
          fullGrandTotal += sessTotal;
        });

        apiSessions.splice(0, apiSessions.length, ...stitchedSessions);
        formData.grandTotalAmount = fullGrandTotal;
      }

      const apiPayload = {
        id: formData.id,
        name: formData.name,
        mobile_no: formData.mobile_no,
        reference: formData.reference?.trim() || "-",
        description: formData.description,
        rule: formData.rule,
        advance_amount: formData.advance_amount,
        sessions: apiSessions,
        grandTotalAmount: formData.grandTotalAmount,
      };

      navigate("/edit-order-pdf", {
        state: {
          apiPayload,
          id: formData.id,
          fromNavigation: formData.fromNavigation,
        },
      });
    };

    if (marginWarnings.length > 0) {
      import("sweetalert2").then(({ default: Swal }) => {
        Swal.fire({
          title: "Price Margin Warning",
          html: `<p class="text-sm mt-2 font-bold text-gray-800">The per plate price is below the minimum margin. Do you still want to place this order?</p>`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#845cbd",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Proceed anyway",
        }).then((result) => {
          if (result.isConfirmed) {
            submitPayload();
          }
        });
      });
    } else {
      submitPayload();
    }
  };

  return (
    <EditDishComponent
      formData={formData}
      errors={errors}
      dishesList={dishesList}
      isDishesLoading={isDishesLoading}
      loading={loading}
      handleChange={handleChange}
      handleAddSchedule={handleAddSchedule}
      handleRemoveSchedule={handleRemoveSchedule}
      handleScheduleDateChange={handleScheduleDateChange}
      handleAddTimeSlot={handleAddTimeSlot}
      handleRemoveTimeSlot={handleRemoveTimeSlot}
      handleSlotChange={handleSlotChange}
      handleSlotDishesUpdate={handleSlotDishesUpdate}
      handleSlotAddExtra={handleSlotAddExtra}
      handleSlotRemoveExtra={handleSlotRemoveExtra}
      handleSlotExtraChange={handleSlotExtraChange}
      waiterTypes={waiterTypes}
      isLoadingWaiterTypes={isLoadingWaiterTypes}
      handleSlotAddWaiter={handleSlotAddWaiter}
      handleSlotRemoveWaiter={handleSlotRemoveWaiter}
      handleSlotWaiterChange={handleSlotWaiterChange}
      handleSubmit={handleSubmit}
      isSessionMode={isSessionMode}
    />
  );
}

export default EditDishContoller;
