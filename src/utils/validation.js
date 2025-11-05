/**
 * Validate invoice form data
 * @param {Object} data - Invoice data to validate
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export function validateInvoiceData(data) {
  const errors = {};

  // Required fields
  if (!data.invoiceNumber || data.invoiceNumber.trim() === '') {
    errors.invoiceNumber = 'Invoice number is required';
  }

  if (!data.companyName || data.companyName.trim() === '') {
    errors.companyName = 'Company name is required';
  }

  if (!data.customerName || data.customerName.trim() === '') {
    errors.customerName = 'Customer name is required';
  }

  if (!data.amountNumber || data.amountNumber.trim() === '') {
    errors.amountNumber = 'Amount is required';
  } else {
    // Validate amount is a valid number
    const cleanAmount = data.amountNumber.replace(/[.,\s]/g, '');
    if (isNaN(cleanAmount) || parseInt(cleanAmount, 10) <= 0) {
      errors.amountNumber = 'Amount must be a valid positive number';
    }
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = 'Description/purpose is required';
  }

  if (!data.date || data.date.trim() === '') {
    errors.date = 'Date is required';
  }

  if (!data.location || data.location.trim() === '') {
    errors.location = 'Location is required';
  }

  if (!data.signerTitle || data.signerTitle.trim() === '') {
    errors.signerTitle = 'Signer title is required';
  }

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}

/**
 * Get error message for a field
 * @param {Object} errors - Errors object
 * @param {string} fieldName - Field name
 * @returns {string|null} - Error message or null
 */
export function getFieldError(errors, fieldName) {
  return errors[fieldName] || null;
}

/**
 * Check if a field has an error
 * @param {Object} errors - Errors object
 * @param {string} fieldName - Field name
 * @returns {boolean} - True if field has error
 */
export function hasFieldError(errors, fieldName) {
  return !!errors[fieldName];
}
