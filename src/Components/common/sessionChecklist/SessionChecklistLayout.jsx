/* eslint-disable react/prop-types */
import * as mapper from "../../../utils/orderMasterDataMapping";

const THEME = {
  primary: "#845CBD",
  primaryDark: "#6F47B8",
  primarySoft: "#F6F0FF",
  primaryBorder: "#E7D9FF",
  primaryText: "#5B34A8",
  bodyText: "#241B35",
  bodyBorder: "#E9DFFB",
  bodyAlt: "#FAF7FF",
  muted: "#8E7AB3",
};

const checkbox = "[   ]";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "12px",
  marginTop: "6px",
  marginBottom: "14px",
};

const thStyle = {
  backgroundColor: THEME.primarySoft,
  color: THEME.primaryText,
  border: `1px solid ${THEME.primaryBorder}`,
  padding: "6px 8px",
  fontWeight: "bold",
  textAlign: "left",
  fontSize: "11px",
};

const tdStyle = {
  border: `1px solid ${THEME.bodyBorder}`,
  padding: "6px 8px",
  color: THEME.bodyText,
  verticalAlign: "top",
};

const sectionTitleStyle = {
  backgroundColor: THEME.primary,
  color: "#fff",
  fontWeight: "bold",
  fontSize: "11px",
  padding: "6px 10px",
  marginTop: "14px",
  borderRadius: "4px 4px 0 0",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const getMenuRows = (session) => {
  const rows = mapper.getMenuRows(session?.selected_items || {});
  return rows.map(([itemName, category]) => [
    itemName,
    category,
    mapper.safeText(session?.estimated_persons || "-"),
    checkbox,
    checkbox,
  ]);
};

const getIngredientRows = (session) => {
  const rows = mapper.getIngredientRows(
    session?.ingredients_required || {},
    session?.assigned_vendors || {}
  );
  return rows.map((row) => [row.name, row.quantity, row.source, checkbox]);
};

const getVendorRows = (orderData, session) => {
  const sessionVendors = mapper.getVendorDeliveryRows(session?.assigned_vendors || {});
  if (sessionVendors.length > 0) {
    return sessionVendors.map((row) => {
      const mobile = row[5] !== "-" ? row[5] : "";
      const time = row[3] !== "-" ? row[3] : "";
      const val = [mobile, time].filter(Boolean).join(" / ") || "-";
      return [row[0], row[1], val, checkbox];
    });
  }

  const orderLevelVendors = (orderData?.vendors_assigned || []).map((v) => [
    mapper.safeText(v?.name),
    mapper.safeText(v?.category || v?.service),
    mapper.safeText(v?.mobile),
    checkbox,
  ]);
  return orderLevelVendors;
};

const getGroundRows = (session) => {
  const rows = [];
  const ground = session?.ground_management || {};
  Object.entries(ground).forEach(([category, items]) => {
    const list = Array.isArray(items) ? items : [items];
    list.forEach((item) => {
      rows.push([
        mapper.safeText(category),
        mapper.safeText(item?.name),
        mapper.safeText(item?.unit || "Nos"),
        mapper.safeText(item?.quantity || "-"),
        checkbox,
      ]);
    });
  });
  return rows;
};

const getOutsourcedMobileTime = (item) => {
  const vendor = item?.vendor || {};
  const mobile = mapper.safeText(
    vendor?.mobile_no || vendor?.mobile || vendor?.phone || item?.mobile_no || item?.mobile || ""
  );
  const time = mapper.safeText(
    vendor?.delivery_time || vendor?.time || item?.delivery_time || item?.time || ""
  );
  return [mobile, time].filter((value) => value && value !== "-").join(" / ") || "-";
};

const renderRows = (rows, colCount, zebra = true) => {
  if (!rows.length) {
    return (
      <tr>
        <td style={{ ...tdStyle, textAlign: "center", color: THEME.muted }} colSpan={colCount}>
          No data available
        </td>
      </tr>
    );
  }
  return rows.map((row, idx) => (
    <tr key={idx} style={zebra && idx % 2 === 1 ? { backgroundColor: THEME.bodyAlt } : undefined}>
      {row.map((cell, cIdx) => {
        const isCheckboxCell = cell === checkbox;

        return (
          <td
            key={cIdx}
            style={{
              ...tdStyle,
              textAlign: isCheckboxCell ? "center" : "left",
            }}
          >
            {isCheckboxCell ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {cell}
              </div>
            ) : (
              cell
            )}
          </td>
        );
      })}
    </tr>
  ));
};

function SessionChecklistLayout({
  orderData,
  sessionData,
  sessionIndex = 0,
  containerId = "session-checklist-content",
}) {
  const sessionTitle = mapper.safeText(
    sessionData?.session_name ||
      sessionData?.name ||
      sessionData?.event_time ||
      `Session ${sessionIndex + 1}`
  );

  const menuRows = getMenuRows(sessionData);
  const ingredientRows = getIngredientRows(sessionData);
  const outsourcedRows = (sessionData?.outsourced_items || []).map((item) => [
    mapper.safeText(item.item_name),
    mapper.getVendorName(item.vendor),
    mapper.safeText(item.quantity),
    mapper.safeText(item.unit),
    getOutsourcedMobileTime(item),
    checkbox,
  ]);
  const vendorRows = getVendorRows(orderData, sessionData);
  const groundRows = getGroundRows(sessionData);

  return (
    <div
      id={containerId}
      style={{
        width: "794px",
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: "#fff",
        border: `1px solid ${THEME.primaryBorder}`,
        // borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #845CBD 0%, #6F47B8 100%)",
          color: "#fff",
          padding: "14px 20px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "0.05em" }}>
          EVENT SESSION CHECKLIST
        </div>
        <div style={{ marginTop: "4px", fontSize: "12px", opacity: 0.9 }}>
          Booking #{mapper.safeText(orderData?.booking_no || orderData?.id)}
        </div>
      </div>

      <div style={{ padding: "16px 20px 22px" }}>
        <div style={sectionTitleStyle}>1. Session Info</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Session</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Location</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Estimated Persons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>{sessionTitle}</td>
              <td style={tdStyle}>{mapper.formatDate(sessionData?.event_date || orderData?.event_date)}</td>
              <td style={tdStyle}>{mapper.safeText(sessionData?.event_time)}</td>
              <td style={tdStyle}>{mapper.safeText(sessionData?.event_address || orderData?.event_address)}</td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                {mapper.safeText(sessionData?.estimated_persons || orderData?.estimated_persons || "-")}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitleStyle}>2. Menu Checklist</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Req Qty</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Prepared</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Served</th>
            </tr>
          </thead>
          <tbody>{renderRows(menuRows, 5)}</tbody>
        </table>

        <div style={sectionTitleStyle}>3. Ingredient Checklist</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Ingredient</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Source</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Received</th>
            </tr>
          </thead>
          <tbody>{renderRows(ingredientRows, 4)}</tbody>
        </table>

        <div style={sectionTitleStyle}>3b. Outsourced Items</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Vendor</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Mobile / Time</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Received</th>
            </tr>
          </thead>
          <tbody>{renderRows(outsourcedRows, 6)}</tbody>
        </table>

        <div style={sectionTitleStyle}>4. Vendor Details</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Vendor Name</th>
              <th style={thStyle}>Service / Ingredients</th>
              <th style={thStyle}>Mobile / Time</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Delivered</th>
            </tr>
          </thead>
          <tbody>{renderRows(vendorRows, 4)}</tbody>
        </table>

        <div style={sectionTitleStyle}>5. Ground Management Items</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Qty</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Available</th>
            </tr>
          </thead>
          <tbody>{renderRows(groundRows, 5)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionChecklistLayout;
