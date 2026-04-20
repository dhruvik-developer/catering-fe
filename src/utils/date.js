// src/utils/date.js

/**
 * Parse date string in dd-mm-yyyy or yyyy-mm-dd format
 * @param {string} str - Date string
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (str) => {
  if (!str) return null;
  const ddmmyyyy = str.match(/^(\d{1,2})[-\\/](\d{1,2})[-\\/](\d{4})$/);
  if (ddmmyyyy)
    return new Date(
      Number(ddmmyyyy[3]),
      Number(ddmmyyyy[2]) - 1,
      Number(ddmmyyyy[1])
    );
  const yyyymmdd = str.match(/^(\d{4})[-\\/](\d{1,2})[-\\/](\d{1,2})/);
  if (yyyymmdd)
    return new Date(
      Number(yyyymmdd[1]),
      Number(yyyymmdd[2]) - 1,
      Number(yyyymmdd[3])
    );
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Format date to dd-mm-yyyy
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatToDDMMYYYY = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Format date to yyyy-mm-dd
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatToYYYYMMDD = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in dd-mm-yyyy format
 * @returns {string} Today's date
 */
export const getTodayDDMMYYYY = () => {
  return formatToDDMMYYYY(new Date());
};

/**
 * Get today's date in yyyy-mm-dd format
 * @returns {string} Today's date
 */
export const getTodayYYYYMMDD = () => {
  return formatToYYYYMMDD(new Date());
};