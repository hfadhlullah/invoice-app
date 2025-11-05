// src/hooks/useFirebaseInvoices.js
import { useState, useEffect } from 'react';
import { InvoiceService } from '../firebase/invoiceService.js';

export const useFirebaseInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load invoices from Firebase
  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedInvoices = await InvoiceService.getAllInvoices();
      setInvoices(fetchedInvoices);
    } catch (err) {
      setError(err.message);
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new invoice
  const createInvoice = async (invoiceData) => {
    try {
      setError(null);
      const newInvoice = await InvoiceService.createInvoice(invoiceData);
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update an existing invoice
  const updateInvoice = async (id, invoiceData) => {
    try {
      setError(null);
      const updatedInvoice = await InvoiceService.updateInvoice(id, invoiceData);
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === id ? updatedInvoice : invoice
        )
      );
      return updatedInvoice;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete an invoice
  const deleteInvoice = async (id) => {
    try {
      setError(null);
      await InvoiceService.deleteInvoice(id);
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Search invoices
  const searchInvoices = async (searchTerm) => {
    try {
      setError(null);
      if (!searchTerm.trim()) {
        await loadInvoices();
        return;
      }
      
      const searchResults = await InvoiceService.searchInvoices(searchTerm);
      setInvoices(searchResults);
    } catch (err) {
      setError(err.message);
      console.error('Error searching invoices:', err);
    }
  };

  // Load invoices on component mount
  useEffect(() => {
    loadInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    loadInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices
  };
};