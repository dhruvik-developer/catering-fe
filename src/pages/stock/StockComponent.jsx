/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Loader from "../../Components/common/Loader";
import EmptyState from "../../Components/common/EmptyState";
import Dropdown from "../../Components/common/formDropDown/DropDown";
import {
  FiPackage,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiAlertTriangle,
  FiDollarSign,
  FiBox,
  FiTrendingUp,
} from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";

const unitLabels = {
  KG: "Kilogram",
  G: "Gram",
  L: "Litre",
  ML: "Millilitre",
  QTY: "Quantity",
};
const unitShort = {
  KG: "Kg",
  G: "g",
  L: "L",
  ML: "mL",
  QTY: "Qty",
};

function StatHero({ gradient, icon, label, value, shadowColor }) {
  return (
    <Card
      sx={{
        background: gradient,
        color: "#fff",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.22)",
        position: "relative",
        overflow: "hidden",
        minHeight: 118,
        boxShadow: shadowColor
          ? `0 18px 36px -24px ${shadowColor}`
          : "0 18px 36px -26px rgba(15, 23, 42, 0.55)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 85% 12%, rgba(255,255,255,0.22), transparent 28%)",
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: shadowColor
            ? `0 22px 44px -26px ${shadowColor}`
            : "0 22px 44px -28px rgba(15, 23, 42, 0.62)",
        },
      }}
    >
      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="row"


         sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StockComponent({
  selectedCategory,
  setSelectedCategory,
  categories,
  items,
  loading,
  handleAddCategory,
  handleAddItem,
  onCategoryDelete,
  onItemDelete,
  handleIncreaseItem,
  handleDecreaseItem,
}) {
  const { hasPermission } = usePermissions();
  const canCreateStock = hasPermission("stock.create");
  const canUpdateStock = hasPermission("stock.update");
  const canDeleteStock = hasPermission("stock.delete");
  const totalItems = items?.length || 0;
  const lowStockItems =
    items?.filter((i) => parseInt(i.quantity) <= parseInt(i.alert)).length || 0;
  const totalValue =
    items?.reduce((sum, i) => sum + Number(i.total_price || 0), 0) || 0;

  const canDeleteCategory =
    canDeleteStock &&
    selectedCategory &&
    selectedCategory !== "low_stock" &&
    selectedCategory !== "all_items";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3.5,
        bgcolor: "var(--app-surface)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.76))",
        border: "1px solid var(--app-border)",
        boxShadow: "var(--app-shadow)",
        backdropFilter: "blur(18px)",
      }}
    >
      {/* Title */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
        <Avatar
          variant="rounded"
          sx={{
            background:
              "linear-gradient(135deg, var(--color-primary-soft), rgba(255,255,255,0.75))",
            color: "primary.main",
            border: "1px solid var(--color-primary-border)",
            width: 44,
            height: 44,
          }}
        >
          <FiPackage size={20} />
        </Avatar>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            Stocks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your inventory &amp; stock levels
          </Typography>
        </Box>
      </Stack>

      {loading ? (
        <Loader message="Loading Stocks Details..." />
      ) : (
        <>
          {/* Controls Bar */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: 3,
              bgcolor: "var(--app-surface-strong)",
              borderColor: "var(--app-border)",
              boxShadow: "0 14px 30px -30px rgba(15, 23, 42, 0.5)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}


             sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}>
              {categories.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}



                 sx={{ alignItems: "center", flex: 1, minWidth: 0 }}>
                  <Dropdown
                    options={categories} selectedValue={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    placeholder="Select Category"
                  />
                  {canDeleteCategory && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onCategoryDelete(selectedCategory)}
                      title="Delete Stock Category"
                    >
                      <FiTrash2 size={18} />
                    </IconButton>
                  )}
                </Stack>
              )}
              {canCreateStock && (
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiPlus size={15} />}
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </Button>
                  {selectedCategory !== "low_stock" &&
                    selectedCategory !== "all_items" && (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FiPlus size={15} />}
                        onClick={handleAddItem}
                      >
                        Add Item
                      </Button>
                    )}
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* Stats Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatHero
                gradient={(t) =>
                  `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`
                }
                icon={<FiBox size={22} />}
                label="Total Items"
                value={totalItems}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatHero
                gradient={
                  lowStockItems > 0
                    ? "linear-gradient(135deg, #dc2626, #991b1b)"
                    : "linear-gradient(135deg, #10b981, #047857)"
                }
                icon={
                  lowStockItems > 0 ? (
                    <FiAlertTriangle size={22} />
                  ) : (
                    <FiTrendingUp size={22} />
                  )
                }
                label={
                  lowStockItems > 0 ? "Low Stock Items" : "Inventory Status"
                }
                value={lowStockItems > 0 ? lowStockItems : "All Healthy"}
                shadowColor={lowStockItems > 0 ? "#ef4444" : "#10b981"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatHero
                gradient="linear-gradient(135deg, #475569, #1e293b)"
                icon={<FiDollarSign size={22} />}
                label="Total Inventory Value"
                value={`₹${totalValue.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`}
              />
            </Grid>
          </Grid>

          {/* Items Grid */}
          {items.length === 0 ? (
            <EmptyState
              icon={<FiPackage size={24} />}
              title="No Stock Items Found"
              message="Your inventory is currently empty. Add items to start tracking your stock levels."
            />
          ) : (
            <Grid container spacing={2}>
              {items.map((item) => {
                const alertStock = parseInt(item.alert);
                const quantity = parseInt(item.quantity);
                const isLowStock = quantity <= alertStock;
                const stockPercent =
                  alertStock > 0
                    ? Math.min((quantity / (alertStock * 4)) * 100, 100)
                    : 100;

                return (
                  <Grid
                    key={item.id}
                    size={{ xs: 12, md: 6, xl: 4 }}
                  >
                    <Card
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        height: "100%",
                        bgcolor: "var(--app-surface-strong)",
                        border: "1px solid",
                        borderColor: isLowStock
                          ? "error.light"
                          : "var(--app-border)",
                        boxShadow: "0 16px 34px -30px rgba(15, 23, 42, 0.55)",
                        backdropFilter: "blur(14px)",
                        transition:
                          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          borderColor: isLowStock
                            ? "error.main"
                            : "primary.light",
                          boxShadow:
                            "0 22px 44px -30px rgba(15, 23, 42, 0.65)",
                        },
                      }}
                    >
                      {isLowStock && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 6,
                            bgcolor: "error.main",
                          }}
                        />
                      )}
                      <CardContent>
                        <Stack
                          direction="row"


                          spacing={1}
                          sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}



                           sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 44,
                                height: 44,
                                bgcolor: isLowStock
                                  ? "error.main"
                                  : "var(--color-primary-border)",
                                color: isLowStock ? "#fff" : "primary.main",
                              }}
                            >
                              <FiBox size={22} />
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Stack
                                direction="row"
                                spacing={1}

                               sx={{ alignItems: "center" }}>
                                <Typography
                                  variant="subtitle1" noWrap
                                 sx={{ fontWeight: 700 }}>
                                  {item.name}
                                </Typography>
                                {isLowStock && (
                                  <Chip
                                    size="small"
                                    label="Low Stock"
                                    color="error"
                                    sx={{
                                      height: 18,
                                      fontSize: "0.6rem",
                                      fontWeight: 800,
                                    }}
                                  />
                                )}
                              </Stack>
                              {item.categoryName && (
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                  sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    fontWeight: 700,
                                  }}
                                >
                                  {item.categoryName}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                          {canDeleteStock && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onItemDelete(item.id)}
                              title="Delete Item"
                            >
                              <FiTrash2 size={16} />
                            </IconButton>
                          )}
                        </Stack>

                        {/* Quantity Display */}
                        <Stack
                          direction="row"


                          sx={{ justifyContent: "space-between", alignItems: "flex-end", mb: 2 }}
                        >
                          <Box>
                            <Typography
                              variant="h4"

                              color={isLowStock ? "error.main" : "primary.main"}
                             sx={{ fontWeight: 800 }}>
                              {item.quantity}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{
                                textTransform: "uppercase",
                                fontWeight: 700,
                              }}
                            >
                              Current {unitLabels[item.type] || item.type}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {item.alert}{" "}
                              {unitShort[item.type] || item.type}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{
                                textTransform: "uppercase",
                                fontWeight: 700,
                              }}
                            >
                              Minimum Level
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Stock Level Bar */}
                        <LinearProgress
                          variant="determinate"
                          value={stockPercent}
                          color={isLowStock ? "error" : "primary"}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "action.hover",
                            mb: 2.5,
                          }}
                        />

                        {/* Financial Info */}
                        <Grid container spacing={1.5} sx={{ mb: 2 }}>
                          <Grid size={6}>
                            <Box
                              sx={{
                                px: 1.5,
                                py: 1,
                                borderRadius: 2,
                                bgcolor: "rgba(248,250,252,0.86)",
                                border: 1,
                                borderColor: "var(--app-border)",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{
                                  textTransform: "uppercase",
                                  fontWeight: 700,
                                  fontSize: "0.6rem",
                                  letterSpacing: 1,
                                }}
                              >
                                Net Price
                              </Typography>
                              <Typography
                                variant="body2"

                                color="text.primary"
                               sx={{ fontWeight: 800 }}>
                                ₹{Number(item.nte_price || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={6}>
                            <Box
                              sx={{
                                px: 1.5,
                                py: 1,
                                borderRadius: 2,
                                background:
                                  "linear-gradient(135deg, var(--color-primary-tint), rgba(255,255,255,0.82))",
                                border: 1,
                                borderColor: "var(--color-primary-border)",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="primary.main"
                                sx={{
                                  textTransform: "uppercase",
                                  fontWeight: 700,
                                  fontSize: "0.6rem",
                                  letterSpacing: 1,
                                  opacity: 0.8,
                                }}
                              >
                                Stock Value
                              </Typography>
                              <Typography
                                variant="body2"

                                color="primary.main"
                               sx={{ fontWeight: 800 }}>
                                ₹{Number(item.total_price || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Controls */}
                        {canUpdateStock && (
                          <Stack direction="row" spacing={1}>
                            <Button
                              fullWidth
                              color="primary"
                              variant="contained"
                              startIcon={<FiPlus size={14} />}
                              onClick={() => handleIncreaseItem(item)}
                              sx={{ fontWeight: 700, textTransform: "uppercase" }}
                            >
                              Stock In
                            </Button>
                            <Button
                              fullWidth
                              color="error"
                              variant="outlined"
                              startIcon={<FiMinus size={14} />}
                              onClick={() => handleDecreaseItem(item)}
                              sx={{ fontWeight: 700, textTransform: "uppercase" }}
                            >
                              Stock Out
                            </Button>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </Paper>
  );
}

export default StockComponent;
