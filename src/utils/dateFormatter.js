/**
 * Format date to Indonesian format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date in Indonesian (e.g., "15 Mei 2023")
 */
export function formatDateID(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Format date to various formats
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @param {string} format - Format type: 'id', 'us', 'iso', 'eu'
 * @returns {string} - Formatted date
 */
export function formatDate(dateString, format = 'id') {
  if (!dateString) return '';
  
  const date = new Date(dateString + 'T00:00:00');
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  switch (format) {
    case 'id':
      return formatDateID(dateString);
    case 'us':
      return `${month}/${day}/${year}`; // MM/DD/YYYY
    case 'iso':
      return `${year}-${month}-${day}`; // YYYY-MM-DD
    case 'eu':
      return `${day}/${month}/${year}`; // DD/MM/YYYY
    default:
      return formatDateID(dateString);
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} - Today's date
 */
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert formatted date string back to YYYY-MM-DD
 * @param {string} formattedDate - Formatted date string
 * @returns {string} - Date in YYYY-MM-DD format
 */
export function parseFormattedDate(formattedDate) {
  if (!formattedDate) return '';
  
  // Try to parse Indonesian format "15 Mei 2023"
  const months = {
    'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
    'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
    'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
  };
  
  const parts = formattedDate.trim().split(' ');
  if (parts.length === 3 && months[parts[1]]) {
    const day = String(parts[0]).padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  // If already in ISO format or can't parse, return as is
  return formattedDate;
}
