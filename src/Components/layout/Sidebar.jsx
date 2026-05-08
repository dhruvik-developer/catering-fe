import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logError } from "../../utils/logger";
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dish01Icon,
  MenuRestaurantIcon,
  MoneyReceiveSquareIcon,
  Note03Icon,
  StickyNote02Icon,
  TaskAdd01Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";
import { FiUsers, FiGrid, FiShield, FiKey, FiHome, FiGitBranch, FiInbox } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";
import { isPlatformAdminHost } from "../../services/tenantRuntime";

const SIDEBAR_WIDTH = 288;

const hugeIcon = (icon) => (
  <HugeiconsIcon icon={icon} size={22} color="currentColor" />
);

const tenantMenuItems = [
  {
    name: "Dashboard",
    labelKey: "sidebar.dashboard",
    path: "/dashboard",
    icon: <FiHome size={22} />,
    requiredPermission: "event_bookings.view",
  },
  {
    name: "Create Dish",
    labelKey: "sidebar.createDish",
    path: "/dish",
    icon: hugeIcon(Dish01Icon),
    requiredPermission: ["event_session.view", "dishes.view"],
  },
  {
    name: "Category",
    labelKey: "sidebar.category",
    path: "/category",
    icon: hugeIcon(MenuRestaurantIcon),
    requiredPermission: "categories.view",
  },
  {
    name: "Order Management",
    labelKey: "sidebar.orderManagement",
    path: "/order-management",
    icon: hugeIcon(Note03Icon),
    requiredPermission: [
      "quotations.view",
      "event_bookings.view",
      "invoices.view",
      "event_summary.view",
    ],
  },
  {
    name: "Stock",
    labelKey: "sidebar.stock",
    path: "/stock",
    icon: hugeIcon(StickyNote02Icon),
    requiredPermission: "stock.view",
  },
  {
    name: "Payment History",
    labelKey: "sidebar.paymentHistory",
    path: "/payment-history",
    icon: hugeIcon(TransactionHistoryIcon),
    requiredPermission: "payments.view",
  },
  {
    name: "Expense",
    labelKey: "sidebar.expense",
    path: "/expense",
    icon: hugeIcon(MoneyReceiveSquareIcon),
    requiredPermission: [
      "expense_entries.view",
      "expenses.view",
      "expense_categories.view",
      "expense_entity.view",
    ],
  },
  {
    name: "Create Ingredient",
    labelKey: "sidebar.createIngredient",
    path: "/create-recipe-ingredient",
    icon: hugeIcon(TaskAdd01Icon),
    requiredPermission: "categories.view",
  },
  {
    name: "People",
    labelKey: "sidebar.people",
    path: "/people",
    icon: <FiUsers size={22} />,
    requiredPermission: ["vendors.view", "eventstaff.view"],
  },
  {
    name: "Ground Checklist",
    labelKey: "sidebar.groundChecklist",
    path: "/ground-checklist",
    icon: hugeIcon(TaskAdd01Icon),
    requiredPermission: "ground.view",
  },
  {
    // Two gates:
    //   1. adminOnly — only main tenant admins manage branches
    //   2. requiredPermission — also hidden when the tenant's subscription
    //      doesn't include the branches module (backend ships nothing
    //      branch-shaped in enabled_modules in that case).
    name: "Branches",
    labelKey: "sidebar.branches",
    path: "/branches",
    icon: <FiGitBranch size={22} />,
    adminOnly: true,
    requiredPermission: "branches.view",
  },
];

const adminMenuItems = [
  {
    name: "Dashboard",
    labelKey: "sidebar.dashboard",
    path: "/dashboard",
    icon: <FiGrid size={22} />,
  },
  {
    name: "Tenants",
    labelKey: "sidebar.tenants",
    path: "/tenants",
    icon: <FiUsers size={22} />,
  },
  {
    name: "Subscription Plans",
    labelKey: "sidebar.subscriptionPlans",
    path: "/subscription-plans",
    icon: hugeIcon(TransactionHistoryIcon),
  },
  {
    name: "Access Control",
    labelKey: "sidebar.accessControl",
    path: "/access-control",
    icon: <FiKey size={22} />,
  },
  {
    name: "User Models",
    labelKey: "sidebar.userModels",
    path: "/admin-users",
    icon: <FiShield size={22} />,
  },
  {
    name: "Leads",
    labelKey: "sidebar.leads",
    path: "/leads",
    icon: <FiInbox size={22} />,
  },
];

const isAdminHost = isPlatformAdminHost();
const menuItems = isAdminHost ? adminMenuItems : tenantMenuItems;

const activePaths = {
  "/dashboard": ["/dashboard"],
  "/dish": ["/dish", "/edit-dish", "/edit-item", "/pdf", "/edit-order-pdf"],
  "/category": [
    "/category",
    "/create-category",
    "/create-item",
    "/item-recipe",
    "/create-ingredient",
    "/edit-ingredient",
  ],
  "/order-management": [
    "/order-management",
    "/quotation",
    "/all-order",
    "/invoice",
    "/order-management/quotation",
    "/order-management/all-order",
    "/order-management/invoice",
    "/order-management/event-summary",
    "/quotation-pdf/",
    "/order-pdf/",
    "/share-order-pdf",
    "/view-ingredient",
    "/share-ingredient",
    "/share-ingredient-pdf",
    "/share-full-ingredient-pdf",
    "/share-outsourced",
    "/share-outsourced-pdf",
    "/invoice-order-pdf/",
    "/invoice-bill-pdf/",
    "/complete-invoice",
    "/event-summary",
  ],
  "/user": ["/user", "/add-rule"],
  "/people": [
    "/people",
    "/event-staff",
    "/vendor",
    "/waiter-types",
    "/add-staff",
    "/edit-staff",
    "/event-assignments",
    "/add-assignment",
    "/edit-assignment",
    "/add-vendor",
    "/edit-vendor",
    "/staff-detail",
    "/fixed-staff-payments",
  ],
  "/create-recipe-ingredient": [
    "/create-recipe-ingredient",
    "/add-ingredient-item",
  ],
  "/ground-checklist": [
    "/ground-checklist",
    "/ground-categories",
    "/ground-items",
  ],
};

function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { isMainTenantAdmin } = useContext(UserContext);
  // Branches management is for the *main* tenant admin only — branch admins
  // and branch users must not see it (per backend doc).
  const isTenantAdmin = Boolean(isMainTenantAdmin);
  const [businessLogo, setBusinessLogo] = useState("");
  const [isLogoLoading, setIsLogoLoading] = useState(!isAdminHost);

  useEffect(() => {
    if (isAdminHost) return;
    const fetchBusinessLogo = async () => {
      try {
        const response = await getAllBusinessProfiles();
        const profileList = Array.isArray(response?.data)
          ? response.data
          : response?.data
            ? [response.data]
            : [];
        setBusinessLogo(profileList[0]?.logo || "");
      } catch (error) {
        logError("Failed to load business logo:", error);
        setBusinessLogo("");
      } finally {
        setIsLogoLoading(false);
      }
    };
    fetchBusinessLogo();
  }, []);

  const isMenuItemActive = (itemPath) =>
    activePaths[itemPath]?.some((p) => location.pathname.startsWith(p)) ||
    location.pathname === itemPath;

  // Sidebar is permanent for every host — admin and tenant alike. It sits
  // beside the page content (position: relative inside the flex Layout) and
  // never closes; navigation never dismisses it.
  return (
    <Drawer
      anchor="left"
      variant="permanent"
      open
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          position: "relative",
        },
      }}
      slotProps={{
        paper: {
          sx: {
            width: SIDEBAR_WIDTH,
            bgcolor: "rgba(255,255,255,0.9)",
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))",
            backdropFilter: "blur(18px)",
            border: 0,
            borderRight: 1,
            borderColor: "var(--app-border)",
            boxShadow: "10px 0 36px -34px rgba(15, 23, 42, 0.55)",
          },
        },
      }}
    >
      {/* Logo / brand area */}
      <Stack
        sx={{ alignItems: "center",
          p: 2.5,
          gap: 1,
          borderBottom: 1,
          borderColor: "var(--app-border)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-primary), white 92%), rgba(255,255,255,0.3))",
        }}
      >
        {isAdminHost ? (
          <Stack spacing={0.5} sx={{ alignItems: "center", py: 1 }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "var(--color-primary)",
                color: "var(--color-primary-contrast)",
                width: 48,
                height: 48,
                fontWeight: 800,
              }}
            >
              SA
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "var(--color-primary)", letterSpacing: 0.5 }}
            >
              {t("sidebar.superAdminPortal")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("sidebar.platformControlCenter")}
            </Typography>
          </Stack>
        ) : isLogoLoading ? (
          <Skeleton variant="rounded" width={180} height={80} />
        ) : businessLogo ? (
          <Box
            component="img"
            src={businessLogo}
            alt="Business Logo"
            onError={() => setBusinessLogo("")}
            sx={{ height: 80, maxWidth: 180, objectFit: "contain" }}
          />
        ) : (
          <Stack spacing={0.5} sx={{ alignItems: "center" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: "center", lineHeight: 1.35 }}
            >
              {t("sidebar.logoHint")}
            </Typography>
            {hasPermission("business_profiles.view") && (
              <Link to="/settings" style={{ textDecoration: "none" }}>
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
                >
                  {t("sidebar.goToSettings")}
                </Typography>
              </Link>
            )}
          </Stack>
        )}
      </Stack>

      {/* Menu list */}
      <List
        sx={{
          px: 1.5,
          py: 1,
          gap: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {menuItems.map((item) => {
          if (
            item.requiredPermission &&
            !hasPermission(item.requiredPermission)
          ) {
            return null;
          }
          // Tenant-admin-only rows (e.g. Branches) are hidden from
          // regular tenant users.
          if (item.adminOnly && !isTenantAdmin) {
            return null;
          }
          const active = isMenuItemActive(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: 1.5,
                  gap: 1.5,
                  color: active ? "primary.contrastText" : "text.secondary",
                  bgcolor: active ? "primary.main" : "rgba(255,255,255,0.42)",
                  boxShadow: active
                    ? "0 10px 22px -18px rgba(15, 23, 42, 0.55)"
                    : "none",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                  "&:hover": {
                    bgcolor: active ? "primary.dark" : "rgba(255,255,255,0.75)",
                  },
                }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: active ? "rgba(255,255,255,0.16)" : "action.hover",
                    color: active ? "primary.contrastText" : "primary.main",
                    boxShadow: "none",
                  }}
                >
                  {item.icon}
                </Avatar>
                <ListItemText
                  primary={t(item.labelKey, { defaultValue: item.name })}
                  slotProps={{
                    primary: {
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;
