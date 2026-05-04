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
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";
import {
  FiClipboard,
  FiPhone,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiShare2,
  FiX,
  FiChevronRight,
  FiFileText,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AllOrderComponent({
  allOrder,
  loading,
  handleCompleteOrder,
  handleDeleteAllOrder,
  handleViewOrderDetails,
  handleDownloadOrderPDF,
  totalCount,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleQuickFilter,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isTabletUp = useMediaQuery(theme.breakpoints.up("md"));
  const hasFilters = Boolean(searchQuery || dateRange[0] || dateRange[1]);
  const visibleCount = allOrder?.length || 0;
  const countText =
    totalCount !== visibleCount
      ? t("allOrders.countOf", { count: visibleCount, total: totalCount || 0 })
      : t("allOrders.count", { count: visibleCount });

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.paper" }}
    >
      {/* Title */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "var(--color-primary-border)",
            color: "primary.main",
            width: 44,
            height: 44,
          }}
        >
          <FiClipboard size={20} />
        </Avatar>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            {t("allOrders.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {countText}
          </Typography>
        </Box>
      </Stack>

      {/* Filter row: search on the left, quick filters + date range on the right */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, md: 2 }}


        sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", mb: 3 }}
      >
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("list.searchNameOrMobile")}
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
            <Button onClick={() => handleQuickFilter("upcoming")}>
              {t("filters.upcoming")}
            </Button>
          </ButtonGroup>

          <Box
            sx={{
              width: { xs: "100%", md: 240 },
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
              placeholderText={t("filters.selectEventDateRange")}
              isClearable
            />
          </Box>
        </Stack>
      </Stack>

      {loading ? (
        <Loader message={t("allOrders.loading")} />
      ) : allOrder.length === 0 ? (
        <EmptyState
          icon={<FiClipboard size={24} />}
          title={
            hasFilters
              ? t("allOrders.empty.filteredTitle")
              : t("allOrders.empty.title")
          }
          message={
            hasFilters
              ? t("allOrders.empty.filteredMessage")
              : t("allOrders.empty.message")
          }
        />
      ) : (
        <Grid container spacing={2}>
          {allOrder.map((order) => {
            const totalPersons =
              order.sessions?.reduce(
                (total, s) => total + (Number(s.estimated_persons) || 0),
                0
              ) ||
              order.estimated_persons ||
              "—";
            const dateLabel =
              order.sessions?.length > 0
                ? Array.from(
                    new Set(order.sessions.map((s) => s.event_date))
                  ).join(", ")
                : order.event_date || "—";

            return (
              <Grid key={order.id} size={{ xs: 12, xl: 6 }}>
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
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {order.name?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1" noWrap
                         sx={{ fontWeight: 600 }}>
                          {order.name}
                        </Typography>
                        {order.reference && (
                          <Typography
                            variant="caption"
                            color="text.secondary" noWrap
                          >
                            {t("quotation.reference")}: {order.reference}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Chip
                      icon={<FiCalendar size={12} />}
                      label={dateLabel}
                      size="small"
                      title={dateLabel}
                      sx={{
                        bgcolor: "background.paper",
                        color: "primary.main",
                        maxWidth: 200,
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  </Stack>

                  {/* Card Body */}
                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Stack
                      direction="row"
                      spacing={1}

                      sx={{ alignItems: "center",
                        alignSelf: "flex-start",
                        px: 1.5,
                        py: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <FiPhone size={14} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {order.mobile_no || "—"}
                      </Typography>
                    </Stack>

                    <Box
                      onClick={() => handleViewOrderDetails(order.id)}
                      title={t("allOrders.sessions.viewDetailedOrder")}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        bgcolor: (t) => t.palette.primary.light + "14",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": {
                          bgcolor: (t) => t.palette.primary.light + "26",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Stack
                        direction="row"


                       sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <FiClipboard size={14} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {t("allOrders.sessions.total", {
                              count: order.sessions?.length || 1,
                            })}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}


                         sx={{ alignItems: "center", color: "primary.main" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {t("allOrders.sessions.viewDetails")}
                          </Typography>
                          <FiChevronRight size={14} />
                        </Stack>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}

                        sx={{ alignItems: "center", pl: 3 }}
                      >
                        <FiUsers size={12} />
                        <Typography variant="caption" color="text.secondary">
                          {t("allOrders.sessions.estimatedPersons")}:
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {totalPersons}
                        </Typography>
                      </Stack>
                    </Box>
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
                      fullWidth={!isTabletUp}
                      variant="outlined"
                      color="primary"
                      startIcon={<FiCheckCircle size={14} />}
                      onClick={() => handleCompleteOrder(order.id)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      {t("allOrders.actions.complete")}
                    </Button>
                    <Button
                      size="small"
                      fullWidth={!isTabletUp}
                      variant="outlined"
                      color="primary"
                      startIcon={<FiFileText size={14} />}
                      onClick={() => handleDownloadOrderPDF(order.id)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      PDF
                    </Button>
                    <Button
                      size="small"
                      fullWidth={!isTabletUp}
                      variant="outlined"
                      color="primary"
                      startIcon={<FiShare2 size={14} />}
                      sx={{ flex: { sm: 1 }, opacity: 0.8, cursor: "default" }}
                      title={t("allOrders.actions.sharingDisabled")}
                    >
                      {t("allOrders.actions.share")}
                    </Button>


                    <Button
                      size="small"
                      fullWidth={!isTabletUp}
                      variant="outlined"
                      color="error"
                      startIcon={<FiXCircle size={14} />}
                      onClick={() => handleDeleteAllOrder(order.id)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      {t("common.cancel")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Paper>
  );
}

export default AllOrderComponent;
