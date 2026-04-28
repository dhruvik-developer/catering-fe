import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { FiUsers } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";
import { setSidebarOpen } from "../../redux/uiSlice";

const SIDEBAR_WIDTH = 288;

const hugeIcon = (icon) => (
  <HugeiconsIcon icon={icon} size={22} color="currentColor" />
);

const menuItems = [
  {
    name: "Create Dish",
    path: "/dish",
    icon: hugeIcon(Dish01Icon),
    requiredPermission: ["event_session.view", "dishes.view"],
  },
  {
    name: "Category",
    path: "/category",
    icon: hugeIcon(MenuRestaurantIcon),
    requiredPermission: "categories.view",
  },
  {
    name: "Order Management",
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
    path: "/stock",
    icon: hugeIcon(StickyNote02Icon),
    requiredPermission: "stock.view",
  },
  {
    name: "Payment History",
    path: "/payment-history",
    icon: hugeIcon(TransactionHistoryIcon),
    requiredPermission: "payments.view",
  },
  {
    name: "Expense",
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
    path: "/create-recipe-ingredient",
    icon: hugeIcon(TaskAdd01Icon),
    requiredPermission: "categories.view",
  },
  {
    name: "People",
    path: "/people",
    icon: <FiUsers size={22} />,
    requiredPermission: ["vendors.view", "eventstaff.view"],
  },
  {
    name: "Ground Checklist",
    path: "/ground-checklist",
    icon: hugeIcon(TaskAdd01Icon),
    requiredPermission: "ground.view",
  },
];

const activePaths = {
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
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.sidebarOpen);
  const { hasPermission } = usePermissions();
  const [businessLogo, setBusinessLogo] = useState("");
  const [isLogoLoading, setIsLogoLoading] = useState(true);

  useEffect(() => {
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
        console.error("Failed to load business logo:", error);
        setBusinessLogo("");
      } finally {
        setIsLogoLoading(false);
      }
    };
    fetchBusinessLogo();
  }, []);

  const close = () => dispatch(setSidebarOpen(false));

  const isMenuItemActive = (itemPath) =>
    activePaths[itemPath]?.some((p) => location.pathname.startsWith(p)) ||
    location.pathname === itemPath;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={close}
      PaperProps={{
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
      }}
    >
      {/* Logo area */}
      <Stack
        alignItems="center"
        sx={{
          p: 2.5,
          gap: 1,
          borderBottom: 1,
          borderColor: "var(--app-border)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-primary), white 92%), rgba(255,255,255,0.3))",
        }}
      >
        {isLogoLoading ? (
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
          <Stack alignItems="center" spacing={0.5}>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              sx={{ lineHeight: 1.35 }}
            >
              Set your business profile logo in Settings tab.
            </Typography>
            {hasPermission("business_profiles.view") && (
              <Link
                to="/settings"
                onClick={close}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="primary.main"
                  sx={{ "&:hover": { textDecoration: "underline" } }}
                >
                  Go to Settings
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
          const active = isMenuItemActive(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={close}
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
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
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
