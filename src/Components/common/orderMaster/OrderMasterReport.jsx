/* eslint-disable react/prop-types */
import React from "react";
import BaseImage from "../BaseImage";
import { Rules } from "../rules";
import * as mapper from "../../../utils/orderMasterDataMapping";

const THEME = {
  primary: "var(--color-primary)",
  primaryDark: "var(--color-primary-dark)",
  primarySoft: "var(--color-primary-soft)",
  primaryTint: "var(--color-primary-tint)",
  primaryBorder: "var(--color-primary-border)",
  primaryText: "var(--color-primary-text)",
  titleBarText: "var(--color-primary-dark)",
  bodyBorder: "var(--color-primary-soft)",
  bodyAlt: "var(--color-primary-tint)",
  bodyText: "#241B35",
  muted: "var(--color-primary-text)",
  noteBg: "var(--color-primary-tint)",
  noteBorder: "var(--color-primary-border)",
  noteTitle: "var(--color-primary-dark)",
  noteText: "var(--color-primary-text)",
};

const SectionTitle = ({ number, title }) => (
  <div
    style={{
      backgroundColor: THEME.primary,
      color: "#fff",
      fontWeight: "bold",
      fontSize: "11px",
      padding: "5px 10px",
      marginTop: "14px",
      marginBottom: "0",
      borderRadius: "3px 3px 0 0",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}
  >
    {number}. {title}
  </div>
);

const TABLE_STYLE = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "12px",
  marginBottom: "0",
};

const NO_BREAK_GROUP_STYLE = {
  breakInside: "avoid",
  pageBreakInside: "avoid",
};

const SESSION_PAGE_BREAK_STYLE = {
  breakBefore: "page",
  pageBreakBefore: "always",
};

const TH = ({ children, style = {} }) => (
  <th
    style={{
      backgroundColor: THEME.primarySoft,
      color: THEME.primaryText,
      fontWeight: "bold",
      border: `1px solid ${THEME.primaryBorder}`,
      padding: "5px 8px",
      textAlign: "left",
      fontSize: "11px",
      ...style,
    }}
  >
    {children}
  </th>
);

const TD = ({ children, style = {} }) => (
  <td
    style={{
      border: `1px solid ${THEME.bodyBorder}`,
      padding: "5px 8px",
      color: THEME.bodyText,
      verticalAlign: "top",
      fontSize: "12px",
      ...style,
    }}
  >
    {children}
  </td>
);

const EmptyRow = ({ cols }) => (
  <tr>
    <TD style={{ textAlign: "center", color: THEME.muted, fontStyle: "italic" }} colSpan={cols}>
      No data available
    </TD>
  </tr>
);

const OrderMasterReport = ({ order, businessProfile }) => {
  const sessions = order?.sessions?.length ? order.sessions : [];
  const uniqueKey = order?.id ? `TRZ-B${String(order.id).padStart(4, "0")}` : "TRZ-UNSAVED";

  return (
    <div
      id="pdf-content"
      style={{
        width: "100%",
        backgroundColor: "#fff",
        // borderRadius: "8px",
        overflow: "hidden",
        border: `1px solid ${THEME.primaryBorder}`,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Document Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
          color: "#fff",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "0.06em" }}>
            {businessProfile?.caters_name || "radha SWEET & CATERERS"}
          </div>
          <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "3px" }}>
            {businessProfile?.godown_address || ""}
            {businessProfile?.phone_number ? `  |  ${businessProfile.phone_number}` : ""}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", opacity: 0.75, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Order Master
          </div>
          <div style={{ fontSize: "13px", fontWeight: "bold", marginTop: "2px" }}>{uniqueKey}</div>
          {order?.booking_no && (
            <div style={{ fontSize: "11px", opacity: 0.8 }}>Booking #{order.booking_no}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", justifyContent: "flex-end" }}>
            <BaseImage
              src="/fssai.png"
              alt="FSSAI"
              style={{ height: "18px", filter: "brightness(0) invert(1)" }}
            />
            <span style={{ fontSize: "10px", opacity: 0.75 }}>
              {businessProfile?.fssai_number || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Title Bar */}
      <div
        style={{
          backgroundColor: THEME.primarySoft,
          borderBottom: `2px solid ${THEME.primary}`,
          textAlign: "center",
          padding: "7px 0",
          fontSize: "13px",
          fontWeight: "bold",
          color: THEME.titleBarText,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        CATERING ERP — ORDER MASTER
      </div>

      <div style={{ padding: "18px 22px 28px" }}>
        {/* 1. EVENT INFORMATION */}
        <SectionTitle number={1} title="Event Information" />
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <TH style={{ width: "20%" }}>Field</TH>
              <TH style={{ width: "30%" }}>Value</TH>
              <TH style={{ width: "20%" }}>Field</TH>
              <TH style={{ width: "30%" }}>Value</TH>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TD style={{ fontWeight: "bold" }}>Event Name</TD>
              <TD>{mapper.safeText(order?.name || order?.event_name)}</TD>
              <TD style={{ fontWeight: "bold" }}>Client Mobile</TD>
              <TD>{mapper.safeText(order?.mobile_no || order?.mobile)}</TD>
            </tr>
            <tr style={{ backgroundColor: THEME.bodyAlt }}>
              <TD style={{ fontWeight: "bold" }}>Reference Person</TD>
              <TD>{mapper.safeText(order?.reference_person || order?.reference)}</TD>
              <TD style={{ fontWeight: "bold" }}>Booking Date</TD>
              <TD>
                {mapper.formatDate(order?.booking_date || order?.created_at || order?.event_date)}
              </TD>
            </tr>
            <tr>
              <TD style={{ fontWeight: "bold" }}>Status</TD>
              <TD>{mapper.safeText(order?.status)}</TD>
              <TD></TD>
              <TD></TD>
            </tr>
          </tbody>
        </table>

        {/* SESSIONS */}
        {sessions.map((session, sIdx) => {
          const sessionTitle = mapper.safeText(
            session.session_name || session.name || session.event_time || `Session ${sIdx + 1}`
          );
          const estimatedPersons = session.estimated_persons || order?.estimated_persons || 0;

          const menuRows = mapper.getMenuRows(session.selected_items);
          const ingRows = mapper.getIngredientRows(
            session.ingredients_required,
            session.assigned_vendors
          );
          const outsourcedRows = mapper.getOutsourcedItemRows(session.outsourced_items);
          const vendorRows = mapper.getVendorDeliveryRows(
            session.assigned_vendors,
            session.ingredients_required,
            session.outsourced_items
          );
          const staffRows = mapper.getStaffRows(session);
          const waiterRows = mapper.getWaiterRows(session.waiter_service);
          const extraRows = mapper.getExtraServiceRows(session.extra_service);

          return (
            <div
              key={sIdx}
              style={sIdx > 0 ? SESSION_PAGE_BREAK_STYLE : {}}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "12px",
                  padding: "6px 10px",
                  marginTop: "22px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                SESSION {sIdx + 1}: {sessionTitle}
              </div>

              {/* 2. SESSION DETAILS */}
              <SectionTitle number={2} title="Session Details" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH>Session Name</TH>
                    <TH>Event Date</TH>
                    <TH>Event Time</TH>
                    <TH>Event Address</TH>
                    <TH style={{ textAlign: "center" }}>Estimated Persons</TH>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <TD>{sessionTitle}</TD>
                    <TD>{mapper.formatDate(session.event_date || order?.event_date)}</TD>
                    <TD>{mapper.safeText(session.event_time)}</TD>
                    <TD>{mapper.safeText(session.event_address || order?.event_address)}</TD>
                    <TD style={{ textAlign: "center", fontWeight: "bold" }}>{estimatedPersons}</TD>
                  </tr>
                </tbody>
              </table>

              {/* 3. MENU ITEMS */}
              <SectionTitle number={3} title="Menu Items" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH style={{ width: "60%" }}>Item Name</TH>
                    <TH style={{ width: "40%" }}>Category</TH>
                  </tr>
                </thead>
                <tbody>
                  {menuRows.length > 0 ? (
                    menuRows.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                        <TD>{row[0]}</TD>
                        <TD>{row[1]}</TD>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow cols={2} />
                  )}
                </tbody>
              </table>

              {/* 4. INGREDIENT REQUIREMENT */}
              <SectionTitle number={4} title="Ingredient Requirement" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH style={{ width: "35%" }}>Ingredient Name</TH>
                    <TH style={{ width: "25%" }}>Category</TH>
                    <TH style={{ width: "20%" }}>Required Quantity</TH>
                    <TH style={{ width: "20%", textAlign: "center" }}>Source</TH>
                  </tr>
                </thead>
                {ingRows.length > 0 ? (
                  ingRows.map((row, i) => (
                    <tbody key={i} style={NO_BREAK_GROUP_STYLE}>
                      <tr style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                        <TD
                          style={{
                            ...NO_BREAK_GROUP_STYLE,
                            ...(row.usedIn.length > 0 ? { borderBottom: "none" } : {}),
                          }}
                        >
                          {row.name}
                        </TD>
                        <TD
                          style={{
                            ...NO_BREAK_GROUP_STYLE,
                            ...(row.usedIn.length > 0 ? { borderBottom: "none" } : {}),
                          }}
                        >
                          {row.category}
                        </TD>
                        <TD
                          style={{
                            ...NO_BREAK_GROUP_STYLE,
                            ...(row.usedIn.length > 0 ? { borderBottom: "none" } : {}),
                          }}
                        >
                          {row.quantity}
                        </TD>
                        <TD
                          style={{
                            ...NO_BREAK_GROUP_STYLE,
                            textAlign: "center",
                            ...(row.usedIn.length > 0 ? { borderBottom: "none" } : {}),
                          }}
                        >
                          {row.source}
                        </TD>
                      </tr>
                      {row.usedIn.length > 0 && (
                        <tr style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                          <TD
                            colSpan={4}
                            style={{
                              ...NO_BREAK_GROUP_STYLE,
                              borderTop: "none",
                              paddingTop: 0,
                              paddingBottom: "8px",
                              paddingLeft: "14px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: "bold",
                                color: THEME.primaryText,
                                marginBottom: "3px",
                              }}
                            >
                              Used In:
                            </div>
                            <ul
                              style={{
                                margin: 0,
                                paddingLeft: "16px",
                                color: THEME.noteText,
                                fontSize: "11px",
                              }}
                            >
                              {row.usedIn.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </TD>
                        </tr>
                      )}
                    </tbody>
                  ))
                ) : (
                  <tbody>
                    <EmptyRow cols={4} />
                  </tbody>
                )}
              </table>

              {/* 4b. OUTSOURCED ITEMS */}
              <SectionTitle number="4b" title="Outsourced Items" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH style={{ width: "40%" }}>Item Name</TH>
                    <TH style={{ width: "30%" }}>Vendor</TH>
                    <TH style={{ width: "15%" }}>Quantity</TH>
                    <TH style={{ width: "15%" }}>Unit</TH>
                  </tr>
                </thead>
                <tbody>
                  {outsourcedRows.length > 0 ? (
                    outsourcedRows.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                        <TD>{row[0]}</TD>
                        <TD>{row[1]}</TD>
                        <TD>{row[2]}</TD>
                        <TD>{row[3]}</TD>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow cols={4} />
                  )}
                </tbody>
              </table>

              {/* 5. VENDOR DELIVERY DETAILS */}
              <SectionTitle number={5} title="Vendor Delivery Details" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH>Vendor Name</TH>
                    <TH>Ingredients / Items</TH>
                    <TH>Delivery Date</TH>
                    <TH>Delivery Time</TH>
                    <TH>Delivery Address</TH>
                  </tr>
                </thead>
                <tbody>
                  {vendorRows.length > 0 ? (
                    vendorRows.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                        <TD style={{ fontWeight: "bold" }}>{row[0]}</TD>
                        <TD>{row[1]}</TD>
                        <TD>{row[2]}</TD>
                        <TD>{row[3]}</TD>
                        <TD>{row[4]}</TD>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow cols={5} />
                  )}
                </tbody>
              </table>

              {/* 6. STAFF ASSIGNMENT */}
              <SectionTitle number={6} title="Staff Assignment" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH>Staff Name</TH>
                    <TH>Role</TH>
                    <TH>Staff Type</TH>
                    <TH style={{ textAlign: "center" }}>People Assigned</TH>
                  </tr>
                </thead>
                <tbody>
                  {staffRows.length > 0 ? (
                    staffRows.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                        <TD>{row[0]}</TD>
                        <TD>{row[1]}</TD>
                        <TD>{row[2]}</TD>
                        <TD style={{ textAlign: "center" }}>{row[3]}</TD>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow cols={4} />
                  )}
                </tbody>
              </table>

              {/* 7. WAITER SERVICE */}
              <SectionTitle number={7} title="Waiter Service" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH>Type</TH>
                    <TH style={{ textAlign: "right" }}>Rate</TH>
                    <TH style={{ textAlign: "center" }}>Count</TH>
                    <TH style={{ textAlign: "right" }}>Total Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {waiterRows.length > 0 ? (
                    waiterRows.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                        <TD>{row[0]}</TD>
                        <TD style={{ textAlign: "right" }}>{row[1]}</TD>
                        <TD style={{ textAlign: "center" }}>{row[2]}</TD>
                        <TD style={{ textAlign: "right" }}>{row[3]}</TD>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow cols={4} />
                  )}
                </tbody>
              </table>

              {/* 8. EXTRA SERVICES */}
              <SectionTitle number={8} title="Extra Services" />
              <table style={TABLE_STYLE}>
                <thead>
                  <tr>
                    <TH style={{ width: "75%" }}>Service Name</TH>
                    <TH style={{ textAlign: "right", width: "25%" }}>Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {extraRows.length > 0 ? (
                    extraRows.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                        <TD>{row[0]}</TD>
                        <TD style={{ textAlign: "right" }}>{row[1]}</TD>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow cols={2} />
                  )}
                </tbody>
              </table>
            </div>
          );
        })}

        {sessions.length === 0 && (
          <div style={{ textAlign: "center", color: THEME.muted, padding: "32px", fontStyle: "italic" }}>
            No sessions configured for this order.
          </div>
        )}

        {/* 9. GROUND MANAGEMENT */}
        <SectionTitle number={9} title="Ground Management" />
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <TH>Category</TH>
              <TH>Item Name</TH>
              <TH>Unit</TH>
              <TH style={{ textAlign: "center" }}>Quantity</TH>
            </tr>
          </thead>
          <tbody>
            {mapper.getGroundManagementRows(sessions).length > 0 ? (
              mapper.getGroundManagementRows(sessions).map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 1 ? THEME.bodyAlt : "#fff" }}>
                  <TD style={{ fontWeight: "bold" }}>{row[0]}</TD>
                  <TD>{row[1]}</TD>
                  <TD>{row[2]}</TD>
                  <TD style={{ textAlign: "center" }}>{row[3]}</TD>
                </tr>
              ))
            ) : (
              <EmptyRow cols={4} />
            )}
          </tbody>
        </table>

        {/* Notes */}
        {order?.description && order.description !== "N" && (
          <div
            style={{
              marginTop: "18px",
              backgroundColor: THEME.noteBg,
              border: `1px solid ${THEME.noteBorder}`,
              borderRadius: "6px",
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "11px",
                color: THEME.noteTitle,
                marginBottom: "4px",
                textTransform: "uppercase",
              }}
            >
              Order Notes
            </div>
            <div style={{ fontSize: "12px", color: THEME.noteText, lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
              {order.description}
            </div>
          </div>
        )}

        {/* Rules */}
        {order?.rule === true && (
          <div style={{ marginTop: "18px", borderTop: "1px solid #e5e7eb", paddingTop: "14px" }}>
            <Rules />
          </div>
        )}
      </div>

      {/* Document Footer */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)",
          color: "#fff",
          textAlign: "center",
          padding: "10px",
          fontSize: "11px",
          letterSpacing: "0.05em",
        }}
      >
        Thank you for choosing <strong>{businessProfile?.caters_name || "radha Sweet & Caterers"}</strong>
        <div style={{ fontSize: "9px", opacity: 0.6, marginTop: "2px" }}>Generated with precision and care</div>
      </div>
    </div>
  );
};

export default OrderMasterReport;
