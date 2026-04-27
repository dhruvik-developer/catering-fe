/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepButton,
  StepLabel,
} from "@mui/material";
import { FiUser, FiGrid, FiClipboard } from "react-icons/fi";
import Step1_ClientEvent from "./Step1_ClientEvent";
import Step2_MenuSelection from "./Step2_MenuSelection";
import Step3_Summary from "./Step3_Summary";

const STEPS = [
  { id: 1, label: "Client & Event", icon: FiUser },
  { id: 2, label: "Menu Selection", icon: FiGrid },
  { id: 3, label: "Summary & Services", icon: FiClipboard },
];

function StepIcon({ icon: Icon, active, completed }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: completed
          ? "success.main"
          : active
            ? "primary.contrastText"
            : "rgba(255,255,255,0.2)",
        color: completed
          ? "success.contrastText"
          : active
            ? "primary.main"
            : "rgba(255,255,255,0.6)",
        boxShadow: active ? 3 : 0,
        transition: "all 0.3s",
      }}
    >
      <Icon size={18} />
    </Box>
  );
}

function DishComponent({
  formData,
  errors,
  dishesList,
  isDishesLoading,
  waiterTypes,
  isLoadingWaiterTypes,
  refreshWaiterTypes,
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
  handleSlotAddWaiter,
  handleSlotRemoveWaiter,
  handleSlotWaiterChange,
  handleSubmit,
  validateStep1,
  validateStep2,
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const goToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeIndex = currentStep - 1;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Stepper Header */}
      <Box
        sx={{
          background: (t) =>
            `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
          color: "primary.contrastText",
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Stepper
          activeStep={activeIndex}
          alternativeLabel
          sx={{
            maxWidth: 720,
            mx: "auto",
            "& .MuiStepConnector-line": {
              borderColor: "rgba(255,255,255,0.25)",
              borderTopWidth: 3,
              borderRadius: 999,
            },
            "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
              borderColor: "success.main",
            },
            "& .MuiStepLabel-label": {
              color: "rgba(255,255,255,0.5) !important",
              fontSize: "0.75rem",
              fontWeight: 600,
              mt: 1,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "primary.contrastText !important",
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "success.light !important",
            },
          }}
        >
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const CustomStepIcon = (iconProps) => (
              <StepIcon
                icon={step.icon}
                active={iconProps.active}
                completed={iconProps.completed}
              />
            );

            return (
              <Step key={step.id} completed={isCompleted}>
                <StepButton
                  onClick={() => {
                    if (isCompleted) goBack(step.id);
                  }}
                  disabled={!isCompleted}
                  sx={{ "&.Mui-disabled": { cursor: "default" } }}
                >
                  <StepLabel slots={{ stepIcon: CustomStepIcon }}>
                    {step.label}
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {/* Step Content */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {currentStep === 1 && (
          <Step1_ClientEvent
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleAddSchedule={handleAddSchedule}
            handleRemoveSchedule={handleRemoveSchedule}
            handleScheduleDateChange={handleScheduleDateChange}
            handleAddTimeSlot={handleAddTimeSlot}
            handleRemoveTimeSlot={handleRemoveTimeSlot}
            handleSlotChange={handleSlotChange}
            onNext={goToStep2}
          />
        )}

        {currentStep === 2 && (
          <Step2_MenuSelection
            formData={formData}
            errors={errors}
            dishesList={dishesList}
            isDishesLoading={isDishesLoading}
            handleSlotDishesUpdate={handleSlotDishesUpdate}
            onNext={goToStep3}
            onBack={() => goBack(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3_Summary
            formData={formData}
            errors={errors}
            waiterTypes={waiterTypes}
            isLoadingWaiterTypes={isLoadingWaiterTypes}
            refreshWaiterTypes={refreshWaiterTypes}
            handleChange={handleChange}
            handleSlotChange={handleSlotChange}
            handleSlotAddExtra={handleSlotAddExtra}
            handleSlotRemoveExtra={handleSlotRemoveExtra}
            handleSlotExtraChange={handleSlotExtraChange}
            handleSlotAddWaiter={handleSlotAddWaiter}
            handleSlotRemoveWaiter={handleSlotRemoveWaiter}
            handleSlotWaiterChange={handleSlotWaiterChange}
            handleSubmit={handleSubmit}
            onBack={() => goBack(2)}
          />
        )}
      </Box>
    </Paper>
  );
}

export default DishComponent;
