/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FiArrowLeft,
  FiFileText,
  FiPlus,
  FiX,
  FiUsers,
  FiMapPin,
  FiClipboard,
  FiBookOpen,
  FiSend,
} from "react-icons/fi";

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: (t) => t.palette.primary.light + "33",
          color: "primary.main",
          width: 40,
          height: 40,
        }}
      >
        <Icon size={20} />
      </Avatar>
      <Box>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

function InfoTile({ label, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={700} color="text.primary">
        {value || "—"}
      </Typography>
    </Box>
  );
}

function Step3_Summary({
  formData,
  errors,
  waiterTypes,
  isLoadingWaiterTypes,
  handleChange,
  handleSlotChange,
  handleSlotAddExtra,
  handleSlotRemoveExtra,
  handleSlotExtraChange,
  handleSlotAddWaiter,
  handleSlotRemoveWaiter,
  handleSlotWaiterChange,
  handleSubmit,
  onBack,
}) {
  const [showRules, setShowRules] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const eventCards = [];
  formData.schedule.forEach((day, dIdx) => {
    const dateObj = new Date(day.event_date);
    const pad = (n) => n.toString().padStart(2, "0");
    const dateStr = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;

    day.timeSlots.forEach((slot, sIdx) => {
      eventCards.push({
        dIdx,
        sIdx,
        dateStr,
        dayLabel: `Day ${dIdx + 1}`,
        timeLabel: slot.timeLabel || `Slot ${sIdx + 1}`,
        estimatedPersons: slot.estimatedPersons,
        perPlatePrice: slot.perPlatePrice,
        waiterServices: slot.waiterServices || [],
        dishes: slot.dishes || [],
        extraServices: slot.extraServices || [],
        subtotalAmount: slot.subtotalAmount || 0,
        event_address: slot.event_address || "",
      });
    });
  });

  return (
    <Stack spacing={3}>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <SectionHeader
          icon={FiClipboard}
          title="Event Summary & Services"
          subtitle="Review each event, set pricing, and add services"
        />
        <Paper
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.5,
            borderRadius: 2,
            border: 1,
            borderColor: "success.light",
            bgcolor: (t) => t.palette.success.light + "33",
            textAlign: "right",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: 700,
              color: "success.dark",
            }}
          >
            Grand Total
          </Typography>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            ₹{Number(formData.grandTotalAmount || 0).toFixed(2)}
          </Typography>
        </Paper>
      </Stack>

      {/* Client Info Summary */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          background: (t) =>
            `linear-gradient(90deg, ${t.palette.action.hover}, ${t.palette.primary.light + "1a"})`,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <InfoTile label="Client" value={formData.name} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <InfoTile label="Mobile" value={formData.mobile_no} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <InfoTile label="Reference" value={formData.reference} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <InfoTile label="Total Events" value={eventCards.length} />
          </Grid>
        </Grid>
      </Paper>

      {/* Event Cards */}
      <Stack spacing={2.5}>
        {eventCards.map((event, cardIdx) => (
          <Paper
            key={`${event.dIdx}-${event.sIdx}`}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              borderColor: (t) => t.palette.primary.light + "66",
              borderWidth: 2,
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              sx={{
                px: 2.5,
                py: 1.75,
                background: (t) =>
                  `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                color: "primary.contrastText",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "primary.contrastText",
                    width: 36,
                    height: 36,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {cardIdx + 1}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {event.timeLabel}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, color: "inherit" }}
                  >
                    {event.dateStr} • {event.dayLabel}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Subtotal
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  ₹{Number(event.subtotalAmount || 0).toFixed(2)}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ p: 2.5 }}>
              <Stack spacing={2.5}>
                {/* Info Row */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{
                        p: 1.5,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1.5,
                        bgcolor: "action.hover",
                        alignItems: "center",
                      }}
                    >
                      <FiUsers size={18} />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          sx={{
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          Persons
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>
                          {event.estimatedPersons || 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Per Plate Price (₹)"
                      placeholder="e.g. 350"
                      value={event.perPlatePrice || ""}
                      onChange={(e) =>
                        handleSlotChange(
                          event.dIdx,
                          event.sIdx,
                          "perPlatePrice",
                          e.target.value
                        )
                      }
                      autoComplete="off"
                      error={Boolean(
                        errors[`platePrice_${event.dIdx}_${event.sIdx}`]
                      )}
                      helperText={
                        errors[`platePrice_${event.dIdx}_${event.sIdx}`] || " "
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Venue"
                      placeholder="Event venue / address"
                      value={event.event_address}
                      onChange={(e) =>
                        handleSlotChange(
                          event.dIdx,
                          event.sIdx,
                          "event_address",
                          e.target.value
                        )
                      }
                      autoComplete="off"
                      error={Boolean(
                        errors[`event_address_${event.dIdx}_${event.sIdx}`]
                      )}
                      helperText={
                        errors[`event_address_${event.dIdx}_${event.sIdx}`] ||
                        " "
                      }
                      slotProps={{
                        input: {
                          startAdornment: (
                            <FiMapPin
                              size={14}
                              style={{ marginRight: 6, opacity: 0.5 }}
                            />
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Selected Dishes */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor: (t) => t.palette.primary.light + "66",
                    bgcolor: (t) => t.palette.primary.light + "0d",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 1.5, alignItems: "center" }}
                  >
                    <FiFileText size={15} />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.dark"
                    >
                      Selected Dishes
                    </Typography>
                    <Chip
                      size="small"
                      label={event.dishes.length}
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  {event.dishes.length > 0 ? (
                    <>
                      <Grid container spacing={1}>
                        {event.dishes.map((dish) => {
                          const isZeroPrice =
                            !dish.selectionRate ||
                            parseFloat(dish.selectionRate) === 0;
                          return (
                            <Grid
                              key={dish.dishId}
                              size={{ xs: 12, sm: 6, md: 4 }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  border: 1,
                                  borderColor: isZeroPrice
                                    ? "error.light"
                                    : "divider",
                                  bgcolor: isZeroPrice
                                    ? (t) => t.palette.error.light + "33"
                                    : "background.paper",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    bgcolor: isZeroPrice
                                      ? "error.light"
                                      : (t) => t.palette.primary.light + "33",
                                    color: isZeroPrice
                                      ? "error.main"
                                      : "primary.main",
                                  }}
                                >
                                  <FiFileText size={10} />
                                </Avatar>
                                <Typography
                                  variant="body2"
                                  fontWeight={500}
                                  noWrap
                                  color={
                                    isZeroPrice ? "error.main" : "text.primary"
                                  }
                                >
                                  {dish.dishName}
                                </Typography>
                              </Stack>
                            </Grid>
                          );
                        })}
                      </Grid>
                      {event.dishes.some(
                        (d) =>
                          !d.selectionRate ||
                          parseFloat(d.selectionRate) === 0
                      ) && (
                        <Typography
                          variant="caption"
                          color="error.main"
                          sx={{
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: 0.5,
                              border: 1,
                              borderColor: "error.light",
                              bgcolor: (t) => t.palette.error.light + "33",
                            }}
                          />
                          Red highlighted items are not counted in dish price
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      fontStyle="italic"
                    >
                      No dishes selected for this event.
                    </Typography>
                  )}
                </Paper>

                {/* Waiter Services */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor: (t) => t.palette.primary.light + "66",
                    bgcolor: (t) => t.palette.primary.light + "0d",
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      mb: 1.5,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <FiUsers size={15} />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary.dark"
                      >
                        Waiter Service
                      </Typography>
                      {event.waiterServices.length > 0 && (
                        <Chip
                          size="small"
                          label={event.waiterServices.length}
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                    </Stack>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<FiPlus size={12} />}
                      onClick={() =>
                        handleSlotAddWaiter(event.dIdx, event.sIdx)
                      }
                    >
                      Add Waiter
                    </Button>
                  </Stack>

                  {event.waiterServices.length > 0 ? (
                    <Stack spacing={1.25}>
                      {event.waiterServices.map((ws, wIdx) => {
                        const entryTotal =
                          (Number(ws.waiterRate) || 0) *
                          (Number(ws.waiterCount) || 0);
                        return (
                          <Paper
                            key={wIdx}
                            variant="outlined"
                            sx={{ p: 1.25, borderRadius: 1.5 }}
                          >
                            <Stack spacing={1}>
                              <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={1}
                                sx={{
                                  alignItems: {
                                    xs: "stretch",
                                    md: "center",
                                  },
                                }}
                              >
                                <FormControl size="small" sx={{ flex: 1 }}>
                                  <InputLabel>Waiter type</InputLabel>
                                  <Select
                                    label="Waiter type"
                                    value={ws.waiterType || ""}
                                    onChange={(e) =>
                                      handleSlotWaiterChange(
                                        event.dIdx,
                                        event.sIdx,
                                        wIdx,
                                        "waiterType",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="">
                                      <em>Select waiter type</em>
                                    </MenuItem>
                                    {isLoadingWaiterTypes && (
                                      <MenuItem value="">
                                        <em>Loading…</em>
                                      </MenuItem>
                                    )}
                                    {!isLoadingWaiterTypes &&
                                      waiterTypes?.map((type) => (
                                        <MenuItem key={type.id} value={type.name}>
                                          {type.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                                <Box
                                  sx={{
                                    minWidth: 140,
                                    p: 1.25,
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    textAlign: "center",
                                    bgcolor: "action.hover",
                                  }}
                                >
                                  <Typography
                                    component="span"
                                    variant="body2"
                                  >
                                    ₹{" "}
                                    <Box component="strong">
                                      {(Number(ws.waiterRate) || 0).toFixed(2)}
                                    </Box>
                                    /head
                                  </Typography>
                                </Box>
                                <TextField
                                  size="small"
                                  placeholder="Count"
                                  value={ws.waiterCount || ""}
                                  onChange={(e) =>
                                    handleSlotWaiterChange(
                                      event.dIdx,
                                      event.sIdx,
                                      wIdx,
                                      "waiterCount",
                                      e.target.value
                                    )
                                  }
                                  autoComplete="off"
                                  sx={{ width: { xs: "100%", md: 100 } }}
                                  slotProps={{
                                    htmlInput: {
                                      style: { textAlign: "center" },
                                    },
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  fontWeight={700}
                                  color="primary.main"
                                  sx={{
                                    minWidth: 80,
                                    textAlign: { xs: "left", md: "right" },
                                  }}
                                >
                                  ₹{entryTotal.toFixed(2)}
                                </Typography>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleSlotRemoveWaiter(
                                      event.dIdx,
                                      event.sIdx,
                                      wIdx
                                    )
                                  }
                                >
                                  <FiX size={14} />
                                </IconButton>
                              </Stack>
                              <TextField
                                size="small"
                                fullWidth
                                placeholder="Notes (optional)"
                                value={ws.waiterNotes || ""}
                                onChange={(e) =>
                                  handleSlotWaiterChange(
                                    event.dIdx,
                                    event.sIdx,
                                    wIdx,
                                    "waiterNotes",
                                    e.target.value
                                  )
                                }
                                autoComplete="off"
                              />
                            </Stack>
                          </Paper>
                        );
                      })}

                      {event.waiterServices.length > 1 && (
                        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                          <Chip
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                            label={`Total Waiter Charge: ₹${event.waiterServices
                              .reduce(
                                (sum, ws) =>
                                  sum +
                                  (Number(ws.waiterRate) || 0) *
                                    (Number(ws.waiterCount) || 0),
                                0
                              )
                              .toFixed(2)}`}
                          />
                        </Stack>
                      )}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      fontStyle="italic"
                    >
                      No waiter services added.
                    </Typography>
                  )}
                </Paper>

                {/* Extra Services */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor: (t) => t.palette.primary.light + "66",
                    bgcolor: (t) => t.palette.primary.light + "14",
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      mb: 1.5,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <FiPlus size={15} />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary.dark"
                      >
                        Extra Services
                      </Typography>
                      {event.extraServices.length > 0 && (
                        <Chip
                          size="small"
                          label={event.extraServices.length}
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                    </Stack>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<FiPlus size={12} />}
                      onClick={() =>
                        handleSlotAddExtra(event.dIdx, event.sIdx)
                      }
                    >
                      Add Service
                    </Button>
                  </Stack>

                  {event.extraServices.length > 0 ? (
                    <Stack spacing={1}>
                      {event.extraServices.map((extra, eIdx) => (
                        <Stack
                          key={eIdx}
                          direction={{ xs: "column", md: "row" }}
                          spacing={1}
                          sx={{
                            p: 1.25,
                            borderRadius: 1.5,
                            border: 1,
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            alignItems: { xs: "stretch", md: "center" },
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Service name"
                            value={extra.serviceName || ""}
                            onChange={(e) =>
                              handleSlotExtraChange(
                                event.dIdx,
                                event.sIdx,
                                eIdx,
                                "serviceName",
                                e.target.value
                              )
                            }
                            autoComplete="off"
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            placeholder="₹ Price"
                            value={extra.price || ""}
                            onChange={(e) =>
                              handleSlotExtraChange(
                                event.dIdx,
                                event.sIdx,
                                eIdx,
                                "price",
                                e.target.value
                              )
                            }
                            autoComplete="off"
                            sx={{ width: { xs: "100%", md: 110 } }}
                            slotProps={{
                              htmlInput: { style: { textAlign: "center" } },
                            }}
                          />
                          <TextField
                            size="small"
                            placeholder="Qty"
                            value={extra.quantity || ""}
                            onChange={(e) =>
                              handleSlotExtraChange(
                                event.dIdx,
                                event.sIdx,
                                eIdx,
                                "quantity",
                                e.target.value
                              )
                            }
                            autoComplete="off"
                            sx={{ width: { xs: "100%", md: 80 } }}
                            slotProps={{
                              htmlInput: { style: { textAlign: "center" } },
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color="text.primary"
                            sx={{
                              minWidth: 70,
                              textAlign: { xs: "left", md: "right" },
                            }}
                          >
                            ₹{(
                              (Number(extra.price) || 0) *
                              (Number(extra.quantity) || 1)
                            ).toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleSlotRemoveExtra(
                                event.dIdx,
                                event.sIdx,
                                eIdx
                              )
                            }
                          >
                            <FiX size={14} />
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      fontStyle="italic"
                    >
                      No extra services added.
                    </Typography>
                  )}
                </Paper>
              </Stack>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Description + Rule Checkbox */}
      <Grid container spacing={2.5} sx={{ pt: 2.5, borderTop: 1, borderColor: "divider" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="General Description"
            name="description"
            placeholder="Notes for the entire event..."
            value={formData.description || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formData.rule)}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "rule", value: e.target.checked },
                    })
                  }
                />
              }
              label={
                <Typography fontWeight={500}>Display Rules on PDF</Typography>
              }
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Rules + Suggestions + Navigation */}
      <Box sx={{ pt: 2.5, borderTop: 1, borderColor: "divider" }}>
        <Stack
          direction="row"
          spacing={1.5}
          useFlexGap
          sx={{ mb: 2.5, flexWrap: "wrap" }}
        >
          <Button
            variant={showRules ? "contained" : "outlined"}
            color="primary"
            startIcon={<FiBookOpen size={15} />}
            onClick={() => {
              setShowRules(!showRules);
              setShowSuggestions(false);
            }}
          >
            View Rules
          </Button>
          <Button
            variant={showSuggestions ? "contained" : "outlined"}
            color="primary"
            startIcon={<FiFileText size={15} />}
            onClick={() => {
              setShowSuggestions(!showSuggestions);
              setShowRules(false);
            }}
          >
            View Suggestions
          </Button>
        </Stack>

        <Collapse in={showRules}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: 2,
              borderColor: (t) => t.palette.primary.light + "66",
              bgcolor: (t) => t.palette.primary.light + "14",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1.5, alignItems: "center" }}
            >
              <FiBookOpen size={15} />
              <Typography
                variant="body2"
                fontWeight={700}
                color="primary.dark"
              >
                Terms & Rules
              </Typography>
            </Stack>
            <Stack component="ol" spacing={1} sx={{ pl: 2, m: 0 }}>
              {[
                "The party must arrange the cooking area on time.",
                "The party must confirm the menu and dish count 10 days before the event.",
                "The party must arrange water supply for utensils and waste disposal.",
                "The party must arrange tables for counters and other pandal service equipment.",
                "The party must pay 30% advance payment after placing the order.",
              ].map((rule, idx) => (
                <Typography
                  key={idx}
                  component="li"
                  variant="body2"
                  color="primary.dark"
                >
                  {rule}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Collapse>

        <Collapse in={showSuggestions}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: 2,
              borderColor: "info.light",
              bgcolor: (t) => t.palette.info.light + "22",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1.5, alignItems: "center" }}
            >
              <FiFileText size={15} />
              <Typography variant="body2" fontWeight={700} color="info.dark">
                Suggestions
              </Typography>
            </Stack>
            <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
              {[
                "Consider adding a welcome drinks section for events with 200+ guests.",
                "Multi-day events benefit from varied menus to avoid repetition.",
                "Ensure dessert selection aligns with the number of main course dishes.",
              ].map((tip, idx) => (
                <Typography
                  key={idx}
                  component="li"
                  variant="body2"
                  color="info.dark"
                >
                  {tip}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Collapse>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FiArrowLeft size={16} />}
            onClick={onBack}
          >
            Back to Menu
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<FiSend size={18} />}
            onClick={handleSubmit}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              background: (t) =>
                `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
            }}
          >
            Review &amp; Generate PDF
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

export default Step3_Summary;
