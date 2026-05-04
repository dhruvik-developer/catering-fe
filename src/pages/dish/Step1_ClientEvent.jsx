/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiUser,
  FiPlus,
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiTrash2,
} from "react-icons/fi";
import { TIME_LABEL_KEYS } from "./dishI18n";

const TIME_OPTIONS = [
  { value: "Breakfast", labelKey: TIME_LABEL_KEYS.Breakfast },
  { value: "Lunch", labelKey: TIME_LABEL_KEYS.Lunch },
  { value: "Dinner", labelKey: TIME_LABEL_KEYS.Dinner },
  { value: "High Tea", labelKey: TIME_LABEL_KEYS["High Tea"] },
  { value: "Late Night Nasto", labelKey: TIME_LABEL_KEYS["Late Night Nasto"] },
];

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, alignItems: "center" }}>
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

const DatePickerTextField = forwardRef(function DatePickerTextField(
  { helperText, sx, InputProps, inputProps, ...props },
  ref
) {
  const textFieldHelperText =
    typeof helperText === "string" && helperText.trim() === ""
      ? undefined
      : helperText;

  return (
    <TextField
      {...props} fullWidth
      inputRef={ref}
      helperText={textFieldHelperText}
      slotProps={{
        input: { ...InputProps, readOnly: true },
        htmlInput: inputProps,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: props.disabled ? "action.hover" : "background.paper",
        },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#000000",
          color: "#000000",
        },
        "& .MuiInputLabel-root.Mui-disabled": {
          color: "rgba(0, 0, 0, 0.87)",
        },
        ...sx,
      }}
    />
  );
});

// Keeps react-datepicker on the same visual system as MUI TextField.
function DatePickerInput({ sx, textFieldProps, ...datePickerProps }) {
  return (
    <Box
      sx={{
        "& .react-datepicker-wrapper": { width: "100%" },
        width: "100%",
        ...sx,
      }}
    >
      <DatePicker
        {...datePickerProps}
        customInput={<DatePickerTextField {...textFieldProps} />}
      />
    </Box>
  );
}

function Step1_ClientEvent({
  formData,
  errors,
  handleChange,
  handleAddSchedule,
  handleRemoveSchedule,
  handleScheduleDateChange,
  handleAddTimeSlot,
  handleRemoveTimeSlot,
  handleSlotChange,
  onNext,
}) {
  const { t } = useTranslation();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Stack spacing={4}>
      {/* Section 1: Client Information */}
      <Box
        sx={{
          bgcolor: "var(--color-primary-soft)",
          p: { xs: 2, sm: 3 },
          borderRadius: "24px",
        }}
      >
        <SectionHeader
          icon={FiUser}
          title={t("dishFlow.client.title")}
          subtitle={t("dishFlow.client.subtitle")}
        />

        <Grid
          container
          columnSpacing={2.5}
          rowSpacing={1.5}
          sx={{ alignItems: "flex-start" }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("dishFlow.client.clientName")}
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder={errors.name || t("dishFlow.client.clientNamePlaceholder")}
              error={Boolean(errors.name)}
              helperText={errors.name || undefined}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("dishFlow.client.mobileNumber")}
              name="mobile_no"
              value={formData.mobile_no || ""}
              onChange={handleChange}
              placeholder={errors.mobile_no || t("dishFlow.client.mobilePlaceholder")}
              slotProps={{ htmlInput: { maxLength: 10 } }}
              error={Boolean(errors.mobile_no)}
              helperText={errors.mobile_no || undefined}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DatePickerInput
              selected={formData.date}
              dateFormat="dd/MM/yyyy" disabled
              textFieldProps={{
                label: t("dishFlow.client.orderDate"),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("dishFlow.client.referenceName")}
              name="reference"
              value={formData.reference || ""}
              onChange={handleChange}
              placeholder={t("dishFlow.client.referencePlaceholder")}
              error={Boolean(errors.reference)}
              helperText={errors.reference || undefined}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Section 2: Event Schedule */}
      <Box
        sx={{
          bgcolor: "var(--color-primary-soft)",
          p: { xs: 2, sm: 3 },
          borderRadius: "24px",
        }}
      >
        <SectionHeader
          icon={FiCalendar}
          title={t("dishFlow.schedule.title")}
          subtitle={t("dishFlow.schedule.subtitle")}
        />

        {errors.schedule && (
          <Typography
            variant="body2"
            color="error.main"

            sx={{ fontWeight: 500,
              mb: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: 1,
              border: 1,
              borderColor: "error.light",
              bgcolor: "error.light",
              color: "error.dark",
            }}
          >
            {errors.schedule}
          </Typography>
        )}
        {errors.slots && (
          <Typography
            variant="body2"
            color="error.main"

            sx={{ fontWeight: 500,
              mb: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: 1,
              border: 1,
              borderColor: "error.light",
              bgcolor: "error.light",
              color: "error.dark",
            }}
          >
            {errors.slots}
          </Typography>
        )}

        <Stack spacing={2.5}>
          {formData.schedule.map((day, dIdx) => (
            <Paper
              key={dIdx}
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                borderColor: (t) => t.palette.primary.light + "66",
                bgcolor: (t) => t.palette.primary.light + "0d",
              }}
            >
              {/* Day Header */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                  mb: 2.5,
                  alignItems: { xs: "stretch", md: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      width: 40,
                      height: 40,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {dIdx + 1}
                  </Avatar>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                  >
                    <Typography
                      variant="body2"

                      color="text.primary"
                      sx={{ fontWeight: 700, flexShrink: 0 }}
                    >
                      {t("dishFlow.schedule.eventDate")}
                    </Typography>
                    <DatePickerInput
                      sx={{ width: { xs: "100%", sm: 160 } }}
                      placeholderText={t("dishFlow.schedule.chooseDate")}
                      minDate={tomorrow}
                      dateFormat="dd/MM/yyyy" selected={day.event_date}
                      onChange={(date) => handleScheduleDateChange(dIdx, date)}
                      textFieldProps={{
                        placeholder: t("dishFlow.schedule.chooseDate"),
                        helperText: null,
                      }}
                    />
                  </Stack>
                </Stack>
                {formData.schedule.length > 1 && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveSchedule(dIdx)}
                    title={t("dishFlow.schedule.deleteDay")}
                    sx={{
                      alignSelf: { xs: "flex-end", md: "center" },
                    }}
                  >
                    <FiTrash2 size={16} />
                  </IconButton>
                )}
              </Stack>

              {/* Time Slots */}
              <Stack spacing={1.5}>
                {day.timeSlots.map((slot, sIdx) => (
                  <Paper
                    key={sIdx}
                    variant="outlined"
                    sx={{
                      p: 2,
                      pl: 3,
                      borderRadius: 2,
                      borderColor: (t) => t.palette.primary.light + "66",
                      position: "relative",
                      overflow: "hidden",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 6,
                        background: (t) =>
                          `linear-gradient(180deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                      }}
                    />
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ alignItems: { xs: "stretch", md: "center" } }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", flexShrink: 0 }}
                      >
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: "var(--color-primary-border)",
                            color: "primary.main",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <FiClock size={15} />
                        </Avatar>
                        <Typography
                          variant="caption"

                          color="primary.main"
                          sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                          {t("dishFlow.schedule.slot", { count: sIdx + 1 })}
                        </Typography>
                      </Stack>

                      <Grid
                        container
                        spacing={2}
                        sx={{ flex: 1, minWidth: 0, alignItems: "flex-start" }}
                      >
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl
                            fullWidth
                            size="small"
                            error={Boolean(errors[`timeLabel_${dIdx}_${sIdx}`])}
                          >
                            <InputLabel>{t("dishFlow.schedule.eventTiming")}</InputLabel>
                            <Select
                              label={t("dishFlow.schedule.eventTiming")}
                              value={slot.timeLabel || ""}
                              onChange={(e) =>
                                handleSlotChange(
                                  dIdx,
                                  sIdx,
                                  "timeLabel",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="">
                                <em>{t("dishFlow.schedule.selectTiming")}</em>
                              </MenuItem>
                              {TIME_OPTIONS.map((option) => {
                                const count = day.timeSlots.reduce(
                                  (acc, currentSlot, currIdx) =>
                                    currIdx !== sIdx &&
                                    currentSlot.timeLabel === option.value
                                      ? acc + 1
                                      : acc,
                                  0
                                );
                                const isDisabled = count >= 3;
                                return (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={isDisabled}
                                  >
                                    {t(option.labelKey)}{" "}
                                    {isDisabled && t("dishFlow.schedule.maxLimitReached")}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            {errors[`timeLabel_${dIdx}_${sIdx}`] && (
                              <FormHelperText>
                                {errors[`timeLabel_${dIdx}_${sIdx}`]}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label={t("dishFlow.schedule.numberOfPersons")}
                            placeholder={t("dishFlow.schedule.personsPlaceholder")}
                            value={slot.estimatedPersons || ""}
                            onChange={(e) =>
                              handleSlotChange(
                                dIdx,
                                sIdx,
                                "estimatedPersons",
                                e.target.value
                              )
                            }
                            error={Boolean(errors[`persons_${dIdx}_${sIdx}`])}
                            helperText={
                              errors[`persons_${dIdx}_${sIdx}`] || undefined
                            }
                          />
                        </Grid>
                      </Grid>

                      {day.timeSlots.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveTimeSlot(dIdx, sIdx)}
                          title={t("dishFlow.schedule.removeTimeSlot")}
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      )}
                    </Stack>
                  </Paper>
                ))}

                <Button
                  variant="outlined" fullWidth
                  startIcon={<FiPlus size={14} />}
                  onClick={() => handleAddTimeSlot(dIdx)}
                  sx={{
                    py: 1.25,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    color: "text.secondary",
                    borderColor: "divider",
                    "&:hover": {
                      borderStyle: "dashed",
                      borderWidth: 2,
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {t("dishFlow.schedule.addTimeSlot")}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Bottom actions */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          pt: 2,
          borderTop: 1,
          borderColor: "divider",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FiPlus size={16} />}
          onClick={handleAddSchedule}
        >
          {t("dishFlow.schedule.addEventDate")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={<FiArrowRight size={18} />}
          onClick={onNext}
        >
          {t("dishFlow.schedule.continueToMenu")}
        </Button>
      </Stack>
    </Stack>
  );
}

export default Step1_ClientEvent;
