export const TIME_LABEL_KEYS = {
  Breakfast: "dishFlow.time.breakfast",
  Lunch: "dishFlow.time.lunch",
  Dinner: "dishFlow.time.dinner",
  "High Tea": "dishFlow.time.highTea",
  "Late Night Nasto": "dishFlow.time.lateNightSnack",
  "Late Night Snack": "dishFlow.time.lateNightSnack",
};

export const translateTimeLabel = (t, value) => {
  if (!value) return value;
  const key = TIME_LABEL_KEYS[value];
  return key ? t(key) : value;
};

