import { useNavigate } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import DashboardComponent from "./DashboardComponent";

function DashboardController() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useOrders();

  // Click on any event card jumps straight to the order-details view, which
  // is the deepest landing page that hangs off a single booking.
  const goToEvent = (eventId) => {
    if (!eventId) return;
    navigate(`/view-order-details/${eventId}`);
  };

  return (
    <DashboardComponent
      loading={isLoading}
      orders={orders}
      onEventClick={goToEvent}
    />
  );
}

export default DashboardController;
