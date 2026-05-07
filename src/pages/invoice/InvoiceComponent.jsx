/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";
import PageHero from "../../Components/common/PageHero";
import {
  FiFileText,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiEye,
  FiCheckCircle,
  FiSend,
  FiSearch,
  FiX,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getStatusChipColor = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "PAID") return "success";
  if (normalized === "UNPAID") return "error";
  return "warning";
};

function InvoiceComponent({
  loading,
  invoice,
  totalCount,
  navigate,
  selectedFilter,
  setSelectedFilter,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleQuickFilter,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const hasFilters = Boolean(searchQuery || dateRange[0] || dateRange[1]);
  const visibleCount = invoice?.length || 0;
  const countText =
    totalCount !== visibleCount
      ? t("invoice.countOf", { count: visibleCount, total: totalCount || 0 })
      : t("invoice.count", { count: visibleCount });
  const translatePaymentStatus = (status) =>
    t(`payment.${String(status || "").toLowerCase()}`, {
      defaultValue: status || "—",
    });
  const translatePaymentMode = (mode) =>
    t(`paymentModes.${String(mode || "").toLowerCase()}`, {
      defaultValue: mode || "—",
    });

  return (
    <>
      <PageHero
        icon={<FiFileText size={24} />}
        eyebrow={t("invoice.eyebrow", { defaultValue: "Billing" })}
        title={t("invoice.title")}
        subtitle={countText}
      />
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
      >

      {/* Filter row */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, md: 2 }}


        sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", mb: 3 }}
      >
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("list.searchNameOrMobile")}
          autoComplete="off"
          sx={{
            width: { xs: "100%", md: 280 },
            flexShrink: 0,
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch size={14} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    edge="end"
                  >
                    <FiX size={14} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <Stack
          direction="row"
          spacing={1} useFlexGap


         sx={{ flexWrap: "wrap", alignItems: "center", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
          <ButtonGroup size="small">
            <Button onClick={() => handleQuickFilter("today")}>
              {t("filters.today")}
            </Button>
            <Button onClick={() => handleQuickFilter("thisWeek")}>
              {t("filters.week")}
            </Button>
            <Button onClick={() => handleQuickFilter("thisMonth")}>
              {t("filters.month")}
            </Button>
          </ButtonGroup>

          <Box
            sx={{
              width: { xs: "100%", md: 220 },
              flexShrink: 0,
              position: "relative",
              "& .react-datepicker-wrapper": { width: "100%" },
              "& input": {
                width: "100%",
                padding: "8.5px 12px 8.5px 34px",
                borderRadius: theme.shape.borderRadius + "px",
                border: "1px solid",
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                font: "inherit",
                color: theme.palette.text.primary,
                outline: "none",
              },
              "& input:focus": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
              },
            }}
          >
            <Box
              component={FiCalendar}
              size={14}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "text.secondary",
                zIndex: 1,
              }}
            />
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              dateFormat="dd MMM yyyy"
              placeholderText={t("filters.selectDateRange")}
              maxDate={new Date()}
              isClearable
            />
          </Box>

          <Select
            size="small"
            value={selectedFilter || "All"}
            onChange={(e) => setSelectedFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">{t("filters.all")}</MenuItem>
            <MenuItem value="Paid">{t("payment.paid")}</MenuItem>
            <MenuItem value="Unpaid">{t("payment.unpaid")}</MenuItem>
          </Select>
        </Stack>
      </Stack>

      {loading ? (
        <Loader message={t("invoice.loading")} />
      ) : !invoice || invoice.length === 0 ? (
        <EmptyState
          icon={<FiFileText size={24} />}
          title={
            hasFilters
              ? t("invoice.empty.filteredTitle")
              : t("invoice.empty.title")
          }
          message={
            hasFilters
              ? t("invoice.empty.filteredMessage")
              : t("invoice.empty.message")
          }
        />
      ) : (
        <Grid container spacing={2}>
          {invoice.map((invo) => {
            // Trust the backend-computed pending. Earlier this re-derived
            // pending as `total - advance - transaction`, but the backend
            // already includes the latest transaction inside advance, so
            // that double-counted and showed ₹0 for partial bills.
            const calculatedPending =
              invo.payment_status === "PAID"
                ? 0
                : Number(invo.pending_amount || 0);

            const dateLabel =
              invo.sessions?.length > 0
                ? Array.from(
                    new Set(invo.sessions.map((s) => s.event_date))
                  ).join(", ")
                : invo.event_date || "—";

            return (
              <Grid key={invo.id} size={{ xs: 12, xl: 6 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  {/* Card Header */}
                  <Stack
                    direction="row"


                    spacing={2}
                    sx={{ alignItems: "center", justifyContent: "space-between",
                      px: 2.5,
                      py: 2,
                      bgcolor: (t) => t.palette.primary.light + "1f",
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}


                     sx={{ alignItems: "center", minWidth: 0 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {invo.name?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                          {invo.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary" noWrap
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <FiCalendar size={11} />
                          {dateLabel}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip
                      label={translatePaymentStatus(invo.payment_status)}
                      size="small"
                      color={getStatusChipColor(invo.payment_status)}
                      sx={{ fontWeight: 700, flexShrink: 0 }}
                    />
                  </Stack>

                  {/* Card Body */}
                  <CardContent sx={{ flex: 1 }}>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack
                          direction="row"
                          spacing={1}

                          sx={{ alignItems: "center",
                            px: 1.5,
                            py: 1,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                          }}
                        >
                          <FiCreditCard size={14} />
                          <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                            {translatePaymentMode(invo.payment_mode)}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack
                          direction="row"
                          spacing={1}

                          sx={{ alignItems: "center",
                            px: 1.5,
                            py: 1,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                          }}
                        >
                          <FiDollarSign size={14} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {invo.payment_status === "PAID"
                              ? t("invoice.amount.paid", {
                                  amount: Number(invo.total_amount || 0).toFixed(2),
                                })
                              : t("invoice.amount.advance", {
                                  amount: Number(invo.advance_amount || 0).toFixed(2),
                                })}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack
                          direction="row"
                          spacing={1}

                          sx={{ alignItems: "center",
                            px: 1.5,
                            py: 1,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                          }}
                        >
                          <FiDollarSign size={14} />
                          <Typography
                            variant="body2"

                            color="text.primary"
                           sx={{ fontWeight: 600 }}>
                            {t("invoice.amount.total", {
                              amount: Number(invo.total_amount || 0).toFixed(2),
                            })}
                          </Typography>
                        </Stack>
                      </Grid>
                      {invo.payment_status !== "PAID" && (
                        <Grid size={12}>
                          <Stack
                            direction="row"

                            sx={{ alignItems: "center",
                              px: 2,
                              py: 1.1,
                              minHeight: 42,
                              borderRadius: 2.5,
                              border: "1px solid",
                              borderColor: "error.main",
                              bgcolor: "background.paper",
                              color: "error.main",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}

                             sx={{ alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  bgcolor: "error.main",
                                  flexShrink: 0,
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {t("invoice.amount.pending", {
                                  amount: Math.max(0, calculatedPending).toFixed(2),
                                })}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>

                  <Divider />

                  {/* Card Footer - Actions */}
                  <CardActions
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "stretch",
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<FiEye size={14} />}
                      onClick={() => navigate(`/invoice-order-pdf/${invo.id}`)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      {t("invoice.actions.viewOrder")}
                    </Button>
                    {invo.payment_status !== "PAID" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<FiCheckCircle size={14} />}
                        onClick={() =>
                          navigate(`/complete-invoice-pdf/${invo.id}`)
                        }
                        sx={{ flex: { sm: 1 } }}
                      >
                        {t("invoice.actions.completePayment")}
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<FiSend size={14} />}
                      onClick={() => navigate(`/invoice-bill-pdf/${invo.id}`)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      {t("invoice.actions.sendBill")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      </Paper>
    </>
  );
}

export default InvoiceComponent;
