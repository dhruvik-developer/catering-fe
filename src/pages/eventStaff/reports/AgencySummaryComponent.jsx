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
import PageHero from "../../../Components/common/PageHero";

function AgencySummaryComponent({ loading, summaryData }) {
  return (
    <>
      <PageHero
        icon={<FiPieChart size={24} />}
        eyebrow="Reports"
        title="Agency Summary Report"
        subtitle="Overview of total spend and staff count by labor agency"
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

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
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <FaBuilding color="currentColor" />
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
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

                      color="primary.main"
                     sx={{ fontWeight: 800 }}>
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
    </>
  );
}

export default AgencySummaryComponent;
