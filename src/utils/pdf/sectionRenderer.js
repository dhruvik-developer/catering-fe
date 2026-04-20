export const THEME = {
  primaryColor: [132, 92, 189],      // #845CBD - Banner
  sectionColor: [111, 71, 184],      // #6F47B8 - Sub headers
  headFill: [246, 240, 255],         // THEME.primarySoft
  altFill: [250, 247, 255],          // THEME.bodyAlt
  primaryText: [91, 52, 168],        // THEME.primaryText
  bodyText: [36, 27, 53],            // THEME.bodyText
  bodyBorder: [233, 223, 251],       // THEME.bodyBorder
  white: [255, 255, 255],
};

/**
 * Handle page breaks dynamically.
 * Adds a new page if the required space exceeds the remaining page height.
 *
 * @param {jsPDF} doc - jsPDF instance
 * @param {number} currentY - Current Y position
 * @param {number} requiredSpace - Minimum space needed
 * @returns {number} New Y position
 */
export const handlePageBreak = (doc, currentY, requiredSpace = 25) => {
  const pageHeight = doc.internal.pageSize.height;
  if (currentY > pageHeight - requiredSpace) {
    doc.addPage();
    return 14; // Return default top margin Y
  }
  return currentY;
};

/**
 * Creates the standard document header used across all PDFs.
 *
 * @param {jsPDF} doc - jsPDF instance
 * @param {string} title - Main document title (right-aligned)
 * @param {string} subtitle - Secondary identifier like Booking # (right-aligned)
 * @param {object} businessProfile - Top left company info
 * @returns {number} New Y position
 */
export const createHeader = (doc, title, subtitle, businessProfile) => {
  const pageWidth = doc.internal.pageSize.width;

  doc.setFillColor(...THEME.primaryColor);
  doc.rect(0, 0, pageWidth, 22, "F");

  // Left Content - Company Name & Address
  doc.setTextColor(...THEME.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(businessProfile?.caters_name || "radha SWEET & CATERERS", 14, 10);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const address = businessProfile?.godown_address || "";
  const phone = businessProfile?.phone_number ? `  |  ${businessProfile.phone_number}` : "";
  doc.text(address + phone, 14, 15);

  // Right Content - Document Title
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), pageWidth - 14, 10, { align: "right" });
  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, pageWidth - 14, 15, { align: "right" });
  }

  return 22; // Ending Y coordinate
};

/**
 * Creates a standard section title highlight block.
 *
 * @param {jsPDF} doc - jsPDF instance
 * @param {number} startY - Top Y coordinate
 * @param {string} text - Title text
 * @returns {number} New Y position
 */
export const createSectionTitle = (doc, startY, text) => {
  const pageWidth = doc.internal.pageSize.width;
  let currentY = handlePageBreak(doc, startY, 15);

  doc.setFillColor(...THEME.sectionColor);
  doc.rect(14, currentY, pageWidth - 28, 6, "F");

  doc.setTextColor(...THEME.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(text, 16, currentY + 4.2);

  // Reset text color for subsequent content
  doc.setTextColor(...THEME.bodyText);
  return currentY + 7;
};

/**
 * Creates standard document footer.
 * 
 * @param {jsPDF} doc - jsPDF instance
 * @param {object} businessProfile - Business info for thanks message
 */
export const createFooter = (doc, businessProfile) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  doc.setFillColor(...THEME.primaryColor);
  doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
  doc.setTextColor(...THEME.white);
  doc.setFontSize(8);
  doc.text(
    `Thank you for choosing ${businessProfile?.caters_name || "radha Sweet & Caterers"}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );
  doc.setFontSize(7);
  doc.text("Generated with precision and care", pageWidth / 2, pageHeight - 4, { align: "center" });
};
