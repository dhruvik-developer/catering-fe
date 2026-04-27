/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FiArrowLeft,
  FiClipboard,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiBox,
  FiEdit2,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import { format } from "date-fns";

import DishTagModal from "../../Components/dishTag/DishTagModal";
import PaymentModal from "../../Components/payment/PaymentModal";
import GroundManagementModal from "../../Components/ground/GroundManagementModal";
import ItemVendorModal from "../../Components/vendor/ItemVendorModal";

const statusChipColor = (status) => {
  if (status === "done") return "success";
  if (status === "cancelled") return "error";
  return "primary";
};

function InfoBlock({ icon, label, value, valueVariant = "body1" }) {
  return (
    <Stack spacing={0.5}>
      <Typography
        variant="caption"
        color="primary.main"
        fontWeight={700}
        sx={{ textTransform: "uppercase", letterSpacing: 0.5, display: "inline-flex", alignItems: "center", gap: 0.75 }}
      >
        {icon} {label}
      </Typography>
      <Typography variant={valueVariant} fontWeight={600} color="text.primary">
        {value || "—"}
      </Typography>
    </Stack>
  );
}

function StaffCard({ staff, onClick, tone = "primary" }) {
  const clickable = Boolean(staff.assignment_id && onClick);
  return (
    <Box
      onClick={clickable ? onClick : undefined}
      title={
        clickable ? "Edit Assignment" : "No Assignment ID"
      }
      sx={{
        textAlign: "left",
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: 1,
        borderColor: clickable ? "primary.light" : "divider",
        bgcolor: clickable
          ? (t) => t.palette.primary.light + "1f"
          : "action.hover",
        cursor: clickable ? "pointer" : "default",
        transition: "background-color 0.15s",
        "&:hover": clickable
          ? { bgcolor: (t) => t.palette.primary.light + "33" }
          : {},
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="body2" fontWeight={700} color={`${tone}.main`}>
          {staff.name || staff}
        </Typography>
        {staff.staff_type && (
          <Chip
            size="small"
            label={staff.staff_type}
            variant="outlined"
            sx={{ height: 18, fontSize: "0.625rem" }}
          />
        )}
      </Stack>
      {staff.role && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 0.5, color: "text.secondary" }}
        >
          <Typography variant="caption" fontWeight={500}>
            {staff.role}
          </Typography>
          {staff.people_summoned && (
            <>
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  bgcolor: "text.disabled",
                }}
              />
              <Typography variant="caption">
                {staff.people_summoned}{" "}
                {staff.people_summoned === 1 ? "person" : "people"}
              </Typography>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
}

function ViewOrderDetailsComponent({
  orderDetails,
  loading,
  handleViewIngredientBySession,
  handleEditOrder,
  handleEditSession,
  handleAssignStaff,
  handleEditAssignment,
  handleOpenSessionChecklistPreview,
  handleSaveGroundManagement,
  handleBack,
  handleOpenTags,
  tagSession,
  onCloseTag,
  catererNameProfile,
  isPaymentModalOpen,
  onClosePaymentModal,
  onPaymentSuccess,
}) {
  const [groundMgmtSession, setGroundMgmtSession] = useState(null);
  const [itemVendorSession, setItemVendorSession] = useState(null);

  const showDishes = (session) => setItemVendorSession(session);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Loader message="Loading Order Details..." />
      </Box>
    );
  }

  if (!orderDetails) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "50vh", color: "text.secondary" }}
        spacing={2}
      >
        <FiBox size={48} style={{ opacity: 0.4 }} />
        <Typography variant="h6">Order not found</Typography>
        <Button
          variant="contained"
          startIcon={<FiArrowLeft size={16} />}
          onClick={handleBack}
        >
          Go Back
        </Button>
      </Stack>
    );
  }

  const {
    id,
    name,
    reference,
    mobile_no,
    event_address,
    advance_amount,
    status,
    event_date,
    estimated_persons,
    sessions = [],
  } = orderDetails;

  const orderSessions =
    sessions.length > 0
      ? sessions
      : [
          {
            event_date,
            event_time: orderDetails.event_time,
            estimated_persons,
            per_dish_amount: orderDetails.per_dish_amount,
            extra_service_amount: orderDetails.extra_service_amount,
          },
        ];

  const uniqueDates = Array.from(
    new Set(orderSessions.map((s) => s.event_date))
  ).filter(Boolean);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 0, sm: 1 }, pb: 10 }}>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={handleBack}
            sx={{
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              "&:hover": { color: "primary.main" },
            }}
          >
            <FiArrowLeft size={20} />
          </IconButton>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" fontWeight={700}>
                Order Details
              </Typography>
              <Chip
                size="small"
                label={status || "Pending"}
                color={statusChipColor(status)}
                variant="outlined"
                sx={{ fontWeight: 700, textTransform: "uppercase" }}
              />
            </Stack>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mt: 0.5, color: "text.secondary" }}
            >
              <FiClipboard size={14} />
              <Typography variant="body2">ID: #{id}</Typography>
            </Stack>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiEdit2 size={16} />}
          onClick={() => handleEditOrder(id)}
          title="Edit entire order (all sessions)"
        >
          Edit Complete Order
        </Button>
      </Stack>

      {/* Customer Details Card */}
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          mb: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            bgcolor: "primary.main",
          }}
        />
        <Box sx={{ px: 3, py: 2.5 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <InfoBlock
                icon={<FiUsers size={12} />}
                label="Customer"
                value={
                  <Box>
                    <Typography variant="body1" fontWeight={700}>
                      {name || "—"}
                    </Typography>
                    {reference && (
                      <Typography variant="body2" color="text.secondary">
                        Ref: {reference}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <InfoBlock
                icon={<FiPhone size={12} />}
                label="Mobile No"
                value={mobile_no || "—"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <InfoBlock
                icon={<FiCalendar size={12} />}
                label="Event Dates"
                value={uniqueDates.join(", ") || "—"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <InfoBlock
                icon={<FiDollarSign size={12} />}
                label="Advance Paid"
                valueVariant="h5"
                value={`₹${Number(advance_amount || 0).toLocaleString("en-IN")}`}
              />
            </Grid>
          </Grid>

          {event_address && (
            <>
              <Divider sx={{ my: 2 }} />
              <InfoBlock
                icon={<FiMapPin size={12} />}
                label="Event Address"
                value={event_address}
              />
            </>
          )}
        </Box>
      </Paper>

      {/* Sessions heading */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "var(--color-primary-border)",
            color: "primary.main",
            width: 32,
            height: 32,
          }}
        >
          <FiClock size={16} />
        </Avatar>
        <Typography variant="h6" fontWeight={700}>
          Session Breakdown ({orderSessions.length})
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {orderSessions.map((session, index) => {
          const sessionDateStr = session.event_date;
          let displayDate = sessionDateStr;
          try {
            const parts = sessionDateStr?.split("-");
            if (parts && parts.length === 3) {
              let d;
              if (parts[0].length === 4) {
                d = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
              } else {
                d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
              }
              if (!isNaN(d)) displayDate = format(d, "dd MMM, yyyy");
            }
          } catch {
            /* ignore */
          }

          const groundItemCount = session.ground_management
            ? Object.values(session.ground_management).reduce(
                (sum, items) =>
                  sum + (Array.isArray(items) ? items.length : 1),
                0
              )
            : 0;

          return (
            <Grid key={index} size={{ xs: 12, xl: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                {/* Session Header */}
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", md: "center" }}
                  spacing={1.5}
                  sx={{
                    px: 2.5,
                    py: 1.75,
                    bgcolor: (t) => t.palette.primary.light + "1f",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        boxShadow: 1,
                      }}
                    >
                      S{index + 1}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {session.event_time || `Session ${index + 1}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {displayDate || "—"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FiEdit2 size={14} />}
                      onClick={() => handleEditSession(id, index)}
                      title={`Edit ${session.event_time || `Session ${index + 1}`}`}
                    >
                      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                        Edit
                      </Box>
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<FiBriefcase size={14} />}
                      onClick={() =>
                        handleAssignStaff(id, session.id, session.event_time)
                      }
                      title={`Assign Staff to ${session.event_time || `Session ${index + 1}`}`}
                    >
                      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                        Assign Staff
                      </Box>
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FiBox size={14} />}
                      onClick={() =>
                        handleViewIngredientBySession(id, session.id, session.event_time)
                      }
                    >
                      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                        Ingredients
                      </Box>
                    </Button>
                  </Stack>
                </Stack>

                {/* Session stats */}
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <InfoBlock
                        icon={<FiUsers size={12} />}
                        label="Estimated Persons"
                        value={session.estimated_persons || "—"}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <InfoBlock
                        icon={<FiDollarSign size={12} />}
                        label="Per Dish Amount"
                        value={
                          session.per_dish_amount
                            ? `₹${Number(session.per_dish_amount).toLocaleString("en-IN")}`
                            : "—"
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <InfoBlock
                        icon={<FiDollarSign size={12} />}
                        label="Extra Service Amt"
                        value={
                          session.extra_service_amount
                            ? `₹${Number(session.extra_service_amount).toLocaleString("en-IN")}`
                            : "—"
                        }
                      />
                    </Grid>
                    {session.event_address && (
                      <Grid size={12}>
                        <Divider sx={{ mb: 1.5 }} />
                        <InfoBlock
                          icon={<FiMapPin size={12} />}
                          label="Event Address"
                          value={session.event_address}
                        />
                      </Grid>
                    )}
                  </Grid>

                  {/* Session action chips */}
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {session.selected_items &&
                      Object.keys(session.selected_items).length > 0 && (
                        <>
                          <Chip
                            label="Selected Dishes"
                            onClick={() => showDishes(session)}
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              cursor: "pointer",
                              bgcolor: (t) => t.palette.primary.light + "1f",
                              color: "primary.main",
                              borderColor: "primary.light",
                            }}
                            title="View category-wise selected dishes and assign vendors"
                          />
                          <Chip
                            label="🏷️ Dish Tags"
                            onClick={() => handleOpenTags(session)}
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              cursor: "pointer",
                              color: "secondary.main",
                              borderColor: "secondary.light",
                              bgcolor: (t) => t.palette.secondary.light + "1a",
                            }}
                            title={`Print Dish Tags for ${session.event_time || `Session ${index + 1}`}`}
                          />
                        </>
                      )}
                    <Chip
                      icon={<FiClipboard size={14} />}
                      label="Checklist PDF"
                      onClick={() =>
                        handleOpenSessionChecklistPreview(id, session.id ?? index)
                      }
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        cursor: "pointer",
                        bgcolor: (t) => t.palette.primary.light + "1f",
                        color: "primary.main",
                      }}
                    />
                    <Chip
                      icon={<FiBox size={14} />}
                      label={
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <span>Ground Mgmt</span>
                          {groundItemCount > 0 && (
                            <Box
                              sx={{
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                px: 0.75,
                                py: 0.1,
                                borderRadius: 99,
                                fontSize: "0.65rem",
                                fontWeight: 700,
                              }}
                            >
                              {groundItemCount}
                            </Box>
                          )}
                        </Stack>
                      }
                      onClick={() => setGroundMgmtSession(session)}
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        cursor: "pointer",
                        bgcolor: (t) => t.palette.primary.light + "1f",
                        color: "primary.main",
                      }}
                    />
                  </Stack>

                  {/* Managers assigned */}
                  {session.managers_assigned &&
                    session.managers_assigned.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={700}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            mb: 1,
                          }}
                        >
                          <FiUser size={12} /> Assigned Managers
                        </Typography>
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                          {session.managers_assigned.map((staff, mIdx) => (
                            <StaffCard
                              key={`mgr-${mIdx}`}
                              staff={staff}
                              onClick={() => handleEditAssignment(staff.assignment_id)}
                            />
                          ))}
                        </Stack>
                      </>
                    )}

                  {/* Summoned staff */}
                  {session.summoned_staff_details &&
                    session.summoned_staff_details.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={700}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            mb: 1,
                          }}
                        >
                          <FiBriefcase size={12} /> Assigned Staff
                        </Typography>
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                          {session.summoned_staff_details.map((staff, sIdx) => (
                            <StaffCard
                              key={sIdx}
                              staff={staff}
                              onClick={() => handleEditAssignment(staff.assignment_id)}
                            />
                          ))}
                        </Stack>
                      </>
                    )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {orderSessions.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            textAlign: "center",
            py: 4,
            px: 3,
            color: "text.secondary",
            borderRadius: 3,
          }}
        >
          No session details available.
        </Paper>
      )}

      {/* Modals — keep as-is, their own implementation */}
      <DishTagModal
        isOpen={!!tagSession}
        session={tagSession}
        onClose={onCloseTag}
        catererNameProfile={catererNameProfile}
        customerName={name}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={onClosePaymentModal}
        bookingId={id}
        onPaymentSuccess={onPaymentSuccess}
      />
      <GroundManagementModal
        isOpen={!!groundMgmtSession}
        onClose={() => setGroundMgmtSession(null)}
        onSave={async (groundData) => {
          if (groundMgmtSession) {
            await handleSaveGroundManagement(groundMgmtSession.id, groundData);
            setGroundMgmtSession(null);
          }
        }}
        existingData={groundMgmtSession?.ground_management || null}
        sessionName={groundMgmtSession?.event_time || ""}
      />
      <ItemVendorModal
        isOpen={!!itemVendorSession}
        onClose={() => setItemVendorSession(null)}
        session={itemVendorSession}
        eventId={id}
      />
    </Box>
  );
}

export default ViewOrderDetailsComponent;
