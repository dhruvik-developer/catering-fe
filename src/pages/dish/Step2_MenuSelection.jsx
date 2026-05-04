/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import {
  FiSearch,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiGrid,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";
import {
  categoryMatchesQuery,
  flattenCategoryItems,
  sortCategoryTree,
} from "../../utils/categoryTree";
import { useLocalized } from "../../i18n/helpers";
import { translateTimeLabel } from "./dishI18n";

function Step2_MenuSelection({
  formData,
  dishesList,
  isDishesLoading,
  handleSlotDishesUpdate,
  onNext,
  onBack,
}) {
  const { t } = useTranslation();
  const pickLocalized = useLocalized();
  // Flatten all timeslots into tabs
  const tabs = useMemo(() => {
    const result = [];
    formData.schedule.forEach((day, dIdx) => {
      const dateObj = new Date(day.event_date);
      const pad = (n) => n.toString().padStart(2, "0");
      const dateStr = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}`;
      day.timeSlots.forEach((slot, sIdx) => {
        result.push({
          dIdx,
          sIdx,
          label: slot.timeLabel || t("dishFlow.schedule.slot", { count: sIdx + 1 }),
          dateStr,
          dishes: slot.dishes || [],
        });
      });
    });
    return result;
  }, [formData.schedule, t]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  const categoriesList = useMemo(
    () => sortCategoryTree(dishesList),
    [dishesList]
  );

  useEffect(() => {
    if (categoriesList.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categoriesList[0].id);
    }
  }, [categoriesList, activeCategoryId]);

  const activeTab = tabs[activeTabIndex];
  const currentDishes = activeTab ? activeTab.dishes : [];

  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return categoriesList;
    return categoriesList.filter((cat) =>
      categoryMatchesQuery(cat, categorySearchQuery)
    );
  }, [categoriesList, categorySearchQuery]);

  const activeCategory = categoriesList.find((c) => c.id === activeCategoryId);

  const categoryItems = useMemo(() => {
    const items = flattenCategoryItems(activeCategory);
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      `${item.name} ${item.categoryPath}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery]);

  const isDishSelected = (dishId) =>
    currentDishes.some((d) => d.dishId === dishId);

  const toggleDish = (dish) => {
    if (!activeTab) return;
    const { dIdx, sIdx } = activeTab;
    const existing = currentDishes.find((d) => d.dishId === dish.id);
    let newDishes;
    if (existing) {
      newDishes = currentDishes.filter((d) => d.dishId !== dish.id);
    } else {
      newDishes = [
        ...currentDishes,
        {
          dishId: dish.id,
          dishName: dish.name,
          categoryName: dish.categoryName || activeCategory?.name || t("dishFlow.menu.dishes"),
          selectionRate: parseFloat(dish.selection_rate) || 0,
          baseCost: parseFloat(dish.base_cost) || 0,
        },
      ];
    }
    handleSlotDishesUpdate(dIdx, sIdx, newDishes);
  };

  const totalSelectedAll = useMemo(() => {
    let count = 0;
    formData.schedule.forEach((day) => {
      day.timeSlots.forEach((slot) => {
        count += slot.dishes?.length || 0;
      });
    });
    return count;
  }, [formData.schedule]);

  const getSelectedCountForCategory = (catId) => {
    const cat = categoriesList.find((c) => c.id === catId);
    if (!cat) return 0;
    const allItems = flattenCategoryItems(cat);
    return allItems.filter((item) => isDishSelected(item.id)).length;
  };

  if (!activeTab) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t("dishFlow.menu.noTimings")}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FiArrowLeft />}
          onClick={onBack}
        >
          {t("dishFlow.menu.goBack")}
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={0}>
      {/* Event timing tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mx: { xs: -2, sm: -3 },
          mt: { xs: -2, sm: -3 },
          px: { xs: 2, sm: 3 },
          pt: 2,
          bgcolor: "action.hover",
        }}
      >
        <Tabs
          value={activeTabIndex}
          onChange={(_, v) => {
            setActiveTabIndex(v);
            setSearchQuery("");
          }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabs.map((tab, idx) => (
            <Tab
              key={`${tab.dIdx}-${tab.sIdx}`}
              value={idx}
              label={
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  <span>{translateTimeLabel(t, tab.label)}</span>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ textTransform: "none", letterSpacing: 0 }}
                  >
                    {tab.dateStr}
                  </Typography>
                  {tab.dishes.length > 0 && (
                    <Chip
                      size="small"
                      label={tab.dishes.length}
                      color="primary"
                      sx={{
                        height: 20,
                        minWidth: 20,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        "& .MuiChip-label": { px: 0.75 },
                      }}
                    />
                  )}
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Main: Sidebar + Grid */}
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          overflow: "hidden",
          height: { xs: "auto", md: "calc(100vh - 300px)" },
          minHeight: 420,
        }}
      >
        {/* Left sidebar: categories */}
        <Box
          sx={{
            width: { xs: "100%", md: 240 },
            minWidth: { md: 220 },
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: "divider",
            bgcolor: "action.hover",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t("dishFlow.menu.searchCategory")}
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch size={14} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              maxHeight: { xs: 220, md: "none" },
            }}
          >
            {filteredCategories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              const selectedCount = getSelectedCountForCategory(cat.id);
              return (
                <Box
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setSearchQuery("");
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    borderLeft: 4,
                    borderColor: isActive ? "primary.main" : "transparent",
                    bgcolor: isActive ? "background.paper" : "transparent",
                    color: isActive ? "primary.main" : "text.secondary",
                    fontWeight: isActive ? 700 : 500,
                    transition: "all 0.15s",
                    "&:hover": {
                      bgcolor: "background.paper",
                      color: "text.primary",
                    },
                  }}
                >
                  <Typography
                    variant="body2" noWrap
                    sx={{ fontWeight: "inherit", color: "inherit" }}
                  >
                    {pickLocalized(cat, "name") || cat.name}
                  </Typography>
                  {selectedCount > 0 && (
                    <Chip
                      size="small"
                      label={selectedCount}
                      color={isActive ? "primary" : "default"}
                      sx={{ ml: 1, height: 20, fontWeight: 700 }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Right: dish grid */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "action.hover",
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <TextField
              size="small"
              placeholder={t("dishFlow.menu.searchDishes")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, maxWidth: 360 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch size={14} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ textTransform: "uppercase", fontWeight: 700 }}
                >
                  {t("dishFlow.menu.thisEvent")}
                </Typography>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                  {t("dishFlow.menu.dishesCount", { count: currentDishes.length })}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ textTransform: "uppercase", fontWeight: 700 }}
                >
                  {t("dishFlow.menu.allEvents")}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {t("dishFlow.menu.dishesCount", { count: totalSelectedAll })}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {isDishesLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 10,
                }}
              >
                <Loader fullScreen={false} />
              </Box>
            ) : categoryItems.length === 0 ? (
              <EmptyState
                icon={<FiGrid size={24} />}
                title={t("dishFlow.menu.noDishesTitle")}
                message={t("dishFlow.menu.noDishesMessage")}
              />
            ) : (
              <Grid container spacing={1.5}>
                {categoryItems.map((dish) => {
                  const selected = isDishSelected(dish.id);
                  return (
                    <Grid
                      key={dish.id}
                      size={{ xs: 6, md: 4, lg: 3, xl: 2.4 }}
                    >
                      <Paper
                        variant="outlined"
                        onClick={() => toggleDish(dish)}
                        sx={{
                          p: 2,
                          minHeight: 90,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          position: "relative",
                          borderWidth: 2,
                          borderColor: selected
                            ? "primary.main"
                            : "divider",
                          bgcolor: selected
                            ? (t) => t.palette.primary.light + "26"
                            : "background.paper",
                          boxShadow: selected ? 2 : 0,
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: selected ? "primary.main" : "grey.400",
                            boxShadow: 1,
                          },
                        }}
                      >
                        {selected && (
                          <Avatar
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              width: 24,
                              height: 24,
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          >
                            <FiCheck size={13} strokeWidth={3} />
                          </Avatar>
                        )}
                        <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            color={selected ? "primary.main" : "text.primary"}
                            sx={{ fontWeight: 600, lineHeight: 1.4 }}
                          >
                            {pickLocalized(dish, "name") || dish.name}
                          </Typography>
                          {dish.categoryPath &&
                            dish.categoryPath !== activeCategory?.name && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ lineHeight: 1.2 }}
                              >
                              {dish.categoryPath}
                              </Typography>
                            )}
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Footer */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          pt: 2.5,
          mt: 2.5,
          borderTop: 1,
          borderColor: "divider",
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<FiArrowLeft size={16} />}
          onClick={onBack}
        >
          {t("common.back")}
        </Button>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ alignItems: { xs: "stretch", md: "center" } }}
        >
          <Stack
            direction="row"
            spacing={1} useFlexGap
            sx={{
              display: { xs: "none", md: "flex" },
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {tabs.map((tab, idx) => (
              <Chip
                key={idx}
                label={`${translateTimeLabel(t, tab.label)}: ${tab.dishes.length}`}
                size="small"
                color={tab.dishes.length > 0 ? "primary" : "default"}
                variant={tab.dishes.length > 0 ? "filled" : "outlined"}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<FiArrowRight size={18} />}
            onClick={onNext}
          >
            {t("dishFlow.menu.continueToSummary")}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Step2_MenuSelection;
