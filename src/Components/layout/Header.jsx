/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useMemo } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Link as MuiLink,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { TbLogout2 } from "react-icons/tb";
import {
  FiMenu,
  FiChevronDown,
  FiUsers,
  FiAlertTriangle,
  FiCalendar,
  FiClipboard,
  FiHome,
  FiChevronRight,
  FiSettings,
  FiBox,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import { getStockCategory } from "../../api/FetchStockCategory";
import { getAllOrder } from "../../api/FetchAllOrder";
import usePermissions from "../../hooks/usePermissions";
import { getDefaultRouteForAccess } from "../../utils/accessControl";

// Parse date string in dd-mm-yyyy OR yyyy-mm-dd format
function parseDate(str) {
  if (!str) return null;
  const ddmmyyyy = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (ddmmyyyy)
    return new Date(
      Number(ddmmyyyy[3]),
      Number(ddmmyyyy[2]) - 1,
      Number(ddmmyyyy[1])
    );
  const yyyymmdd = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (yyyymmdd)
    return new Date(
      Number(yyyymmdd[1]),
      Number(yyyymmdd[2]) - 1,
      Number(yyyymmdd[3])
    );
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// Route-to-label mapping for breadcrumbs
const routeLabels = {
  dish: "Create Dish",
  category: "Category",
  "order-management": "Order Management",
  quotation: "Quotation",
  "all-order": "All Orders",
  invoice: "Invoice",
  stock: "Stock",
  "payment-history": "Payment History",
  expense: "Expense",
  "recipe-ingredient": "Recipe Ingredient",
  "create-recipe-ingredient": "Create Ingredient",
  "create-ingredient": "Add Ingredient",
  "add-ingredient-item": "Add Item",
  "edit-ingredient": "Edit Ingredient",
  "item-recipe": "Item Recipe",
  "view-ingredient": "View Ingredient",
  "share-ingredient": "Share Ingredient",
  user: "Users",
  "add-user": "Add User",
  "edit-user": "Edit User",
  radha: "radha",
  item: "Items",
  "create-item": "Create Item",
  "edit-dish": "Edit Dish",
  "edit-item": "Edit Item",
  "order-pdf": "Order PDF",
  "edit-order-pdf": "Edit Order PDF",
  "share-order-pdf": "Share Order",
  "share-ingredient-pdf": "Share Ingredient PDF",
  "share-outsourced": "Share Outsourced Items",
  "share-outsourced-pdf": "Share Outsourced Items PDF",
  "share-full-ingredient-pdf": "Share Full Ingredient PDF",
  "quotation-pdf": "Quotation PDF",
  "invoice-order-pdf": "Invoice Order PDF",
  "invoice-bill-pdf": "Bill PDF",
  "complete-invoice-pdf": "Complete Invoice PDF",
  "add-category": "Add Category",
  "create-category": "Create Category",
  "add-rule": "Rules",
  calendar: "Calendar",
  people: "People",
  vendor: "Vendor",
  "add-vendor": "Add Vendor",
  "edit-vendor": "Edit Vendor",
  "view-order-details": "Order Details",
  "event-staff": "Event Staff",
  "waiter-types": "Waiter Types",
  permissions: "Permissions",
  "add-staff": "Add Staff",
  "edit-staff": "Edit Staff",
  "event-assignments": "Event Assignments",
  "add-assignment": "Add Assignment",
  "edit-assignment": "Edit Assignment",
  "event-summary": "Event Summary",
  "staff-detail": "Staff Detail",
  "fixed-staff-payments": "Fixed Staff Payments",

  "ground-checklist": "Ground Checklist",
  "ground-categories": "Ground Categories",
  "ground-items": "Ground Items",
  settings: "Settings",
  "session-checklist-preview": "Session Checklist",
  "dish-tags-pdf": "Dish Tags PDF",
};

// Parent route mapping for nested pages
const parentRoutes = {
  item: "/category",
  "create-item": "/category",
  "create-category": "/category",
  "item-recipe": "/category",
  "create-ingredient": "/category",
  "edit-ingredient": "/category",
  "add-ingredient-item": "/create-recipe-ingredient",
  "edit-dish": "/order-management/all-order",
  "edit-item": "/order-management/all-order",
  "order-pdf": "/order-management/all-order",
  "edit-order-pdf": "/order-management/all-order",
  "share-order-pdf": "/order-management/all-order",
  "share-ingredient": "/order-management/all-order",
  "share-ingredient-pdf": "/order-management/all-order",
  "share-outsourced": "/order-management/all-order",
  "share-outsourced-pdf": "/order-management/all-order",
  "share-full-ingredient-pdf": "/order-management/all-order",
  "view-ingredient": "/order-management/all-order",
  "view-order-details": "/order-management/all-order",
  "quotation-pdf": "/order-management/quotation",
  "invoice-order-pdf": "/order-management/invoice",
  "invoice-bill-pdf": "/order-management/invoice",
  "complete-invoice-pdf": "/order-management/invoice",
  "add-user": "/user",
  "edit-user": "/user",
  "add-rule": "/user",
  vendor: "/people",
  "add-vendor": "/people/vendor",
  "edit-vendor": "/people/vendor",
  "event-staff": "/people",
  "waiter-types": "/people",
  "add-staff": "/people/event-staff",
  "edit-staff": "/people/event-staff",
  "staff-detail": "/people/event-staff",
  "fixed-staff-payments": "/people/event-staff",
  "event-assignments": "/order-management/all-order",
  "add-assignment": "/event-assignments",
  "edit-assignment": "/event-assignments",
  pdf: "/dish",
  "dish-tags-pdf": "/dish",
  "session-checklist-preview": "/order-management/all-order",
  "ground-categories": "/ground-checklist",
  "ground-items": "/ground-checklist",
};

const Header = ({ toggleSidebar }) => {
  const { username, logout, permissions, enabledModules } =
    useContext(UserContext);
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = username || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const homeRoute =
    getDefaultRouteForAccess(permissions, enabledModules) || "/login";
  const canViewStock = hasPermission("stock.view");
  const canViewOrders = hasPermission("event_bookings.view");
  const canViewSettings = hasPermission("business_profiles.view");
  const canViewUsers = hasPermission("users.view");

  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [upcomingOrderCount, setUpcomingOrderCount] = useState(0);
  const [upcomingOrders, setUpcomingOrders] = useState([]);

  // Anchor elements for MUI menus
  const [lowStockAnchor, setLowStockAnchor] = useState(null);
  const [upcomingAnchor, setUpcomingAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  // Build breadcrumbs from the current path (logic preserved verbatim)
  const breadcrumbs = useMemo(() => {
    const path = (location.pathname || "")
      .replace(/^\//, "")
      .replace(/\/$/, "");
    if (!path) return [];
    const segments = path.split("/");
    let crumbs = [];

    const routesWithId = new Set([
      "view-ingredient",
      "view-order-details",
      "item-recipe",
      "edit-user",
      "edit-vendor",
      "edit-staff",
      "edit-assignment",
      "staff-detail",
      "edit-dish",
      "edit-ingredient",
      "order-pdf",
      "share-order-pdf",
      "quotation-pdf",
      "invoice-order-pdf",
      "invoice-bill-pdf",
      "complete-invoice-pdf",
      "fixed-staff-payments",
      "session-checklist-preview",
    ]);

    const numericId =
      segments.find((s) => /^\d+$/.test(s)) || location.state?.id;

    const fromState =
      location.state?.from || location.state?.fromNavigation?.from;
    const dynamicParentRoutes = {
      ...parentRoutes,
      ...location.state?.customParents,
    };

    if (fromState && !location.state?.customParents) {
      const leaf = [...segments].reverse().find((s) => !/^\d+$/.test(s));
      if (leaf) {
        dynamicParentRoutes[leaf] = `/${fromState}`;
      }
    }

    const leafSegment = [...segments].reverse().find((s) => !/^\d+$/.test(s));

    if (leafSegment) {
      let currentKey = leafSegment;
      let parentChain = [];
      let visitedKeys = new Set([currentKey]);

      while (dynamicParentRoutes[currentKey]) {
        const rawParentPath = dynamicParentRoutes[currentKey];
        const parentPath = rawParentPath.startsWith("/")
          ? rawParentPath
          : `/${rawParentPath}`;

        const parentSegments = parentPath
          .replace(/^\//, "")
          .split("/")
          .filter(Boolean);
        const parentKey = [...parentSegments]
          .reverse()
          .find((s) => !/^\d+$/.test(s));

        if (parentKey && !visitedKeys.has(parentKey)) {
          visitedKeys.add(parentKey);
          const label =
            routeLabels[parentKey] ||
            parentKey.charAt(0).toUpperCase() +
              parentKey.slice(1).replace(/-/g, " ");

          let finalParentPath = parentPath;
          if (
            routesWithId.has(parentKey) &&
            numericId &&
            !parentPath.includes(numericId)
          ) {
            finalParentPath = `${parentPath}/${numericId}`;
          }

          parentChain.unshift({ label, path: finalParentPath, isLast: false });
          currentKey = parentKey;
        } else {
          break;
        }
      }
      crumbs = parentChain;
    }

    let currentFullPath = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentFullPath += `/${segment}`;

      if (/^\d+$/.test(segment)) {
        if (crumbs.length > 0) {
          crumbs[crumbs.length - 1].path = currentFullPath;
        }
        continue;
      }

      const label =
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      const isLast =
        i === segments.length - 1 ||
        (i < segments.length - 1 &&
          segments.slice(i + 1).every((s) => /^\d+$/.test(s)));

      const existingIndex = crumbs.findIndex(
        (c) =>
          c.path === currentFullPath ||
          c.path === `${currentFullPath}/${numericId}`
      );
      if (existingIndex === -1) {
        crumbs.push({ label, path: currentFullPath, isLast });
      } else {
        crumbs[existingIndex].isLast = isLast;
        if (!isLast && numericId) {
          crumbs[existingIndex].path = `${currentFullPath}/${numericId}`;
        }
      }
    }

    return crumbs;
  }, [location.pathname, location.state]);

  // Fetch low stock + upcoming orders; refresh on explicit events (logic preserved)
  useEffect(() => {
    const fetchHeaderData = async () => {
      const [stockResult, orderResult] = await Promise.allSettled([
        canViewStock ? getStockCategory() : Promise.resolve(null),
        canViewOrders ? getAllOrder() : Promise.resolve(null),
      ]);

      if (canViewStock && stockResult.status === "fulfilled") {
        const stockData = stockResult.value?.data?.data;
        if (stockData && Array.isArray(stockData)) {
          let lowCount = 0;
          const lowItems = [];
          stockData.forEach((cat) => {
            const items = cat.stokeitem || cat.stoke_item || cat.items || [];
            if (Array.isArray(items)) {
              items.forEach((item) => {
                const qty = Number(item.quantity) || 0;
                const alertQty = Number(item.alert) || 0;
                if (alertQty > 0 && qty <= alertQty) {
                  lowCount++;
                  lowItems.push({
                    id: item.id,
                    name: item.name,
                    quantity: qty,
                    alert: alertQty,
                    type: item.type,
                    categoryName: cat.name,
                    categoryId: cat.id,
                  });
                }
              });
            }
          });
          setLowStockCount(lowCount);
          setLowStockItems(lowItems);
        }
      } else {
        setLowStockCount(0);
        setLowStockItems([]);
      }

      if (canViewOrders && orderResult.status === "fulfilled") {
        const orderData = orderResult.value?.data?.data;
        if (orderData) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const sevenDaysLater = new Date(today);
          sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
          const upcoming = orderData.filter((order) => {
            const activeEventDate =
              order.sessions && order.sessions.length > 0
                ? order.sessions[0].event_date
                : order.event_date;
            if (!activeEventDate) return false;
            const eventDate = parseDate(activeEventDate);
            return (
              eventDate &&
              eventDate >= today &&
              eventDate <= sevenDaysLater &&
              order.status !== "done" &&
              order.status !== "cancelled" &&
              order.status !== "Completed" &&
              order.status !== "completed"
            );
          });
          upcoming.sort((a, b) => {
            const dateA =
              a.sessions && a.sessions.length > 0
                ? a.sessions[0].event_date
                : a.event_date;
            const dateB =
              b.sessions && b.sessions.length > 0
                ? b.sessions[0].event_date
                : b.event_date;
            return parseDate(dateA) - parseDate(dateB);
          });
          setUpcomingOrders(upcoming);
          setUpcomingOrderCount(upcoming.length);
        }
      } else {
        setUpcomingOrders([]);
        setUpcomingOrderCount(0);
      }
    };
    fetchHeaderData();

    window.addEventListener("orderStatusChanged", fetchHeaderData);
    window.addEventListener("stockDataChanged", fetchHeaderData);
    return () => {
      window.removeEventListener("orderStatusChanged", fetchHeaderData);
      window.removeEventListener("stockDataChanged", fetchHeaderData);
    };
  }, [canViewOrders, canViewStock]);

  const handleLogout = () => {
    setProfileAnchor(null);
    logout();
    toast.success("Logout successfully!");
    navigate("/login");
  };

  const closeLowStock = () => setLowStockAnchor(null);
  const closeUpcoming = () => setUpcomingAnchor(null);
  const closeProfile = () => setProfileAnchor(null);

  const unitShort = { KG: "Kg", G: "g", L: "L", ML: "mL", QTY: "Qty" };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(18px)",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "var(--app-border)",
        boxShadow: "0 14px 34px -32px rgba(15, 23, 42, 0.5)",
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 1.5, sm: 3 },
          minHeight: { xs: 56, sm: 64 },
          gap: 1,
          justifyContent: "space-between",
        }}
      >
        {/* Left: Hamburger + Breadcrumbs */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          <IconButton
            edge="start"
            onClick={toggleSidebar}
            sx={{
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
            aria-label="toggle sidebar"
          >
            <FiMenu />
          </IconButton>

          <Breadcrumbs
            separator={<FiChevronRight size={12} />}
            aria-label="breadcrumb"
            sx={{
              display: { xs: "none", sm: "flex" },
              color: "inherit",
              "& .MuiBreadcrumbs-separator": { color: "inherit", opacity: 0.5 },
              "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" },
            }}
          >
            <MuiLink
              component="button"
              onClick={() => navigate(homeRoute)}
              underline="hover"
              sx={{
                color: "inherit",
                opacity: 0.7,
                display: "inline-flex",
                alignItems: "center",
                "&:hover": { opacity: 1 },
              }}
            >
              <FiHome size={16} />
            </MuiLink>
            {breadcrumbs.map((crumb, i) =>
              crumb.isLast ? (
                <Typography
                  key={i}
                  variant="body2"
                  fontWeight={600}
                  color="inherit"
                  noWrap
                >
                  {crumb.label}
                </Typography>
              ) : (
                <MuiLink
                  key={i}
                  component="button"
                  onClick={() => navigate(crumb.path)}
                  underline="hover"
                  sx={{
                    color: "inherit",
                    opacity: 0.7,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <Typography variant="body2" noWrap component="span">
                    {crumb.label}
                  </Typography>
                </MuiLink>
              )
            )}
          </Breadcrumbs>
        </Stack>

        {/* Right: Low stock + Upcoming + Calendar + Profile */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {canViewStock && (
            <Button
              size="small"
              variant={lowStockCount > 0 ? "contained" : "text"}
              color={lowStockCount > 0 ? "warning" : "inherit"}
              startIcon={<FiAlertTriangle size={14} />}
              onClick={(e) => setLowStockAnchor(e.currentTarget)}
              sx={{
                borderRadius: 999,
                minWidth: 0,
                color: lowStockCount > 0 ? undefined : "text.secondary",
                bgcolor: lowStockCount > 0 ? undefined : "action.hover",
                border: lowStockCount > 0 ? 0 : "1px solid",
                borderColor: "divider",
                "&:hover": {
                  bgcolor: lowStockCount > 0 ? undefined : "action.selected",
                },
              }}
            >
              <Badge
                badgeContent={lowStockCount > 0 ? lowStockCount : null}
                color="error"
                sx={{ "& .MuiBadge-badge": { right: -6, top: -2 } }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Low Stock
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", sm: "none" } }}
                >
                  {lowStockCount}
                </Box>
              </Badge>
            </Button>
          )}
          <Menu
            anchorEl={lowStockAnchor}
            open={Boolean(lowStockAnchor)}
            onClose={closeLowStock}
            PaperProps={{
              sx: {
                width: 340,
                maxHeight: 420,
                mt: 1,
                bgcolor: "var(--app-surface-strong)",
                border: "1px solid var(--app-border)",
                boxShadow: "var(--app-shadow)",
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: "action.hover" }}>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <FiAlertTriangle size={14} />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Low Stock Items
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="primary.main"
                  sx={{
                    bgcolor: "background.paper",
                    px: 1,
                    py: 0.25,
                    borderRadius: 99,
                  }}
                >
                  {lowStockCount} Alert{lowStockCount !== 1 ? "s" : ""}
                </Typography>
              </Stack>
            </Box>
            <Divider />
            {lowStockItems.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center", color: "text.disabled" }}>
                <FiBox size={28} style={{ opacity: 0.4 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  All stock levels are good
                </Typography>
                <Typography variant="caption">
                  No items below alert level
                </Typography>
              </Box>
            ) : (
              lowStockItems.map((item) => {
                const unit = unitShort[item.type] || item.type;
                return (
                  <MenuItem
                    key={item.id}
                    onClick={() => {
                      closeLowStock();
                      navigate("/stock", {
                        state: {
                          selectCategoryId: item.categoryId,
                          _ts: Date.now(),
                        },
                      });
                    }}
                    sx={{ py: 1.25 }}
                  >
                    <ListItemIcon>
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: (t) => t.palette.primary.light + "33",
                          color: "primary.main",
                          width: 36,
                          height: 36,
                        }}
                      >
                        <FiBox size={16} />
                      </Avatar>
                    </ListItemIcon>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        noWrap
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        noWrap
                      >
                        {item.categoryName}
                      </Typography>
                    </Box>
                    <Stack sx={{ alignItems: "flex-end" }}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {item.quantity} {unit}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        Min: {item.alert} {unit}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })
            )}
            {lowStockItems.length > 0 && (
              <>
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeLowStock();
                    navigate("/stock", {
                      state: { view: "low_stock", _ts: Date.now() },
                    });
                  }}
                  sx={{
                    justifyContent: "center",
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  View All Low Stock Items <FiChevronRight size={12} />
                </MenuItem>
              </>
            )}
          </Menu>

          {canViewOrders && (
            <Button
              size="small"
              variant="text"
              startIcon={<FiClipboard size={14} />}
              onClick={(e) => setUpcomingAnchor(e.currentTarget)}
              sx={{
                borderRadius: 999,
                minWidth: 0,
                color: "text.secondary",
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <Badge
                badgeContent={upcomingOrderCount > 0 ? upcomingOrderCount : null}
                color="secondary"
                sx={{ "& .MuiBadge-badge": { right: -6, top: -2 } }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Upcoming
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", sm: "none" } }}
                >
                  {upcomingOrderCount}
                </Box>
              </Badge>
            </Button>
          )}
          <Menu
            anchorEl={upcomingAnchor}
            open={Boolean(upcomingAnchor)}
            onClose={closeUpcoming}
            PaperProps={{
              sx: {
                width: 340,
                maxHeight: 420,
                mt: 1,
                bgcolor: "var(--app-surface-strong)",
                border: "1px solid var(--app-border)",
                boxShadow: "var(--app-shadow)",
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: "action.hover" }}>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <FiClipboard size={14} />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Upcoming Orders
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="primary.main"
                  sx={{
                    bgcolor: "background.paper",
                    px: 1,
                    py: 0.25,
                    borderRadius: 99,
                  }}
                >
                  Next 7 Days
                </Typography>
              </Stack>
            </Box>
            <Divider />
            {upcomingOrders.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center", color: "text.disabled" }}>
                <FiClipboard size={28} style={{ opacity: 0.4 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  No upcoming orders
                </Typography>
                <Typography variant="caption">
                  No events in the next 7 days
                </Typography>
              </Box>
            ) : (
              upcomingOrders.map((order) => {
                const activeEventDate =
                  order.sessions && order.sessions.length > 0
                    ? order.sessions[0].event_date
                    : order.event_date;
                const eventDate = parseDate(activeEventDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffDays = eventDate
                  ? Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
                  : -1;
                const dayLabel =
                  diffDays === 0
                    ? "Today"
                    : diffDays === 1
                      ? "Tomorrow"
                      : `In ${diffDays} days`;

                return (
                  <MenuItem
                    key={order.id}
                    onClick={() => {
                      closeUpcoming();
                      navigate(`/order-pdf/${order.id}`);
                    }}
                    sx={{ py: 1.25 }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: (t) => t.palette.primary.light + "33",
                          color: "primary.main",
                          width: 36,
                          height: 36,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {order.name?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>
                    </ListItemIcon>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        noWrap
                      >
                        {order.name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 0.25, alignItems: "center" }}
                      >
                        <FiCalendar size={10} />
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          noWrap
                        >
                          {order.event_date}
                          {order.event_time ? ` • ${order.event_time}` : ""}
                        </Typography>
                      </Stack>
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 99,
                        bgcolor:
                          diffDays === 0
                            ? "error.light"
                            : (t) => t.palette.primary.light + "33",
                        color: diffDays === 0 ? "error.dark" : "primary.main",
                      }}
                    >
                      {dayLabel}
                    </Typography>
                  </MenuItem>
                );
              })
            )}
            {upcomingOrders.length > 0 && (
              <>
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeUpcoming();
                    navigate("/all-order?filter=upcoming");
                  }}
                  sx={{
                    justifyContent: "center",
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  View All Upcoming Orders <FiChevronRight size={12} />
                </MenuItem>
              </>
            )}
          </Menu>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ my: 1, bgcolor: "divider" }}
          />

          {canViewOrders && (
            <Button
              size="small"
              variant="text"
              startIcon={<FiCalendar size={15} />}
              onClick={() => navigate("/calendar")}
              sx={{
                color: "text.secondary",
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", md: "inline" } }}
              >
                Calendar
              </Box>
            </Button>
          )}

          {/* Profile */}
          <Button
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              bgcolor: "var(--app-surface)",
              color: "primary.main",
              border: "1px solid",
              borderColor: "var(--app-border)",
              pl: 1.5,
              pr: 1,
              py: 0.5,
              borderRadius: 999,
              "&:hover": { bgcolor: "action.hover" },
            }}
            endIcon={
              <FiChevronDown
                size={14}
                style={{
                  transform: profileAnchor ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            }
          >
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{
                display: { xs: "none", sm: "inline" },
                mr: 1,
              }}
            >
              {displayName}
            </Typography>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                width: 32,
                height: 32,
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {initial}
            </Avatar>
          </Button>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={closeProfile}
            PaperProps={{
              sx: {
                width: 180,
                mt: 1,
                bgcolor: "var(--app-surface-strong)",
                border: "1px solid var(--app-border)",
                boxShadow: "var(--app-shadow)",
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {canViewUsers && (
              <MenuItem
                onClick={() => {
                  closeProfile();
                  navigate("/user");
                }}
              >
                <ListItemIcon>
                  <FiUsers size={16} />
                </ListItemIcon>
                <Typography variant="body2" fontWeight={500}>
                  Users
                </Typography>
              </MenuItem>
            )}
            {canViewSettings && (
              <MenuItem
                onClick={() => {
                  closeProfile();
                  navigate("/settings");
                }}
              >
                <ListItemIcon>
                  <FiSettings size={16} />
                </ListItemIcon>
                <Typography variant="body2" fontWeight={500}>
                  Settings
                </Typography>
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon sx={{ color: "inherit" }}>
                <TbLogout2 size={16} />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
