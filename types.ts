export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER', // Responsable
  CASHIER = 'CASHIER',
  ACCOUNTANT = 'ACCOUNTANT'
}

export type Permission = 'manage_users' | 'view_finance' | 'manage_stock' | 'create_sales' | 'approve_quotes';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
}

export enum ProductStatus {
  AVAILABLE = 'Disponible',
  LOW_STOCK = 'Stock Faible',
  OUT_OF_STOCK = 'Rupture'
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  buyPrice: number;
  sellPrice: number;
  tva: number;
  stock: number;        // Physical stock in warehouse
  reserved: number;     // Stock committed to accepted quotes
  minStock: number;
  location: string;
}

export enum MovementType {
  IN = 'Entrée',
  OUT = 'Sortie',
  RESERVE = 'Réservation',
  ADJUSTMENT = 'Ajustement',
  RETURN = 'Retour'
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reference?: string; // Link to Invoice or BL ID
  date: string;
  user: string;
}

export enum QuoteStatus {
  DRAFT = 'Brouillon',
  SENT = 'Envoyé',
  ACCEPTED = 'Accepté', // Triggers reservation
  REJECTED = 'Refusé',
  INVOICED = 'Facturé'
}

export enum InvoiceStatus {
  UNPAID = 'Impayé',
  PARTIAL = 'Partiel',
  PAID = 'Payé',
  OVERDUE = 'En retard'
}

export enum DeliveryStatus {
  PENDING = 'En attente',
  IN_TRANSIT = 'En transit',
  DELIVERED = 'Livré',
  CANCELLED = 'Annulé'
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  ice?: string;
  email: string;
  phone: string;
  address?: string;
  type: 'Particulier' | 'Professionnel';
  totalSpent: number;
  creditBalance: number; // Allow negative balance (credit)
}

export interface Supplier {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  ice?: string;
  address?: string;
  category: string;
}

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  date: string;
  validUntil: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subTotal: number;
  taxAmount: number;
  total: number;
  notes?: string;
}

export interface Invoice {
  id: string;
  reference: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  items: QuoteItem[];
  subTotal: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  clientId?: string;
  amount: number;
  date: string;
  method: 'Espèces' | 'Carte' | 'Virement' | 'Chèque';
  reference?: string; // Check number or transaction ID
  user: string;
}

export interface DeliveryNote {
  id: string;
  reference: string;
  quoteReference?: string;
  clientName: string;
  date: string;
  status: DeliveryStatus;
  address: string;
  driver?: string;
  itemsCount: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  category: 'VENTE' | 'ACHAT' | 'CHARGE' | 'SALAIRE';
  amount: number;
  method: string;
  description: string;
  reference?: string; // Link to Payment or Invoice
  user: string;
}

export interface Log {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details?: string;
  timestamp: string;
  ip?: string;
}