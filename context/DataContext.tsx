import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, Client, Supplier, Quote, Invoice, Payment, DeliveryNote, Transaction, Log, 
  QuoteStatus, DeliveryStatus, InvoiceStatus, StockMovement, MovementType, UserRole
} from '../types';
import { 
  MOCK_PRODUCTS, MOCK_CLIENTS, MOCK_SUPPLIERS, MOCK_QUOTES, 
  MOCK_DELIVERIES, MOCK_TRANSACTIONS, MOCK_LOGS 
} from '../constants';
import { useAuth } from './AuthContext';

interface DataContextType {
  products: Product[];
  stockMovements: StockMovement[];
  clients: Client[];
  suppliers: Supplier[];
  quotes: Quote[];
  invoices: Invoice[];
  payments: Payment[];
  deliveries: DeliveryNote[];
  transactions: Transaction[];
  logs: Log[];
  
  // Advanced Actions
  addProduct: (product: Omit<Product, 'id' | 'reserved'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void; // Added missing type
  
  // Stock Actions
  adjustStock: (productId: string, quantity: number, type: MovementType, reason: string) => void;
  
  addQuote: (quote: Omit<Quote, 'id' | 'status' | 'reference' | 'validUntil'>) => void;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
  
  createInvoiceFromQuote: (quoteId: string) => void;
  addPayment: (invoiceId: string, amount: number, method: string) => void;
  
  addDelivery: (delivery: Omit<DeliveryNote, 'id' | 'status' | 'reference'>) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`techstock_v2_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Enhanced State
  const [products, setProducts] = useState<Product[]>(() => loadState('products', MOCK_PRODUCTS.map(p => ({...p, reserved: 0}))));
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => loadState('movements', []));
  const [clients, setClients] = useState<Client[]>(() => loadState('clients', MOCK_CLIENTS.map(c => ({...c, totalSpent: 0, creditBalance: 0}))));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadState('suppliers', MOCK_SUPPLIERS));
  
  const [quotes, setQuotes] = useState<Quote[]>(() => loadState('quotes', MOCK_QUOTES));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadState('invoices', []));
  const [payments, setPayments] = useState<Payment[]>(() => loadState('payments', []));
  
  const [deliveries, setDeliveries] = useState<DeliveryNote[]>(() => loadState('deliveries', MOCK_DELIVERIES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', MOCK_TRANSACTIONS));
  const [logs, setLogs] = useState<Log[]>(() => loadState('logs', MOCK_LOGS));

  // Persistence
  useEffect(() => localStorage.setItem('techstock_v2_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('techstock_v2_movements', JSON.stringify(stockMovements)), [stockMovements]);
  useEffect(() => localStorage.setItem('techstock_v2_quotes', JSON.stringify(quotes)), [quotes]);
  useEffect(() => localStorage.setItem('techstock_v2_invoices', JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem('techstock_v2_payments', JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem('techstock_v2_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('techstock_v2_logs', JSON.stringify(logs)), [logs]);

  // --- Audit Logger ---
  const addLog = (action: string, module: string, details: string) => {
    const newLog: Log = {
      id: `l${Date.now()}`,
      user: user?.name || 'System',
      role: user?.role || 'SYSTEM',
      action,
      module,
      details,
      timestamp: new Date().toLocaleString('fr-FR'),
      ip: '127.0.0.1' // Simulated
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // --- Stock Logic ---
  const addProduct = (data: Omit<Product, 'id' | 'reserved'>) => {
    const newProduct = { ...data, id: `p${Date.now()}`, reserved: 0 };
    setProducts(prev => [newProduct, ...prev]);
    
    // Initial Stock Movement
    if (data.stock > 0) {
      recordMovement(newProduct.id, newProduct.name, MovementType.IN, data.stock, 'Stock Initial');
    }
    addLog('Création Produit', 'Stock', `Ajout: ${newProduct.name}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Implemented deleteProduct to fix the error
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addLog('Suppression Produit', 'Stock', `Produit ${id} supprimé`);
  };

  const recordMovement = (productId: string, productName: string, type: MovementType, qty: number, ref?: string) => {
    const movement: StockMovement = {
      id: `mv${Date.now()}`,
      productId,
      productName,
      type,
      quantity: qty,
      reference: ref,
      date: new Date().toISOString(),
      user: user?.name || 'System'
    };
    setStockMovements(prev => [movement, ...prev]);
  };

  const adjustStock = (productId: string, quantity: number, type: MovementType, reason: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update physical stock
    const newStock = type === MovementType.IN ? product.stock + quantity : product.stock - quantity;
    
    updateProduct(productId, { stock: Math.max(0, newStock) });
    recordMovement(productId, product.name, type, quantity, reason);
    addLog('Ajustement Stock', 'Stock', `${type} de ${quantity} pour ${product.name}. Raison: ${reason}`);
  };

  // --- Sales & Quote Logic ---
  const addQuote = (data: Omit<Quote, 'id' | 'status' | 'reference' | 'validUntil'>) => {
    const id = `q${Date.now()}`;
    const count = quotes.length + 1;
    const reference = `DEV-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    
    const newQuote: Quote = {
      ...data,
      id,
      reference,
      status: QuoteStatus.DRAFT,
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 15 days validity
    };
    setQuotes(prev => [newQuote, ...prev]);
    addLog('Nouveau Devis', 'Ventes', `Devis ${reference} créé`);
  };

  const updateQuoteStatus = (id: string, status: QuoteStatus) => {
    const quote = quotes.find(q => q.id === id);
    if (!quote) return;

    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));

    // Stock Reservation Logic
    if (status === QuoteStatus.ACCEPTED && quote.status !== QuoteStatus.ACCEPTED) {
      // Reserve stock
      quote.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateProduct(product.id, { reserved: product.reserved + item.quantity });
          recordMovement(product.id, product.name, MovementType.RESERVE, item.quantity, quote.reference);
        }
      });
      addLog('Devis Accepté', 'Ventes', `Stock réservé pour ${quote.reference}`);
    }
  };

  // --- Finance & Invoicing Logic ---
  const createInvoiceFromQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    // 1. Create Invoice
    const invoiceRef = `FAC-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(4, '0')}`;
    const newInvoice: Invoice = {
      id: `inv${Date.now()}`,
      reference: invoiceRef,
      quoteId: quote.id,
      clientId: quote.clientId,
      clientName: quote.clientName,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: InvoiceStatus.UNPAID,
      items: quote.items,
      subTotal: quote.subTotal,
      taxAmount: quote.taxAmount,
      total: quote.total,
      paidAmount: 0
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // 2. Update Quote Status
    updateQuoteStatus(quoteId, QuoteStatus.INVOICED);

    // 3. Create Delivery Note (BL) Automatically
    const client = clients.find(c => c.id === quote.clientId);
    const blRef = `BL-${Date.now().toString().substr(-6)}`;
    const newBL: DeliveryNote = {
        id: `bl${Date.now()}`,
        reference: blRef,
        quoteReference: quote.reference,
        clientName: quote.clientName,
        date: new Date().toISOString().split('T')[0],
        status: DeliveryStatus.PENDING,
        address: client?.address || 'Adresse inconnue',
        itemsCount: quote.items.reduce((acc, i) => acc + i.quantity, 0)
    };
    setDeliveries(prev => [newBL, ...prev]);

    addLog('Facturation', 'Finance', `Facture ${invoiceRef} et BL ${blRef} générés depuis ${quote.reference}`);
  };

  const addPayment = (invoiceId: string, amount: number, method: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    const newPaidAmount = invoice.paidAmount + amount;
    let newStatus = invoice.status;
    
    if (newPaidAmount >= invoice.total) newStatus = InvoiceStatus.PAID;
    else if (newPaidAmount > 0) newStatus = InvoiceStatus.PARTIAL;

    // Update Invoice
    setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, paidAmount: newPaidAmount, status: newStatus } : i));

    // Record Payment
    const payment: Payment = {
      id: `pay${Date.now()}`,
      invoiceId,
      amount,
      date: new Date().toISOString(),
      method: method as any,
      user: user?.name || 'System'
    };
    setPayments(prev => [payment, ...prev]);

    // Add Transaction
    const transaction: Transaction = {
      id: `t${Date.now()}`,
      date: new Date().toISOString(),
      type: 'IN',
      category: 'VENTE',
      amount,
      method,
      description: `Règlement Facture ${invoice.reference} (${newStatus})`,
      reference: payment.id,
      user: user?.name || 'System'
    };
    setTransactions(prev => [transaction, ...prev]);

    // Update Client Stats
    setClients(prev => prev.map(c => 
      c.id === invoice.clientId 
        ? { ...c, totalSpent: c.totalSpent + amount } 
        : c
    ));

    addLog('Paiement', 'Finance', `Reçu ${amount} MAD pour ${invoice.reference}`);
  };

  // --- Delivery Logic ---
  const addDelivery = (data: Omit<DeliveryNote, 'id' | 'status' | 'reference'>) => {
    const ref = `BL-${Date.now().toString().substr(-6)}`;
    const newBL: DeliveryNote = { ...data, id: `bl${Date.now()}`, reference: ref, status: DeliveryStatus.PENDING };
    setDeliveries(prev => [newBL, ...prev]);
    addLog('Expédition', 'Logistique', `BL ${ref} créé`);
  };

  const updateDeliveryStatus = (id: string, status: DeliveryStatus) => {
    const delivery = deliveries.find(d => d.id === id);
    if (!delivery) return;

    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status } : d));

    if (status === DeliveryStatus.DELIVERED && delivery.status !== DeliveryStatus.DELIVERED) {
      if (delivery.quoteReference) {
        const quote = quotes.find(q => q.reference === delivery.quoteReference);
        if (quote) {
            quote.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    // Reduce physical stock AND reserved stock
                    const newStock = Math.max(0, product.stock - item.quantity);
                    const newReserved = Math.max(0, product.reserved - item.quantity);
                    
                    updateProduct(product.id, { stock: newStock, reserved: newReserved });
                    recordMovement(product.id, product.name, MovementType.OUT, item.quantity, `Livraison ${delivery.reference}`);
                }
            });
        }
      }
      addLog('Livraison', 'Logistique', `BL ${delivery.reference} livré. Stock déduit.`);
    }
  };

  return (
    <DataContext.Provider value={{
      products, stockMovements, clients, suppliers, quotes, invoices, payments, deliveries, transactions, logs,
      addProduct, updateProduct, deleteProduct, adjustStock,
      addQuote, updateQuoteStatus,
      createInvoiceFromQuote, addPayment,
      addDelivery, updateDeliveryStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};