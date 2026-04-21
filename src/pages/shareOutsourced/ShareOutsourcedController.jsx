import { useLocation, useNavigate } from "react-router-dom";
import ShareOutsourcedComponent from "./ShareOutsourcedComponent";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";
import { getSingleOrder, updateEventBooking } from "../../api/FetchAllOrder";

function ShareOutsourcedController() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, sessionId, eventAddress, vendorGroups: preloadedVendorGroups } = location.state || {};

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [showCustomAddressInput, setShowCustomAddressInput] = useState(false);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [vendorGroups, setVendorGroups] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAllBusinessProfiles();
        if (res?.status && res?.data?.length > 0) setBusinessProfile(res.data[0]);
      } catch (_) {}
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!eventId) return;

    // Fast path: data already loaded on previous page
    if (preloadedVendorGroups && preloadedVendorGroups.length > 0) {
      setVendorGroups(preloadedVendorGroups);
      const initChecked = {};
      preloadedVendorGroups.forEach((vg, vIdx) => {
        (vg.items || []).forEach((_, iIdx) => {
          initChecked[`${vIdx}-${iIdx}`] = true;
        });
      });
      setCheckedItems(initChecked);
      return;
    }

    // Fallback: no preloaded data available
    setVendorGroups([]);
    setCheckedItems({});
  }, [eventId, sessionId, preloadedVendorGroups]);

  useEffect(() => {
    if (!vendorGroups || vendorGroups.length === 0) return;

    const allVendors = [];
    vendorGroups.forEach(vg => {
      (vg.items || []).forEach(item => {
        if (item.vendor) allVendors.push(item.vendor);
      });
      if (allVendors.length === 0 && vg.vendor) allVendors.push(vg.vendor);
    });

    if (allVendors.length > 0) {
      const firstVendor = allVendors[0];
      const isSameVendor = allVendors.every(v => 
        (v.id && firstVendor.id && v.id === firstVendor.id) || 
        (v.name && firstVendor.name && v.name === firstVendor.name)
      );

      if (isSameVendor) {
        if (firstVendor.delivery_time) setDeliveryTime(firstVendor.delivery_time);
        
        if (firstVendor.delivery_date) {
          try {
            const [dd, mm, yyyy] = firstVendor.delivery_date.split("-");
            if (dd && mm && yyyy) setSelectedDate(new Date(yyyy, mm - 1, dd));
          } catch (e) {}
        }
        
        if (firstVendor.delivery_address) {
          const addr = firstVendor.delivery_address;
          const officeAddr = businessProfile?.godown_address || "C1 1201 Pragati IT Park ,Near AR Mall Mota Varaccha, Surat";
          if (addr === eventAddress) {
            setSelectedAddress("event");
          } else if (addr === officeAddr) {
            setSelectedAddress("office");
          } else {
            setSelectedAddress("custom");
            setCustomAddress(addr);
            setShowCustomAddressInput(true);
          }
        }
      }
    }
  }, [vendorGroups, businessProfile, eventAddress]);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const handleCheckboxChange = (vIdx, iIdx) => {
    const key = `${vIdx}-${iIdx}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateForm = () => {
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
    const hasChecked = Object.values(checkedItems).some(Boolean);
    if (!hasChecked) {
      toast.error("Please select at least one item.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const officeAddress =
      businessProfile?.godown_address ||
      "C1 1201 Pragati IT Park ,Near AR Mall Mota Varaccha, Surat";
    const finalAddress =
      selectedAddress === "custom"
        ? customAddress
        : selectedAddress === "office"
          ? officeAddress
          : eventAddress;

    const formattedDate = selectedDate
      ? `${selectedDate.getDate().toString().padStart(2, "0")}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getFullYear()}`
      : null;

    // Collect selected items across vendor groups
    const selectedItems = [];
    vendorGroups.forEach((vg, vIdx) => {
      (vg.items || []).forEach((item, iIdx) => {
        if (checkedItems[`${vIdx}-${iIdx}`]) {
          selectedItems.push({
            item_name: item.item_name,
            quantity: item.quantity,
            unit: item.unit,
            vendor: {
              id: vg.vendor_id || vg.id || vg.vendor?.id || null,
              name: vg.vendor_name,
              delivery_date: formattedDate,
              delivery_time: deliveryTime,
              delivery_address: finalAddress,
            }
          });
        }
      });
    });

    try {
      setLoading(true);
      if (eventId && sessionId) {
        const orderRes = await getSingleOrder(eventId);
        if (orderRes?.data?.status) {
          const bookingData = orderRes.data.data;
          const sessionIndex = bookingData.sessions.findIndex(
            (s) => String(s.id) === String(sessionId)
          );
          if (sessionIndex > -1) {
            // Deduplicate by item_name
            const currentOutsourced = bookingData.sessions[sessionIndex].outsourced_items || [];
            const newMapped = new Map(currentOutsourced.map(i => [i.item_name, i]));
            selectedItems.forEach(item => {
              newMapped.set(item.item_name, item);
            });
            bookingData.sessions[sessionIndex].outsourced_items = Array.from(newMapped.values());
            
            await updateEventBooking(eventId, bookingData);
          }
        }
      }

      navigate("/share-outsourced-pdf", {
        state: {
          ...location.state,
          statePayload: {
            eventAddress: finalAddress,
            formattedDate,
            deliveryTime,
            selectedItems,
            vendorGroups: vendorGroups.map((vg, vIdx) => ({
              ...vg,
              items: (vg.items || []).filter((_, iIdx) => checkedItems[`${vIdx}-${iIdx}`]),
            })).filter(vg => vg.items.length > 0),
          },
          from: "share-outsourced",
          customParents: {
            ...location.state?.customParents,
            "share-outsourced-pdf": "share-outsourced",
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save outsourced items to backend!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#845cbd] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ShareOutsourcedComponent
      eventAddress={eventAddress}
      vendorGroups={vendorGroups}
      navigate={navigate}
      selectedAddress={selectedAddress}
      handleAddressChange={handleAddressChange}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      deliveryTime={deliveryTime}
      setDeliveryTime={setDeliveryTime}
      checkedItems={checkedItems}
      handleCheckboxChange={handleCheckboxChange}
      handleSubmit={handleSubmit}
      customAddress={customAddress}
      setCustomAddress={setCustomAddress}
      showCustomAddressInput={showCustomAddressInput}
      setShowCustomAddressInput={setShowCustomAddressInput}
      businessProfile={businessProfile}
    />
  );
}

export default ShareOutsourcedController;
