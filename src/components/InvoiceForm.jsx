import { useState, useEffect } from 'react';
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
  // Only the first section (invoice) should be open when the form first mounts
  const [expandedSections, setExpandedSections] = useState({
    company: false,
    invoice: true,
    amount: false,
    additional: false
  });

  // When a different invoice is opened (invoiceNumber changes), reset sections so
  // only the first section is expanded. This keeps behavior consistent when
  // switching between invoices or opening the app.
  useEffect(() => {
    setExpandedSections({ company: false, invoice: true, amount: false, additional: false });
  }, [invoiceData?.invoiceNumber]);

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
{/* Invoice Details */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 16h6M9 8h6M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Invoice Details</span>
          </div>
        }
        section="invoice"
        toggleSection={toggleSection}
        expanded={expandedSections.invoice}
      >
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
              className="mt-[30px] px-4 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg transition-all shadow-sm hover:shadow font-medium inline-flex items-center gap-2"
              title="Generate next invoice number"
              aria-label="Generate next invoice number"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a9 9 0 101-17" />
              </svg>
              <span>Next</span>
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
                  className={`flex-1 px-3 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-slate-500 text-base ${
                  touched.date && hasFieldError(validationErrors, 'date')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={handleTodayClick}
                className="px-2 sm:px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all text-xs sm:text-sm font-medium inline-flex items-center gap-2"
                title="Set to today"
                aria-label="Set date to today"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Today</span>
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
              <option value="id">Indonesian</option>
              <option value="us">US Format</option>
              <option value="eu">EU Format</option>
              <option value="iso">ISO Format</option>
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

      {/* Company Branding */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M9 21V9a2 2 0 012-2h2a2 2 0 012 2v12" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6M9 11h6" />
            </svg>
            <span>Company Information</span>
          </div>
        }
        section="company"
        toggleSection={toggleSection}
        expanded={expandedSections.company}
      >
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
              {invoiceData?.logoUrl ? (
                <div className="w-full h-20 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden relative bg-white">
                  <img src={invoiceData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2 bg-white" />
                  <div className="absolute inset-0 flex items-start justify-end p-2">
                    <div className="flex gap-2 pointer-events-auto">
                      <label htmlFor="logo-upload" className="inline-flex items-center gap-2 px-2 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800 cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                        </svg>
                        Replace
                      </label>
                      <button
                        type="button"
                        onClick={() => onChange({ ...invoiceData, logoUrl: '' })}
                        className="inline-flex items-center gap-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        aria-label="Remove logo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-20 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
                >
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 7V4m8 3V4M16 11l-4-4-4 4M8 21h8" />
                  </svg>
                  <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
                </label>
              )}
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
              {invoiceData?.certUrl ? (
                <div className="w-full h-20 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden relative bg-white">
                  <img src={invoiceData.certUrl} alt="Certificate" className="w-full h-full object-contain p-2 bg-white" />
                  <div className="absolute inset-0 flex items-start justify-end p-2">
                    <div className="flex gap-2">
                      <label htmlFor="cert-upload" className="inline-flex items-center gap-2 px-2 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800 cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                        </svg>
                        Replace
                      </label>
                      <button
                        type="button"
                        onClick={() => onChange({ ...invoiceData, certUrl: '' })}
                        className="inline-flex items-center gap-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        aria-label="Remove certificate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="cert-upload"
                  className="flex flex-col items-center justify-center w-full h-20 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
                >
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 7h10v6a4 4 0 01-4 4H9a4 4 0 01-4-4V7z" />
                  </svg>
                  <span className="text-xs text-gray-500 mt-1">Upload Cert</span>
                </label>
              )}
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

      {/* Amount & Payment */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v10" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
            </svg>
            <span>Amount & Payment</span>
          </div>
        }
        section="amount"
        toggleSection={toggleSection}
        expanded={expandedSections.amount}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Currency <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="currency"
              value={invoiceData?.currency || 'Rp'}
              onChange={handleCurrencyChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-500 transition-all text-base"
            >
                <option value="Rp">Rp (Rupiah)</option>
                <option value="IDR">IDR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
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
                className={`w-full px-3 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-slate-500 font-mono text-lg ${
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
        <div className="bg-gradient-to-br text-center from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200">
          <label className="text-xs font-medium text-slate-900 gap-2">
            <span>Amount in Words (Auto-generated)</span>
          </label>
          <p className="text-sm text-slate-800 font-medium italic">
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
      <Card
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l4 4m0 0l-4 4m4-4H8" />
            </svg>
            <span>Signature & Instructions</span>
          </div>
        }
        section="additional"
        toggleSection={toggleSection}
        expanded={expandedSections.additional}
      >
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
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none text-base"
          />
        </div>
      </Card>
    </div>
  );
}

export default InvoiceFormModern;
