// Example: How to integrate Firebase with your existing InvoiceList component

// Before (using local storage)
import { useLocalStorage } from '../hooks/useLocalStorage';

// After (using Firebase)
import { useFirebaseInvoices } from '../hooks/useFirebaseInvoices';

// In your component:
export function InvoiceList() {
  // Replace this:
  // const [invoices, setInvoices] = useLocalStorage('invoices', []);
  
  // With this:
  const { 
    invoices, 
    loading, 
    error, 
    createInvoice, 
    updateInvoice, 
    deleteInvoice 
  } = useFirebaseInvoices();

  if (loading) return <div>Loading invoices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {invoices.map(invoice => (
        <div key={invoice.id}>
          {/* Your invoice item UI */}
        </div>
      ))}
    </div>
  );
}