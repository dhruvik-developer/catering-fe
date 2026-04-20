/**
 * Sanitize strings for valid, readable filenames.
 * - Removes special characters
 * - Trims and replaces spaces with underscores
 * - "Dharmesh Bhai" -> "DharmeshBhai"
 * - "Late Night Nasto" -> "Late_Night_Nasto"
 */
export function sanitizeFilenamePart(part, removeSpaces = false) {
  if (!part) return "";
  let sanitized = part
    .toString()
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, ""); // Keep only alphanumeric + spaces
  if (removeSpaces) {
    sanitized = sanitized.replace(/\s+/g, ""); // "Dharmesh Bhai" -> "DharmeshBhai"
  } else {
    sanitized = sanitized.replace(/\s+/g, "_"); // "Late Night Nasto" -> "Late_Night_Nasto"
  }
  return sanitized;
}

/**
 * Generates a consistent, formatted filename for PDF exports based on order data.
 *
 * @param {Object} params
 * @param {string} params.customerName - Customer name (e.g. "Dharmesh Bhai")
 * @param {string} [params.sessionName] - Optional session name (e.g. "Late Night Nasto")
 * @param {string} params.type - The document type: "quotation", "ingredient", "dish-tag", "order", "invoice", "bill"
 * @param {string|number} [params.number] - Reference number (Quotation ID, Bill No, etc)
 * @param {string} [params.date] - Formatted date (DD-MM-YYYY)
 * @returns {string} The formatted filename with .pdf extension
 */
export function generatePdfFilename({
  customerName,
  sessionName,
  type,
  number,
  date,
}) {
  const parts = [];

  // 1. Customer Name
  const sanitizedCustomer = sanitizeFilenamePart(customerName, true); // remove spaces
  if (sanitizedCustomer) parts.push(sanitizedCustomer);

  // 2. Session Name (if applicable)
  const sanitizedSession = sanitizeFilenamePart(sessionName, false); // replace spaces with _
  if (sanitizedSession) parts.push(sanitizedSession);

  // 3. Document Type & Number
  switch (type) {
    case "quotation":
      parts.push(`Quotation${number ? `-${number}` : ""}`);
      break;
    case "ingredient":
      parts.push("Ingredient-List");
      break;
    case "full-ingredient":
      parts.push("Full-Ingredient-List");
      break;
    case "dish-tag":
      parts.push("Dish-Tags");
      break;
    case "order":
      parts.push(`Order${number ? `-${number}` : ""}`);
      break;
    case "invoice":
      parts.push(`Invoice${number ? `-${number}` : ""}`);
      break;
    case "bill":
      parts.push(`Bill${number ? `-${number}` : ""}`);
      break;
    default:
      parts.push("Document");
  }

  // 4. Date
  if (date) parts.push(date);

  // Join with dashes and append extension
  return `${parts.join("-")}.pdf`;
}
