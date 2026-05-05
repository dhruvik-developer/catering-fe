import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import usePermissions from "../../hooks/usePermissions";
import { UserContext } from "../../context/UserContext";
import DashboardComponent from "./DashboardComponent";

function DashboardController() {
  const navigate = useNavigate();
  const { username } = useContext(UserContext);
  const { hasPermission } = usePermissions();
  const { data: orders = [], isLoading } = useOrders();

  // Click on any event card jumps straight to the order-details view, which
  // is the deepest landing page that hangs off a single booking.
  const goToEvent = (eventId) => {
    if (!eventId) return;
    navigate(`/view-order-details/${eventId}`);
  };

  // Build the quick-action list from permissions so we never render a button
  // that would 404 the user. Each entry is gated by the same permission the
  // sidebar uses for the destination, keeping behaviour consistent.
  const quickActions = [
    {
      key: "all-orders",
      label: "All Orders",
      to: "/order-management/all-order",
      permission: "event_bookings.view",
    },
    {
      key: "calendar",
      label: "Calendar",
      to: "/calendar",
      permission: "event_bookings.view",
    },
    {
      key: "quotation",
      label: "Quotations",
      to: "/order-management/quotation",
      permission: "quotations.view",
    },
    {
      key: "invoice",
      label: "Invoices",
      to: "/order-management/invoice",
      permission: "invoices.view",
    },
    {
      key: "stock",
      label: "Stock",
      to: "/stock",
      permission: "stock.view",
    },
    {
      key: "create-dish",
      label: "Create Dish",
      to: "/dish",
      permission: ["event_session.view", "dishes.view"],
    },
  ].filter((action) => hasPermission(action.permission));

  return (
    <DashboardComponent
      loading={isLoading}
      username={username}
      orders={orders}
      onEventClick={goToEvent}
      onQuickAction={(to) => navigate(to)}
      quickActions={quickActions}
    />
  );
}

export default DashboardController;
