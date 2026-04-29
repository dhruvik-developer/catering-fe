/* eslint-disable react/prop-types */
import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Loader from "../../Components/common/Loader";
import AddOrderIngredientsModal from "../../Components/common/AddOrderIngredientsModal";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
  FiCalendar,
  FiUsers,
  FiShare2,
  FiUserCheck,
} from "react-icons/fi";
import { format } from "date-fns";

// ─── Unit Conversion Helper ───────────────────────────────────────────────────
const UNIT_CONVERSIONS = {
  kg: { g: 1000, kg: 1 },
  g: { kg: 0.001, g: 1 },
  l: { ml: 1000, l: 1 },
  ml: { l: 0.001, ml: 1 },
};

function convertToUnit(value, fromUnit, toUnit) {
  if (!fromUnit || !toUnit) return value;
  const from = fromUnit.trim().toLowerCase();
  const to = toUnit.trim().toLowerCase();
  if (from === to) return value;
  const factor = UNIT_CONVERSIONS[from]?.[to];
  return factor !== undefined ? value * factor : null;
}

function parseQuantity(str) {
  if (!str) return { value: 0, unit: "" };
  const match = String(str).match(/^([\d.]+)\s*([a-zA-Z]*)$/);
  if (match) return { value: parseFloat(match[1]) || 0, unit: match[2] || "" };
  return { value: parseFloat(str) || 0, unit: "" };
}

function getUniqueUsedItems(rows = []) {
  const usedItemsMap = new Map();
  rows.forEach((row) => {
    const usedItems = Array.isArray(row?.used_in_items) ? row.used_in_items : [];
    usedItems.forEach((usedItem) => {
      const itemName = String(usedItem || "").trim();
      const normalizedName = itemName.toLowerCase();
      if (normalizedName && !usedItemsMap.has(normalizedName)) {
        usedItemsMap.set(normalizedName, itemName);
      }
    });
  });
  return Array.from(usedItemsMap.values());
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      let d;
      if (parts[0].length === 4) {
        d = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
      } else {
        d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
      if (!isNaN(d)) return format(d, "dd MMM, yyyy");
    }
  } catch {
    /* fallback */
  }
  return dateStr;
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────
function InfoBlock({ label, value }) {
  return (
    <Stack spacing={0.25}>
      <Typography
        variant="caption"
        color="primary.main"

        sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ViewIngredientComponent({
  viewIngredient,
  eventIngredientsList = [],
  formValues,
  checkedItems = {},
  handleCheckboxChange,
  handleShareIngredients,
  handleFullShareIngredients,
  handleShareOutsourced,
  sessionFilter,
  sessionIdFilter,
  loading,
  navigate,
  onUpdateQuantity,
  missingBySession = {},
  onAddOrderLocalIngredients,
  onReplaceOrderLocalIngredients,
  onDeleteOrderLocalIngredient,
}) {
  const outsourcedItemsList = React.useMemo(() => {
    if (!viewIngredient?.sessions) return [];
    const items = [];
    viewIngredient.sessions.forEach((session) => {
      if (sessionIdFilter && String(session.id) !== String(sessionIdFilter))
        return;
      if (
        !sessionIdFilter &&
        sessionFilter &&
        session.event_time !== sessionFilter
      )
        return;
      const outsourced = session.outsourced_items || [];
      outsourced.forEach((oi) => {
        items.push({ ...oi, sessionTime: session.event_time });
      });
    });
    return items;
  }, [viewIngredient, sessionFilter, sessionIdFilter]);

  const [editingKey, setEditingKey] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");
  const [savingEdit, setSavingEdit] = React.useState(false);

  const [orderLocalModal, setOrderLocalModal] = React.useState(null);

  const orderLocalKeys = React.useMemo(() => {
    const s = new Set();
    (viewIngredient?.sessions || []).forEach((sess) => {
      Object.keys(sess.order_local_ingredients || {}).forEach((key) =>
        s.add(key)
      );
    });
    return s;
  }, [viewIngredient]);

  const orderLocalByDishBySession = React.useMemo(() => {
    const map = {};
    (viewIngredient?.sessions || []).forEach((sess) => {
      const perDish = {};
      Object.entries(sess.order_local_ingredients || {}).forEach(
        ([key, val]) => {
          if (!val || typeof val !== "object") return;
          const dish = val.for_item || "Other";
          if (!perDish[dish]) perDish[dish] = [];
          const { value, unit } = parseQuantity(val.quantity || "");
          const displayName = key.replace(/\s*\(for [^)]+\)$/, "");
          perDish[dish].push({
            key,
            ingredient: displayName,
            quantity: value || "",
            unit: unit || "g",
            category: val.category || "Other",
          });
        }
      );
      if (Object.keys(perDish).length > 0) map[sess.id] = perDish;
    });
    return map;
  }, [viewIngredient]);

  const visibleSessionsForBanner = (viewIngredient?.sessions || []).filter(
    (s) => {
      if (sessionIdFilter) return String(s.id) === String(sessionIdFilter);
      if (sessionFilter) return s.event_time === sessionFilter;
      return true;
    }
  );

  const closeOrderLocalModal = () => setOrderLocalModal(null);

  const handleOrderLocalSave = async (rows) => {
    if (!orderLocalModal) return;
    const { sessionId, dishName, mode } = orderLocalModal;
    const saver =
      mode === "edit"
        ? onReplaceOrderLocalIngredients
        : onAddOrderLocalIngredients;
    if (!saver) return;
    const success = await saver(sessionId, dishName, rows);
    if (success) closeOrderLocalModal();
  };

  const handleRemoveAllForDish = async (sessionId, dishName) => {
    if (!onDeleteOrderLocalIngredient) return;
    const dishEntries =
      orderLocalByDishBySession[sessionId]?.[dishName] || [];
    for (const row of dishEntries) {
       
      await onDeleteOrderLocalIngredient(sessionId, row.key);
    }
  };

  const handleSaveEdit = async (sessionId, ingredientName) => {
    if (!editValue.trim()) {
      setEditingKey(null);
      return;
    }
    setSavingEdit(true);
    const success = await onUpdateQuantity(
      sessionId,
      ingredientName,
      editValue.trim()
    );
    setSavingEdit(false);
    if (success !== false) {
      setEditingKey(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Bar */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Button
            variant="text"
            startIcon={<FiArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            sx={{ color: "text.secondary" }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Back
            </Box>
          </Button>
          <Typography
            variant="h6"

            sx={{ fontWeight: 700, flex: 1, textAlign: "center" }} noWrap
          >
            Ingredient Details
          </Typography>
          <Box sx={{ width: { xs: 40, sm: 80 } }} />
        </Toolbar>
      </AppBar>

      {loading ? (
        <Box sx={{ p: 4 }}>
          <Loader message="Loading Ingredients..." />
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            px: { xs: 2, sm: 3, lg: 4 },
            py: 4,
          }}
        >
          <Stack spacing={3}>
            {/* Session filter hero banner */}
            {sessionFilter &&
              (() => {
                const matchedSession = sessionIdFilter
                  ? viewIngredient?.sessions?.find(
                      (s) => String(s.id) === String(sessionIdFilter)
                    ) || {}
                  : viewIngredient?.sessions?.find(
                      (s) =>
                        (s.event_time || "").trim().toLowerCase() ===
                        (sessionFilter || "").trim().toLowerCase()
                    ) || {};
                const uniqueDates = Array.from(
                  new Set(
                    (viewIngredient?.sessions || []).map((s) => s.event_date)
                  )
                ).filter(Boolean);
                const displayDate =
                  matchedSession.event_date ||
                  viewIngredient?.event_date ||
                  (uniqueDates.length > 0 ? uniqueDates[0] : null);
                const persons =
                  matchedSession.estimated_persons ||
                  viewIngredient?.estimated_persons ||
                  "—";
                const address =
                  matchedSession.event_address ||
                  viewIngredient?.event_address ||
                  "—";
                return (
                  <>
                    <Paper
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 3,
                      }}
                    >
                      <Stack direction="row" spacing={4} useFlexGap sx={{ flexWrap: "wrap" }}>
                        {viewIngredient?.name && (
                          <InfoBlock
                            label="Customer"
                            value={
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {viewIngredient.name}
                              </Typography>
                            }
                          />
                        )}
                        {viewIngredient?.mobile_no && (
                          <InfoBlock
                            label="Mobile"
                            value={viewIngredient.mobile_no}
                          />
                        )}
                        {displayDate && (
                          <InfoBlock
                            label="Event Date"
                            value={formatDate(displayDate)}
                          />
                        )}
                        <InfoBlock
                          label="Estimated Persons"
                          value={
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {persons}
                            </Typography>
                          }
                        />
                        {address && address !== "—" && (
                          <InfoBlock label="Event Address" value={address} />
                        )}
                      </Stack>
                    </Paper>

                    <Paper
                      elevation={2}
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        borderRadius: 3,
                        px: { xs: 2, sm: 3 },
                        py: 2,
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}

                       sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
                        <FiCalendar size={20} />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.75,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                              fontWeight: 500,
                            }}
                          >
                            Viewing Session
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {sessionFilter}
                            </Typography>
                            {displayDate && (
                              <Typography
                                variant="caption"
                                sx={{ opacity: 0.85 }}
                              >
                                • {formatDate(displayDate)}
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        <Chip
                          icon={<FiUsers size={14} color="currentColor" />}
                          label={`${persons} persons`}
                          sx={{
                            ml: { sm: "auto" },
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: "inherit",
                            fontWeight: 600,
                            "& .MuiChip-icon": { color: "inherit" },
                          }}
                        />
                      </Stack>
                    </Paper>
                  </>
                );
              })()}

            {/* Event info (only when no session filter) */}
            {!sessionFilter && (
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Stack direction="row" spacing={4} useFlexGap sx={{ flexWrap: "wrap" }}>
                  {(() => {
                    const uniqueDates = Array.from(
                      new Set(
                        (viewIngredient?.sessions || []).map(
                          (s) => s.event_date
                        )
                      )
                    ).filter(Boolean);
                    const allDates = [...uniqueDates];
                    if (
                      viewIngredient?.event_date &&
                      !allDates.includes(viewIngredient.event_date)
                    ) {
                      allDates.push(viewIngredient.event_date);
                    }
                    return (
                      <>
                        {viewIngredient?.name && (
                          <InfoBlock
                            label="Customer"
                            value={
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {viewIngredient.name}
                              </Typography>
                            }
                          />
                        )}
                        {viewIngredient?.mobile_no && (
                          <InfoBlock
                            label="Mobile"
                            value={viewIngredient.mobile_no}
                          />
                        )}
                        {allDates.length > 0 && (
                          <InfoBlock
                            label={`Event Date${allDates.length > 1 ? "s" : ""}`}
                            value={allDates.map((d) => formatDate(d)).join(", ")}
                          />
                        )}
                      </>
                    );
                  })()}
                  <InfoBlock
                    label="Estimated Persons"
                    value={
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {viewIngredient.estimated_persons}
                      </Typography>
                    }
                  />
                  <InfoBlock
                    label="Event Address"
                    value={viewIngredient.event_address}
                  />
                </Stack>
              </Paper>
            )}

            {/* Vendor Supplied / Outsourced Items Block */}
            {outsourcedItemsList.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Stack
                  direction="row"


                  sx={{ justifyContent: "space-between", alignItems: "center",
                    px: 3,
                    py: 1.5,
                    bgcolor: (t) => t.palette.primary.light + "1f",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    🍱 Vendor Supplied Items
                  </Typography>
                  <Chip
                    size="small"
                    label={`${outsourcedItemsList.length} item${
                      outsourcedItemsList.length !== 1 ? "s" : ""
                    }`}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Grid container spacing={2}>
                    {outsourcedItemsList.map((oi, idx) => (
                      <Grid key={idx} size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <CardContent sx={{ flex: 1 }}>
                            <Stack
                              direction="row"


                              spacing={1}
                             sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                              <Typography
                                variant="body2"

                                sx={{ fontWeight: 700, flex: 1 }}
                              >
                                {oi.item_name}
                              </Typography>
                              <Chip
                                size="small"
                                label="Outsourced"
                                color="primary"
                                variant="outlined"
                                sx={{
                                  fontSize: "0.625rem",
                                  fontWeight: 700,
                                  height: 20,
                                }}
                              />
                            </Stack>
                            {oi.quantity && (
                              <Chip
                                icon={<span>📦</span>}
                                label={`Qty: ${oi.quantity} ${oi.unit || ""}`}
                                size="small"
                                sx={{
                                  mt: 1,
                                  bgcolor: (t) =>
                                    t.palette.primary.light + "1f",
                                  color: "primary.dark",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                            <Box sx={{ mt: 1 }}>
                              {oi.vendor ? (
                                <Stack
                                  direction="row"
                                  spacing={1}

                                  sx={{ alignItems: "center",
                                    bgcolor: "action.hover",
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1.5,
                                  }}
                                >
                                  <span>🏢</span>
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    Supplier:
                                  </Typography>
                                  <Typography variant="caption" noWrap>
                                    {oi.vendor.name}
                                  </Typography>
                                </Stack>
                              ) : (
                                <Stack
                                  direction="row"
                                  spacing={1}

                                  sx={{ alignItems: "center",
                                    bgcolor: (t) =>
                                      t.palette.primary.light + "1f",
                                    color: "primary.main",
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1.5,
                                  }}
                                >
                                  <FiAlertTriangle size={14} />
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    No Vendor Assigned
                                  </Typography>
                                </Stack>
                              )}
                            </Box>
                            {!sessionFilter && (
                              <Typography
                                variant="caption"
                                color="text.disabled"

                                sx={{ fontWeight: 700,
                                  display: "block",
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                  mt: 1,
                                }}
                              >
                                ⏰ {oi.sessionTime}
                              </Typography>
                            )}
                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<FiShare2 size={14} />}
                              sx={{ mt: 1.5, opacity: 0.8, cursor: "default" }}
                              title="Sharing Disabled"
                            >
                              Share with Vendor
                            </Button>

                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            )}

            {/* Per-session "missing ingredients" banners */}
            {visibleSessionsForBanner.map((session) => {
              const missing = missingBySession[session.id] || [];
              const orderLocalByDish =
                orderLocalByDishBySession[session.id] || {};
              const dishesInBanner = [
                ...missing.map((m) => m.item),
                ...Object.keys(orderLocalByDish).filter(
                  (d) => !missing.some((m) => m.item === d)
                ),
              ];
              if (dishesInBanner.length === 0) return null;

              return (
                <Paper
                  key={`missing-${session.id}`}
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: "warning.light",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: (t) => t.palette.warning.light + "1a",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}

                    sx={{ alignItems: "flex-start",
                      px: { xs: 2, sm: 3 },
                      py: 2,
                      borderBottom: 1,
                      borderColor: "warning.light",
                      bgcolor: (t) => t.palette.warning.light + "33",
                    }}
                  >
                    <FiAlertTriangle color="#b45309" size={20} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle1" color="warning.dark" sx={{ fontWeight: 700 }}>
                        Some dishes need ingredients for this order
                      </Typography>
                      <Typography variant="caption" color="warning.dark" sx={{ opacity: 0.8 }}>
                        {session.event_time
                          ? `Session: ${session.event_time}${
                              session.event_date
                                ? ` • ${formatDate(session.event_date)}`
                                : ""
                            }`
                          : session.event_date
                            ? formatDate(session.event_date)
                            : "Session"}
                        {" — "}
                        {missing.length > 0
                          ? `${missing.length} dish${
                              missing.length !== 1 ? "es" : ""
                            } missing a recipe`
                          : "ingredients added below"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
                    {dishesInBanner.map((dish) => {
                      const existing = orderLocalByDish[dish] || [];
                      return (
                        <Paper
                          key={dish}
                          elevation={0}
                          sx={{
                            border: 1,
                            borderColor: "warning.light",
                            borderRadius: 2,
                            p: { xs: 1.5, sm: 2 },
                          }}
                        >
                          <Stack
                            direction="row"


                            spacing={1.5} useFlexGap
                           sx={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {dish}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                No recipe defined globally
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                              {existing.length > 0 ? (
                                <>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<FiEdit2 size={13} />}
                                    onClick={() =>
                                      setOrderLocalModal({
                                        sessionId: session.id,
                                        sessionLabel: session.event_time || null,
                                        dishName: dish,
                                        mode: "edit",
                                        initialRows: existing.map((e) => ({
                                          ingredient: e.ingredient,
                                          quantity: e.quantity,
                                          unit: e.unit,
                                          category: e.category,
                                        })),
                                      })
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="text"
                                    color="error"
                                    size="small"
                                    startIcon={<FiTrash2 size={13} />}
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Remove all ingredients added for "${dish}" in this order?`
                                        )
                                      ) {
                                        handleRemoveAllForDish(session.id, dish);
                                      }
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<FiPlus size={14} />}
                                  onClick={() =>
                                    setOrderLocalModal({
                                      sessionId: session.id,
                                      sessionLabel: session.event_time || null,
                                      dishName: dish,
                                      mode: "add",
                                      initialRows: [],
                                    })
                                  }
                                >
                                  Add Ingredients
                                </Button>
                              )}
                            </Stack>
                          </Stack>
                          {existing.length > 0 && (
                            <Stack
                              direction="row"
                              spacing={1} useFlexGap
                              sx={{ flexWrap: "wrap", mt: 1.5 }}
                            >
                              {existing.map((e) => (
                                <Chip
                                  key={e.key}
                                  size="small"
                                  label={
                                    <Box component="span">
                                      <Box component="span" sx={{ fontWeight: 700 }}>
                                        {e.ingredient}
                                      </Box>
                                      <Box
                                        component="span"
                                        sx={{ opacity: 0.7, ml: 0.5 }}
                                      >
                                        {e.quantity} {e.unit}
                                      </Box>
                                    </Box>
                                  }
                                  sx={{
                                    bgcolor: (t) =>
                                      t.palette.primary.light + "1f",
                                    color: "primary.dark",
                                    border: 1,
                                    borderColor: "primary.light",
                                  }}
                                />
                              ))}
                            </Stack>
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                </Paper>
              );
            })}

            {/* Category blocks */}
            {eventIngredientsList.map((category, index) => {
              const hasVisibleItems = category.data.some((item) => {
                if (sessionIdFilter)
                  return item.use_item?.some(
                    (u) => String(u.session_id) === String(sessionIdFilter)
                  );
                if (!sessionFilter) return true;
                return item.use_item?.some((u) => {
                  const m = (u.item_name || "").match(/\(Session:\s*([^)]+)\)/);
                  return m ? m[1].trim() === sessionFilter : true;
                });
              });
              if (!hasVisibleItems) return null;

              const visibleItems = category.data.filter((item) => {
                if (sessionIdFilter)
                  return item.use_item?.some(
                    (u) => String(u.session_id) === String(sessionIdFilter)
                  );
                if (!sessionFilter) return true;
                return item.use_item?.some((u) => {
                  const m = (u.item_name || "").match(/\(Session:\s*([^)]+)\)/);
                  return m ? m[1].trim() === sessionFilter : true;
                });
              });

              const allItemsAssigned =
                visibleItems.length > 0 &&
                visibleItems.every((item) => {
                  const filteredUseItems =
                    item.use_item?.filter((u) => {
                      if (sessionIdFilter)
                        return String(u.session_id) === String(sessionIdFilter);
                      if (!sessionFilter) return true;
                      const m = (u.item_name || "").match(
                        /\(Session:\s*([^)]+)\)/
                      );
                      return m ? m[1].trim() === sessionFilter : true;
                    }) || [];

                  const itemTotal = filteredUseItems.reduce((sum, u) => {
                    const { value } = parseQuantity(u.quantity || "");
                    return sum + value;
                  }, 0);

                  const godownQty = parseFloat(item.godown_quantity || 0);
                  if (godownQty >= itemTotal && itemTotal > 0) return true;

                  let hasVendor = false;
                  if (viewIngredient?.sessions) {
                    viewIngredient.sessions.forEach((session) => {
                      if (
                        sessionIdFilter &&
                        String(session.id) !== String(sessionIdFilter)
                      )
                        return;
                      if (
                        !sessionIdFilter &&
                        sessionFilter &&
                        session.event_time !== sessionFilter
                      )
                        return;
                      const req = session.ingredients_required || {};
                      if (
                        req[item.item] &&
                        req[item.item].vendor &&
                        req[item.item].vendor.id !== "godown"
                      ) {
                        hasVendor = true;
                      }
                    });
                  }
                  return hasVendor;
                });

              const anyItemAssigned = visibleItems.some((item) => {
                let hasVendor = false;
                if (viewIngredient?.sessions) {
                  viewIngredient.sessions.forEach((session) => {
                    if (
                      sessionIdFilter &&
                      String(session.id) !== String(sessionIdFilter)
                    )
                      return;
                    if (
                      !sessionIdFilter &&
                      sessionFilter &&
                      session.event_time !== sessionFilter
                    )
                      return;
                    const req = session.ingredients_required || {};
                    if (req[item.item] && req[item.item].vendor) {
                      hasVendor = true;
                    }
                  });
                }
                return hasVendor;
              });

              return (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  {/* Category bar */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}


                    spacing={1.5}
                    sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" },
                      px: 3,
                      py: 1.5,
                      bgcolor: (t) => t.palette.primary.light + "1f",
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {category.name}
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<FiUserCheck size={14} />}
                        disabled={allItemsAssigned}
                        onClick={() =>
                          !allItemsAssigned &&
                          handleShareIngredients(
                            category.name,
                            sessionFilter || undefined,
                            "assign"
                          )
                        }
                        title={
                          allItemsAssigned
                            ? "All items already assigned"
                            : "Assign vendors to items"
                        }
                      >
                        {allItemsAssigned ? "Vendor Assigned" : "Assign Vendor"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<FiShare2 size={14} />}
                        disabled={!anyItemAssigned}
                        sx={{ opacity: 0.8, cursor: "default" }}
                        title="Sharing Disabled"
                      >
                        Share {category.name}
                      </Button>

                    </Stack>
                  </Stack>

                  {/* Items Grid */}
                  <Box sx={{ p: 1.5, bgcolor: "action.hover" }}>
                    <Grid container spacing={1.5}>
                      {category.data.map((item, i) => {
                        const firstUseQtyStr = item.use_item?.[0]?.quantity || "";
                        const { unit: requiredUnit } =
                          parseQuantity(firstUseQtyStr);

                        const visibleRows =
                          item.use_item?.filter((u) => {
                            if (sessionIdFilter)
                              return (
                                String(u.session_id) === String(sessionIdFilter)
                              );
                            if (!sessionFilter) return true;
                            const m = (u.item_name || "").match(
                              /\(Session:\s*([^)]+)\)/
                            );
                            return m ? m[1].trim() === sessionFilter : true;
                          }) || [];
                        const usedInItems = getUniqueUsedItems(visibleRows);

                        if (visibleRows.length === 0) return null;

                        const totalRequiredValue = visibleRows.reduce(
                          (sum, u) => {
                            const { value } = parseQuantity(u.quantity || "");
                            return sum + value;
                          },
                          0
                        );

                        const godownRaw = parseFloat(item.godown_quantity || 0);
                        const godownUnit = item.godown_quantity_type || "";
                        const convertedGodown =
                          requiredUnit && godownUnit
                            ? convertToUnit(
                                godownRaw,
                                godownUnit,
                                requiredUnit
                              ) ?? godownRaw
                            : godownRaw;

                        const itemVendorsMap = new Map();
                        if (viewIngredient?.sessions) {
                          viewIngredient.sessions.forEach((session) => {
                            if (
                              sessionIdFilter &&
                              String(session.id) !== String(sessionIdFilter)
                            )
                              return;
                            if (
                              !sessionIdFilter &&
                              sessionFilter &&
                              session.event_time !== sessionFilter
                            )
                              return;
                            const req = session.ingredients_required || {};
                            if (req[item.item] && req[item.item].vendor) {
                              const v = req[item.item].vendor;
                              itemVendorsMap.set(v.id || v.name, v);
                            }
                          });
                        }
                        const itemVendors = Array.from(itemVendorsMap.values());
                        const hasNonGodownVendor = itemVendors.some(
                          (v) => v.id !== "godown"
                        );

                        const remaining = totalRequiredValue - convertedGodown;
                        const totalQuantity = hasNonGodownVendor
                          ? 0
                          : Math.max(0, remaining);
                        const isFromGodown = godownRaw > 0;
                        const isOrderLocal = orderLocalKeys.has(item.item);

                        return (
                          <Grid
                            key={i}
                            size={{ xs: 12, sm: 6, lg: 4 }}
                          >
                            <Card
                              variant="outlined"
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                transition: "box-shadow 0.2s",
                                "&:hover": { boxShadow: 2 },
                              }}
                            >
                              <CardContent
                                sx={{
                                  flex: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                  p: 2,
                                  "&:last-child": { pb: 2 },
                                }}
                              >
                                {/* Item header */}
                                <Stack
                                  direction="row"
                                  spacing={1}


                                  sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}


                                   sx={{ alignItems: "center", minWidth: 0 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: "error.main",
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Typography
                                      variant="body2" noWrap
                                     sx={{ fontWeight: 700 }}>
                                      {item.item}
                                    </Typography>
                                  </Stack>
                                  {isOrderLocal && (
                                    <Chip
                                      size="small"
                                      label="Added for this order"
                                      color="warning"
                                      variant="outlined"
                                      sx={{
                                        fontSize: "0.625rem",
                                        fontWeight: 700,
                                        height: 20,
                                      }}
                                    />
                                  )}
                                </Stack>

                                {/* Session quantity rows */}
                                <Stack spacing={0.75} sx={{ mb: 1.5 }}>
                                  {visibleRows.map((usedItem, j) => {
                                    const rawName =
                                      usedItem?.item_name || "N/A";
                                    const itemCat =
                                      usedItem?.item_category || "";
                                    const sessionMatch = rawName.match(
                                      /\(Session:\s*([^)]+)\)/
                                    );
                                    const sessionLabel = sessionMatch
                                      ? sessionMatch[1].trim()
                                      : rawName;
                                    const qty = usedItem?.quantity || "0";
                                    const rowKey = `${item.item}||${usedItem.session_id}`;

                                    return (
                                      <Stack
                                        key={j}
                                        direction="row"


                                        sx={{ alignItems: "center", justifyContent: "space-between",
                                          bgcolor: (t) =>
                                            t.palette.primary.light + "1a",
                                          border: 1,
                                          borderColor: "primary.light",
                                          borderRadius: 1.5,
                                          px: 1.5,
                                          py: 0.75,
                                        }}
                                      >
                                        <Stack
                                          direction="row"
                                          spacing={0.75} useFlexGap
                                         sx={{ alignItems: "center", flexWrap: "wrap" }}>
                                          <Chip
                                            size="small"
                                            label={sessionLabel}
                                            sx={{
                                              bgcolor: (t) =>
                                                t.palette.primary.light + "33",
                                              color: "primary.dark",
                                              fontSize: "0.65rem",
                                              fontWeight: 700,
                                              height: 22,
                                            }}
                                          />
                                          {itemCat && (
                                            <Chip
                                              size="small"
                                              label={itemCat}
                                              variant="outlined"
                                              sx={{
                                                fontSize: "0.65rem",
                                                height: 22,
                                              }}
                                            />
                                          )}
                                        </Stack>
                                        {editingKey === rowKey ? (
                                          <Stack
                                            direction="row"
                                            spacing={0.5}

                                           sx={{ alignItems: "center" }}>
                                            <TextField
                                              value={editValue}
                                              onChange={(e) =>
                                                setEditValue(e.target.value)
                                              } autoFocus
                                              disabled={savingEdit}
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                  handleSaveEdit(
                                                    usedItem.session_id,
                                                    item.item
                                                  );
                                                if (e.key === "Escape")
                                                  setEditingKey(null);
                                              }}
                                              sx={{
                                                width: 100,
                                                "& .MuiInputBase-input": {
                                                  py: 0.5,
                                                  fontSize: "0.8rem",
                                                  fontWeight: 700,
                                                },
                                              }}
                                            />
                                            <IconButton
                                              size="small"
                                              color="primary"
                                              disabled={savingEdit}
                                              onClick={() =>
                                                handleSaveEdit(
                                                  usedItem.session_id,
                                                  item.item
                                                )
                                              }
                                              title="Save"
                                            >
                                              <FiCheck size={14} />
                                            </IconButton>
                                            <IconButton
                                              size="small"
                                              color="error"
                                              disabled={savingEdit}
                                              onClick={() => setEditingKey(null)}
                                              title="Cancel"
                                            >
                                              <FiX size={14} />
                                            </IconButton>
                                          </Stack>
                                        ) : (
                                          <Stack
                                            direction="row"
                                            spacing={0.5}

                                           sx={{ alignItems: "center" }}>
                                            <Typography
                                              variant="body2"

                                             sx={{ fontWeight: 700 }}>
                                              {qty}
                                            </Typography>
                                            <IconButton
                                              size="small"
                                              onClick={() => {
                                                setEditingKey(rowKey);
                                                setEditValue(qty);
                                              }}
                                              title="Edit quantity"
                                              sx={{ p: 0.25 }}
                                            >
                                              <FiEdit2 size={12} />
                                            </IconButton>
                                          </Stack>
                                        )}
                                      </Stack>
                                    );
                                  })}
                                </Stack>

                                {usedInItems.length > 0 && (
                                  <Box
                                    sx={{
                                      mb: 1.5,
                                      px: 1.5,
                                      py: 1,
                                      borderRadius: 1.5,
                                      border: 1,
                                      borderColor: "primary.light",
                                      bgcolor: (t) =>
                                        t.palette.primary.light + "14",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="primary.main"

                                      sx={{ fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                      }}
                                    >
                                      Used In Items
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                      {usedInItems.join(", ")}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Vendor Assignment Display */}
                                {itemVendors.length > 0 && (
                                  <Box
                                    sx={{
                                      mb: 1.5,
                                      px: 1.5,
                                      py: 1,
                                      borderRadius: 1.5,
                                      border: 1,
                                      ...(itemVendors.some(
                                        (v) => v.id === "godown"
                                      )
                                        ? {
                                            bgcolor: "#f0fdf4",
                                            borderColor: "#86efac",
                                            color: "#15803d",
                                          }
                                        : {
                                            bgcolor: (t) =>
                                              t.palette.primary.light + "14",
                                            borderColor: "primary.light",
                                            color: "primary.main",
                                          }),
                                    }}
                                  >
                                    {itemVendors.some(
                                      (v) => v.id === "godown"
                                    ) ? (
                                      <Typography
                                        variant="caption"

                                       sx={{ fontWeight: 700 }}>
                                        🏭 Ordered from Godown
                                      </Typography>
                                    ) : (
                                      <Stack spacing={0.5}>
                                        {itemVendors.map((v) => (
                                          <Stack
                                            key={v.id || v.name}
                                            direction="row"


                                           sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography
                                              variant="caption"

                                             sx={{ fontWeight: 700 }}>
                                              ★ Assigned to: {v.name}
                                            </Typography>
                                            {v.source_type === "item" ? (
                                              <Chip
                                                size="small"
                                                label="Auto (Item)"
                                                sx={{
                                                  fontSize: "0.625rem",
                                                  height: 18,
                                                }}
                                              />
                                            ) : v.source_type === "manual" ? (
                                              <Chip
                                                size="small"
                                                label="Manual"
                                                variant="outlined"
                                                sx={{
                                                  fontSize: "0.625rem",
                                                  height: 18,
                                                }}
                                              />
                                            ) : null}
                                          </Stack>
                                        ))}
                                      </Stack>
                                    )}
                                  </Box>
                                )}

                                {/* Calculation strip */}
                                <Box
                                  sx={{
                                    mt: "auto",
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1.5,
                                    border: 1,
                                    borderColor: "divider",
                                    bgcolor: "background.paper",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={0.75} useFlexGap
                                    sx={{ flexWrap: "wrap", mb: 0.75 }}
                                  >
                                    {isFromGodown ? (
                                      <Chip
                                        size="small"
                                        label={`Godown: ${godownRaw} ${godownUnit}${
                                          convertedGodown < totalRequiredValue
                                            ? " (partial)"
                                            : ""
                                        }`}
                                        icon={
                                          <span>
                                            {convertedGodown >=
                                            totalRequiredValue
                                              ? "✅"
                                              : "🏭"}
                                          </span>
                                        }
                                        color={
                                          convertedGodown >= totalRequiredValue
                                            ? "success"
                                            : "primary"
                                        }
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                      />
                                    ) : (
                                      <Chip
                                        size="small"
                                        label="Godown: 0"
                                        icon={<span>📦</span>}
                                        sx={{ fontWeight: 600 }}
                                      />
                                    )}
                                    {hasNonGodownVendor ? (
                                      <Chip
                                        size="small"
                                        label={`Vendor: ${Math.max(
                                          0,
                                          remaining
                                        )} ${
                                          requiredUnit || item.quantity_type || ""
                                        }`}
                                        icon={<span>🛒</span>}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                      />
                                    ) : (
                                      totalQuantity > 0 && (
                                        <Chip
                                          size="small"
                                          label="Vendor: Not assigned"
                                          icon={<FiAlertTriangle size={12} />}
                                          color="warning"
                                          variant="outlined"
                                          sx={{ fontWeight: 600 }}
                                        />
                                      )
                                    )}
                                  </Stack>
                                  <Divider sx={{ my: 0.75 }} />
                                  <Stack
                                    direction="row" useFlexGap

                                   sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                                    <Stack
                                      direction="row"
                                      spacing={0.5}

                                     sx={{ alignItems: "baseline" }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"

                                       sx={{ fontWeight: 600 }}>
                                        Total:
                                      </Typography>
                                      <Typography
                                        variant="body2"

                                       sx={{ fontWeight: 700 }}>
                                        {totalRequiredValue}{" "}
                                        <Box
                                          component="span"
                                          sx={{
                                            fontSize: "0.7rem",
                                            color: "text.disabled",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {requiredUnit ||
                                            item.quantity_type ||
                                            ""}
                                        </Box>
                                      </Typography>
                                    </Stack>
                                    <Stack
                                      direction="row"
                                      spacing={0.5}

                                     sx={{ alignItems: "baseline" }}>
                                      <Typography
                                        variant="caption"
                                        color="primary.main"

                                       sx={{ fontWeight: 600 }}>
                                        {totalQuantity === 0 ? "✅" : "⚠️"} Remaining:
                                      </Typography>
                                      <Typography
                                        variant="body1"

                                        color="primary.main"
                                       sx={{ fontWeight: 700 }}>
                                        {totalQuantity}{" "}
                                        <Box
                                          component="span"
                                          sx={{
                                            fontSize: "0.7rem",
                                            color: "text.disabled",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {formValues[
                                            `${category.name}-${i}-quantityType`
                                          ] ||
                                            item.quantity_type ||
                                            ""}
                                        </Box>
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        </Box>
      )}

      <AddOrderIngredientsModal
        isOpen={!!orderLocalModal}
        onClose={closeOrderLocalModal}
        dishName={orderLocalModal?.dishName || ""}
        sessionLabel={orderLocalModal?.sessionLabel}
        initialRows={orderLocalModal?.initialRows || []}
        mode={orderLocalModal?.mode || "add"}
        onSave={handleOrderLocalSave}
      />
    </Box>
  );
}

export default ViewIngredientComponent;
