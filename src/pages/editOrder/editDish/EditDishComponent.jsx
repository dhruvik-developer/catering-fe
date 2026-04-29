/* eslint-disable react/prop-types */
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
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
import {
  FiPlus,
  FiX,
  FiChevronDown,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiStar,
  FiGrid,
  FiSave,
  FiCalendar,
} from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  flattenCategoryItems,
  sortCategoryTree,
} from "../../../utils/categoryTree";
import Loader from "../../../Components/common/Loader";

const TIME_OPTIONS = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Lunch", label: "Lunch" },
  { value: "Dinner", label: "Dinner" },
  { value: "High Tea", label: "High Tea" },
  { value: "Late Night Nasto", label: "Late Night Snack" },
];

function SectionHeading({ title, action }) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        mb: 1.5,
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0 }}>
        <Box
          sx={{
            width: 4,
            height: 20,
            borderRadius: 99,
            bgcolor: "primary.main",
          }}
        />
        <Typography
          variant="overline"

          color="text.secondary"
          sx={{ fontWeight: 700, letterSpacing: 1.5 }}
        >
          {title}
        </Typography>
      </Stack>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  );
}

function FieldLabel({ icon, children, color = "text.secondary" }) {
  return (
    <Typography
      variant="caption"

      color={color}
      sx={{ fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        mb: 0.5,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontSize: "0.65rem",
      }}
    >
      {icon} {children}
    </Typography>
  );
}

function DatePickerShell({ children, theme, fullWidth = true, disabled }) {
  return (
    <Box
      sx={{
        "& .react-datepicker-wrapper": {
          width: fullWidth ? "100%" : "auto",
        },
        "& input": {
          width: "100%",
          padding: "8.5px 12px",
          borderRadius: theme.shape.borderRadius + "px",
          border: "1px solid",
          borderColor: theme.palette.divider,
          backgroundColor: disabled
            ? theme.palette.action.disabledBackground
            : theme.palette.background.paper,
          font: "inherit",
          fontSize: "0.875rem",
          color: theme.palette.text.primary,
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
        },
        "& input:focus": {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
        },
      }}
    >
      {children}
    </Box>
  );
}

function EditDishComponent({
  formData,
  errors,
  dishesList,
  isDishesLoading,
  loading,
  handleChange,
  handleAddSchedule,
  handleRemoveSchedule,
  handleScheduleDateChange,
  handleAddTimeSlot,
  handleRemoveTimeSlot,
  handleSlotChange,
  handleSlotDishesUpdate,
  handleSlotAddExtra,
  handleSlotRemoveExtra,
  handleSlotExtraChange,
  waiterTypes,
  isLoadingWaiterTypes,
  handleSlotAddWaiter,
  handleSlotRemoveWaiter,
  handleSlotWaiterChange,
  handleSubmit,
  isSessionMode,
}) {
  const theme = useTheme();
  const [activeDishModal, setActiveDishModal] = useState(null);
  const [tempDishes, setTempDishes] = useState([]);
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState([]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const categoriesList = sortCategoryTree(dishesList);

  const toggleCategoryCollapse = (id) =>
    setCollapsedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const openDishModal = (dIdx, sIdx, currentDishes) => {
    setTempDishes(JSON.parse(JSON.stringify(currentDishes)));
    setActiveDishModal({ dIdx, sIdx });
  };
  const closeDishModal = () => {
    setActiveDishModal(null);
    setTempDishes([]);
  };
  const saveDishModal = () => {
    if (activeDishModal) {
      handleSlotDishesUpdate(
        activeDishModal.dIdx,
        activeDishModal.sIdx,
        tempDishes
      );
    }
    closeDishModal();
  };
  const handleTempDishToggle = (dish, categoryName = "Dishes") => {
    const existsIndex = tempDishes.findIndex((d) => d.dishId === dish.id);
    if (existsIndex >= 0) {
      setTempDishes((prev) => prev.filter((_, i) => i !== existsIndex));
    } else {
      setTempDishes((prev) => [
        ...prev,
        {
          dishId: dish.id,
          dishName: dish.name,
          categoryName,
          selectionRate: parseFloat(dish.selection_rate) || 0,
          baseCost: parseFloat(dish.base_cost) || 0,
        },
      ]);
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Loader message="Loading Booking Details..." />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: 3, overflow: "hidden", border: 1, borderColor: "divider" }}
    >
      {/* Header Bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          py: 2,
          background: (t) =>
            `linear-gradient(to right, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
          color: "primary.contrastText",
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {isSessionMode ? "Edit Session Details" : "Edit Booking Details"}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            {isSessionMode
              ? "Modify items and extras for this specific session"
              : "Modify schedules, dishes and extras"}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            px: 2.5,
            py: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              mr: 1,
            }}
          >
            Grand Total
          </Typography>
          <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
            ₹
            {Number(formData.grandTotalAmount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          {/* Customer Info */}
          <Box>
            <SectionHeading title="Customer Info" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <FieldLabel>Customer Name *</FieldLabel>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={errors.name || "Customer name"}
                  error={!!errors.name}
                  helperText={errors.name || ""}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <FieldLabel>Mobile Number *</FieldLabel>
                <TextField
                  fullWidth
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  slotProps={{ htmlInput: { maxLength: 10 } }}
                  placeholder={errors.mobile_no || "10-digit mobile"}
                  error={!!errors.mobile_no}
                  helperText={errors.mobile_no || ""}
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <FieldLabel icon={<FiCalendar size={10} />}>Order Date</FieldLabel>
                <DatePickerShell theme={theme} disabled>
                  <DatePicker
                    selected={formData.date || new Date()}
                    dateFormat="dd/MM/yyyy" disabled
                  />
                </DatePickerShell>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <FieldLabel>Reference</FieldLabel>
                <TextField
                  fullWidth
                  name="reference"
                  value={formData.reference || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                  error={!!errors.reference}
                  helperText={errors.reference || ""}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Event Schedule */}
          <Box>
            <SectionHeading
              title={isSessionMode ? "Session Configuration" : "Event Schedule"}
              action={
                !isSessionMode && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<FiPlus size={13} />}
                    onClick={handleAddSchedule}
                  >
                    Add Date
                  </Button>
                )
              }
            />

            {errors.schedule && (
              <Typography
                variant="caption"
                color="error.main"
                sx={{
                  display: "block",
                  bgcolor: "error.light",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: "error.light",
                  mb: 1.5,
                  fontWeight: 500,
                }}
              >
                {errors.schedule}
              </Typography>
            )}
            {errors.slots && (
              <Typography
                variant="caption"
                color="error.main"
                sx={{
                  display: "block",
                  bgcolor: "error.light",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: "error.light",
                  mb: 1.5,
                  fontWeight: 500,
                }}
              >
                {errors.slots}
              </Typography>
            )}

            <Stack spacing={2}>
              {formData.schedule.map((day, dIdx) => (
                <Paper
                  key={dIdx}
                  variant="outlined"
                  sx={{ borderRadius: 2, overflow: "hidden" }}
                >
                  {/* Day Header */}
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    sx={{
                      alignItems: { xs: "stretch", md: "center" },
                      justifyContent: "space-between",
                      px: 2,
                      py: 1.5,
                      bgcolor: (t) => t.palette.primary.light + "1a",
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          boxShadow: 1,
                        }}
                      >
                        D{dIdx + 1}
                      </Box>
                      <DatePickerShell theme={theme} fullWidth={false}>
                        <DatePicker
                          placeholderText="Pick date"
                          minDate={tomorrow}
                          dateFormat="dd/MM/yyyy" selected={day.event_date}
                          onChange={(date) =>
                            handleScheduleDateChange(dIdx, date)
                          }
                        />
                      </DatePickerShell>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{
                        alignItems: "center",
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: "right",
                          bgcolor: (t) => t.palette.primary.light + "26",
                          border: 1,
                          borderColor: "primary.light",
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1.5,
                        }}
                      >
                        <Typography
                          component="span"
                          variant="caption"

                          color="primary.main"
                          sx={{ fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            display: "block",
                            fontSize: "0.6rem",
                            lineHeight: 1,
                          }}
                        >
                          Day Total
                        </Typography>
                        <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 800 }}>
                          ₹
                          {Number(day.dayTotalAmount || 0).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 }
                          )}
                        </Typography>
                      </Box>
                      {!isSessionMode && formData.schedule.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveSchedule(dIdx)}
                          title="Remove Day"
                          sx={{ bgcolor: "error.light" }}
                        >
                          <AiOutlineDelete size={16} />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  {/* Time Slots */}
                  <Stack spacing={1.5} sx={{ p: 2 }}>
                    {day.timeSlots.map((slot, sIdx) => (
                      <Paper
                        key={sIdx}
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}
                      >
                        <Stack spacing={1.5}>
                          {/* Row 1: Slot Config */}
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={1.5}
                            sx={{ alignItems: { xs: "stretch", md: "flex-end" } }}
                          >
                            <Box sx={{ flex: 1, minWidth: 140 }}>
                              <FieldLabel icon={<FiClock size={10} />}>
                                Time Slot
                              </FieldLabel>
                              <Select
                                fullWidth
                                size="small"
                                value={slot.timeLabel}
                                onChange={(e) =>
                                  handleSlotChange(
                                    dIdx,
                                    sIdx,
                                    "timeLabel",
                                    e.target.value
                                  )
                                }
                                error={!!errors[`timeLabel_${dIdx}_${sIdx}`]}
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select...</em>
                                </MenuItem>
                                {TIME_OPTIONS.map((t) => (
                                  <MenuItem key={t.value} value={t.value}>
                                    {t.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors[`timeLabel_${dIdx}_${sIdx}`] && (
                                <Typography
                                  variant="caption"
                                  color="error.main"

                                 sx={{ fontWeight: 500 }}>
                                  {errors[`timeLabel_${dIdx}_${sIdx}`]}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ width: { xs: "100%", md: 120 } }}>
                              <FieldLabel icon={<FiUsers size={10} />}>
                                Persons
                              </FieldLabel>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="0"
                                value={slot.estimatedPersons || ""}
                                onChange={(e) =>
                                  handleSlotChange(
                                    dIdx,
                                    sIdx,
                                    "estimatedPersons",
                                    e.target.value
                                  )
                                }
                                error={!!errors[`persons_${dIdx}_${sIdx}`]}
                                helperText={errors[`persons_${dIdx}_${sIdx}`] || ""}
                                slotProps={{ htmlInput: { style: { textAlign: "center" } } }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: "100%", md: 140 } }}>
                              <FieldLabel
                                icon={<FiDollarSign size={10} />}
                                color="primary.main"
                              >
                                Per Plate ₹
                              </FieldLabel>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="0"
                                value={slot.perPlatePrice || ""}
                                onChange={(e) =>
                                  handleSlotChange(
                                    dIdx,
                                    sIdx,
                                    "perPlatePrice",
                                    e.target.value
                                  )
                                }
                                error={!!errors[`platePrice_${dIdx}_${sIdx}`]}
                                helperText={
                                  errors[`platePrice_${dIdx}_${sIdx}`] || ""
                                }
                                slotProps={{
                                  htmlInput: {
                                    style: {
                                      textAlign: "center",
                                      fontWeight: 700,
                                    },
                                  },
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    bgcolor: (t) =>
                                      t.palette.primary.light + "14",
                                  },
                                }}
                              />
                            </Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "flex-end", ml: { md: "auto" } }}
                            >
                              <Box sx={{ textAlign: "right" }}>
                                <Typography
                                  variant="caption"
                                  color="text.disabled"

                                  sx={{ fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                    display: "block",
                                    fontSize: "0.6rem",
                                  }}
                                >
                                  Subtotal
                                </Typography>
                                <Typography
                                  variant="h6"

                                  color="primary.main"
                                 sx={{ fontWeight: 800 }}>
                                  ₹
                                  {Number(
                                    slot.subtotalAmount || 0
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                  })}
                                </Typography>
                              </Box>
                              {!isSessionMode && day.timeSlots.length > 1 && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleRemoveTimeSlot(dIdx, sIdx)
                                  }
                                  title="Remove Slot"
                                >
                                  <FiX size={15} />
                                </IconButton>
                              )}
                            </Stack>
                          </Stack>

                          {/* Venue / Address */}
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Event venue / address"
                            value={slot.event_address || ""}
                            onChange={(e) =>
                              handleSlotChange(
                                dIdx,
                                sIdx,
                                "event_address",
                                e.target.value
                              )
                            }
                            error={!!errors[`event_address_${dIdx}_${sIdx}`]}
                            helperText={
                              errors[`event_address_${dIdx}_${sIdx}`] || ""
                            }
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FiMapPin size={12} />
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />

                          {/* Row 2: Dishes + Extras */}
                          <Grid container spacing={1.5}>
                            {/* Dishes */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Paper
                                variant="outlined"
                                sx={{ p: 1.5, borderRadius: 1.5 }}
                              >
                                <Stack
                                  direction="row"
                                  sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1.5,
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="caption"

                                    color="primary.main"
                                    sx={{ fontWeight: 700,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <FiGrid size={12} /> Dishes ({slot.dishes.length})
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() =>
                                      openDishModal(dIdx, sIdx, slot.dishes)
                                    }
                                    sx={{ py: 0.25, fontSize: "0.7rem" }}
                                  >
                                    Select
                                  </Button>
                                </Stack>
                                {errors[`dishes_${dIdx}_${sIdx}`] && (
                                  <Typography
                                    variant="caption"
                                    color="error.main"


                                    sx={{ fontWeight: 500, display: "block", mb: 1 }}
                                  >
                                    {errors[`dishes_${dIdx}_${sIdx}`]}
                                  </Typography>
                                )}
                                {slot.dishes.length > 0 ? (
                                  <>
                                    <Stack
                                      direction="row"
                                      spacing={0.5} useFlexGap
                                      sx={{ flexWrap: "wrap" }}
                                    >
                                      {slot.dishes.map((dish) => {
                                        const isNewZeroPrice =
                                          (!dish.selectionRate ||
                                            parseFloat(dish.selectionRate) ===
                                              0) &&
                                          !dish.isOriginal;
                                        return (
                                          <Chip
                                            key={dish.dishId}
                                            size="small"
                                            label={dish.dishName}
                                            color={
                                              isNewZeroPrice
                                                ? "error"
                                                : "primary"
                                            }
                                            variant="outlined"
                                            sx={{
                                              fontWeight: 500,
                                              maxWidth: 180,
                                              bgcolor: isNewZeroPrice
                                                ? (t) =>
                                                    t.palette.error.light + "1f"
                                                : (t) =>
                                                    t.palette.primary.light + "1f",
                                            }}
                                          />
                                        );
                                      })}
                                    </Stack>
                                    {slot.dishes.some(
                                      (d) =>
                                        (!d.selectionRate ||
                                          parseFloat(d.selectionRate) === 0) &&
                                        !d.isOriginal
                                    ) && (
                                      <Typography
                                        variant="caption"
                                        color="error.main"
                                        sx={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 0.5,
                                          mt: 1,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 0.5,
                                            bgcolor: "error.light",
                                            border: 1,
                                            borderColor: "error.light",
                                          }}
                                        />
                                        Red items are not counted in dish price
                                      </Typography>
                                    )}
                                  </>
                                ) : (
                                  <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    fontStyle="italic"
                                  >
                                    No dishes selected
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>

                            {/* Extras */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Paper
                                variant="outlined"
                                sx={{ p: 1.5, borderRadius: 1.5 }}
                              >
                                <Stack
                                  direction="row"
                                  sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1.5,
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="caption"

                                    color="primary.main"
                                    sx={{ fontWeight: 700,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <FiStar size={12} /> Extras ({slot.extraServices.length})
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<FiPlus size={12} />}
                                    onClick={() =>
                                      handleSlotAddExtra(dIdx, sIdx)
                                    }
                                    sx={{ py: 0.25, fontSize: "0.7rem" }}
                                  >
                                    Add
                                  </Button>
                                </Stack>
                                {slot.extraServices.length > 0 ? (
                                  <Stack spacing={0.75}>
                                    {slot.extraServices.map((extra, eIdx) => (
                                      <Stack
                                        key={eIdx}
                                        direction="row"
                                        spacing={0.75}
                                        sx={{ alignItems: "center" }}
                                      >
                                        <TextField
                                          size="small"
                                          placeholder="Service"
                                          value={extra.serviceName}
                                          onChange={(e) =>
                                            handleSlotExtraChange(
                                              dIdx,
                                              sIdx,
                                              eIdx,
                                              "serviceName",
                                              e.target.value
                                            )
                                          }
                                          sx={{ flex: 1 }}
                                          slotProps={{ htmlInput: { style: { fontSize: "0.75rem" } } }}
                                        />
                                        <TextField
                                          size="small"
                                          placeholder="₹"
                                          value={extra.price}
                                          onChange={(e) =>
                                            handleSlotExtraChange(
                                              dIdx,
                                              sIdx,
                                              eIdx,
                                              "price",
                                              e.target.value
                                            )
                                          }
                                          sx={{ width: 72 }}
                                          slotProps={{
                                            htmlInput: {
                                              style: {
                                                textAlign: "center",
                                                fontWeight: 700,
                                                fontSize: "0.75rem",
                                              },
                                            },
                                          }}
                                        />
                                        <TextField
                                          size="small"
                                          placeholder="Qty"
                                          value={extra.quantity}
                                          onChange={(e) =>
                                            handleSlotExtraChange(
                                              dIdx,
                                              sIdx,
                                              eIdx,
                                              "quantity",
                                              e.target.value
                                            )
                                          }
                                          sx={{ width: 56 }}
                                          slotProps={{
                                            htmlInput: {
                                              style: {
                                                textAlign: "center",
                                                fontSize: "0.75rem",
                                              },
                                            },
                                          }}
                                        />
                                        <Typography
                                          variant="caption"

                                          color="text.secondary"
                                          sx={{ fontWeight: 800,
                                            minWidth: 48,
                                            textAlign: "right",
                                          }}
                                        >
                                          ₹
                                          {(Number(extra.price) || 0) *
                                            (Number(extra.quantity) || 1)}
                                        </Typography>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() =>
                                            handleSlotRemoveExtra(
                                              dIdx,
                                              sIdx,
                                              eIdx
                                            )
                                          }
                                        >
                                          <FiX size={13} />
                                        </IconButton>
                                      </Stack>
                                    ))}
                                  </Stack>
                                ) : (
                                  <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    fontStyle="italic"
                                  >
                                    No extras added
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>
                          </Grid>

                          {/* Row 3: Waiter Services */}
                          <Paper
                            variant="outlined"
                            sx={{ p: 1.5, borderRadius: 1.5 }}
                          >
                            <Stack
                              direction="row"
                              sx={{
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1.5,
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="caption"

                                color="primary.main"
                                sx={{ fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <FiUsers size={12} /> Waiter Service (
                                {slot.waiterServices?.length || 0})
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FiPlus size={12} />}
                                onClick={() =>
                                  handleSlotAddWaiter(dIdx, sIdx)
                                }
                                sx={{ py: 0.25, fontSize: "0.7rem" }}
                              >
                                Add Waiter
                              </Button>
                            </Stack>
                            {slot.waiterServices?.length > 0 ? (
                              <Stack spacing={0.75}>
                                {slot.waiterServices.map((ws, wIdx) => (
                                  <Stack
                                    key={wIdx}
                                    direction={{ xs: "column", md: "row" }}
                                    spacing={0.75} useFlexGap
                                    sx={{
                                      alignItems: { xs: "stretch", md: "center" },
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <Select
                                      size="small"
                                      value={ws.waiterType}
                                      onChange={(e) =>
                                        handleSlotWaiterChange(
                                          dIdx,
                                          sIdx,
                                          wIdx,
                                          "waiterType",
                                          e.target.value
                                        )
                                      }
                                      displayEmpty
                                      sx={{ flex: 1, minWidth: 120 }}
                                    >
                                      <MenuItem value="">
                                        <em>Select type</em>
                                      </MenuItem>
                                      {isLoadingWaiterTypes && (
                                        <MenuItem value="">
                                          <em>Loading...</em>
                                        </MenuItem>
                                      )}
                                      {!isLoadingWaiterTypes &&
                                        waiterTypes &&
                                        waiterTypes.map((type) => (
                                          <MenuItem
                                            key={type.id}
                                            value={type.name}
                                          >
                                            {type.name}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                    <Box
                                      sx={{
                                        width: 72,
                                        textAlign: "center",
                                        px: 1.25,
                                        py: 0.75,
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        bgcolor: "action.hover",
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                        color: "text.secondary",
                                      }}
                                    >
                                      ₹{Number(ws.waiterRate || 0).toFixed(0)}
                                    </Box>
                                    <TextField
                                      size="small"
                                      placeholder="Count"
                                      value={ws.waiterCount}
                                      onChange={(e) =>
                                        handleSlotWaiterChange(
                                          dIdx,
                                          sIdx,
                                          wIdx,
                                          "waiterCount",
                                          e.target.value
                                        )
                                      }
                                      sx={{ width: 72 }}
                                      slotProps={{
                                        htmlInput: {
                                          style: {
                                            textAlign: "center",
                                            fontSize: "0.75rem",
                                          },
                                        },
                                      }}
                                    />
                                    <TextField
                                      size="small"
                                      placeholder="Notes (optional)"
                                      value={ws.waiterNotes}
                                      onChange={(e) =>
                                        handleSlotWaiterChange(
                                          dIdx,
                                          sIdx,
                                          wIdx,
                                          "waiterNotes",
                                          e.target.value
                                        )
                                      }
                                      sx={{ flex: 2, minWidth: 100 }}
                                      slotProps={{ htmlInput: { style: { fontSize: "0.75rem" } } }}
                                    />
                                    <Typography
                                      variant="caption"

                                      color="text.secondary"
                                      sx={{ fontWeight: 800,
                                        minWidth: 56,
                                        textAlign: "right",
                                      }}
                                    >
                                      ₹
                                      {(Number(ws.waiterRate) || 0) *
                                        (Number(ws.waiterCount) || 0)}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() =>
                                        handleSlotRemoveWaiter(
                                          dIdx,
                                          sIdx,
                                          wIdx
                                        )
                                      }
                                    >
                                      <FiX size={13} />
                                    </IconButton>
                                  </Stack>
                                ))}
                              </Stack>
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.disabled"
                                fontStyle="italic"
                              >
                                No waiter services added
                              </Typography>
                            )}
                          </Paper>
                        </Stack>
                      </Paper>
                    ))}

                    {!isSessionMode && (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<FiPlus size={13} />}
                        onClick={() => handleAddTimeSlot(dIdx)}
                        sx={{
                          borderStyle: "dashed",
                          color: "text.secondary",
                          borderColor: "divider",
                        }}
                      >
                        Add Time Slot
                      </Button>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Notes & Submit */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <FieldLabel>Description / Notes</FieldLabel>
              <TextField
                fullWidth
                multiline
                minRows={3}
                name="description"
                placeholder="Any special instructions for the event..."
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack
                spacing={1.5}
                sx={{ height: "100%", justifyContent: "space-between" }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <FormControlLabel
                    sx={{ m: 0 }}
                    control={
                      <Checkbox
                        checked={!!formData.rule}
                        onChange={(e) =>
                          handleChange({
                            target: { name: "rule", value: e.target.checked },
                          })
                        }
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Include Rules on PDF
                      </Typography>
                    }
                  />
                </Paper>
                <Button
                  type="submit" fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  startIcon={<FiSave size={16} />}
                  sx={{
                    py: 1.5,
                    background: (t) =>
                      `linear-gradient(to right, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                  }}
                >
                  Review &amp; Generate PDF
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Box>

      {/* Dish Selection Modal */}
      <Dialog
        open={!!activeDishModal}
        onClose={closeDishModal} fullWidth
        maxWidth="md"
        PaperProps={{ sx: { maxHeight: "85vh" } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Select Dishes
              </Typography>
              {activeDishModal && (
                <Typography variant="caption" color="text.disabled">
                  Day {activeDishModal.dIdx + 1} —{" "}
                  {formData.schedule[activeDishModal.dIdx]?.timeSlots[
                    activeDishModal.sIdx
                  ]?.timeLabel || "Slot"}
                </Typography>
              )}
            </Box>
            <IconButton size="small" onClick={closeDishModal}>
              <FiX size={18} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {isDishesLoading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <Loader fullScreen={false} />
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {categoriesList.map((category) => {
                const isCollapsed = collapsedCategoryIds.includes(category.id);
                const items = flattenCategoryItems(category);
                const selectedCount = items.filter((d) =>
                  tempDishes.some((td) => td.dishId === d.id)
                ).length;

                return (
                  <Paper
                    key={category.id}
                    variant="outlined"
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                  >
                    <Stack
                      direction="row"
                      onClick={() => toggleCategoryCollapse(category.id)}
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        px: 2,
                        py: 1.25,
                        bgcolor: "action.hover",
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { bgcolor: "action.selected" },
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 0.75,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        >
                          {category.positions || "—"}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={items.length}
                          sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                        {selectedCount > 0 && (
                          <Chip
                            size="small"
                            label={`${selectedCount} ✓`}
                            color="primary"
                            sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                          />
                        )}
                      </Stack>
                      <Box
                        sx={{
                          color: "text.disabled",
                          transform: isCollapsed
                            ? "rotate(0deg)"
                            : "rotate(180deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <FiChevronDown size={16} />
                      </Box>
                    </Stack>
                    {!isCollapsed && (
                      <Box sx={{ p: 1.5, borderTop: 1, borderColor: "divider" }}>
                        <Grid container spacing={1}>
                          {items.map((dish) => {
                            const selectedEntry = tempDishes.find(
                              (d) => d.dishId === dish.id
                            );
                            const isSelected = !!selectedEntry;
                            const isZeroPrice =
                              !dish.selection_rate ||
                              parseFloat(dish.selection_rate) === 0;
                            const isNewZeroPrice =
                              isZeroPrice && !selectedEntry?.isOriginal;
                            const state = isSelected
                              ? isNewZeroPrice
                                ? "error"
                                : "primary"
                              : isZeroPrice
                                ? "warning"
                                : "idle";
                            return (
                              <Grid key={dish.id} size={{ xs: 6, sm: 4 }}>
                                <Box
                                  onClick={() =>
                                    handleTempDishToggle(
                                      dish,
                                      dish.categoryName || category.name
                                    )
                                  }
                                  sx={{
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1.5,
                                    border: 1,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    ...(state === "primary" && {
                                      borderColor: "primary.main",
                                      bgcolor: (t) =>
                                        t.palette.primary.light + "26",
                                      color: "primary.main",
                                      fontWeight: 600,
                                    }),
                                    ...(state === "error" && {
                                      borderColor: "error.light",
                                      bgcolor: (t) =>
                                        t.palette.error.light + "1a",
                                      color: "error.main",
                                      fontWeight: 600,
                                    }),
                                    ...(state === "warning" && {
                                      borderColor: "error.light",
                                      bgcolor: "transparent",
                                      color: "error.light",
                                    }),
                                    ...(state === "idle" && {
                                      borderColor: "divider",
                                      color: "text.secondary",
                                      "&:hover": { borderColor: "text.disabled" },
                                    }),
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ alignItems: "center", minWidth: 0 }}
                                  >
                                    <Checkbox
                                      checked={isSelected} readOnly
                                      size="small"
                                      sx={{ p: 0 }}
                                      color={
                                        state === "error" ? "error" : "primary"
                                      }
                                    />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography variant="body2" noWrap>
                                        {dish.name}
                                      </Typography>
                                      {dish.categoryPath &&
                                        dish.categoryPath !== category.name && (
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            noWrap
                                            sx={{ display: "block" }}
                                          >
                                            {dish.categoryPath}
                                          </Typography>
                                        )}
                                    </Box>
                                  </Stack>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5, justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            <Box component="strong" sx={{ color: "text.primary" }}>
              {tempDishes.length}
            </Box>{" "}
            selected
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={closeDishModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={saveDishModal}>
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default EditDishComponent;
