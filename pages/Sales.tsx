import React, { useState } from 'react';
import { Plus, FileText, Download, CheckCircle, Clock, XCircle, Printer, FileCheck } from 'lucide-react';
import { Card, Button, Badge, Modal, Select, Input } from '../components/ui';
import { QuoteStatus, DeliveryStatus, InvoiceStatus } from '../types';
import { useData } from '../context/DataContext';

export const Sales: React.FC = () => {
  const { quotes, deliveries, invoices, updateQuoteStatus, createInvoiceFromQuote, clients, products, addQuote } = useData();
  const [activeTab, setActiveTab] = useState<'quotes' | 'orders' | 'invoices'>('quotes');
  
  // Create Quote State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const getStatusBadge = (status: QuoteStatus) => {
    switch(status) {
      case QuoteStatus.ACCEPTED: return <Badge color="green">Accepté</Badge>;
      case QuoteStatus.DRAFT: return <Badge color="gray">Brouillon</Badge>;
      case QuoteStatus.SENT: return <Badge color="blue">Envoyé</Badge>;
      case QuoteStatus.REJECTED: return <Badge color="red">Refusé</Badge>;
      case QuoteStatus.INVOICED: return <Badge color="purple">Facturé</Badge>;
      default: return <Badge color="gray">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: DeliveryStatus) => {
    switch(status) {
      case DeliveryStatus.PENDING: return <Badge color="yellow">En attente</Badge>;
      case DeliveryStatus.IN_TRANSIT: return <Badge color="blue">En cours</Badge>;
      case DeliveryStatus.DELIVERED: return <Badge color="green">Livré</Badge>;
      case DeliveryStatus.CANCELLED: return <Badge color="red">Annulé</Badge>;
      default: return <Badge color="gray">{status}</Badge>;
    }
  };

  const getInvoiceStatusBadge = (status: InvoiceStatus) => {
    switch(status) {
      case InvoiceStatus.PAID: return <Badge color="green">Payé</Badge>;
      case InvoiceStatus.PARTIAL: return <Badge color="yellow">Partiel</Badge>;
      case InvoiceStatus.UNPAID: return <Badge color="red">Impayé</Badge>;
      case InvoiceStatus.OVERDUE: return <Badge color="red">En retard</Badge>;
      default: return <Badge color="gray">{status}</Badge>;
    }
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId);
    const product = products.find(p => p.id === selectedProductId);

    if (client && product) {
        const total = product.sellPrice * quantity;
        const tax = total * 0.2; // 20% VAT simplified
        addQuote({
            clientId: client.id,
            clientName: client.company || client.name,
            date: new Date().toISOString().split('T')[0],
            items: [{
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                unitPrice: product.sellPrice,
                total: total
            }],
            subTotal: total,
            taxAmount: tax,
            total: total + tax
        });
        setIsQuoteModalOpen(false);
        setSelectedClientId('');
        setSelectedProductId('');
        setQuantity(1);
    }
  };

  const handleFacturer = (quoteId: string) => {
    if (confirm("Voulez-vous générer la facture et le bon de livraison pour ce devis ?")) {
      createInvoiceFromQuote(quoteId);
      setActiveTab('invoices'); // Switch to Invoices tab
    }
  };

  const handlePrint = (ref: string) => {
    alert(`Impression du document ${ref} en cours...`);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ventes & Devis</h2>
          <p className="text-slate-500">Gérez le cycle de vente de A à Z</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" icon={Printer}>Rapports</Button>
            <Button icon={Plus} onClick={() => setIsQuoteModalOpen(true)}>Nouveau Devis</Button>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <button 
            onClick={() => setActiveTab('quotes')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'quotes' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Devis ({quotes.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Bons de Livraison ({deliveries.length})
          </button>
          <button 
            onClick={() => setActiveTab('invoices')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Factures ({invoices.length})
          </button>
        </nav>
      </div>

      {activeTab === 'quotes' && (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Référence</th>
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Montant TTC</th>
                  <th className="py-4 px-6 text-center">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-brand-600 cursor-pointer">{quote.reference}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{quote.clientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{quote.date}</td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">{quote.total.toLocaleString()} MAD</td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                          {quote.status === QuoteStatus.DRAFT && (
                            <button onClick={() => updateQuoteStatus(quote.id, QuoteStatus.ACCEPTED)} className="text-slate-400 hover:text-emerald-600 transition-colors" title="Valider Devis">
                                  <CheckCircle size={18} />
                            </button>
                          )}
                          {quote.status === QuoteStatus.ACCEPTED && (
                            <button onClick={() => handleFacturer(quote.id)} className="text-slate-400 hover:text-purple-600 transition-colors" title="Facturer">
                                <FileCheck size={18} />
                            </button>
                          )}
                          <button onClick={() => handlePrint(quote.reference)} className="text-slate-400 hover:text-slate-600 transition-colors" title="Imprimer">
                              <Printer size={18} />
                          </button>
                          <button className="text-slate-400 hover:text-brand-600 transition-colors" title="Détails">
                              <FileText size={18} />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Card>
      )}

      {activeTab === 'orders' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Référence BL</th>
                  <th className="py-4 px-6">Référence Devis</th>
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Articles</th>
                  <th className="py-4 px-6 text-center">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {deliveries.length > 0 ? deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-brand-600">{delivery.reference}</td>
                    <td className="py-4 px-6 text-slate-500">{delivery.quoteReference || '-'}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">{delivery.clientName}</td>
                    <td className="py-4 px-6 text-slate-500">{delivery.date}</td>
                    <td className="py-4 px-6 text-center font-bold">{delivery.itemsCount}</td>
                    <td className="py-4 px-6 text-center">
                      {getDeliveryStatusBadge(delivery.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handlePrint(delivery.reference)} className="text-slate-400 hover:text-slate-600 transition-colors" title="Imprimer BL">
                              <Printer size={18} />
                          </button>
                          <button className="text-slate-400 hover:text-brand-600 transition-colors" title="Détails">
                              <FileText size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">Aucun bon de livraison.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'invoices' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Référence</th>
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Date d'échéance</th>
                  <th className="py-4 px-6 text-right">Montant Total</th>
                  <th className="py-4 px-6 text-right">Payé</th>
                  <th className="py-4 px-6 text-center">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {invoices.length > 0 ? invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-brand-600">{invoice.reference}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">{invoice.clientName}</td>
                    <td className="py-4 px-6 text-slate-500">{invoice.dueDate}</td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">{invoice.total.toLocaleString()} MAD</td>
                    <td className="py-4 px-6 text-right text-emerald-600">{invoice.paidAmount.toLocaleString()} MAD</td>
                    <td className="py-4 px-6 text-center">
                      {getInvoiceStatusBadge(invoice.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handlePrint(invoice.reference)} className="text-slate-400 hover:text-slate-600 transition-colors" title="Imprimer Facture">
                              <Printer size={18} />
                          </button>
                          <button className="text-slate-400 hover:text-brand-600 transition-colors" title="Détails">
                              <FileText size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">Aucune facture générée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Simplified Create Quote Modal */}
      <Modal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} title="Nouveau Devis Rapide">
          <form onSubmit={handleCreateQuote} className="space-y-4">
              <Select label="Client" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} required>
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
              </Select>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-medium text-sm mb-3">Ajouter un produit (Simplifié)</h4>
                  <Select label="Produit" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} required>
                      <option value="">Sélectionner un produit</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sellPrice} MAD) - Stock: {p.stock}</option>)}
                  </Select>
                  <div className="mt-3">
                    <Input label="Quantité" type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} required />
                  </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsQuoteModalOpen(false)}>Annuler</Button>
                  <Button type="submit">Créer le Devis</Button>
              </div>
          </form>
      </Modal>
    </div>
  );
};