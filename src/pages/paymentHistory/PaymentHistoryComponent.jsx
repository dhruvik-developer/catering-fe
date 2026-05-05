/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaHandshake,
  FaReceipt,
} from "react-icons/fa";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";
import PageHero from "../../Components/common/PageHero";
import { FiCreditCard } from "react-icons/fi";

function StatCard({ icon, iconBg, iconColor, label, amount, footnote }) {
  const formatted =
    typeof amount === "number"
      ? amount.toLocaleString("en-IN")
      : Number(amount || 0).toLocaleString("en-IN");

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: iconBg,
              color: iconColor,
              width: 36,
              height: 36,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        </Stack>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
          ₹ {formatted}
        </Typography>
        {footnote && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block", fontStyle: "italic" }}
          >
            {footnote}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentHistoryComponent({ paymentData, loading }) {
  return (
    <>
      <PageHero
        icon={<FiCreditCard size={24} />}
        eyebrow="Cash flow"
        title="Payment History"
        subtitle="Every payment received and outstanding balance, at a glance."
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

      {loading ? (
        <Loader message="Loading Payment Histories..." />
      ) : !paymentData ? (
        <EmptyState
          icon={<FaWallet size={24} />}
          title="No Payment History Available"
          message="Transactions will appear here once recorded."
        />
      ) : (
        <Stack spacing={2}>
          {/* Hero: Total Balance */}
          <Card
            sx={{
              background: (t) =>
                `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
              color: (t) => t.palette.primary.contrastText,
              borderRadius: 3,
              border: 0,
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    p: 1.25,
                    borderRadius: 2,
                    display: "inline-flex",
                  }}
                >
                  <FaWallet size={22} />
                </Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Total Balance
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                ₹ {paymentData?.net_amount?.toLocaleString("en-IN") ?? 0}
              </Typography>
            </CardContent>
          </Card>

          {/* Grid of stat cards */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                icon={<FaCheckCircle size={18} />}
                iconBg={(t) => t.palette.success.light + "66"}
                iconColor="success.main"
                label="Total Paid Amount"
                amount={paymentData?.total_paid_amount}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                icon={<FaTimesCircle size={18} />}
                iconBg={(t) => t.palette.error.light + "66"}
                iconColor="error.main"
                label="Total Unpaid Amount"
                amount={paymentData?.total_unpaid_amount}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                icon={<FaHandshake size={18} />}
                iconBg={(t) => t.palette.warning.light + "66"}
                iconColor="warning.main"
                label="Total Settlement Amount"
                amount={paymentData?.total_settlement_amount}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                icon={<FaReceipt size={18} />}
                iconBg={(t) => t.palette.primary.light + "33"}
                iconColor="primary.main"
                label="Total Expense Amount"
                amount={paymentData?.total_expense_amount || 0}
                footnote="Includes expense entries, event staff paid, and fixed salary paid."
              />
            </Grid>
          </Grid>
        </Stack>
      )}
      </Paper>
    </>
  );
}

export default PaymentHistoryComponent;
