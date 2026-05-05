/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Loader from "../../Components/common/Loader";
import VendorTable from "../../Components/vendor/VendorTable";
import PageHero from "../../Components/common/PageHero";
import { FiTruck, FiUserPlus } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";

function VendorComponent({
  loading,
  vendors,
  onVendorAdd,
  onVendorEdit,
  onVendorDelete,
}) {
  const { hasPermission } = usePermissions();
  const heroActionSx = {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "var(--color-primary-contrast,white)",
    border: "1px solid rgba(255,255,255,0.35)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
  };

  return (
    <>
      <PageHero
        icon={<FiTruck size={24} />}
        eyebrow="Suppliers"
        title="Vendors"
        subtitle={`${vendors?.length || 0} vendor${vendors?.length !== 1 ? "s" : ""} registered`}
        actions={
          hasPermission("vendors.create") ? (
            <Button
              variant="contained"
              startIcon={<FiUserPlus size={15} />}
              onClick={onVendorAdd}
              sx={heroActionSx}
            >
              Add Vendor
            </Button>
          ) : null
        }
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

        {loading ? (
          <Loader message="Loading vendors..." />
        ) : (
          <VendorTable
            vendors={vendors}
            onVendorEdit={onVendorEdit}
            onVendorDelete={onVendorDelete}
          />
        )}
      </Paper>
    </>
  );
}

export default VendorComponent;
