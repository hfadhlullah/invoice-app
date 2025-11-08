import { useState, useEffect } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import InvoiceList from './components/InvoiceList';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import { validateInvoiceData } from './utils/validation';
import { getLastInvoiceNumber, getAllInvoices } from './utils/invoiceStorage';
import { InvoiceService } from './firebase/invoiceService';
import { AuthService } from './firebase/authService';
import { generateNextInvoiceNumber } from './utils/invoiceNumber';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [printModalOpen, setPrintModalOpen] = useState(false);
  
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

  // Auth state listener
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const { errors } = validateInvoiceData(invoiceData);
    setValidationErrors(errors);
  }, [invoiceData]);

  // Add event listener for mobile close button
  useEffect(() => {
    const handleCloseInvoiceList = () => {
      setShowInvoiceList(false);
      setShowPreview(true);
    };
    
    window.addEventListener('closeInvoiceList', handleCloseInvoiceList);
    return () => window.removeEventListener('closeInvoiceList', handleCloseInvoiceList);
  }, []);

  // Close print modal on Escape
  useEffect(() => {
    if (!printModalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setPrintModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [printModalOpen]);

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
    setShowPreview(true);
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
    setShowPreview(true);
  };

  // Handle logout
  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header
        onToggleInvoices={() => {
          if (!showInvoiceList) {
            setShowInvoiceList(true);
            setShowPreview(false);
          } else {
            setShowInvoiceList(false);
            setShowPreview(true);
          }
        }}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main Content - Split View */}
            {/* Main Content */}
  <main className="flex-1 max-w-[1920px] mx-auto w-full p-3 sm:p-6 pb-20 lg:pb-0">
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-3 sm:gap-6 h-full">
          {/* Invoice List Sidebar (Collapsible) - Mobile overlay */}
          {showInvoiceList && (
              <div className={`
              ${showInvoiceList ? 'xl:col-span-2' : ''} 
              h-full overflow-hidden rounded-xl shadow-lg border border-gray-200
              xl:relative fixed inset-0 xl:inset-auto z-50 xl:z-auto
              bg-white xl:bg-transparent print:hidden
            `}>
              {/* Mobile overlay background */}
              <div className="xl:hidden absolute inset-0 bg-black bg-opacity-50" onClick={() => { setShowInvoiceList(false); setShowPreview(true); }}></div>
              
              {/* Invoice list content */}
              <div className="relative h-full w-96 xl:w-full bg-white xl:bg-transparent rounded-xl xl:rounded-none">
                <InvoiceList
                  onSelectInvoice={handleSelectInvoice}
                  onNewInvoice={handleNewInvoice}
                  currentInvoiceId={currentInvoiceId}
                />
              </div>
            </div>
          )}

          {/* Form and Preview Layout */}
          <div className={`${showInvoiceList ? 'xl:col-span-4' : 'xl:col-span-6'} grid grid-cols-1 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-3 sm:gap-6`}>
            {/* Left Column - Form */}
            <div className="h-full overflow-y-auto custom-scrollbar order-2 lg:order-1">
              <InvoiceForm
                key={currentInvoiceId || 'new'}
                invoiceData={invoiceData}
                onChange={setInvoiceData}
                validationErrors={validationErrors}
              />
            </div>
            
            {/* Right Column - Preview */}
            {showPreview && (
              <>
                <div className="order-1 lg:order-2 hidden lg:block print:block">
                  {/* Action toolbar positioned on top of the preview (outside InvoicePreview) */}
                  <div className="top-3 right-3 z-20 print:hidden flex items-center justify-end gap-2 pb-4">
                    <button
                      onClick={handleSaveInvoice}
                      disabled={Object.keys(validationErrors).length > 0 || saveStatus === 'saving'}
                      className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                    >
                      {saveStatus === 'saving' ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : saveStatus === 'saved' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                      )}
                      <span className="ml-1 hidden sm:inline">{currentInvoiceId ? 'Update' : 'Save'}</span>
                    </button>

                    {currentInvoiceId && (
                      <button
                        onClick={handleNewInvoice}
                        className="px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 text-sm"
                      >
                        New
                      </button>
                    )}

                    <button
                      onClick={() => setPrintModalOpen(true)}
                      disabled={Object.keys(validationErrors).length > 0}
                      className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm"
                    >
                      Print
                    </button>
                  </div>

                  <div className="sticky top-4 bg-slate-100 rounded-xl shadow-2xl p-3 sm:p-8 overflow-y-auto custom-scrollbar max-h-screen">
                    <InvoicePreview invoiceData={invoiceData} />
                  </div>
                </div>

                {/* Mobile floating bottom action bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 print:hidden bg-white/80 backdrop-blur-sm border-t border-slate-200 px-3 py-2">
                  <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <button
                      onClick={handleSaveInvoice}
                      disabled={Object.keys(validationErrors).length > 0 || saveStatus === 'saving'}
                      className="flex-1 mx-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                      aria-label="Save invoice"
                    >
                      {saveStatus === 'saving' ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : saveStatus === 'saved' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                      )}
                      <span className="ml-2 text-sm">{currentInvoiceId ? 'Update' : 'Save'}</span>
                    </button>

                    <div className="mx-1">
                      {currentInvoiceId && (
                        <button
                          onClick={handleNewInvoice}
                          className="px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 text-sm"
                          aria-label="New invoice"
                        >
                          New
                        </button>
                      )}
                    </div>

                    <div className="mx-1">
                      <button
                        onClick={() => setPrintModalOpen(true)}
                        disabled={Object.keys(validationErrors).length > 0}
                        className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm"
                        aria-label="Print invoice"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Print confirmation modal (hidden in print via .no-print) */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            <h2 className="text-lg font-semibold mb-2">Print invoice</h2>
            <p className="text-sm text-gray-700 mb-4">If you are on mobile, please rotate your phone to landscape before printing for best results. Then tap "Print" below.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-3 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => { setPrintModalOpen(false); setTimeout(() => window.print(), 60); }}
                className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}

export default App;
