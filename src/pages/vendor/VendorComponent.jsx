/* eslint-disable react/prop-types */
import Loader from "../../Components/common/Loader";
import VendorTable from "../../Components/vendor/VendorTable";
import { FiTruck, FiUserPlus } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";

function VendorComponent({
  navigate,
  loading,
  vendors,
  onVendorAdd,
  onVendorEdit,
  onVendorDelete,
}) {
  const { hasPermission } = usePermissions();
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiTruck className="text-[var(--color-primary)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vendors</h2>
            <p className="text-sm text-gray-400">
              {vendors?.length || 0} vendor{vendors?.length !== 1 ? "s" : ""}{" "}
              registered
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasPermission("vendors.create") && (
            <button
              onClick={onVendorAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
            >
              <FiUserPlus size={15} />
              Add Vendor
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <Loader message="Loading vendors..." />
      ) : (
        <VendorTable
          vendors={vendors}
          onVendorEdit={onVendorEdit}
          onVendorDelete={onVendorDelete}
        />
      )}
    </div>
  );
}

export default VendorComponent;
