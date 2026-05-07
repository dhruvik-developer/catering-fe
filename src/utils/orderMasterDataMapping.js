/**
 * orderMasterDataMapping.js
 * Centralized logic for formatting and flattening Order Master data into table-ready rows.
 * Used by BOTH OrderMasterReport (UI) and generateOrderMasterPDF.
 */

export const safeText = (v) => {
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s || "-";
};

const parseMaybeJson = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (trimmed[0] !== "{" && trimmed[0] !== "[") return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return fallback;
  }
};

const asObject = (value) => {
  const parsed = parseMaybeJson(value, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
};

const asArray = (value) => {
  const parsed = parseMaybeJson(value, []);
  return Array.isArray(parsed) ? parsed : [];
};

const hasText = (value) => safeText(value) !== "-";

const pickText = (...values) => {
  for (const value of values) {
    if (hasText(value)) return String(value).trim();
  }
  return "";
};

const uniqueTextPush = (list, value) => {
  const text = safeText(value);
  if (text === "-") return;
  const normalized = text.toLowerCase();
  if (!list.some((entry) => String(entry).trim().toLowerCase() === normalized)) {
    list.push(text);
  }
};

export const formatDate = (d) => {
  if (!d) return "-";
  try {
    const clean = String(d).trim();
    if (clean.includes("T")) {
      const p = new Date(clean);
      if (!Number.isNaN(p.getTime()))
        return p.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }
    const parts = clean.split("-");
    if (parts.length === 3 && parts.every(Boolean)) {
      const parsed =
        parts[0].length === 4
          ? new Date(`${parts[0]}-${parts[1]}-${parts[2]}`)
          : new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!Number.isNaN(parsed.getTime()))
        return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }
  } catch {
    /* ignore */
  }
  return String(d);
};

export const formatQty = (val, unit = "") => {
  if (val === null || val === undefined || val === "") return "-";
  const u = String(unit || "").trim();
  return u ? `${String(val).trim()} ${u}` : String(val).trim();
};

export const getVendorName = (v) => {
  const parsed = parseMaybeJson(v, v);
  if (!parsed) return "-";
  if (typeof parsed === "string") return parsed || "-";
  return safeText(parsed.name || parsed.vendor_name || parsed.company_name);
};

const getVendorSnapshot = (vendorLike, fallback = {}) => {
  const parsedVendor = parseMaybeJson(vendorLike, vendorLike);
  const vendorObj =
    parsedVendor && typeof parsedVendor === "object" && !Array.isArray(parsedVendor)
      ? parsedVendor
      : {};
  const fallbackObj =
    fallback && typeof fallback === "object" && !Array.isArray(fallback) ? fallback : {};

  const snapshot = {
    ...fallbackObj,
    ...vendorObj,
  };

  const vendorName = pickText(
    snapshot.name,
    snapshot.vendor_name,
    snapshot.company_name,
    typeof parsedVendor === "string" ? parsedVendor : ""
  );
  if (vendorName) snapshot.name = vendorName;

  const mobile = pickText(snapshot.mobile_no, snapshot.mobile, snapshot.phone);
  if (mobile) snapshot.mobile_no = mobile;

  const deliveryDate = pickText(snapshot.delivery_date);
  if (deliveryDate) snapshot.delivery_date = deliveryDate;

  const deliveryTime = pickText(snapshot.delivery_time, snapshot.time);
  if (deliveryTime) snapshot.delivery_time = deliveryTime;

  const deliveryAddress = pickText(snapshot.delivery_address);
  if (deliveryAddress) snapshot.delivery_address = deliveryAddress;

  if (snapshot.id === undefined || snapshot.id === null || snapshot.id === "") {
    snapshot.id = fallbackObj.id ?? null;
  }

  const hasSnapshotData = Object.values(snapshot).some((value) => hasText(value));
  if (hasSnapshotData) return snapshot;
  return parsedVendor;
};

export const getItemName = (item) => {
  if (typeof item === "string") return safeText(item);
  return safeText(item?.name?.name || item?.name || item?.dishName || item?.item_name);
};

export const getStaffName = (s) => {
  if (typeof s === "string") return safeText(s);
  return safeText(s?.name || s?.staff_name || s?.full_name);
};

export const getWaiterEntries = (ws) => {
  if (!ws) return [];
  if (Array.isArray(ws.entries) && ws.entries.length > 0) return ws.entries;
  if (ws.type) return [ws];
  return [];
};

/**
 * Mappings for each section
 */

export const getMenuRows = (selectedItems) => {
  const rows = [];
  Object.entries(asObject(selectedItems)).forEach(([cat, items]) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => rows.push([getItemName(item), safeText(cat)]));
  });
  return rows;
};

export const getIngredientRows = (ingredients, assignedVendors) => {
  const rows = [];
  const normalizedIngredients = asObject(ingredients);
  const normalizedAssignedVendors = asObject(assignedVendors);

  Object.entries(normalizedIngredients).forEach(([name, info]) => {
    const parsedInfo = parseMaybeJson(info, info);
    const details = typeof parsedInfo === "object" && parsedInfo ? parsedInfo : {};
    const assignedVendor = normalizedAssignedVendors?.[name] || null;
    const reqQty =
      typeof parsedInfo === "string"
        ? safeText(parsedInfo)
        : formatQty(
            details.quantity || details.required_quantity || details.qty || "-",
            details.unit || details.stock_type || details.quantity_type || ""
          );

    const vendor = details?.vendor || assignedVendor || null;
    const vName = getVendorName(vendor);
    const key = String(vendor?.id || vendor?.name || "").trim().toLowerCase();
    const source = key === "godown" ? "Godown" : vName !== "-" ? vName : "Godown";

    const usedIn = Array.isArray(details.used_in) ? details.used_in : [];
    rows.push({
      name: safeText(name),
      category: safeText(details.category || details.item_category || "Uncategorized"),
      quantity: reqQty,
      source: source,
      usedIn: usedIn,
    });
  });
  return rows;
};

export const getNormalizedOutsourcedItems = (outsourcedItems) =>
  asArray(outsourcedItems)
    .map((item) => {
      const vendorFallback = {
        id: item?.vendor_id ?? null,
        name: pickText(item?.vendor_name),
        delivery_date: pickText(item?.delivery_date, item?.vendor?.delivery_date),
        delivery_time: pickText(
          item?.delivery_time,
          item?.time,
          item?.vendor?.delivery_time,
          item?.vendor?.time
        ),
        delivery_address: pickText(item?.delivery_address, item?.vendor?.delivery_address),
        mobile_no: pickText(
          item?.mobile_no,
          item?.mobile,
          item?.vendor?.mobile_no,
          item?.vendor?.mobile,
          item?.vendor?.phone
        ),
      };

      const vendor = getVendorSnapshot(item?.vendor, vendorFallback);

      return {
        ...item,
        item_name: pickText(
          item?.item_name,
          item?.item?.name,
          item?.item?.item_name,
          item?.name?.name,
          item?.name
        ),
        vendor,
        quantity: item?.quantity ?? item?.qty ?? item?.required_quantity ?? "",
        unit: pickText(item?.unit, item?.quantity_type, item?.qty_unit),
        delivery_date: pickText(
          item?.delivery_date,
          vendor && typeof vendor === "object" ? vendor.delivery_date : ""
        ),
        delivery_time: pickText(
          item?.delivery_time,
          item?.time,
          vendor && typeof vendor === "object" ? vendor.delivery_time || vendor.time : ""
        ),
        delivery_address: pickText(
          item?.delivery_address,
          vendor && typeof vendor === "object" ? vendor.delivery_address : ""
        ),
        mobile_no: pickText(
          item?.mobile_no,
          item?.mobile,
          vendor && typeof vendor === "object"
            ? vendor.mobile_no || vendor.mobile || vendor.phone
            : ""
        ),
      };
    })
    .filter((item) => hasText(item.item_name) || getVendorName(item.vendor) !== "-");

export const getVendorDeliveryRows = (assignedVendors, ingredients = {}, outsourcedItems = []) => {
  const vendorMap = {};
  const normalizedAssignedVendors = asObject(assignedVendors);
  const normalizedIngredients = asObject(ingredients);

  const upsertVendor = (label, vendorLike, fallback = {}) => {
    const vendor = getVendorSnapshot(vendorLike, fallback);
    const vendorObj =
      vendor && typeof vendor === "object" && !Array.isArray(vendor) ? vendor : {};
    const vendorName = getVendorName(vendor);
    const deliveryDate = pickText(vendorObj.delivery_date, fallback.delivery_date);
    const deliveryTime = pickText(
      vendorObj.delivery_time,
      vendorObj.time,
      fallback.delivery_time,
      fallback.time
    );
    const deliveryAddress = pickText(vendorObj.delivery_address, fallback.delivery_address);
    const mobileNo = pickText(
      vendorObj.mobile_no,
      vendorObj.mobile,
      vendorObj.phone,
      fallback.mobile_no,
      fallback.mobile,
      fallback.phone
    );

    const hasVendorData =
      vendorName !== "-" || deliveryDate || deliveryTime || deliveryAddress || mobileNo;
    if (!hasVendorData) return;

    const keyBase = vendorObj.id ?? (vendorName !== "-" ? vendorName : safeText(label));
    const key = String(keyBase).trim().toLowerCase();

    if (!vendorMap[key]) {
      vendorMap[key] = {
        vendorName,
        entries: [],
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        delivery_address: deliveryAddress,
        mobile_no: mobileNo,
      };
    }

    uniqueTextPush(vendorMap[key].entries, label);

    if (!vendorMap[key].delivery_date && deliveryDate) vendorMap[key].delivery_date = deliveryDate;
    if (!vendorMap[key].delivery_time && deliveryTime) vendorMap[key].delivery_time = deliveryTime;
    if (!vendorMap[key].delivery_address && deliveryAddress) {
      vendorMap[key].delivery_address = deliveryAddress;
    }
    if (!vendorMap[key].mobile_no && mobileNo) vendorMap[key].mobile_no = mobileNo;
    if (vendorMap[key].vendorName === "-" && vendorName !== "-") vendorMap[key].vendorName = vendorName;
  };

  Object.entries(normalizedAssignedVendors).forEach(([ingredient, vendor]) => {
    upsertVendor(ingredient, vendor);
  });

  Object.entries(normalizedIngredients).forEach(([ingredient, info]) => {
    const parsedInfo = parseMaybeJson(info, info);
    const details = typeof parsedInfo === "object" && parsedInfo ? parsedInfo : {};
    if (details.vendor) {
      upsertVendor(ingredient, details.vendor);
    }
  });

  getNormalizedOutsourcedItems(outsourcedItems).forEach((item) => {
    upsertVendor(item.item_name, item.vendor, {
      delivery_date: item.delivery_date,
      delivery_time: item.delivery_time,
      delivery_address: item.delivery_address,
      mobile_no: item.mobile_no,
    });
  });

  return Object.values(vendorMap).map((v) => [
    v.vendorName,
    v.entries.join(", "),
    formatDate(v.delivery_date),
    safeText(v.delivery_time),
    safeText(v.delivery_address),
    safeText(v.mobile_no),
  ]);
};

export const getStaffRows = (session) => {
  const rows = [];
  (session?.managers_assigned || []).forEach((s) =>
    rows.push([
      getStaffName(s),
      safeText(typeof s === "object" ? s.role || "Manager" : "Manager"),
      safeText(typeof s === "object" ? s.staff_type || "Fixed" : "Fixed"),
      safeText(typeof s === "object" ? s.people_assigned || s.people_summoned || s.count || 1 : 1),
    ])
  );
  (session?.summoned_staff_details || []).forEach((s) =>
    rows.push([
      getStaffName(s),
      safeText(typeof s === "object" ? s.role || "Staff" : "Staff"),
      safeText(typeof s === "object" ? s.staff_type || "Agency" : "Agency"),
      safeText(typeof s === "object" ? s.people_assigned || s.people_summoned || s.count || 1 : 1),
    ])
  );
  return rows;
};

export const getWaiterRows = (waiterService) => {
  const entries = getWaiterEntries(waiterService);
  return entries.map((e) => {
    const rate = Number(e?.rate || 0);
    const count = Number(e?.count || 0);
    const amount = e?.amount !== undefined ? Number(e.amount) : rate * count;
    return [
      safeText(e?.type),
      `Rs. ${rate.toLocaleString("en-IN")}`,
      String(count),
      `Rs. ${amount.toLocaleString("en-IN")}`,
    ];
  });
};

export const getExtraServiceRows = (extraServices) => {
  // Backend sometimes ships extra_service as an object map instead of an
  // array, so coerce to a list before filter/map.
  const list = Array.isArray(extraServices)
    ? extraServices
    : extraServices && typeof extraServices === "object"
      ? Object.values(extraServices)
      : [];
  return list
    .filter((s) => s && (s.service_name || s.amount))
    .map((s) => [
      safeText(s.service_name || s.name),
      `Rs. ${Number(s.amount || 0).toLocaleString("en-IN")}`,
    ]);
};

export const getGroundManagementRows = (sessions) => {
  const rows = [];
  sessions.forEach((session) => {
    const gm = session.ground_management || {};
    Object.entries(gm).forEach(([category, items]) => {
      const itemList = Array.isArray(items) ? items : [items];
      itemList.forEach((item) => {
        rows.push([
          safeText(category),
          safeText(item.name),
          safeText(item.unit || "Nos"),
          safeText(item.quantity || "-"),
        ]);
      });
    });
  });
  return rows;
};

export const getOutsourcedItemRows = (outsourcedItems) => {
  return getNormalizedOutsourcedItems(outsourcedItems).map((oi) => [
    safeText(oi.item_name),
    getVendorName(oi.vendor),
    hasText(oi.quantity) ? `${oi.quantity}` : "-",
    safeText(oi.unit || "-"),
  ]);
};
