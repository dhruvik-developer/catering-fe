const ACTIONS = ["view", "create", "update", "delete"];

const MODULE_ALIASES = {
  business_profiles: ["business_profiles", "business_profile", "settings"],
  categories: ["categories"],
  event_session: ["event_session", "event_sessions", "dishes"],
  expense_categories: ["expense_categories", "expenses_categories"],
  expense_entries: ["expense_entries", "expenses"],
  expense_entity: ["expense_entity", "expense_entities"],
  payments: ["payments", "payment_history"],
  eventstaff: ["eventstaff", "event_staff", "staff", "waiter_types", "fixed_staff_payments", "staff_withdrawals"],
  stock: ["stock", "stocks", "stoke", "stock_items", "stock_categories", "stock_adjustments"],
  vendors: ["vendors", "vendor_category"],
  quotations: ["quotations", "event_bookings"],
  event_bookings: ["event_bookings"],
  invoices: ["invoices", "event_bookings"],
  event_summary: ["event_summary", "event_booking_reports"],
  ground: ["ground", "ground_checklist_template", "ground_items", "ground_categories", "event_ground_requirement"],
  notes: ["notes"],
  permissions: ["permissions", "access_control"],
  users: ["users"],
};

const ROUTE_ACCESS = [
  // Tenant dashboard — shows event overview with click-through, so
  // booking-view is the right gate.
  { path: "/dashboard", permission: "event_bookings.view" },
  { path: "/settings", permission: "business_profiles.view" },

  { path: "/dish", permission: ["event_session.view", "dishes.view"] },
  { path: "/edit-dish", permission: ["event_session.update", "dishes.update"] },
  { path: "/edit-item", permission: ["event_session.update", "dishes.update"] },
  { path: "/pdf", permission: ["event_session.view", "dishes.view"] },
  { path: "/edit-order-pdf", permission: ["event_session.view", "dishes.view"] },
  { path: "/dish-tags-pdf", permission: ["event_session.view", "dishes.view"] },

  { path: "/category", permission: "categories.view" },
  { path: "/create-category", permission: "categories.create" },
  { path: "/create-item", permission: "categories.create" },
  { path: "/create-ingredient", permission: "categories.create" },
  { path: "/item-recipe", permission: "categories.view" },
  { path: "/view-ingredient", permission: "categories.view" },
  { path: "/recipe-ingredient", permission: "categories.view" },
  { path: "/create-recipe-ingredient", permission: "categories.view" },
  { path: "/add-ingredient-item", permission: "categories.create" },
  { path: "/edit-ingredient", permission: "categories.update" },

  { path: "/payment-history", permission: "payments.view" },
  { path: "/calendar", permission: "event_bookings.view" },

  {
    path: "/expense",
    permission: [
      "expense_entries.view",
      "expenses.view",
      "expense_categories.view",
      "expense_entity.view",
    ],
  },

  { path: "/stock", permission: "stock.view" },

  {
    path: "/people/permissions",
    permission: "users.view",
  },
  { path: "/people/event-staff", permission: "eventstaff.view" },
  { path: "/people/vendor", permission: "vendors.view" },
  { path: "/people/waiter-types", permission: "eventstaff.view" },
  { path: "/people", permission: ["eventstaff.view", "vendors.view"] },
  { path: "/event-staff", permission: "eventstaff.view" },
  { path: "/vendor", permission: "vendors.view" },
  { path: "/waiter-types", permission: "eventstaff.view" },
  { path: "/add-staff", permission: "eventstaff.create" },
  { path: "/edit-staff", permission: "eventstaff.update" },
  { path: "/event-assignments", permission: "eventstaff.view" },
  { path: "/add-assignment", permission: "eventstaff.create" },
  { path: "/edit-assignment", permission: "eventstaff.update" },
  { path: "/staff-detail", permission: "eventstaff.view" },
  { path: "/fixed-staff-payments", permission: "eventstaff.view" },
  { path: "/add-vendor", permission: "vendors.create" },
  { path: "/edit-vendor", permission: "vendors.update" },

  { path: "/order-management/quotation", permission: "quotations.view" },
  { path: "/order-management/all-order", permission: "event_bookings.view" },
  { path: "/order-management/invoice", permission: "invoices.view" },
  { path: "/order-management/event-summary", permission: "event_summary.view" },
  {
    path: "/order-management",
    permission: [
      "quotations.view",
      "event_bookings.view",
      "invoices.view",
      "event_summary.view",
    ],
  },
  { path: "/quotation", permission: "quotations.view" },
  { path: "/all-order", permission: "event_bookings.view" },
  { path: "/invoice", permission: "invoices.view" },
  { path: "/event-summary", permission: "event_summary.view" },
  { path: "/view-order-details", permission: "event_bookings.view" },
  { path: "/share-ingredient", permission: "event_bookings.view" },
  { path: "/share-outsourced", permission: "event_bookings.view" },
  { path: "/quotation-pdf", permission: "quotations.view" },
  { path: "/order-pdf", permission: "event_bookings.view" },
  { path: "/share-order-pdf", permission: "event_bookings.view" },
  { path: "/share-ingredient-pdf", permission: "event_bookings.view" },
  { path: "/share-full-ingredient-pdf", permission: "event_bookings.view" },
  { path: "/share-outsourced-pdf", permission: "event_bookings.view" },
  { path: "/invoice-order-pdf", permission: "invoices.view" },
  { path: "/invoice-bill-pdf", permission: "invoices.view" },
  { path: "/complete-invoice-pdf", permission: "invoices.view" },

  { path: "/ground-checklist", permission: "ground.view" },
  { path: "/ground-categories", permission: "ground.view" },
  { path: "/ground-items", permission: "ground.view" },

  { path: "/user", permission: "users.view" },
  { path: "/add-user", permission: "users.create" },
  { path: "/edit-user", permission: "users.update" },
  { path: "/add-rule", permission: "users.update" },
];

const DEFAULT_ACCESS_ORDER = [
  { path: "/dish", permission: ["event_session.view", "dishes.view"] },
  { path: "/category", permission: "categories.view" },
  { path: "/payment-history", permission: "payments.view" },
  {
    path: "/expense",
    permission: [
      "expense_entries.view",
      "expenses.view",
      "expense_categories.view",
      "expense_entity.view",
    ],
  },
  { path: "/settings", permission: "business_profiles.view" },
  { path: "/stock", permission: "stock.view" },
  {
    path: "/order-management",
    permission: [
      "quotations.view",
      "event_bookings.view",
      "invoices.view",
      "event_summary.view",
    ],
  },
  { path: "/people", permission: ["eventstaff.view", "vendors.view"] },
  { path: "/ground-checklist", permission: "ground.view" },
];

export const normalizeAccessList = (value) => {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const splitPermission = (code) => {
  if (typeof code !== "string" || code === "*") {
    return { module: code, action: "" };
  }

  const lastDot = code.lastIndexOf(".");
  if (lastDot === -1) {
    return { module: code, action: "" };
  }

  return {
    module: code.slice(0, lastDot),
    action: code.slice(lastDot + 1),
  };
};

export const getModuleAliases = (moduleName) => {
  if (!moduleName || moduleName === "*") return [];

  const directAliases = MODULE_ALIASES[moduleName] || [moduleName];
  const reverseAliases = Object.values(MODULE_ALIASES).find((aliases) =>
    aliases.includes(moduleName)
  );

  return unique([moduleName, ...directAliases, ...(reverseAliases || [])]);
};

export const expandPermissionCode = (code) => {
  if (code === "*") return ["*"];

  const { module, action } = splitPermission(code);
  if (!module || !action) return [code];

  return getModuleAliases(module).map((alias) => `${alias}.${action}`);
};

export const isModuleEnabledForPermission = (enabledModules, code) => {
  const modules = normalizeAccessList(enabledModules);
  if (!modules.length || code === "*") return true;

  const enabledSet = new Set(modules);
  const { module } = splitPermission(code);
  if (!module) return true;

  return getModuleAliases(module).some((alias) => enabledSet.has(alias));
};

export const hasEnabledModule = (enabledModules, moduleName) => {
  const modules = normalizeAccessList(enabledModules);
  if (!modules.length) return true;

  const enabledSet = new Set(modules);
  return getModuleAliases(moduleName).some((alias) => enabledSet.has(alias));
};

export const hasPermissionForCodes = (
  permissions,
  enabledModules,
  codes,
  mode = "any"
) => {
  if (!codes) return true;

  const userPermissions = normalizeAccessList(permissions);
  const permissionSet = new Set(userPermissions);
  const checkCodes = Array.isArray(codes) ? codes : [codes];

  if (!checkCodes.length) return true;

  const checkSingleCode = (code) => {
    if (code === "*") return permissionSet.has("*");

    if (!isModuleEnabledForPermission(enabledModules, code)) {
      return false;
    }

    if (permissionSet.has("*")) return true;

    return expandPermissionCode(code).some((expandedCode) =>
      permissionSet.has(expandedCode)
    );
  };

  if (mode === "all") {
    return checkCodes.every(checkSingleCode);
  }

  return checkCodes.some(checkSingleCode);
};

const normalizePathname = (pathname = "") => {
  const normalized = `/${String(pathname).replace(/^\/+/, "")}`.replace(
    /\/+$/,
    ""
  );
  return normalized || "/";
};

const routeMatches = (pathname, routePath) => {
  const current = normalizePathname(pathname);
  const route = normalizePathname(routePath);
  return current === route || current.startsWith(`${route}/`);
};

export const getRouteAccess = (pathname) => {
  return ROUTE_ACCESS.find((route) => routeMatches(pathname, route.path));
};

export const canAccessRoute = (pathname, permissions, enabledModules) => {
  const routeAccess = getRouteAccess(pathname);
  if (!routeAccess) return true;

  return hasPermissionForCodes(
    permissions,
    enabledModules,
    routeAccess.permission
  );
};

export const getDefaultRouteForAccess = (permissions, enabledModules) => {
  const fallback = DEFAULT_ACCESS_ORDER.find((route) =>
    hasPermissionForCodes(permissions, enabledModules, route.permission)
  );

  return fallback?.path || "";
};

export const getPermissionAction = (code) => {
  const { action } = splitPermission(code);
  return ACTIONS.includes(action) ? action : "";
};
