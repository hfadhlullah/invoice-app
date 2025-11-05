// src/components/FirebaseDebug.jsx
import { useState } from 'react';
import { useFirebaseInvoices } from '../hooks/useFirebaseInvoices';

const FirebaseDebug = () => {
  const { invoices, loading, error } = useFirebaseInvoices();
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        >
          🔍 Debug Firebase
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">🔥 Firebase Data Debug</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading Firebase data...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-blue-800 font-semibold mb-2">📊 Summary</h3>
                <p className="text-blue-700">
                  <strong>Total Invoices:</strong> {invoices.length}
                </p>
                <p className="text-blue-700">
                  <strong>Collection:</strong> invoices
                </p>
                <p className="text-blue-700">
                  <strong>Project ID:</strong> invoice-app-cnt
                </p>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">No invoices found in Firebase</p>
                  <p className="text-sm">Create an invoice to see data here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    📋 All Invoices ({invoices.length})
                  </h3>
                  
                  {invoices.map((invoice, index) => (
                    <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">
                          {invoice.invoiceNumber || `Invoice #${index + 1}`}
                        </h4>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ID: {invoice.id}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <strong>Customer:</strong> {invoice.customerName || 'N/A'}
                        </div>
                        <div>
                          <strong>Amount:</strong> {invoice.currency} {invoice.amountNumber || 'N/A'}
                        </div>
                        <div>
                          <strong>Description:</strong> {invoice.description || 'N/A'}
                        </div>
                        <div>
                          <strong>Date:</strong> {invoice.date || 'N/A'}
                        </div>
                        <div>
                          <strong>Company:</strong> {invoice.companyName || 'N/A'}
                        </div>
                        <div>
                          <strong>Location:</strong> {invoice.location || 'N/A'}
                        </div>
                      </div>

                      {/* Raw Data Toggle */}
                      <details className="mt-3">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Raw Data
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                          {JSON.stringify(invoice, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            💡 Tip: You can also view this data in the{' '}
            <a 
              href="https://console.firebase.google.com/project/invoice-app-cnt/firestore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Firebase Console
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDebug;