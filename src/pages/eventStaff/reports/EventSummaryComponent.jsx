/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiChevronRight } from "react-icons/fi";
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";

function EventSummaryComponent({
  loading,
  summaryData,
  staffType,
  onStaffTypeChange,
}) {
  const navigate = useNavigate();
  const fmt = (n) =>
    parseFloat(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
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
            <FiFileText size={20} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Summary Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click a staff member to view their full event &amp; payment
              details
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Filter by Staff Type:
          </Typography>
          <Select
            size="small"
            value={staffType}
            onChange={onStaffTypeChange}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="All">All Staff</MenuItem>
            <MenuItem value="Fixed">Fixed (My Staff)</MenuItem>
            <MenuItem value="Agency">Agency</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>
        </Stack>
      </Stack>

      {loading ? (
        <Loader message="Loading report data..." />
      ) : !summaryData || summaryData.length === 0 ? (
        <EmptyState
          icon={<FiFileText size={24} />}
          title="No Report Data Available"
        />
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: (t) => t.palette.primary.light + "1a" }}>
                <TableCell sx={{ fontWeight: 700 }}>Staff Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Total Events
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Paid
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Pending
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => navigate(`/staff-detail/${row.staff_id}`)}
                  sx={{
                    cursor: "pointer",
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                        {row.staff_name?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>
                      <Typography variant="body1" fontWeight={700}>
                        {row.staff_name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.staff_type}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="primary.main"
                    >
                      {row.events?.length || 0}
                    </Typography>
                  </TableCell>
                  {row.staff_type === "Fixed" ? (
                    <TableCell colSpan={3} align="center">
                      <Chip
                        label="N/A (Paid Monthly)"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          textTransform: "uppercase",
                          fontSize: "0.65rem",
                        }}
                      />
                    </TableCell>
                  ) : (
                    <>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={800}>
                          ₹{fmt(row.total_amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="primary.main"
                        >
                          ₹{fmt(row.total_paid)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={
                            parseFloat(row.total_pending) > 0
                              ? "error.main"
                              : "text.disabled"
                          }
                        >
                          ₹{fmt(row.total_pending)}
                        </Typography>
                      </TableCell>
                    </>
                  )}
                  <TableCell align="center">
                    <IconButton size="small" disabled>
                      <FiChevronRight size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default EventSummaryComponent;
