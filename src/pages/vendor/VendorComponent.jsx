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
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "var(--color-primary-border)",
              color: "primary.main",
              width: 44,
              height: 44,
            }}
          >
            <FiTruck size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Vendors
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {vendors?.length || 0} vendor
              {vendors?.length !== 1 ? "s" : ""} registered
            </Typography>
          </Box>
        </Stack>
        {hasPermission("vendors.create") && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiUserPlus size={15} />}
            onClick={onVendorAdd}
          >
            Add Vendor
          </Button>
        )}
      </Stack>

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
  );
}

export default VendorComponent;
