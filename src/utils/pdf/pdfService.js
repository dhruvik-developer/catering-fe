import jsPDF from "jspdf";
import * as mapper from "../orderMasterDataMapping"; // Reuse existing robust data rules
import { createHeader, createSectionTitle, createFooter, handlePageBreak } from "./sectionRenderer";
import { createTable } from "./tableHelper";
import { prepareUnicodePdfDocument } from "./unicodePdfFont";

// -------------------------------------------------------------
// HELPER: Initialize Document
// -------------------------------------------------------------
const initDocument = async () => {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  await prepareUnicodePdfDocument(doc);
  return doc;
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

// -------------------------------------------------------------
// 1) ORDER MASTER PDF
// -------------------------------------------------------------
export const generateOrderMasterPDF = async (orderData, businessProfile) => {
  const doc = await initDocument();
  let currentY = 0;

  const uniqueKey = orderData?.id ? `TRZ-B${String(orderData.id).padStart(4, "0")}` : "TRZ-UNSAVED";
  const bookingNo = orderData?.booking_no ? `Booking #${orderData.booking_no}` : "";
  const subtitle = bookingNo ? `${uniqueKey}\n${bookingNo}` : uniqueKey;

  currentY = createHeader(doc, "ORDER MASTER", subtitle, businessProfile);
  
  // Title Bar matching legacy logic
  const pageWidth = doc.internal.pageSize.width;
  doc.setFillColor(246, 240, 255); // THEME.primarySoft
  doc.rect(0, currentY, pageWidth, 8, "F");
  doc.setDrawColor(132, 92, 189);
  doc.setLineWidth(0.5);
  doc.line(0, currentY + 8, pageWidth, currentY + 8);
  doc.setTextColor(109, 68, 184);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CATERING ERP — ORDER MASTER", pageWidth / 2, currentY + 5.5, { align: "center", charSpace: 1 });
  currentY += 12;

  // 1) EVENT INFORMATION
  currentY = createSectionTitle(doc, currentY, "1. EVENT INFORMATION");
  currentY = createTable(
    doc,
    currentY,
    [["Field", "Value", "Field", "Value"]],
    [
      [
        "Event Name", mapper.safeText(orderData.name || orderData.event_name),
        "Client Mobile", mapper.safeText(orderData.mobile_no || orderData.mobile)
      ],
      [
        "Reference Person", mapper.safeText(orderData.reference_person || orderData.reference),
        "Booking Date", mapper.formatDate(orderData.booking_date || orderData.created_at || orderData.event_date)
      ],
      ["Status", mapper.safeText(orderData.status), "", ""]
    ],
    { columnStyles: { 0: { fontStyle: "bold", cellWidth: 30 }, 2: { fontStyle: "bold", cellWidth: 30 } } }
  );

  const sessions = orderData.sessions?.length ? orderData.sessions : [];

  sessions.forEach((session, sIdx) => {
    const sessionTitle = mapper.safeText(session.session_name || session.name || session.event_time || `Session ${sIdx + 1}`);

    currentY = handlePageBreak(doc, currentY, 30);
    
    // Session Banner
    doc.setFillColor(132, 92, 189);
    doc.rect(14, currentY, pageWidth - 28, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`SESSION ${sIdx + 1}: ${sessionTitle.toUpperCase()}`, 16, currentY + 4.8);
    currentY += 10;

    // 2) SESSION DETAILS
    currentY = createSectionTitle(doc, currentY, "2. SESSION DETAILS");
    currentY = createTable(
      doc,
      currentY,
      [["Session Name", "Event Date", "Event Time", "Event Address", "Estimated Persons"]],
      [[
        sessionTitle,
        mapper.formatDate(session.event_date || orderData.event_date),
        mapper.safeText(session.event_time),
        mapper.safeText(session.event_address || orderData.event_address),
        mapper.safeText(session.estimated_persons || orderData.estimated_persons || 0)
      ]],
      { columnStyles: { 4: { halign: "center", fontStyle: "bold" } } }
    );

    // 3) MENU ITEMS
    currentY = createSectionTitle(doc, currentY, "3. MENU ITEMS");
    currentY = createTable(
      doc,
      currentY,
      [["Item Name", "Category"]],
      mapper.getMenuRows(session.selected_items)
    );

    // 4) INGREDIENT REQUIREMENT
    currentY = createSectionTitle(doc, currentY, "4. INGREDIENT REQUIREMENT");
    const ingRows = mapper.getIngredientRows(session.ingredients_required, session.assigned_vendors);
    const ingTableBody = [];
    ingRows.forEach(row => {
      ingTableBody.push([row.name, row.category, row.quantity, row.source]);
      if (row.usedIn && row.usedIn.length > 0) {
        const usedInStr = "Used In:\n" + row.usedIn.map(item => `• ${item}`).join("\n");
        ingTableBody.push([
          { content: usedInStr, colSpan: 4, styles: { textColor: [110, 110, 110], fontStyle: 'italic', cellPadding: { left: 10, top: 2, bottom: 2 } } }
        ]);
      }
    });
    currentY = createTable(
      doc,
      currentY,
      [["Ingredient Name", "Category", "Required Quantity", "Source"]],
      ingTableBody,
      { columnStyles: { 3: { halign: "center" } } }
    );

    // 4b) OUTSOURCED ITEMS
    const outsourcedRows = mapper.getOutsourcedItemRows(session.outsourced_items);
    if (outsourcedRows.length > 0) {
      currentY = createSectionTitle(doc, currentY, "4b. OUTSOURCED ITEMS");
      currentY = createTable(
        doc,
        currentY,
        [["Item Name", "Vendor", "Quantity", "Unit"]],
        outsourcedRows,
        { columnStyles: { 0: { fontStyle: "bold" }, 1: { textColor: [132, 92, 189] }, 2: { halign: "center" }, 3: { halign: "center" } } }
      );
    }

    // 5) VENDOR DELIVERY DETAILS
    currentY = createSectionTitle(doc, currentY, "5. VENDOR DELIVERY DETAILS");
    currentY = createTable(
      doc,
      currentY,
      [["Vendor Name", "Ingredients", "Delivery Date", "Mobile / Time", "Delivery Address"]],
      mapper.getVendorDeliveryRows(session.assigned_vendors).map((row) => {
        const mobile = row[5] && row[5] !== "-" ? row[5] : "";
        const time = row[3] && row[3] !== "-" ? row[3] : "";
        const val = [mobile, time].filter(Boolean).join(" / ") || "-";
        return [row[0], row[1], row[2], val, row[4]];
      }),
      { columnStyles: { 0: { fontStyle: "bold" } } }
    );

    // 6) STAFF ASSIGNMENT
    currentY = createSectionTitle(doc, currentY, "6. STAFF ASSIGNMENT");
    currentY = createTable(
      doc,
      currentY,
      [["Staff Name", "Role", "Staff Type", "People Assigned"]],
      mapper.getStaffRows(session),
      { columnStyles: { 3: { halign: "center" } } }
    );

    // 7) WAITER SERVICE
    currentY = createSectionTitle(doc, currentY, "7. WAITER SERVICE");
    currentY = createTable(
      doc,
      currentY,
      [["Type", "Rate", "Count", "Total Amount"]],
      mapper.getWaiterRows(session.waiter_service),
      { columnStyles: { 1: { halign: "right" }, 2: { halign: "center" }, 3: { halign: "right" } } }
    );

    // 8) EXTRA SERVICES
    currentY = createSectionTitle(doc, currentY, "8. EXTRA SERVICES");
    currentY = createTable(
      doc,
      currentY,
      [["Service Name", "Amount"]],
      mapper.getExtraServiceRows(session.extra_service),
      { columnStyles: { 1: { halign: "right" } } }
    );
  });

  // 9) GROUND MANAGEMENT
  currentY = createSectionTitle(doc, currentY, "9. GROUND MANAGEMENT");
  currentY = createTable(
    doc,
    currentY,
    [["Category", "Item Name", "Unit", "Quantity"]],
    mapper.getGroundManagementRows(sessions),
    { columnStyles: { 0: { fontStyle: "bold" }, 3: { halign: "center" } } }
  );

  createFooter(doc, businessProfile);
  
  return doc;
};

// -------------------------------------------------------------
// 2) SESSION CHECKLIST PDF
// -------------------------------------------------------------
export const generateSessionChecklistPDF = async (orderData, sessionData, businessProfile, sessionIndex = 0) => {
  const doc = await initDocument();
  let currentY = 0;

  const subtitle = `Booking #${mapper.safeText(orderData?.booking_no || orderData?.id)}`;
  currentY = createHeader(doc, "SESSION CHECKLIST REPORT", subtitle, businessProfile);

  const sessionTitle = mapper.safeText(
    sessionData?.session_name || sessionData?.name || sessionData?.event_time || `Session ${sessionIndex + 1}`
  );

  currentY = handlePageBreak(doc, currentY, 24);
  const pageWidth = doc.internal.pageSize.width;
  
  // Custom Session Banner
  doc.setFillColor(111, 71, 184);
  doc.rect(14, currentY, pageWidth - 28, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`SESSION ${sessionIndex + 1}: ${sessionTitle.toUpperCase()}`, 16, currentY + 4.8);
  
  currentY += 10;

  // 1) SESSION INFO
  currentY = createSectionTitle(doc, currentY, "1. SESSION INFO");
  currentY = createTable(
    doc,
    currentY,
    [["Session", "Date", "Time", "Location", "Estimated Persons"]],
    [[
      sessionTitle,
      mapper.formatDate(sessionData?.event_date || orderData?.event_date),
      mapper.safeText(sessionData?.event_time),
      mapper.safeText(sessionData?.event_address || orderData?.event_address),
      mapper.safeText(sessionData?.estimated_persons || orderData?.estimated_persons || "-"),
    ]],
    { columnStyles: { 4: { halign: "center", fontStyle: "bold" } } }
  );

  // 2) MENU CHECKLIST
  currentY = createSectionTitle(doc, currentY, "2. MENU CHECKLIST");
  const menuBody = mapper.getMenuRows(sessionData?.selected_items || {}).map((row) => [
    row[0], row[1], mapper.safeText(sessionData?.estimated_persons || "-"), "[   ]", "[   ]",
  ]);
  currentY = createTable(
    doc,
    currentY,
    [["Item Name", "Category", "Required Qty", "Prepared", "Served"]],
    menuBody,
    { columnStyles: { 2: { halign: "center" }, 3: { halign: "center" }, 4: { halign: "center" } } }
  );

  // 3) INGREDIENT CHECKLIST
  currentY = createSectionTitle(doc, currentY, "3. INGREDIENT CHECKLIST");
  const ingredientBody = mapper
    .getIngredientRows(sessionData?.ingredients_required || {}, sessionData?.assigned_vendors || {})
    .map((row) => [row.name, row.quantity, row.source, "[   ]"]);
  currentY = createTable(
    doc,
    currentY,
    [["Ingredient", "Quantity", "Source", "Received"]],
    ingredientBody,
    { columnStyles: { 3: { halign: "center" } } }
  );

  // 3b) OUTSOURCED ITEMS CHECKLIST
  const outsourcedItems = Array.isArray(sessionData?.outsourced_items)
    ? sessionData.outsourced_items
    : [];
  if (outsourcedItems.length > 0) {
    currentY = createSectionTitle(doc, currentY, "3b. OUTSOURCED ITEMS");
    const outsourcedBody = outsourcedItems.map((item) => [
      mapper.safeText(item?.item_name),
      mapper.getVendorName(item?.vendor),
      mapper.safeText(item?.quantity),
      mapper.safeText(item?.unit),
      getOutsourcedMobileTime(item),
      "[   ]",
    ]);
    currentY = createTable(
      doc,
      currentY,
      [["Item Name", "Vendor", "Quantity", "Unit", "Mobile / Time", "Received"]],
      outsourcedBody,
      {
        columnStyles: {
          0: { fontStyle: "bold" },
          1: { textColor: [132, 92, 189] },
          2: { halign: "center" },
          3: { halign: "center" },
          5: { halign: "center" },
        },
      }
    );
  }

  // 4) VENDOR DETAILS
  currentY = createSectionTitle(doc, currentY, "4. VENDOR DETAILS");
  const vendorRows = mapper.getVendorDeliveryRows(sessionData?.assigned_vendors || {});
  const vendorBody = vendorRows.length
    ? vendorRows.map((row) => {
        const mobile = row[5] && row[5] !== "-" ? row[5] : "";
        const time = row[3] && row[3] !== "-" ? row[3] : "";
        const val = [mobile, time].filter(Boolean).join(" / ") || "-";
        return [row[0], row[1], val, "[   ]"];
      })
    : (orderData?.vendors_assigned || []).map((vendor) => [
        mapper.safeText(vendor?.name),
        mapper.safeText(vendor?.category || vendor?.service),
        mapper.safeText(vendor?.mobile),
        "[   ]",
      ]);
  currentY = createTable(
    doc,
    currentY,
    [["Vendor Name", "Service / Ingredients", "Mobile / Time", "Received"]],
    vendorBody,
    { columnStyles: { 3: { halign: "center" } } }
  );

  // 5) GROUND MANAGEMENT ITEMS
  currentY = createSectionTitle(doc, currentY, "5. GROUND MANAGEMENT ITEMS");
  const groundBody = [];
  const groundData = sessionData?.ground_management || {};
  Object.entries(groundData).forEach(([category, items]) => {
    const itemList = Array.isArray(items) ? items : [items];
    itemList.forEach((item) => {
      groundBody.push([
        mapper.safeText(category),
        mapper.safeText(item?.name),
        mapper.safeText(item?.unit || "Nos"),
        mapper.safeText(item?.quantity || "-"),
        "[   ]",
      ]);
    });
  });
  currentY = createTable(
    doc,
    currentY,
    [["Category", "Item Name", "Unit", "Qty", "Available"]],
    groundBody,
    { columnStyles: { 2: { halign: "center" }, 3: { halign: "center" }, 4: { halign: "center" } } }
  );

  createFooter(doc, businessProfile);

  return doc;
};

// -------------------------------------------------------------
// 3) SHARE ORDER PDF
// -------------------------------------------------------------
export const generateShareOrderPDF = async (orderData, businessProfile) => {
  const doc = await initDocument();
  let currentY = 0;

  const uniqueKey = orderData?.id ? `TRZ-B${String(orderData.id).padStart(4, "0")}` : "TRZ-UNSAVED";
  currentY = createHeader(doc, "ORDER SHARED COPY", uniqueKey, businessProfile);

  // 1) CUSTOMER & EVENT DETAILS
  currentY = handlePageBreak(doc, currentY, 40);
  currentY = createSectionTitle(doc, currentY, "1. CUSTOMER & EVENT DETAILS");
  
  const totalPersons = orderData?.sessions?.reduce((acc, s) => acc + (parseInt(s.estimated_persons) || 0), 0) || 0;
  currentY = createTable(
    doc,
    currentY,
    [["Field", "Value", "Field", "Value"]],
    [
      [
        "Customer Name", mapper.safeText(orderData.name),
        "Mobile Number", mapper.safeText(orderData.mobile_no)
      ],
      [
        "Estimated Persons", totalPersons.toString(),
        "Advance Amount", `Rs. ${Number(orderData.advance_amount || 0).toFixed(2)}`
      ],
      [
        "Reference", mapper.safeText(orderData.reference),
        "", ""
      ]
    ],
    { columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 }, 2: { fontStyle: "bold", cellWidth: 35 } } }
  );

  // 2) EVENT SCHEDULE & MENU SELECTION
  const sessions = orderData.sessions?.length ? orderData.sessions : [];
  currentY = handlePageBreak(doc, currentY, 30);
  currentY = createSectionTitle(doc, currentY, "2. EVENT SCHEDULE & MENU SELECTION");

  sessions.forEach((session, sIdx) => {
    currentY = handlePageBreak(doc, currentY, 30);
    
    // Session Banner
    const pageWidth = doc.internal.pageSize.width;
    doc.setFillColor(132, 92, 189);
    doc.rect(14, currentY, pageWidth - 28, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const sessionDetails = `${session.event_date || ""} | ${session.event_time || ""} | ${session.estimated_persons || 0} Persons | Rs.${session.per_dish_amount || 0}/plate`;
    doc.text(`SESSION ${sIdx + 1}: ${sessionDetails}`, 16, currentY + 5.5);
    currentY += 10;

    if (session.event_address) {
      doc.setTextColor(132, 92, 189);
      doc.setFontSize(8);
      doc.text(`Location: ${session.event_address.trim()}`, 16, currentY + 2);
      currentY += 6;
    }

    // Menu Selection
    if (session.selected_items && Object.keys(session.selected_items).length > 0) {
      const menuRows = [];
      Object.entries(session.selected_items).forEach(([category, items]) => {
        if (!items || items.length === 0) return;
        menuRows.push([{ content: category.toUpperCase(), colSpan: 2, styles: { fillColor: [246, 240, 255], textColor: [132, 92, 189], fontStyle: 'bold' } }]);
        items.forEach((item, idx) => {
          const itemName = typeof item === "string" ? item : (item?.name || item?.dishName || "-");
          menuRows.push([`${idx + 1}.`, itemName]);
        });
      });

      currentY = createTable(
        doc,
        currentY,
        [], // No header columns
        menuRows,
        { 
          theme: 'plain',
          styles: { cellPadding: 2, fontSize: 9 },
          columnStyles: { 0: { cellWidth: 10, textColor: [150, 150, 150], fontStyle: 'bold' }, 1: { cellWidth: 'auto' } } 
        }
      );
    } else {
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "italic");
      doc.text("No specific dishes selected.", 16, currentY + 5);
      currentY += 10;
    }

    // Extra Services
    if (session.extra_service && session.extra_service.some(s => s.service_name)) {
      currentY = handlePageBreak(doc, currentY, 20);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("EXTRA SERVICES", 16, currentY + 4);
      currentY += 6;
      
      const extraRows = session.extra_service.filter(s => s.service_name).map(s => [s.service_name, `Rs. ${Number(s.amount || 0).toFixed(2)}`]);
      currentY = createTable(doc, currentY, [], extraRows, { theme: 'plain', styles: { cellPadding: 2, fontSize: 8 }, columnStyles: { 1: { fontStyle: 'bold', textColor: [132, 92, 189] } } });
    }

    // Waiter Service
    if (session.waiter_service && (session.waiter_service.entries?.length > 0 || session.waiter_service.type)) {
       currentY = handlePageBreak(doc, currentY, 20);
       doc.setTextColor(100, 100, 100);
       doc.setFont("helvetica", "bold");
       doc.setFontSize(8);
       doc.text("WAITER SERVICE", 16, currentY + 4);
       currentY += 6;

       const waiterData = session.waiter_service.entries?.length > 0 ? session.waiter_service.entries : [session.waiter_service];
       const waiterRows = waiterData.map(ws => [ws.type, `Count: ${ws.count}`, `Rate: Rs.${Number(ws.rate||0).toFixed(2)}`, `Total: Rs.${Number(ws.amount||0).toFixed(2)}`]);
       currentY = createTable(doc, currentY, [], waiterRows, { theme: 'plain', styles: { cellPadding: 2, fontSize: 8 } });
    }
  });

  // 3) ORDER NOTES
  if (orderData?.description && orderData.description !== "N") {
    currentY = handlePageBreak(doc, currentY, 30);
    currentY = createSectionTitle(doc, currentY, "3. ORDER NOTES");
    
    doc.setFillColor(255, 251, 235); // amber-50
    doc.setDrawColor(253, 230, 138); // amber-200
    doc.rect(14, currentY, doc.internal.pageSize.width - 28, 15, "FD");
    doc.setTextColor(146, 64, 14); // amber-900
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    const splitNotes = doc.splitTextToSize(orderData.description, doc.internal.pageSize.width - 32);
    doc.text(splitNotes, 16, currentY + 6);
    currentY += (splitNotes.length * 4) + 12;
  }

  createFooter(doc, businessProfile);

  return doc;
};

// -------------------------------------------------------------
// HELPER: Generate Dish Code for Quotation
// -------------------------------------------------------------
const generateDishCode = (price, sessionIndex) => {
  if (!price) return "N/A";
  const priceStr = String(Math.floor(Number(price)));
  const eventLetter = String.fromCharCode(65 + sessionIndex);
  let code = eventLetter;
  const dummies = ["1A2", "3B4", "5C6", "7D8", "9E0"];
  for (let i = 0; i < priceStr.length; i++) {
    code += priceStr[i];
    if (i < priceStr.length - 1) {
       if (priceStr.length >= 4 && i === priceStr.length - 2) {
         continue;
       }
       code += dummies[i % dummies.length];
    }
  }
  return code;
};

// -------------------------------------------------------------
// 4) QUOTATION PDF
// -------------------------------------------------------------
export const generateQuotationPDF = async (orderData, businessProfile) => {
  const doc = await initDocument();
  let currentY = 0;

  const uniqueKey = orderData?.id ? `TRZ-B${String(orderData.id).padStart(4, "0")}` : "TRZ-UNSAVED";
  currentY = createHeader(doc, "QUOTATION", uniqueKey, businessProfile);

  // 1) CUSTOMER & EVENT DETAILS
  currentY = handlePageBreak(doc, currentY, 40);
  currentY = createSectionTitle(doc, currentY, "1. CUSTOMER & EVENT DETAILS");
  
  const totalPersons = orderData?.sessions?.reduce((acc, s) => acc + (parseInt(s.estimated_persons) || 0), 0) || 0;
  currentY = createTable(
    doc,
    currentY,
    [["Field", "Value", "Field", "Value"]],
    [
      [
        "Customer Name", mapper.safeText(orderData.name),
        "Mobile Number", mapper.safeText(orderData.mobile_no)
      ],
      [
        "Estimated Persons", totalPersons.toString(),
        "Advance Amount", `Rs. ${Number(orderData.advance_amount || 0).toFixed(2)}`
      ],
      [
        "Reference", mapper.safeText(orderData.reference),
        "", ""
      ]
    ],
    { columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 }, 2: { fontStyle: "bold", cellWidth: 35 } } }
  );

  // 2) EVENT SCHEDULE & MENU SELECTION
  const sessions = orderData.sessions?.length ? orderData.sessions : [];
  currentY = handlePageBreak(doc, currentY, 30);
  currentY = createSectionTitle(doc, currentY, "2. EVENT SCHEDULE & MENU SELECTION");

  sessions.forEach((session, sIdx) => {
    currentY = handlePageBreak(doc, currentY, 30);
    
    // Session Banner
    const pageWidth = doc.internal.pageSize.width;
    doc.setFillColor(132, 92, 189);
    doc.rect(14, currentY, pageWidth - 28, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const sessionDetails = `${session.event_date || ""} | ${session.event_time || ""} | ${session.estimated_persons || 0} Persons | ID: ${generateDishCode(session.per_dish_amount, sIdx)}`;
    doc.text(`SESSION ${sIdx + 1}: ${sessionDetails}`, 16, currentY + 5.5);
    currentY += 10;

    if (session.event_address) {
      doc.setTextColor(132, 92, 189);
      doc.setFontSize(8);
      doc.text(`Location: ${session.event_address.trim()}`, 16, currentY + 2);
      currentY += 6;
    }

    // Menu Selection
    if (session.selected_items && Object.keys(session.selected_items).length > 0) {
      const menuRows = [];
      Object.entries(session.selected_items).forEach(([category, items]) => {
        if (!items || items.length === 0) return;
        menuRows.push([{ content: category.toUpperCase(), colSpan: 2, styles: { fillColor: [246, 240, 255], textColor: [132, 92, 189], fontStyle: 'bold' } }]);
        items.forEach((item, idx) => {
          const itemName = typeof item === "string" ? item : (item?.name || item?.dishName || "-");
          menuRows.push([`${idx + 1}.`, itemName]);
        });
      });

      currentY = createTable(
        doc,
        currentY,
        [], // No header columns
        menuRows,
        { 
          theme: 'plain',
          styles: { cellPadding: 2, fontSize: 9 },
          columnStyles: { 0: { cellWidth: 10, textColor: [150, 150, 150], fontStyle: 'bold' }, 1: { cellWidth: 'auto' } } 
        }
      );
    } else {
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "italic");
      doc.text("No specific dishes selected.", 16, currentY + 5);
      currentY += 10;
    }

    // Extra Services
    if (session.extra_service && session.extra_service.some(s => s.service_name)) {
      currentY = handlePageBreak(doc, currentY, 20);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("EXTRA SERVICES", 16, currentY + 4);
      currentY += 6;
      
      const extraRows = session.extra_service.filter(s => s.service_name).map(s => [s.service_name, `Rs. ${Number(s.amount || 0).toFixed(2)}`]);
      currentY = createTable(doc, currentY, [], extraRows, { theme: 'plain', styles: { cellPadding: 2, fontSize: 8 }, columnStyles: { 1: { fontStyle: 'bold', textColor: [132, 92, 189] } } });
    }

    // Waiter Service
    if (session.waiter_service && (session.waiter_service.entries?.length > 0 || session.waiter_service.type)) {
       currentY = handlePageBreak(doc, currentY, 20);
       doc.setTextColor(100, 100, 100);
       doc.setFont("helvetica", "bold");
       doc.setFontSize(8);
       doc.text("WAITER SERVICE", 16, currentY + 4);
       currentY += 6;

       const waiterData = session.waiter_service.entries?.length > 0 ? session.waiter_service.entries : [session.waiter_service];
       const waiterRows = waiterData.map(ws => [ws.type, `Count: ${ws.count}`, `Rate: Rs.${Number(ws.rate||0).toFixed(2)}`, `Total: Rs.${Number(ws.amount||0).toFixed(2)}`]);
       currentY = createTable(doc, currentY, [], waiterRows, { theme: 'plain', styles: { cellPadding: 2, fontSize: 8 } });
    }
  });

  // 3) ORDER NOTES
  if (orderData?.description && orderData.description !== "N") {
    currentY = handlePageBreak(doc, currentY, 30);
    currentY = createSectionTitle(doc, currentY, "3. ORDER NOTES");
    
    doc.setFillColor(255, 251, 235); // amber-50
    doc.setDrawColor(253, 230, 138); // amber-200
    doc.rect(14, currentY, doc.internal.pageSize.width - 28, 15, "FD");
    doc.setTextColor(146, 64, 14); // amber-900
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    const splitNotes = doc.splitTextToSize(orderData.description, doc.internal.pageSize.width - 32);
    doc.text(splitNotes, 16, currentY + 6);
    currentY += (splitNotes.length * 4) + 12;
  }

  // 4) TERMS & CONDITIONS
  if (orderData?.rule === true) {
    currentY = handlePageBreak(doc, currentY, 40);
    currentY = createSectionTitle(doc, currentY, "4. TERMS & CONDITIONS");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    const rules = [
      "1. To confirm booking, booking amount shown in final amount box must be deposited either in cash or to company's account. This amount is strictly non-refundable.",
      "2. 80% of final order value is payable 7 days prior to date of program.",
      "3. The remaining amount should be done on the same day as program.",
      "4. Final count of persons is to be finalized 7 days prior to the function date. If the number exceeds by 5%, it should be informed. Uninformed excess plates will be charged double the per plate rate.",
      "5. Children aged 5+ are charged as adults.",
      "6. Client must acquire necessary municipality/police permissions for ground events.",
      "7. Only food handling is part of this contract, not other event-related delays or issues."
    ];
    rules.forEach(rule => {
      const splitRule = doc.splitTextToSize(rule, doc.internal.pageSize.width - 30);
      doc.text(splitRule, 15, currentY);
      currentY += (splitRule.length * 4) + 2;
    });
  }

  createFooter(doc, businessProfile);

  return doc;
};

// -------------------------------------------------------------
// SKELETON: INVOICE PDF
// -------------------------------------------------------------
export const generateInvoicePDF = async (data, businessProfile) => {
  const doc = await initDocument();
  let currentY = 0;
  
  currentY = createHeader(doc, "TAX INVOICE", `Invoice #${data.id || "INV-000"}`, businessProfile);

  currentY = handlePageBreak(doc, currentY, 20);
  currentY = createSectionTitle(doc, currentY, "INVOICE DETAILS");
  currentY = createTable(doc, currentY, [["Field", "Value"]], [["Date", new Date().toLocaleDateString()]]);

  createFooter(doc, businessProfile);
  return doc;
};

// -------------------------------------------------------------
// SKELETON: INGREDIENT PDF
// -------------------------------------------------------------
export const generateIngredientPDF = async (data, businessProfile) => {
  const doc = await initDocument();
  let currentY = 0;
  
  currentY = createHeader(doc, "INGREDIENT REPORT", `Report #${data.id || "000"}`, businessProfile);

  currentY = handlePageBreak(doc, currentY, 20);
  currentY = createSectionTitle(doc, currentY, "INGREDIENTS LIST");
  currentY = createTable(doc, currentY, [["Name", "Category", "Quantity", "Vendor"]], [["Sample", "Sample", "Sample", "Sample"]]);

  createFooter(doc, businessProfile);
  return doc;
};

// -------------------------------------------------------------
// HELPER: SHARE TO WHATSAPP
// -------------------------------------------------------------
export const shareWhatsAppPDF = async (doc, fileName, mobileNo = "", prefilledText = "", toast = null) => {
  const toastId = toast?.loading ? toast.loading("Preparing PDF for WhatsApp...") : null;
  
  try {
    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], fileName, { type: "application/pdf" });
    
    // Auto-download first so they have it locally when Whatsapp Web opens
    doc.save(fileName);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let cleanNumber = mobileNo.toString().replace(/\D/g, "");
    if (cleanNumber.startsWith("00")) cleanNumber = cleanNumber.slice(2);
    if (cleanNumber.length === 11 && cleanNumber.startsWith("0")) cleanNumber = `91${cleanNumber.slice(1)}`;
    else if (cleanNumber.length === 10) cleanNumber = `91${cleanNumber}`;

    const params = new URLSearchParams();
    if (cleanNumber) params.set("phone", cleanNumber);
    if (prefilledText) params.set("text", prefilledText);
    params.set("type", "phone_number");
    params.set("app_absent", "0");

    const whatsappUrl = cleanNumber
      ? `${isMobile ? "https://api.whatsapp.com/send" : "https://web.whatsapp.com/send"}?${params.toString()}`
      : `https://wa.me/${prefilledText ? `?text=${encodeURIComponent(prefilledText)}` : ""}`;

    if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
      if (toast?.success && toastId) toast.success("PDF Downloaded. Opening share...", { id: toastId });
      try {
        await navigator.share({
          title: fileName,
          text: "Please find the document attached.",
          files: [file],
        });
      } catch (err) {
        if (err.name !== "AbortError") window.open(whatsappUrl, "_blank");
      }
    } else {
      if (toast?.success && toastId) toast.success("PDF Downloaded. Opening WhatsApp...", { id: toastId });
      window.open(whatsappUrl, "_blank");
    }
  } catch (err) {
    console.error("WhatsApp share failed:", err);
    if (toast?.error && toastId) toast.error("Failed to share PDF.", { id: toastId });
  }
};
