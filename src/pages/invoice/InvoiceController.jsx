import { useEffect, useState } from "react";
import InvoiceComponent from "./InvoiceComponent";
import toast from "react-hot-toast";
import { getInvoice } from "../../api/FetchInvoice";
import { useNavigate } from "react-router-dom";

function InvoiceController() {
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();

  const handleQuickFilter = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDay = new Date();
    
    if (type === "today") {
      setDateRange([today, today]);
    } else if (type === "thisWeek") {
      const first = currentDay.getDate() - currentDay.getDay() + (currentDay.getDay() === 0 ? -6 : 1); // Monday
      const firstDay = new Date(currentDay.setDate(first));
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      lastDay.setHours(23, 59, 59, 999);
      setDateRange([firstDay, lastDay]);
    } else if (type === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);
      setDateRange([firstDay, lastDay]);
    } else if (type === "clear") {
      setDateRange([null, null]);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await getInvoice();
      if (!response) {
        toast.error("Response is undefined, check network connection or auth");
        return;
      }
      if (response.data?.status) {
        const dataArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const allInvoices = dataArray.map((item) => {
          const billed = item.booking || {};
          return {
            id: billed.id,
            name: billed.name,
            mobile_no: billed.mobile_no,
            reference: billed.reference,
            status: billed.status,
            date: billed.date,
            sessions: billed.sessions || [],

            bill_no: item.bill_no,
            payment_mode: item.payment_mode,
            payment_status: item.payment_status,
            advance_amount: item.advance_amount,
            pending_amount: item.pending_amount,
            transaction_amount: item.transaction_amount,
            total_amount: item.total_amount,
            formatted_event_date: item.formatted_event_date,
          };
        });
        setInvoice(allInvoices);
      } else {
        toast.error("API returned status false");
      }
    } catch (error) {
      toast.error(`JS Error: ${error.message}`);
      console.error("Fetch Invoice Exception:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  //Handle Filtering
  const getFilteredInvoices = () => {
    if (selectedFilter === "All") return invoice;
    if (selectedFilter === "Paid") {
      return invoice.filter((inv) => inv.payment_status === "PAID");
    }
    if (selectedFilter === "Unpaid") {
      return invoice.filter((inv) => inv.payment_status !== "PAID");
    }
    return invoice.filter(
      (inv) => inv.payment_status.toUpperCase() === selectedFilter.toUpperCase()
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-200 text-green-700";
      case "UNPAID":
        return "bg-red-200 text-red-700";
      default:
        return "bg-yellow-200 text-yellow-700";
    }
  };

  const applySearchDateFilter = (list) => {
    const [startDate, endDate] = dateRange;
    return list.filter((inv) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = inv.name?.toLowerCase().includes(query);
        const mobileMatch = inv.mobile_no?.includes(query);
        if (!nameMatch && !mobileMatch) return false;
      }
      
      // Date range filter
      if (startDate || endDate) {
        let eventDates = [];
        if (inv.sessions && inv.sessions.length > 0) {
          eventDates = inv.sessions.map((s) => {
            if (!s.event_date) return new Date(NaN);
            const parts = s.event_date.split("-");
            if (parts.length < 3) return new Date(NaN);
            if (parts[0].length === 4) return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          });
        } else if (inv.date) {
           const parts = inv.date.split("-");
           if (parts.length === 3) {
             if (parts[0].length === 4) eventDates.push(new Date(`${parts[0]}-${parts[1]}-${parts[2]}`));
             else eventDates.push(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`));
           }
        } else if (inv.formatted_event_date) {
           eventDates.push(new Date(inv.formatted_event_date));
        }

        const passesDateRange = eventDates.some((dateObj) => {
          if (isNaN(dateObj.getTime())) return false;
          dateObj.setHours(0,0,0,0);
          
          const start = startDate ? new Date(startDate) : null;
          if (start) start.setHours(0,0,0,0);
          const end = endDate ? new Date(endDate) : null;
          if (end) end.setHours(23,59,59,999);

          if (start && end) {
            return dateObj >= start && dateObj <= end;
          } else if (start) {
            return dateObj >= start; 
          } else if (end) {
            return dateObj <= end;
          }
          return false;
        });
        
        if (!passesDateRange) return false;
      }
      return true;
    });
  };

  return (
    <InvoiceComponent
      loading={loading}
      invoice={applySearchDateFilter(getFilteredInvoices())}
      totalCount={invoice.length}
      navigate={navigate}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleQuickFilter={handleQuickFilter}
      getStatusColor={getStatusColor}
    />
  );
}

export default InvoiceController;
