import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllOrder } from "../../api/FetchAllOrder";
import CalendarComponent from "./CalendarComponent";

function CalendarController() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllOrder();
      if (response?.data?.status) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch orders every time user navigates to this page
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, location.key]);

  return (
    <CalendarComponent orders={orders} loading={loading} navigate={navigate} />
  );
}

export default CalendarController;
