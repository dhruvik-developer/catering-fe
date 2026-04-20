/* eslint-disable react/prop-types */
import { useState } from "react";
import Step1_ClientEvent from "./Step1_ClientEvent";
import Step2_MenuSelection from "./Step2_MenuSelection";
import Step3_Summary from "./Step3_Summary";
import { FiUser, FiGrid, FiClipboard, FiCheck } from "react-icons/fi";

const STEPS = [
  { id: 1, label: "Client & Event", icon: FiUser },
  { id: 2, label: "Menu Selection", icon: FiGrid },
  { id: 3, label: "Summary & Services", icon: FiClipboard },
];

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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ============ STEPPER HEADER ============ */}
      <div className="bg-gradient-to-r from-[#845cbd] to-[#6a3faf] px-4 sm:px-6 py-4 sm:py-5 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
        <div className="flex items-center justify-between max-w-2xl mx-auto min-w-[320px]">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle + Label */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) goBack(step.id);
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-400 text-white shadow-lg shadow-green-400/30 cursor-pointer hover:bg-green-500"
                        : isActive
                          ? "bg-white text-[#845cbd] shadow-lg shadow-white/30 scale-110"
                          : "bg-white/20 text-white/60"
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheck size={18} strokeWidth={3} />
                    ) : (
                      <StepIcon size={18} />
                    )}
                  </button>
                  <span
                    className={`mt-2 text-[11px] font-semibold tracking-wide whitespace-nowrap ${
                      isActive
                        ? "text-white"
                        : isCompleted
                          ? "text-green-200"
                          : "text-white/50"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-3 mt-[-20px]">
                    <div
                      className={`h-[3px] rounded-full transition-all duration-500 ${
                        isCompleted ? "bg-green-400" : "bg-white/20"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ STEP CONTENT ============ */}
      <div className="p-6">
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
      </div>
    </div>
  );
}

export default DishComponent;
