import { Outlet } from "react-router-dom";
import PeopleTabs from "./PeopleTabs";

function PeoplePage() {
  return (
    <div className="space-y-5">
      <PeopleTabs />
      <Outlet />
    </div>
  );
}

export default PeoplePage;
