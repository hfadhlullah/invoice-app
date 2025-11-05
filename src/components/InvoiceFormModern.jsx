import { useState } from 'react';
import { numberToWordsID, formatNumber, unformatNumber } from '../utils/numberToWords';
import { getTodayDate } from '../utils/dateFormatter';
import { generateNextInvoiceNumber } from '../utils/invoiceNumber';
import { hasFieldError, getFieldError } from '../utils/validation';

// Move InputField outside to prevent recreation on every render
const InputField = ({ label, name, type = 'text', placeholder, required, touched, validationErrors, invoiceData, handleChange, handleBlur, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={invoiceData?.[name] || ''}
      onChange={handleChange}
      onBlur={() => handleBlur(name)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
        touched[name] && hasFieldError(validationErrors, name)
          ? 'border-red-300 bg-red-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      {...props}
    />
    {touched[name] && getFieldError(validationErrors, name) && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <span>⚠</span> {getFieldError(validationErrors, name)}
      </p>
    )}
  </div>
);

// Move Card outside to prevent recreation
const Card = ({ title, children, section, toggleSection, expanded }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <button
      onClick={() => toggleSection(section)}
      className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
    >
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
        {title}
      </h2>
      <svg
        className={`w-5 h-5 text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {expanded && (
      <div className="p-4 sm:p-6 space-y-4 animate-fadeIn">
        {children}
      </div>
    )}
  </div>
);

function InvoiceFormModern({ invoiceData, onChange, validationErrors }) {
  const [touched, setTouched] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    company: true,
    invoice: true,
    amount: true,
    additional: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...invoiceData, [name]: value });
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    const formatted = formatNumber(value);
    onChange({
      ...invoiceData,
      amountNumber: formatted,
      amountWords: formatted ? numberToWordsID(unformatNumber(formatted), invoiceData.currency || 'Rp') : ''
    });
  };

  const handleCurrencyChange = (e) => {
    const { value } = e.target;
    onChange({
      ...invoiceData,
      currency: value,
      amountWords: invoiceData.amountNumber ? numberToWordsID(unformatNumber(invoiceData.amountNumber), value) : ''
    });
  };

  const handleGenerateInvoiceNumber = () => {
    const nextNumber = generateNextInvoiceNumber(invoiceData.invoiceNumber);
    onChange({ ...invoiceData, invoiceNumber: nextNumber });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...invoiceData, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTodayClick = () => {
    const today = getTodayDate();
    onChange({ ...invoiceData, date: today });
  };

  return (
    <div className="space-y-4">
      {/* Company Branding */}
      <Card title="🏢 Company Information" section="company" toggleSection={toggleSection} expanded={expandedSections.company}>
        <InputField 
          label="Company Name" 
          name="companyName" 
          required 
          placeholder="Your Company Name"
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Logo Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Company Logo</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logoUrl')}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-full h-20 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                {invoiceData?.logoUrl ? (
                  <img src={invoiceData.logoUrl} alt="Logo" className="h-full object-contain p-2" />
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl">📷</span>
                    <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Certificate Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Certificate</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'certUrl')}
                className="hidden"
                id="cert-upload"
              />
              <label
                htmlFor="cert-upload"
                className="flex flex-col items-center justify-center w-full h-20 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                {invoiceData?.certUrl ? (
                  <img src={invoiceData.certUrl} alt="Certificate" className="h-full object-contain p-2" />
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl">🏆</span>
                    <span className="text-xs text-gray-500 mt-1">Upload Cert</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <InputField 
          label="Tagline" 
          name="companyTagline" 
          placeholder="Your company tagline or slogan"
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />

        <InputField 
          label="License / Registration" 
          name="companyLicense" 
          placeholder="Business license or registration number"
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />

        <InputField 
          label="Address" 
          name="companyAddress" 
          placeholder="Full business address"
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </Card>

      {/* Invoice Details */}
      <Card title="📋 Invoice Details" section="invoice" toggleSection={toggleSection} expanded={expandedSections.invoice}>
        <div className="flex gap-2">
          <div className="flex-1">
            <InputField 
              label="Invoice Number" 
              name="invoiceNumber" 
              required 
              placeholder="INV-001"
              touched={touched}
              validationErrors={validationErrors}
              invoiceData={invoiceData}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </div>
          <button
            onClick={handleGenerateInvoiceNumber}
            className="mt-[30px] px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all shadow-sm hover:shadow font-medium"
            title="Generate next invoice number"
          >
            🔄 Next
          </button>
        </div>

        <InputField 
          label="Customer Name" 
          name="customerName" 
          required 
          placeholder="Customer or client name"
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Date <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                name="date"
                value={invoiceData?.date || ''}
                onChange={handleChange}
                onBlur={() => handleBlur('date')}
                className={`flex-1 px-3 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 text-base ${
                  touched.date && hasFieldError(validationErrors, 'date')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={handleTodayClick}
                className="px-2 sm:px-3 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all text-xs sm:text-sm font-medium"
                title="Set to today"
              >
                <span className="hidden sm:inline">Today</span>
                <span className="sm:hidden">📅</span>
              </button>
            </div>
            {touched.date && getFieldError(validationErrors, 'date') && (
              <p className="text-xs text-red-600 mt-1">⚠ {getFieldError(validationErrors, 'date')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Date Format</label>
            <select
              name="dateFormat"
              value={invoiceData?.dateFormat || 'id'}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all text-base"
            >
              <option value="id">🇮🇩 Indonesian</option>
              <option value="us">🇺🇸 US Format</option>
              <option value="eu">🇪🇺 EU Format</option>
              <option value="iso">📅 ISO Format</option>
            </select>
          </div>
        </div>

        <InputField 
          label="Location" 
          name="location" 
          required 
          placeholder="City or location"
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </Card>

      {/* Amount & Payment */}
      <Card title="💰 Amount & Payment" section="amount" toggleSection={toggleSection} expanded={expandedSections.amount}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Currency <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="currency"
              value={invoiceData?.currency || 'Rp'}
              onChange={handleCurrencyChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all text-base"
            >
              <option value="Rp">🇮🇩 Rp (Rupiah)</option>
              <option value="IDR">🇮🇩 IDR</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="GBP">🇬🇧 GBP</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Amount <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="amountNumber"
              value={invoiceData?.amountNumber || ''}
              onChange={handleAmountChange}
              onBlur={() => handleBlur('amountNumber')}
              placeholder="14.900.000"
              className={`w-full px-3 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 font-mono text-lg ${
                touched.amountNumber && hasFieldError(validationErrors, 'amountNumber')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
            {touched.amountNumber && getFieldError(validationErrors, 'amountNumber') && (
              <p className="text-xs text-red-600 mt-1">⚠ {getFieldError(validationErrors, 'amountNumber')}</p>
            )}
          </div>
        </div>

        {/* Auto-generated amount in words */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <label className="block text-xs font-medium text-blue-900 mb-2">
            ✨ Amount in Words (Auto-generated)
          </label>
          <p className="text-sm text-blue-800 font-medium italic">
            {invoiceData?.amountWords || 'Enter an amount to see it in words...'}
          </p>
        </div>

        <InputField 
          label="Description / Purpose" 
          name="description" 
          required 
          placeholder="Payment for services, products, etc."
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </Card>

      {/* Footer & Signature */}
      <Card title="✍️ Signature & Instructions" section="additional" toggleSection={toggleSection} expanded={expandedSections.additional}>
        <InputField 
          label="Signer Name" 
          name="signerName" 
          placeholder="Person signing the invoice"
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />

        <InputField 
          label="Signer Title / Position" 
          name="signerTitle" 
          required 
          placeholder="Manager Keuangan, CEO, etc."
          touched={touched}
          validationErrors={validationErrors}
          invoiceData={invoiceData}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Payment Instructions</label>
          <textarea
            name="paymentInstructions"
            value={invoiceData?.paymentInstructions || ''}
            onChange={handleChange}
            rows="3"
            placeholder="Bank transfer details, payment terms, etc."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-base"
          />
        </div>
      </Card>
    </div>
  );
}

export default InvoiceFormModern;
