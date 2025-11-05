// Invoice storage management utility
const STORAGE_KEY = 'invoices_list';

// Get all invoices
export const getAllInvoices = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading invoices:', error);
    return [];
  }
};

// Get single invoice by ID
export const getInvoiceById = (id) => {
  const invoices = getAllInvoices();
  return invoices.find(inv => inv.id === id);
};

// Save new invoice
export const saveInvoice = (invoiceData) => {
  const invoices = getAllInvoices();
  const newInvoice = {
    id: Date.now().toString(),
    ...invoiceData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  invoices.push(newInvoice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  return newInvoice;
};

// Update existing invoice
export const updateInvoice = (id, invoiceData) => {
  const invoices = getAllInvoices();
  const index = invoices.findIndex(inv => inv.id === id);
  if (index !== -1) {
    invoices[index] = {
      ...invoices[index],
      ...invoiceData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return invoices[index];
  }
  return null;
};

// Delete invoice
export const deleteInvoice = (id) => {
  const invoices = getAllInvoices();
  const filtered = invoices.filter(inv => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

// Get last invoice number to generate next one
export const getLastInvoiceNumber = () => {
  const invoices = getAllInvoices();
  if (invoices.length === 0) return null;
  
  // Sort by invoice number or creation date
  const sorted = [...invoices].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  return sorted[0]?.invoiceNumber || null;
};

// Search invoices
export const searchInvoices = (query) => {
  const invoices = getAllInvoices();
  const searchTerm = query.toLowerCase();
  return invoices.filter(inv => 
    inv.invoiceNumber?.toLowerCase().includes(searchTerm) ||
    inv.invoiceTo?.toLowerCase().includes(searchTerm) ||
    inv.description?.toLowerCase().includes(searchTerm)
  );
};

// Export invoice data as JSON
export const exportInvoiceData = (invoice) => {
  const dataStr = JSON.stringify(invoice, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${invoice.invoiceNumber || invoice.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import invoice data from JSON
export const importInvoiceData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
