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
import { useTranslation } from "react-i18next";
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
import { translateTimeLabel } from "./dishI18n";

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: "var(--color-primary-border)",
          color: "primary.main",
          width: 40,
          height: 40,
        }}
      >
        <Icon size={20} />
      </Avatar>
      <Box>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
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
      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
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
  const { t } = useTranslation();
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
        dayLabel: t("dishFlow.summary.day", { count: dIdx + 1 }),
        timeLabel: slot.timeLabel || t("dishFlow.schedule.slot", { count: sIdx + 1 }),
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
          title={t("dishFlow.summary.title")}
          subtitle={t("dishFlow.summary.subtitle")}
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
            {t("dishFlow.summary.grandTotal")}
          </Typography>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
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
            <InfoTile label={t("dishFlow.summary.client")} value={formData.name} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <InfoTile label={t("dishFlow.summary.mobile")} value={formData.mobile_no} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <InfoTile label={t("dishFlow.summary.reference")} value={formData.reference} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <InfoTile label={t("dishFlow.summary.totalEvents")} value={eventCards.length} />
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {translateTimeLabel(t, event.timeLabel)}
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
                  {t("dishFlow.summary.subtotal")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
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
                          {t("dishFlow.summary.persons")}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {event.estimatedPersons || 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label={t("dishFlow.summary.perPlatePrice")}
                      placeholder={t("dishFlow.summary.pricePlaceholder")}
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
                      label={t("dishFlow.summary.venue")}
                      placeholder={t("dishFlow.summary.venuePlaceholder")}
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

                      color="primary.dark"
                     sx={{ fontWeight: 600 }}>
                      {t("dishFlow.summary.selectedDishes")}
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
                                      : "var(--color-primary-border)",
                                    color: isZeroPrice
                                      ? "error.main"
                                      : "primary.main",
                                  }}
                                >
                                  <FiFileText size={10} />
                                </Avatar>
                                <Typography
                                  variant="body2" noWrap
                                  color={
                                    isZeroPrice ? "error.main" : "text.primary"
                                  }
                                 sx={{ fontWeight: 500 }}>
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
                          {t("dishFlow.summary.zeroPriceWarning")}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      fontStyle="italic"
                    >
                      {t("dishFlow.summary.noDishesSelected")}
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

                        color="primary.dark"
                       sx={{ fontWeight: 600 }}>
                        {t("dishFlow.summary.waiterService")}
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
                      {t("dishFlow.summary.addWaiter")}
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
                                  <InputLabel>{t("dishFlow.summary.waiterType")}</InputLabel>
                                  <Select
                                    label={t("dishFlow.summary.waiterType")}
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
                                      <em>{t("dishFlow.summary.selectWaiterType")}</em>
                                    </MenuItem>
                                    {isLoadingWaiterTypes && (
                                      <MenuItem value="">
                                        <em>{t("dishFlow.summary.loading")}</em>
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
                                    {t("dishFlow.summary.perHead")}
                                  </Typography>
                                </Box>
                                <TextField
                                  size="small"
                                  placeholder={t("dishFlow.summary.countPlaceholder")}
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

                                  color="primary.main"
                                  sx={{ fontWeight: 700,
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
                                size="small" fullWidth
                                placeholder={t("dishFlow.summary.notesPlaceholder")}
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
                            label={t("dishFlow.summary.totalWaiterCharge", {
                              amount: event.waiterServices
                                .reduce(
                                  (sum, ws) =>
                                    sum +
                                    (Number(ws.waiterRate) || 0) *
                                      (Number(ws.waiterCount) || 0),
                                  0
                                )
                                .toFixed(2),
                            })}
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
                      {t("dishFlow.summary.noWaiterServices")}
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

                        color="primary.dark"
                       sx={{ fontWeight: 600 }}>
                        {t("dishFlow.summary.extraServices")}
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
                      {t("dishFlow.summary.addService")}
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
                            placeholder={t("dishFlow.summary.serviceName")}
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
                            placeholder={t("dishFlow.summary.price")}
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
                            placeholder={t("dishFlow.summary.qty")}
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

                            color="text.primary"
                            sx={{ fontWeight: 700,
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
                      {t("dishFlow.summary.noExtraServices")}
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
            label={t("dishFlow.summary.generalDescription")}
            name="description"
            placeholder={t("dishFlow.summary.descriptionPlaceholder")}
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
                <Typography sx={{ fontWeight: 500 }}>
                  {t("dishFlow.summary.displayRules")}
                </Typography>
              }
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Rules + Suggestions + Navigation */}
      <Box sx={{ pt: 2.5, borderTop: 1, borderColor: "divider" }}>
        <Stack
          direction="row"
          spacing={1.5} useFlexGap
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
            {t("dishFlow.summary.viewRules")}
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
            {t("dishFlow.summary.viewSuggestions")}
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

                color="primary.dark"
               sx={{ fontWeight: 700 }}>
                {t("dishFlow.summary.termsRules")}
              </Typography>
            </Stack>
            <Stack component="ol" spacing={1} sx={{ pl: 2, m: 0 }}>
              {t("dishFlow.rules", { returnObjects: true }).map((rule, idx) => (
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
              <Typography variant="body2" color="info.dark" sx={{ fontWeight: 700 }}>
                {t("dishFlow.summary.suggestions")}
              </Typography>
            </Stack>
            <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
              {t("dishFlow.suggestions", { returnObjects: true }).map((tip, idx) => (
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
            {t("dishFlow.summary.backToMenu")}
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
            {t("dishFlow.summary.reviewGeneratePdf")}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

export default Step3_Summary;
