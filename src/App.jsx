import { useState, useEffect } from 'react';
import InvoiceFormModern from './components/InvoiceFormModern';
import InvoicePreview from './components/InvoicePreview';
import InvoiceList from './components/InvoiceList';
import { validateInvoiceData } from './utils/validation';
import { getLastInvoiceNumber, getAllInvoices } from './utils/invoiceStorage';
import { InvoiceService } from './firebase/invoiceService';
import { generateNextInvoiceNumber } from './utils/invoiceNumber';
import './App.css';

function App() {
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // Use regular useState instead of useLocalStorage to avoid re-renders on every keystroke
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    companyName: '',
    companyLicense: '',
    companyTagline: '',
    companyAddress: '',
    customerName: '',
    amountWords: '',
    amountNumber: '',
    currency: 'Rp',
    description: '',
    date: '',
    dateFormat: 'id',
    location: '',
    signerName: '',
    signerTitle: '',
    paymentInstructions: '',
    logoUrl: '',
    certUrl: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const { errors } = validateInvoiceData(invoiceData);
    setValidationErrors(errors);
  }, [invoiceData]);

  // Handle save invoice
  const handleSaveInvoice = async () => {
    setSaveStatus('saving');
    try {
      if (currentInvoiceId) {
        // Update existing invoice in Firebase
        await InvoiceService.updateInvoice(currentInvoiceId, invoiceData);
      } else {
        // Create new invoice in Firebase
        const newInvoice = await InvoiceService.createInvoice(invoiceData);
        setCurrentInvoiceId(newInvoice.id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving invoice to Firebase:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Handle load invoice
  const handleSelectInvoice = (invoice) => {
    setCurrentInvoiceId(invoice.id);
    setInvoiceData(invoice);
    setShowInvoiceList(false);
  };

  // Handle new invoice
  const handleNewInvoice = async () => {
    setCurrentInvoiceId(null);
    
    try {
      // Get existing invoices from Firebase to generate next number
      const allInvoices = await InvoiceService.getAllInvoices();
      const allNumbers = allInvoices.map(inv => inv.invoiceNumber).filter(Boolean);
      const lastNumber = allNumbers.length > 0 ? allNumbers[0] : null; // Since Firebase orders by createdAt desc
      
      setInvoiceData({
        invoiceNumber: lastNumber ? generateNextInvoiceNumber(lastNumber, allNumbers) : 'INV-001',
        companyName: '',
        companyLicense: '',
        companyTagline: '',
        companyAddress: '',
        customerName: '',
        amountWords: '',
        amountNumber: '',
        currency: 'Rp',
        description: '',
        date: '',
        dateFormat: 'id',
        location: '',
        signerName: '',
        signerTitle: '',
        paymentInstructions: '',
        logoUrl: '',
        certUrl: ''
      });
    } catch (error) {
      console.error('Error getting invoices from Firebase:', error);
      // Fallback to local logic
      const lastNumber = getLastInvoiceNumber();
      const allInvoices = getAllInvoices();
      const allNumbers = allInvoices.map(inv => inv.invoiceNumber).filter(Boolean);
      
      setInvoiceData({
        invoiceNumber: lastNumber ? generateNextInvoiceNumber(lastNumber, allNumbers) : 'INV-001',
        companyName: '',
        companyLicense: '',
        companyTagline: '',
        companyAddress: '',
        customerName: '',
        amountWords: '',
        amountNumber: '',
        currency: 'Rp',
        description: '',
        date: '',
        dateFormat: 'id',
        location: '',
        signerName: '',
        signerTitle: '',
        paymentInstructions: '',
        logoUrl: '',
        certUrl: ''
      });
    }
    
    setShowInvoiceList(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Invoice Generator</h1>
              <p className="text-sm text-gray-500 text-left">
                Invoice: <span className="font-medium text-gray-700">{invoiceData.invoiceNumber || null}</span>
                {currentInvoiceId && <span className="ml-2 text-xs text-blue-600">(Saved)</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Saved Invoices Button */}
            <button
              onClick={() => setShowInvoiceList(!showInvoiceList)}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Invoices
            </button>

            {/* Save Button */}
            <button
              onClick={handleSaveInvoice}
              disabled={Object.keys(validationErrors).length > 0 || saveStatus === 'saving'}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {currentInvoiceId ? 'Update' : 'Save'}
                </>
              )}
            </button>

            {/* New Invoice Button */}
            {currentInvoiceId && (
              <button
                onClick={handleNewInvoice}
                className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            )}
            
            {/* Auto-save Status */}
            <div className="flex items-center gap-2 text-sm">
              {Object.keys(validationErrors).length === 0 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600 font-medium">Ready</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-yellow-600 font-medium">Incomplete</span>
                </>
              )}
            </div>
            
            {/* Print Button */}
            <button 
              onClick={() => window.print()}
              disabled={Object.keys(validationErrors).length > 0}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
            {/* Main Content */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-full">
          {/* Invoice List Sidebar (Collapsible) */}
          {showInvoiceList && (
            <div className="lg:col-span-1 h-full overflow-hidden rounded-xl shadow-lg border border-gray-200">
              <InvoiceList
                onSelectInvoice={handleSelectInvoice}
                onNewInvoice={handleNewInvoice}
                currentInvoiceId={currentInvoiceId}
              />
            </div>
          )}

          {/* Left Column - Form */}
          <div className={`${showInvoiceList ? 'lg:col-span-2' : 'lg:col-span-2'} h-full overflow-y-auto custom-scrollbar`}>
            <InvoiceFormModern
              key={currentInvoiceId || 'new'}
              invoiceData={invoiceData}
              onChange={setInvoiceData}
              validationErrors={validationErrors}
            />
          </div>

          {/* Right Column - Preview */}
          <div className={`${showInvoiceList ? 'lg:col-span-3' : 'lg:col-span-4'} h-full`}>
            <div className="sticky top-0 h-full bg-gray-100 rounded-xl shadow-2xl p-8 overflow-y-auto custom-scrollbar min-h-[800px]">
              <InvoicePreview invoiceData={invoiceData} />
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media print {
          /* Hide app header completely */
          header {
            display: none !important;
          }
          
          /* Reset body and main */
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          main {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            height: auto !important;
          }
          
          /* Hide form column */
          .lg\\:col-span-2 {
            display: none !important;
          }
          
          /* Show preview column full width */
          .lg\\:col-span-3 {
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            padding: 0 !important;
          }
          
          /* Remove wrapper styling */
          .lg\\:col-span-3 > div,
          .lg\\:col-span-3 > div > div {
            position: static !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            min-height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Make invoice content visible */
          .lg\\:col-span-3 .bg-gray-100 > div {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Ensure invoice content is visible */
          .invoice-page {
            width: 100% !important;
            max-width: 100% !important;
            padding: 12mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
        
        @page {
          size: A4;
          margin: 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

    </div>
  );
}

export default App;
