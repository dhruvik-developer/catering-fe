import autoTable from "jspdf-autotable";
import { THEME } from "./sectionRenderer";
import { applyUnicodeFontToAutoTableCell } from "./unicodePdfFont";

/**
 * Generates a standard data table mapped cleanly to autoTable.
 * ensures styling matches the standard ERP theme.
 *
 * @param {jsPDF} doc - jsPDF instance
 * @param {number} startY - Starting Y position
 * @param {Array} head - Table headers e.g. [["Name", "Qty", "Category"]]
 * @param {Array} body - Table rows e.g. [["Apple", "5", "Fruit"]]
 * @param {Object} options - Additional specific autoTable configuration (like column alignments)
 * @returns {number} New Y position after drawing table
 */
export const createTable = (doc, startY, head, body, options = {}) => {
  const tableMargin = options.margin || { left: 14, right: 14 };

  const finalBody = body && body.length > 0 ? body : [["No data available"]];

  // If there's only a "no data" row, span it across all columns to look neat
  if (finalBody.length === 1 && finalBody[0][0] === "No data available") {
    const colCount = head[0] ? head[0].length : 1;
    finalBody[0] = [
      {
        content: "No data available",
        colSpan: colCount,
        styles: { halign: "center", fontStyle: "italic", textColor: [150, 150, 150] },
      },
      // Pad remaining empty slots to satisfy strict array lengths if needed (usually handled by jspdf)
      ...Array(colCount - 1).fill(""),
    ];
  }

  autoTable(doc, {
    startY,
    head,
    body: finalBody,
    theme: "grid",
    margin: tableMargin,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: THEME.bodyText,
      lineColor: THEME.bodyBorder,
      lineWidth: 0.1,
      ...options.styles,
    },
    headStyles: {
      fillColor: THEME.headFill,
      textColor: THEME.primaryText,
      fontStyle: "bold",
      lineWidth: 0.1,
      ...options.headStyles,
    },
    alternateRowStyles: {
      fillColor: THEME.altFill,
    },
    columnStyles: options.columnStyles || {},
    didParseCell: (cellData) => {
      applyUnicodeFontToAutoTableCell(cellData);
      if (typeof options.didParseCell === "function") {
        options.didParseCell(cellData);
      }
    },
  });

  return doc.lastAutoTable.finalY + 4; // Add a small buffer after the table
};
