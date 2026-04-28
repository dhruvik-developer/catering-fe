const titleCase = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const ACTION_LABELS = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
};

const permission = (code, label) => {
  const [moduleName, action] = String(code).split(".");
  const actionLabel = ACTION_LABELS[action] || titleCase(action);

  return {
    code,
    name: label || `${actionLabel} ${titleCase(moduleName)}`,
  };
};

export const FRONTEND_PERMISSION_MODULES = [
  {
    name: "Business Profile",
    permissions: [
      permission("business_profiles.view", "View Business Profile"),
      permission("business_profiles.create", "Create Business Profile"),
      permission("business_profiles.update", "Update Business Profile"),
    ],
  },
  {
    name: "Create Dish",
    permissions: [
      permission("event_session.view", "View Dishes"),
      permission("event_session.update", "Update Dishes"),
    ],
  },
  {
    name: "Category",
    permissions: [
      permission("categories.view", "View Categories"),
      permission("categories.create", "Create Categories"),
      permission("categories.update", "Update Categories"),
      permission("categories.delete", "Delete Categories"),
    ],
  },
  {
    name: "Quotation",
    permissions: [permission("quotations.view", "View Quotations")],
  },
  {
    name: "All Orders",
    permissions: [permission("event_bookings.view", "View Event Bookings")],
  },
  {
    name: "Invoice",
    permissions: [permission("invoices.view", "View Invoices")],
  },
  {
    name: "Event Summary",
    permissions: [permission("event_summary.view", "View Event Summary")],
  },
  {
    name: "Stock",
    permissions: [
      permission("stock.view", "View Stock"),
      permission("stock.create", "Create Stock"),
      permission("stock.update", "Update Stock"),
      permission("stock.delete", "Delete Stock"),
    ],
  },
  {
    name: "Payment History",
    permissions: [permission("payments.view", "View Payment History")],
  },
  {
    name: "Expense Entries",
    permissions: [
      permission("expense_entries.view", "View Expenses"),
      permission("expense_entries.create", "Create Expenses"),
      permission("expense_entries.update", "Update Expenses"),
      permission("expense_entries.delete", "Delete Expenses"),
    ],
  },
  {
    name: "Expense Categories",
    permissions: [
      permission("expense_categories.view", "View Expense Categories"),
      permission("expense_categories.create", "Create Expense Categories"),
      permission("expense_categories.delete", "Delete Expense Categories"),
    ],
  },
  {
    name: "Expense Entities",
    permissions: [permission("expense_entity.view", "View Expense Entities")],
  },
  {
    name: "People",
    permissions: [
      permission("users.view", "View Users And Permissions"),
      permission("users.create", "Create Users"),
      permission("users.update", "Update Users"),
    ],
  },
  {
    name: "Event Staff",
    permissions: [
      permission("eventstaff.view", "View Event Staff"),
      permission("eventstaff.create", "Create Event Staff"),
      permission("eventstaff.update", "Update Event Staff"),
      permission("eventstaff.delete", "Delete Event Staff"),
    ],
  },
  {
    name: "Vendor",
    permissions: [
      permission("vendors.view", "View Vendors"),
      permission("vendors.create", "Create Vendors"),
      permission("vendors.update", "Update Vendors"),
      permission("vendors.delete", "Delete Vendors"),
    ],
  },
  {
    name: "Ground Management",
    permissions: [
      permission("ground.view", "View Ground Checklist"),
      permission("ground.create", "Create Ground Items"),
      permission("ground.update", "Update Ground Items"),
      permission("ground.delete", "Delete Ground Items"),
    ],
  },
];

const getPermissionCode = (perm) => {
  if (typeof perm === "string") return perm;
  if (!perm || typeof perm !== "object") return "";
  return perm.code || perm.permission_code || perm.permission || "";
};

const getModuleKeyFromPermission = (permissions = []) => {
  const firstCode = permissions.map(getPermissionCode).find(Boolean);
  return firstCode ? firstCode.split(".")[0] : "";
};

const getModuleKey = (mod) => {
  const explicitKey = mod?.key || mod?.code || mod?.module || mod?.slug;
  return String(
    explicitKey || getModuleKeyFromPermission(mod?.permissions) || mod?.name || ""
  )
    .trim()
    .toLowerCase();
};

const normalizePermission = (perm) => {
  const code = getPermissionCode(perm);
  if (!code) return null;

  if (typeof perm === "string") {
    return permission(code);
  }

  return {
    ...perm,
    code,
    name: perm.name || perm.label || permission(code).name,
  };
};

const normalizeModule = (mod) => {
  if (!mod || typeof mod !== "object") return null;

  const permissions = Array.isArray(mod.permissions)
    ? mod.permissions.map(normalizePermission).filter(Boolean)
    : [];

  if (!permissions.length) return null;

  return {
    ...mod,
    name: mod.name || mod.label || titleCase(getModuleKeyFromPermission(permissions)),
    permissions,
  };
};

export const mergePermissionModules = (apiModules = []) => {
  const merged = new Map();

  const upsertModule = (mod) => {
    const normalizedModule = normalizeModule(mod);
    if (!normalizedModule) return;

    const moduleKey = getModuleKey(normalizedModule);
    const existingModule = merged.get(moduleKey);

    if (!existingModule) {
      merged.set(moduleKey, normalizedModule);
      return;
    }

    const permissionByCode = new Map(
      existingModule.permissions.map((perm) => [perm.code, perm])
    );

    normalizedModule.permissions.forEach((perm) => {
      if (!permissionByCode.has(perm.code)) {
        permissionByCode.set(perm.code, perm);
      }
    });

    merged.set(moduleKey, {
      ...existingModule,
      permissions: Array.from(permissionByCode.values()),
    });
  };

  apiModules.forEach(upsertModule);
  FRONTEND_PERMISSION_MODULES.forEach(upsertModule);

  return Array.from(merged.values());
};
