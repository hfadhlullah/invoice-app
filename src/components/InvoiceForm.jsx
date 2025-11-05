import { useState } from 'react';
import { numberToWordsID, formatNumber, unformatNumber } from '../utils/numberToWords';
import { getTodayDate } from '../utils/dateFormatter';
import { generateNextInvoiceNumber } from '../utils/invoiceNumber';
import { validateInvoiceData, hasFieldError, getFieldError } from '../utils/validation';

function InvoiceForm({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
    
    // Validate on change if field was touched
    if (touched[name]) {
      const validation = validateInvoiceData(updatedData);
      setErrors(validation.errors);
    }
  };

  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
    const validation = validateInvoiceData(formData);
    setErrors(validation.errors);
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    // Format the number with dots
    const formatted = formatNumber(value);
    const updatedData = { 
      ...formData, 
      amountNumber: formatted,
      // Auto-convert to words with currency
      amountWords: formatted ? numberToWordsID(unformatNumber(formatted), formData.currency) : ''
    };
    setFormData(updatedData);
    onUpdate(updatedData);
    
    // Validate on change if field was touched
    if (touched.amountNumber) {
      const validation = validateInvoiceData(updatedData);
      setErrors(validation.errors);
    }
  };

  const handleConvertToWords = () => {
    if (formData.amountNumber) {
      const words = numberToWordsID(unformatNumber(formData.amountNumber), formData.currency);
      const updatedData = { ...formData, amountWords: words };
      setFormData(updatedData);
      onUpdate(updatedData);
    }
  };

  const handleCurrencyChange = (e) => {
    const { value } = e.target;
    const updatedData = { ...formData, currency: value };
    
    // Auto-update the amount words with new currency if amount exists
    if (formData.amountNumber) {
      updatedData.amountWords = numberToWordsID(unformatNumber(formData.amountNumber), value);
    }
    
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleGenerateInvoiceNumber = () => {
    const nextNumber = generateNextInvoiceNumber(formData.invoiceNumber);
    const updatedData = { ...formData, invoiceNumber: nextNumber };
    setFormData(updatedData);
    onUpdate(updatedData);
    
    // Clear error for invoice number
    if (errors.invoiceNumber) {
      const newErrors = { ...errors };
      delete newErrors.invoiceNumber;
      setErrors(newErrors);
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...formData, [field]: reader.result };
        setFormData(updatedData);
        onUpdate(updatedData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="space-y-6">
      {/* Company Information */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Company Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={() => handleBlur('companyName')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                touched.companyName && hasFieldError(errors, 'companyName') 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {touched.companyName && getFieldError(errors, 'companyName') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'companyName')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company License
            </label>
            <input
              type="text"
              name="companyLicense"
              value={formData.companyLicense}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Tagline
            </label>
            <input
              type="text"
              name="companyTagline"
              value={formData.companyTagline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Address
            </label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Logo & Certificate Upload */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Images</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'logoUrl')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.logoUrl && (
              <img src={formData.logoUrl} alt="Logo preview" className="mt-2 w-24 h-24 object-contain border rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate/Certification
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'certUrl')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.certUrl && (
              <img src={formData.certUrl} alt="Certificate preview" className="mt-2 w-24 h-24 object-contain border rounded" />
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                onBlur={() => handleBlur('invoiceNumber')}
                placeholder="e.g., INV-001"
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  touched.invoiceNumber && hasFieldError(errors, 'invoiceNumber') 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={handleGenerateInvoiceNumber}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition whitespace-nowrap text-sm"
                title="Generate next invoice number"
              >
                Generate
              </button>
            </div>
            {touched.invoiceNumber && getFieldError(errors, 'invoiceNumber') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'invoiceNumber')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              onBlur={() => handleBlur('customerName')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                touched.customerName && hasFieldError(errors, 'customerName') 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {touched.customerName && getFieldError(errors, 'customerName') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'customerName')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={() => handleBlur('date')}
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  touched.date && hasFieldError(errors, 'date') 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  const today = getTodayDate();
                  const updatedData = { ...formData, date: today };
                  setFormData(updatedData);
                  onUpdate(updatedData);
                  // Clear error
                  if (errors.date) {
                    const newErrors = { ...errors };
                    delete newErrors.date;
                    setErrors(newErrors);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition whitespace-nowrap text-sm"
                title="Set to today"
              >
                Today
              </button>
            </div>
            {touched.date && getFieldError(errors, 'date') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'date')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              name="dateFormat"
              value={formData.dateFormat || 'id'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="id">Indonesian (15 Mei 2023)</option>
              <option value="us">US Format (05/15/2023)</option>
              <option value="eu">EU Format (15/05/2023)</option>
              <option value="iso">ISO Format (2023-05-15)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={() => handleBlur('location')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                touched.location && hasFieldError(errors, 'location') 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {touched.location && getFieldError(errors, 'location') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'location')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleCurrencyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Rp">Rp (Rupiah)</option>
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="amountNumber"
              value={formData.amountNumber}
              onChange={handleAmountChange}
              onBlur={() => handleBlur('amountNumber')}
              placeholder="e.g., 14.900.000"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                touched.amountNumber && hasFieldError(errors, 'amountNumber') 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {touched.amountNumber && getFieldError(errors, 'amountNumber') ? (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'amountNumber')}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Numbers will be auto-formatted and converted to words</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Words)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="amountWords"
                value={formData.amountWords}
                onChange={handleChange}
                placeholder="e.g., Empat Belas Juta Sembilan Ratus Ribu Rupiah"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleConvertToWords}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
                title="Convert number to words"
              >
                🔄 Convert
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description/Purpose <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                touched.description && hasFieldError(errors, 'description') 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {touched.description && getFieldError(errors, 'description') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'description')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signer Name
            </label>
            <input
              type="text"
              name="signerName"
              value={formData.signerName}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signer Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="signerTitle"
              value={formData.signerTitle}
              onChange={handleChange}
              onBlur={() => handleBlur('signerTitle')}
              placeholder="e.g., Manager Keuangan"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                touched.signerTitle && hasFieldError(errors, 'signerTitle') 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {touched.signerTitle && getFieldError(errors, 'signerTitle') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError(errors, 'signerTitle')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Instructions</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Instructions
          </label>
          <textarea
            name="paymentInstructions"
            value={formData.paymentInstructions}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </form>
  );
}

export default InvoiceForm;
