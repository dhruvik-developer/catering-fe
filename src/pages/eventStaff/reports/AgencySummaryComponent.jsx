/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FaBuilding } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import Loader from "../../../Components/common/Loader";
import EmptyState from "../../../Components/common/EmptyState";

function AgencySummaryComponent({ loading, summaryData }) {
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "var(--color-primary-border)",
            color: "primary.main",
            width: 44,
            height: 44,
          }}
        >
          <FiPieChart size={20} />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Agency Summary Report
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of total spend and staff count by labor agency
          </Typography>
        </Box>
      </Stack>

      {loading ? (
        <Loader message="Loading report data..." />
      ) : !summaryData || summaryData.length === 0 ? (
        <EmptyState
          icon={<FiPieChart size={24} />}
          title="No Report Data Available"
          message="Data will appear here once agencies have assignments."
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
                <TableCell sx={{ fontWeight: 700 }}>Agency Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Active Staff Count
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Total Payable Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FaBuilding color="currentColor" />
                      <Typography variant="body1" fontWeight={700}>
                        {row.agency_name || "Independent / N/A"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${row.staff_count || 0} Staff`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="primary.main"
                    >
                      ₹{parseFloat(row.total_amount_payable || 0).toFixed(2)}
                    </Typography>
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

export default AgencySummaryComponent;
