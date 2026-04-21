import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DishComponent from "./DishComponent";
import { getCategory } from "../../api/FetchCategory";
import { getWaiterTypes } from "../../api/EventStaffApis";
import { createEventBooking } from "../../api/PostEventBooking";

function DishContoller() {
  const navigate = useNavigate();
  const [dishesList, setDishesList] = useState([]);
  const [waiterTypes, setWaiterTypes] = useState([]);
  const [isDishesLoading, setIsDishesLoading] = useState(false);
  const [isLoadingWaiterTypes, setIsLoadingWaiterTypes] = useState(false);
  const getTomorrow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  };

  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    date: new Date(),
    reference: "",
    schedule: [
      {
        event_date: getTomorrow(),
        event_address: "",
        timeSlots: [
          {
            timeLabel: "",
            estimatedPersons: 0,
            perPlatePrice: 0,
            waiterServices: [],
            dishes: [],
            extraServices: [],
            subtotalAmount: 0,
          },
        ],
        dayTotalAmount: 0,
      },
    ],
    grandTotalAmount: 0,
    description: "",
    rule: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDishes();
    fetchWaiterTypes();
  }, []);

  const fetchWaiterTypes = async () => {
    setIsLoadingWaiterTypes(true);
    try {
      const response = await getWaiterTypes();
      const data = response?.data?.data ?? response?.data;
      if (Array.isArray(data)) {
        setWaiterTypes(data);
      } else {
        console.warn("Unexpected waiter-types payload", response?.data);
      }
    } catch (error) {
      console.error("Error fetching waiter types:", error);
    } finally {
      setIsLoadingWaiterTypes(false);
    }
  };

  const fetchDishes = async () => {
    setIsDishesLoading(true);
    try {
      const response = await getCategory();
      if (response?.data?.data) {
        setDishesList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setIsDishesLoading(false);
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

        // Sum all waiter service entries
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

    setFormData((prev) => ({
      ...prev,
      schedule: updatedSchedule,
      grandTotalAmount: grandTotal,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              waiterServices: [],
              event_address: "",
              dishes: [],
              extraServices: [],
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
      waiterServices: [],
      event_address: "",
      dishes: [],
      extraServices: [],
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
      if (Number(value) > 100000) value = "100000";
    } else if (field === "perPlatePrice") {
      value = value.replace(/[^0-9.]/g, "");
      if ((value.match(/\./g) || []).length > 1)
        value = value.substring(0, value.lastIndexOf("."));
    }
    const slot = newSchedule[dayIndex].timeSlots[slotIndex];
    slot[field] = value;
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

  // --- Waiter Services Handlers (multiple entries) ---
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
    // Auto-fill rate when type is selected
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

  // =========================================
  // STEP-SPECIFIC VALIDATION
  // =========================================

  // Step 1: Validate client info + schedule dates/timeslots
  const validateStep1 = () => {
    let newErrors = {};

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

    // Validate Schedule Array
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
            if (!slot.timeLabel) {
              newErrors[`timeLabel_${dIdx}_${sIdx}`] = "Required";
            } else {
              timeLabelCounts[slot.timeLabel] =
                (timeLabelCounts[slot.timeLabel] || 0) + 1;
              if (timeLabelCounts[slot.timeLabel] > 3) {
                newErrors[`timeLabel_${dIdx}_${sIdx}`] = `Max 3 limit`;
              }
            }

            if (!slot.estimatedPersons || slot.estimatedPersons <= 0) {
              newErrors[`persons_${dIdx}_${sIdx}`] = "Required";
            } else if (Number(slot.estimatedPersons) > 100000) {
              newErrors[`persons_${dIdx}_${sIdx}`] = "Max limit 100,000";
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
      if (newErrors.name && newErrors.name !== "Name is required") {
        toast.error(newErrors.name);
      } else if (newErrors.reference) {
        toast.error(newErrors.reference);
      } else {
        toast.error("Please fill in all mandatory fields before proceeding.");
      }
    }
    return isValid;
  };

  // Step 2: Validate that at least some dishes are selected
  const validateStep2 = () => {
    let newErrors = {};

    formData.schedule.forEach((day, dIdx) => {
      day.timeSlots.forEach((slot, sIdx) => {
        if (!slot.dishes || slot.dishes.length === 0) {
          newErrors[`dishes_${dIdx}_${sIdx}`] = "Select dishes";
        }
      });
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid)
      toast.error("Please select at least one item/dish before proceeding.");
    return isValid;
  };

  // Full validation (for final submit)
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
    if (e) e.preventDefault();

    const { isValid, marginWarnings } = validateForm();
    if (!isValid) return;

    const submitPayload = async () => {
      // Build the flat `sessions` array expected by Django EventBookingSerializer
      const apiSessions = [];
      formData.schedule.forEach((day) => {
        const dateObj = new Date(day.event_date);
        const pad = (n) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(dateObj.getDate())}-${pad(dateObj.getMonth() + 1)}-${dateObj.getFullYear()}`;

        day.timeSlots.forEach((slot) => {
          apiSessions.push({
            event_date: formattedDate,
            event_time: slot.timeLabel,
            event_address: slot.event_address,
            estimated_persons: slot.estimatedPersons || 0,
            per_dish_amount: slot.perPlatePrice || 0,
            selected_items: slot.dishes.reduce((acc, d) => {
              const cat = d.categoryName || "Dishes";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(d.dishName);
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
            waiter_service: (() => {
              const entries = (slot.waiterServices || []).filter(
                (ws) => ws.waiterType && ws.waiterType.trim() !== ""
              );
              if (entries.length === 0) {
                return { type: "", rate: 0, count: 0, notes: "", amount: "0" };
              }
              // Send all entries as a list; backend receives first entry's type
              // and the total combined amount for waiter_service_amount
              const totalAmount = entries.reduce(
                (sum, ws) =>
                  sum +
                  (Number(ws.waiterRate) || 0) * (Number(ws.waiterCount) || 0),
                0
              );
              return {
                type: entries.map((ws) => ws.waiterType).join(", "),
                rate: entries[0]?.waiterRate || 0,
                count: entries.reduce(
                  (s, ws) => s + (Number(ws.waiterCount) || 0),
                  0
                ),
                notes: entries
                  .map((ws) => ws.waiterNotes)
                  .filter(Boolean)
                  .join("; "),
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
            })(),
          });
        });
      });

      const apiPayload = {
        name: formData.name,
        mobile_no: formData.mobile_no,
        reference: formData.reference.trim() || "-",
        description: formData.description,
        rule: formData.rule,
        sessions: apiSessions,
      };

      // Submit the event booking to the API using the mapped Django format
      const response = await createEventBooking(apiPayload);
      if (response && response.data?.data) {
        navigate("/pdf", { state: { itemData: response.data.data } });
      }
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
    <DishComponent
      formData={formData}
      errors={errors}
      dishesList={dishesList}
      isDishesLoading={isDishesLoading}
      handleChange={handleChange}
      handleAddSchedule={handleAddSchedule}
      handleRemoveSchedule={handleRemoveSchedule}
      handleScheduleDateChange={handleScheduleDateChange}
      handleAddTimeSlot={handleAddTimeSlot}
      handleRemoveTimeSlot={handleRemoveTimeSlot}
      handleSlotChange={handleSlotChange}
      waiterTypes={waiterTypes}
      isLoadingWaiterTypes={isLoadingWaiterTypes}
      handleSlotDishesUpdate={handleSlotDishesUpdate}
      handleSlotAddExtra={handleSlotAddExtra}
      handleSlotRemoveExtra={handleSlotRemoveExtra}
      handleSlotExtraChange={handleSlotExtraChange}
      handleSlotAddWaiter={handleSlotAddWaiter}
      handleSlotRemoveWaiter={handleSlotRemoveWaiter}
      handleSlotWaiterChange={handleSlotWaiterChange}
      handleSubmit={handleSubmit}
      validateStep1={validateStep1}
      validateStep2={validateStep2}
      refreshWaiterTypes={fetchWaiterTypes}
    />
  );
}

export default DishContoller;
