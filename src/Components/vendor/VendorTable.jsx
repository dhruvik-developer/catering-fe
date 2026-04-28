/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { FaTrash } from "react-icons/fa";
import { FiEdit2, FiUsers } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";
import EmptyState from "../common/EmptyState";

function StatusBadge({ active }) {
  return (
    <Chip
      size="small"
      label={active ? "Active" : "Inactive"}
      color={active ? "success" : "error"}
      variant="outlined"
      sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
    />
  );
}

function CategoryChips({ categories }) {
  if (!categories || categories.length === 0) {
    return (
      <Typography
        variant="caption"
        color="text.disabled"
        fontStyle="italic"
      >
        No categories
      </Typography>
    );
  }
  return (
    <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
      {categories.map((vc) => (
        <Chip
          key={vc.id}
          size="small"
          label={
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
              {vc.category_name}
              {vc.price != null && (
                <Box
                  component="span"
                  sx={{
                    bgcolor: "background.paper",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: "0.625rem",
                    fontWeight: 700,
                  }}
                >
                  ₹{vc.price}
                </Box>
              )}
            </Box>
          }
          sx={{
            bgcolor: (t) => t.palette.primary.light + "26",
            color: "primary.main",
            fontWeight: 700,
          }}
        />
      ))}
    </Stack>
  );
}

function VendorTable({ vendors, onVendorEdit, onVendorDelete }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("vendors.update");
  const canDelete = hasPermission("vendors.delete");

  if (!vendors || vendors.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers size={24} />}
        title="No Vendors Available"
        message='Use the "Add Vendor" button to register new vendors and they will appear here.'
      />
    );
  }

  if (!isDesktop) {
    // Mobile card layout
    return (
      <Grid container spacing={1.5}>
        {vendors.map((vendor, index) => (
          <Grid key={vendor.id} size={12}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"


                  spacing={1}
                 sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Typography variant="caption" color="text.disabled">
                        #{(index + 1).toString().padStart(2, "0")}
                      </Typography>
                      <StatusBadge active={vendor.is_active} />
                    </Stack>
                    <Typography
                      variant="subtitle1" noWrap
                      sx={{ fontWeight: 700, mt: 0.5 }}
                    >
                      {vendor.name || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {vendor.mobile_no || "-"}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                    {canEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onVendorEdit(vendor)}
                        title="Edit Vendor"
                      >
                        <FiEdit2 size={16} />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onVendorDelete(vendor.id)}
                        title="Delete Vendor"
                      >
                        <FaTrash size={14} />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                {vendor.address && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}
                    >
                      Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.address}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}
                  >
                    Categories
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <CategoryChips categories={vendor.vendor_categories} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Desktop table
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: (t) => t.palette.primary.light + "1a" }}>
            <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Vendor Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Mobile</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Categories</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendors.map((vendor, index) => (
            <TableRow
              key={vendor.id}
              hover
              sx={{ "&:last-child td": { borderBottom: 0 } }}
            >
              <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                {(index + 1).toString().padStart(2, "0")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {vendor.name || "N/A"}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {vendor.mobile_no || "-"}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {vendor.address || "-"}
              </TableCell>
              <TableCell sx={{ maxWidth: 360 }}>
                <CategoryChips categories={vendor.vendor_categories} />
              </TableCell>
              <TableCell align="center">
                <StatusBadge active={vendor.is_active} />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
                  {canEdit && (
                    <IconButton
                      size="small"
                      onClick={() => onVendorEdit(vendor)}
                      title="Edit Vendor"
                    >
                      <FiEdit2 size={16} />
                    </IconButton>
                  )}
                  {canDelete && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onVendorDelete(vendor.id)}
                      title="Delete Vendor"
                    >
                      <FaTrash size={14} />
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default VendorTable;
