/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
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

const TIME_OPTIONS = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Lunch", label: "Lunch" },
  { value: "Dinner", label: "Dinner" },
  { value: "High Tea", label: "High Tea" },
  { value: "Late Night Nasto", label: "Late Night Snack" },
];

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, alignItems: "center" }}>
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

const DatePickerTextField = forwardRef(function DatePickerTextField(
  { helperText = " ", sx, InputProps, inputProps, ...props },
  ref
) {
  return (
    <TextField
      {...props}
      fullWidth
      inputRef={ref}
      helperText={helperText}
      slotProps={{
        input: { ...InputProps, readOnly: true },
        htmlInput: inputProps,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: props.disabled ? "action.hover" : "background.paper",
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
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Stack spacing={4}>
      {/* Section 1: Client Information */}
      <Box>
        <SectionHeader
          icon={FiUser}
          title="Client Information"
          subtitle="Enter basic details of the client"
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
              label="Client Name *"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder={errors.name || "Enter client name"}
              error={Boolean(errors.name)}
              helperText={errors.name || " "}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Mobile Number *"
              name="mobile_no"
              value={formData.mobile_no || ""}
              onChange={handleChange}
              placeholder={errors.mobile_no || "Mobile Number"}
              slotProps={{ htmlInput: { maxLength: 10 } }}
              error={Boolean(errors.mobile_no)}
              helperText={errors.mobile_no || " "}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DatePickerInput
              selected={formData.date}
              dateFormat="dd/MM/yyyy"
              disabled
              textFieldProps={{
                label: "Order Date",
                helperText: " ",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Reference Name (Optional)"
              name="reference"
              value={formData.reference || ""}
              onChange={handleChange}
              placeholder="Reference Name"
              error={Boolean(errors.reference)}
              helperText={errors.reference || " "}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      {/* Section 2: Event Schedule */}
      <Box>
        <SectionHeader
          icon={FiCalendar}
          title="Event Schedule"
          subtitle="Add event dates and time slots for each day"
        />

        {errors.schedule && (
          <Typography
            variant="body2"
            color="error.main"
            fontWeight={500}
            sx={{
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
            fontWeight={500}
            sx={{
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
                      fontWeight={700}
                      color="text.primary"
                      sx={{ flexShrink: 0 }}
                    >
                      Event Date:
                    </Typography>
                    <DatePickerInput
                      sx={{ width: { xs: "100%", sm: 160 } }}
                      placeholderText="Choose Date"
                      minDate={tomorrow}
                      dateFormat="dd/MM/yyyy"
                      selected={day.event_date}
                      onChange={(date) => handleScheduleDateChange(dIdx, date)}
                      textFieldProps={{
                        placeholder: "Choose Date",
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
                    title="Delete Day"
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
                            bgcolor: (t) => t.palette.primary.light + "33",
                            color: "primary.main",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <FiClock size={15} />
                        </Avatar>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="primary.main"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                          Slot {sIdx + 1}
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
                            <InputLabel>Event Timing</InputLabel>
                            <Select
                              label="Event Timing"
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
                                <em>Select Timing...</em>
                              </MenuItem>
                              {TIME_OPTIONS.map((t) => {
                                const count = day.timeSlots.reduce(
                                  (acc, currentSlot, currIdx) =>
                                    currIdx !== sIdx &&
                                    currentSlot.timeLabel === t.value
                                      ? acc + 1
                                      : acc,
                                  0
                                );
                                const isDisabled = count >= 3;
                                return (
                                  <MenuItem
                                    key={t.value}
                                    value={t.value}
                                    disabled={isDisabled}
                                  >
                                    {t.label}{" "}
                                    {isDisabled && "(Max 3 limit reached)"}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            <FormHelperText>
                              {errors[`timeLabel_${dIdx}_${sIdx}`] || " "}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Number of Persons"
                            placeholder="e.g. 250"
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
                            helperText={errors[`persons_${dIdx}_${sIdx}`] || " "}
                          />
                        </Grid>
                      </Grid>

                      {day.timeSlots.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveTimeSlot(dIdx, sIdx)}
                          title="Remove this time slot"
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      )}
                    </Stack>
                  </Paper>
                ))}

                <Button
                  variant="outlined"
                  fullWidth
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
                  Add Time Slot
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
          Add Event Date
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={<FiArrowRight size={18} />}
          onClick={onNext}
        >
          Continue to Menu Selection
        </Button>
      </Stack>
    </Stack>
  );
}

export default Step1_ClientEvent;
