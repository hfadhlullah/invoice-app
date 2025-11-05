/**
 * Generate next invoice number based on the last invoice number
 * @param {string} lastInvoiceNumber - Last invoice number (e.g., "INV-001")
 * @returns {string} - Next invoice number
 */
export function generateNextInvoiceNumber(lastInvoiceNumber) {
  if (!lastInvoiceNumber) {
    return 'INV-001';
  }

  // Try to extract prefix and number
  const match = lastInvoiceNumber.match(/^(.+?)[-_]?(\d+)$/);
  
  if (match) {
    const prefix = match[1];
    const number = parseInt(match[2], 10);
    const separator = lastInvoiceNumber.includes('-') ? '-' : lastInvoiceNumber.includes('_') ? '_' : '';
    const paddingLength = match[2].length;
    
    const nextNumber = (number + 1).toString().padStart(paddingLength, '0');
    return `${prefix}${separator}${nextNumber}`;
  }
  
  // If no pattern found, just append -002
  return `${lastInvoiceNumber}-002`;
}

/**
 * Generate invoice number with custom prefix and number
 * @param {string} prefix - Invoice prefix (e.g., "INV", "INVOICE")
 * @param {number} number - Invoice number
 * @param {number} padding - Number of digits with zero padding
 * @returns {string} - Generated invoice number
 */
export function generateInvoiceNumber(prefix = 'INV', number = 1, padding = 3) {
  const paddedNumber = number.toString().padStart(padding, '0');
  return `${prefix}-${paddedNumber}`;
}

/**
 * Get the last saved invoice number from localStorage
 * @returns {string} - Last invoice number or default
 */
export function getLastInvoiceNumber() {
  try {
    const lastNumber = localStorage.getItem('lastInvoiceNumber');
    return lastNumber || 'INV-001';
  } catch (error) {
    console.error('Error reading last invoice number:', error);
    return 'INV-001';
  }
}

/**
 * Save the last invoice number to localStorage
 * @param {string} invoiceNumber - Invoice number to save
 */
export function saveLastInvoiceNumber(invoiceNumber) {
  try {
    localStorage.setItem('lastInvoiceNumber', invoiceNumber);
  } catch (error) {
    console.error('Error saving last invoice number:', error);
  }
}
