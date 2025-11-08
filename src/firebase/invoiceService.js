// src/firebase/invoiceService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from './config.js';

const COLLECTION_NAME = 'invoices';

export class InvoiceService {
  
  // Create a new invoice
  static async createInvoice(invoiceData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...invoiceData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...invoiceData };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Get all invoices
  static async getAllInvoices() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  // Get invoice by ID
  static async getInvoiceById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Invoice not found');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  // Update invoice
  static async updateInvoice(id, invoiceData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...invoiceData,
        updatedAt: new Date()
      });
      return { id, ...invoiceData };
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  // Delete invoice
  static async deleteInvoice(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Search invoices
  static async searchInvoices(searchTerm) {
    try {
      const term = (searchTerm || '').trim().toLowerCase();
      if (!term) return [];

      // For substring matching on names (e.g., searching "oe" in "John Doe") Firestore
      // doesn't support arbitrary contains queries. For small datasets we fetch all
      // invoices and filter client-side. This keeps matching flexible (substring,
      // case-insensitive) and also supports prefix matching for invoice numbers.
      const allInvoices = await this.getAllInvoices();

      const filtered = allInvoices.filter(inv => {
        const invoiceNumber = (inv.invoiceNumber || '').toString().toLowerCase();
        if (invoiceNumber.startsWith(term)) return true; // prefix match for numbers

        const nameFields = [inv.customerName, inv.clientName, inv.invoiceTo]
          .filter(Boolean)
          .map(s => s.toString().toLowerCase());

        return nameFields.some(name => name.includes(term)); // substring match
      });

      return filtered;
    } catch (error) {
      console.error('Error searching invoices:', error);
      throw error;
    }
  }
}