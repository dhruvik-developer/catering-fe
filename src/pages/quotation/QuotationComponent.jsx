/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";
import {
  FiFileText,
  FiPhone,
  FiClock,
  FiUsers,
  FiCalendar,
  FiEdit2,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function QuotationComponent({
  loading,
  quotation,
  totalCount,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleQuickFilter,
  handleDeleteQuotation,
  handleViewQuotation,
  handleEditOrder,
  handleCompleteQuotation,
}) {
  const theme = useTheme();
  const [sessionsModal, setSessionsModal] = useState(null);
  const hasFilters = Boolean(searchQuery || dateRange[0] || dateRange[1]);

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
          <FiFileText size={20} />
        </Avatar>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            Quotation List
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {quotation?.length || 0}
            {totalCount !== quotation?.length ? ` of ${totalCount}` : ""}{" "}
            quotation{quotation?.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Stack>

      {/* Filter row */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, md: 2 }}


        sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", mb: 3 }}
      >
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search name or mobile..."
          autoComplete="off"
          sx={{
            width: { xs: "100%", md: 280 },
            flexShrink: 0,
          }}
          InputProps={{
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
          }}
        />

        <Stack
          direction="row"
          spacing={1} useFlexGap


         sx={{ flexWrap: "wrap", alignItems: "center", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
          <ButtonGroup size="small">
            <Button onClick={() => handleQuickFilter("today")}>Today</Button>
            <Button onClick={() => handleQuickFilter("next7Days")}>
              Next 7 Days
            </Button>
            <Button onClick={() => handleQuickFilter("next30Days")}>
              Next 30 Days
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
              placeholderText="Select date range"
              minDate={new Date()}
              isClearable
            />
          </Box>
        </Stack>
      </Stack>

      {loading ? (
        <Loader message="Loading Quotations..." />
      ) : !quotation || quotation.length === 0 ? (
        <EmptyState
          icon={<FiFileText size={24} />}
          title={
            hasFilters ? "No Quotations Match Your Filters" : "No Quotations Yet"
          }
          message={
            hasFilters
              ? "Try adjusting your date range or search."
              : "Quotations will appear here once created."
          }
        />
      ) : (
        <Grid container spacing={2}>
          {quotation.map((quote) => {
            const allSessions =
              quote.sessions?.length > 0
                ? quote.sessions
                : [
                    {
                      event_date: quote.event_date,
                      event_time: quote.event_time,
                      estimated_persons: quote.estimated_persons,
                    },
                  ];
            const totalPersons = allSessions.reduce(
              (total, session) =>
                total + (Number(session.estimated_persons) || 0),
              0
            );
            const dateLabel =
              quote.sessions?.length > 0
                ? Array.from(
                    new Set(quote.sessions.map((s) => s.event_date))
                  ).join(", ")
                : quote.event_date || "—";

            return (
              <Grid key={quote.id} size={{ xs: 12, xl: 6 }}>
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
                        {quote.name?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                          {quote.name}
                        </Typography>
                        {quote.reference && (
                          <Typography
                            variant="caption"
                            color="text.secondary" noWrap
                          >
                            Ref: {quote.reference}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}


                     sx={{ alignItems: "center", flexShrink: 0 }}>
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
                      <IconButton
                        size="small"
                        onClick={() => handleEditOrder(quote.id)}
                        title="Edit Quotation"
                      >
                        <FiEdit2 size={15} />
                      </IconButton>
                    </Stack>
                  </Stack>

                  {/* Card Body */}
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
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
                        {quote.mobile_no || "—"}
                      </Typography>
                    </Stack>

                    <Box
                      onClick={() =>
                        setSessionsModal({
                          name: quote.name,
                          sessions: allSessions,
                        })
                      }
                      title="View All Events"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        bgcolor: "var(--color-primary-border)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": {
                          bgcolor: "var(--color-primary-border)",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Stack
                        direction="row"


                       sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <FiFileText size={14} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Total Sessions: {allSessions.length}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}


                         sx={{ alignItems: "center", color: "primary.main" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            View Details
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
                          Estimated Persons:
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {totalPersons || "—"}
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
                      variant="outlined"
                      color="primary"
                      startIcon={<FiEye size={14} />}
                      onClick={() => handleViewQuotation(quote.id)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<FiCheckCircle size={14} />}
                      onClick={() => handleCompleteQuotation(quote.id)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<FiXCircle size={14} />}
                      onClick={() => handleDeleteQuotation(quote.id)}
                      sx={{ flex: { sm: 1 } }}
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Sessions Modal */}
      <Dialog
        open={Boolean(sessionsModal)}
        onClose={() => setSessionsModal(null)} fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"


           sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                All Event Schedules
              </Typography>
              {sessionsModal && (
                <Typography variant="caption" color="text.secondary">
                  {sessionsModal.name} — {sessionsModal.sessions.length} event
                  {sessionsModal.sessions.length !== 1 ? "s" : ""}
                </Typography>
              )}
            </Box>
            <IconButton size="small" onClick={() => setSessionsModal(null)}>
              <FiX size={18} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {sessionsModal?.sessions.map((session, sIdx) => (
              <Grid
                key={sIdx}
                container
                spacing={1.5}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: (t) => t.palette.primary.light + "14",
                }}
              >
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <FiClock size={14} />
                    <Typography variant="body2">
                      <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>
                        {session.event_date}
                      </Box>
                      <Box component="strong">
                        {session.event_time || "—"}
                      </Box>
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <FiUsers size={14} />
                    <Typography variant="body2">
                      <Box component="strong">
                        {session.estimated_persons || "—"}
                      </Box>{" "}
                      persons
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setSessionsModal(null)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default QuotationComponent;
