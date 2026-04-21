import { Outlet } from "react-router-dom";
import OrderManagementTabs from "./OrderManagementTabs";

function OrderManagementPage() {
  return (
    <div className="space-y-5">
      <OrderManagementTabs />
      <Outlet />
    </div>
  );
}

export default OrderManagementPage;

