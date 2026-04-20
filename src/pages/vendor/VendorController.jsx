import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorComponent from "./VendorComponent";
import toast from "react-hot-toast";
import { fetchVendors } from "../../api/vendors";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";

function VendorController() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);

  const fetchVendorsData = async () => {
    try {
      const data = await fetchVendors();
      if (data?.data) {
        setVendors(data.data);
      } else {
        toast.error("Failed to fetch vendors");
      }
    } catch (error) {
      toast.error("Error fetching vendors");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchVendorsData();
      hasFetched.current = true;
    }
  }, []);

  // Handle Add Vendor
  const handleAddVendor = () => {
    navigate("/add-vendor", { state: { mode: "add" } });
  };

  // Handle Edit Vendor
  const handleEditVendor = (vendor) => {
    navigate(`/edit-vendor/${vendor.id}`, {
      state: { mode: "edit", vendorData: vendor },
    });
  };

  // Handle Delete Vendor
  const handleDeleteVendor = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/vendors",
      name: "vendor",
      successMessage: "Vendor deleted successfully!",
      onSuccess: fetchVendorsData,
    });
  };

  return (
    <VendorComponent
      navigate={navigate}
      loading={loading}
      vendors={vendors}
      onVendorAdd={handleAddVendor}
      onVendorEdit={handleEditVendor}
      onVendorDelete={handleDeleteVendor}
    />
  );
}

export default VendorController;
