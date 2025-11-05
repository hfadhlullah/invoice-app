import { useState } from 'react';
import { useFirebaseInvoices } from '../hooks/useFirebaseInvoices';
import { formatNumber } from '../utils/numberToWords';

export default function InvoiceList({ onSelectInvoice, onNewInvoice, currentInvoiceId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Use Firebase hook instead of local state
  const { 
    invoices, 
    loading, 
    error, 
    deleteInvoice: deleteFirebaseInvoice, 
    searchInvoices: searchFirebaseInvoices,
    loadInvoices 
  } = useFirebaseInvoices();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchFirebaseInvoices(query);
    } else {
      await loadInvoices();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFirebaseInvoice(id);
      setShowDeleteConfirm(null);
      if (currentInvoiceId === id) {
        onNewInvoice();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Saved Invoices</h2>
            {/* Close button for mobile overlay */}
            <button
              onClick={() => window.dispatchEvent(new Event('closeInvoiceList'))}
              className="xl:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={onNewInvoice}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-auto"
          >
            + New Invoice
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      {/* Invoice List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-center">Loading invoices from Firebase...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 p-8">
            <svg className="w-16 h-16 mb-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-center">Error loading invoices</p>
            <p className="text-sm text-center mt-2">{error}</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-center">
              {searchQuery ? 'No invoices found' : 'No saved invoices yet'}
            </p>
            {!searchQuery && (
              <p className="text-sm text-center mt-2">
                Create your first invoice to get started
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  currentInvoiceId === invoice.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
                onClick={() => onSelectInvoice(invoice)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {invoice.invoiceNumber || 'No Number'}
                      </h3>
                      {currentInvoiceId === invoice.id && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded self-start">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 truncate mb-1">
                      {invoice.invoiceTo || 'No recipient'}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500">
                      <span className="font-medium text-gray-900">
                        {invoice.currency} {formatNumber(invoice.amount || 0)}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{formatDate(invoice.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(invoice.id);
                    }}
                    className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === invoice.id && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg" onClick={(e) => e.stopPropagation()}>
                    <p className="text-sm text-red-800 mb-2">Delete this invoice?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(invoice.id);
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(null);
                        }}
                        className="px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {invoices.length > 0 && (
        <div className="p-2 sm:p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      )}
    </div>
  );
}
