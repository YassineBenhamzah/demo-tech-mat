import { Product, ProductStatus, Quote, QuoteStatus, Client, Supplier, Transaction, Log, UserRole, DeliveryNote, DeliveryStatus } from './types';

export const CURRENT_USER = {
  id: 'u1',
  name: 'Amine Admin',
  email: 'admin@techstock.ma',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/200'
};

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', code: 'PC-001', name: 'Dell Latitude 5420', category: 'Laptop', brand: 'Dell', buyPrice: 5000, sellPrice: 6500, tva: 20, stock: 12, reserved: 0, minStock: 5, location: 'Magasin A' },
  { id: '2', code: 'PR-102', name: 'HP LaserJet Pro', category: 'Imprimante', brand: 'HP', buyPrice: 1200, sellPrice: 1800, tva: 20, stock: 3, reserved: 0, minStock: 5, location: 'Dépôt' },
  { id: '3', code: 'ACC-55', name: 'Logitech MX Master 3', category: 'Accessoires', brand: 'Logitech', buyPrice: 600, sellPrice: 950, tva: 20, stock: 45, reserved: 0, minStock: 10, location: 'Magasin A' },
  { id: '4', code: 'NET-99', name: 'Ubiquiti UniFi AP', category: 'Réseau', brand: 'Ubiquiti', buyPrice: 1100, sellPrice: 1600, tva: 20, stock: 0, reserved: 0, minStock: 2, location: 'Dépôt' },
  { id: '5', code: 'PC-002', name: 'MacBook Air M2', category: 'Laptop', brand: 'Apple', buyPrice: 10000, sellPrice: 13500, tva: 20, stock: 8, reserved: 0, minStock: 3, location: 'Magasin A' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Tech Solutions SARL', company: 'Tech Solutions', ice: '123456789', email: 'contact@techsol.ma', phone: '0661123456', address: '123 Bd Zerktouni, Casablanca', type: 'Professionnel', totalSpent: 0, creditBalance: 0 },
  { id: 'c2', name: 'Karim Bennani', email: 'karim.b@gmail.com', phone: '0663987654', address: 'Hay Riad, Rabat', type: 'Particulier', totalSpent: 0, creditBalance: 1500 },
  { id: 'c3', name: 'Groupe Scolaire Atlas', company: 'GS Atlas', ice: '987654321', email: 'achat@gsatlas.ma', phone: '0522998877', address: 'Maârif, Casablanca', type: 'Professionnel', totalSpent: 0, creditBalance: 5000 },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', company: 'Disway Maroc', contactName: 'Ahmed Commercial', email: 'sales@disway.ma', phone: '0522000000', ice: '111222333', address: 'Zone Industrielle Sidi Maarouf', category: 'Grossiste IT' },
  { id: 's2', company: 'Smart Technologies', contactName: 'Sara Support', email: 'contact@smartech.ma', phone: '0537000000', ice: '444555666', address: 'Agdal, Rabat', category: 'Distributeur Réseau' },
];

export const MOCK_QUOTES: Quote[] = [
  { 
    id: 'q1', reference: 'DEV-2023-001', clientId: 'c1', clientName: 'Tech Solutions SARL', date: '2023-10-25', validUntil: '2023-11-25', status: QuoteStatus.ACCEPTED, 
    subTotal: 13000, taxAmount: 2600, total: 15600,
    items: [{ productId: '1', productName: 'Dell Latitude 5420', quantity: 2, unitPrice: 6500, total: 13000 }]
  },
  { 
    id: 'q2', reference: 'DEV-2023-002', clientId: 'c2', clientName: 'Karim Bennani', date: '2023-10-26', validUntil: '2023-11-26', status: QuoteStatus.DRAFT, 
    subTotal: 950, taxAmount: 190, total: 1140,
    items: [{ productId: '3', productName: 'Logitech MX Master 3', quantity: 1, unitPrice: 950, total: 950 }]
  },
];

export const MOCK_DELIVERIES: DeliveryNote[] = [
  {
    id: 'bl1', reference: 'BL-2023-089', quoteReference: 'DEV-2023-001', clientName: 'Tech Solutions SARL', date: '2023-10-27', status: DeliveryStatus.PENDING, itemsCount: 2, address: '123 Bd Zerktouni, Casablanca', driver: 'Mohamed T.'
  },
  {
    id: 'bl2', reference: 'BL-2023-088', quoteReference: 'DEV-2023-001', clientName: 'Tech Solutions SARL', date: '2023-10-25', status: DeliveryStatus.DELIVERED, itemsCount: 5, address: '123 Bd Zerktouni, Casablanca', driver: 'Mohamed T.'
  },
  {
    id: 'bl3', reference: 'BL-2023-085', clientName: 'Groupe Scolaire Atlas', date: '2023-10-20', status: DeliveryStatus.DELIVERED, itemsCount: 12, address: 'Maârif, Casablanca'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-26 10:30', type: 'IN', category: 'VENTE', amount: 15600, method: 'Virement', description: 'Paiement Facture #FAC-001', user: 'Amine Admin' },
  { id: 't2', date: '2023-10-26 14:15', type: 'OUT', category: 'CHARGE', amount: 200, method: 'Espèces', description: 'Frais de transport', user: 'Amine Admin' },
];

export const MOCK_LOGS: Log[] = [
  { id: 'l1', user: 'Amine Admin', role: 'ADMIN', action: 'Connexion', module: 'Auth', timestamp: '2023-10-26 09:00:00', details: 'Connexion réussie via IP 192.168.1.10' },
  { id: 'l2', user: 'Amine Admin', role: 'ADMIN', action: 'Création Devis', module: 'Ventes', timestamp: '2023-10-26 09:15:30', details: 'Devis #DEV-2023-002 créé pour Karim Bennani' },
  { id: 'l3', user: 'Sarah Caissier', role: 'CASHIER', action: 'Encaissement', module: 'Caisse', timestamp: '2023-10-26 10:05:00', details: 'Encaissement de 1500 MAD (Espèces)' },
  { id: 'l4', user: 'Amine Admin', role: 'ADMIN', action: 'Modification Stock', module: 'Stock', timestamp: '2023-10-26 11:20:00', details: 'Ajustement manuel: +2 Dell Latitude 5420' },
  { id: 'l5', user: 'Sarah Caissier', role: 'CASHIER', action: 'Fermeture Caisse', module: 'Caisse', timestamp: '2023-10-25 18:30:00', details: 'Solde de clôture: 8,200 MAD' },
  { id: 'l6', user: 'Amine Admin', role: 'ADMIN', action: 'Ajout Client', module: 'Clients', timestamp: '2023-10-24 14:00:00', details: 'Nouveau client: Groupe Scolaire Atlas' },
];

export const CATEGORIES = ['Laptop', 'Desktop', 'Imprimante', 'Réseau', 'Accessoires', 'Composants', 'Logiciels'];