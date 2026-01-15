import React, { useState } from 'react';
import { Truck, Search, Filter, Calendar, MapPin, Package, Download, CheckCircle, Clock } from 'lucide-react';
import { Card, Button, Input, Badge, StatCard, Modal, Select } from '../components/ui';
import { DeliveryStatus } from '../types';
import { useData } from '../context/DataContext';

export const Logistics: React.FC = () => {
  const { deliveries, updateDeliveryStatus, addDelivery, clients } = useData();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'history'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    address: '',
    driver: '',
    itemsCount: 1
  });

  const filteredDeliveries = deliveries.filter(d => {
    const matchesSearch = d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || d.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'pending' 
        ? (d.status === DeliveryStatus.PENDING || d.status === DeliveryStatus.IN_TRANSIT)
        : (d.status === DeliveryStatus.DELIVERED || d.status === DeliveryStatus.CANCELLED);
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: DeliveryStatus) => {
    switch(status) {
      case DeliveryStatus.PENDING: return <Badge color="yellow">En attente</Badge>;
      case DeliveryStatus.IN_TRANSIT: return <Badge color="blue">En cours</Badge>;
      case DeliveryStatus.DELIVERED: return <Badge color="green">Livré</Badge>;
      case DeliveryStatus.CANCELLED: return <Badge color="red">Annulé</Badge>;
      default: return <Badge color="gray">{status}</Badge>;
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedClientId(id);
    const client = clients.find(c => c.id === id);
    if (client) {
      setFormData(prev => ({ ...prev, address: client.address || '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    addDelivery({
      clientName: client.company || client.name,
      date: formData.date,
      address: formData.address,
      driver: formData.driver,
      itemsCount: formData.itemsCount
    });

    setIsModalOpen(false);
    // Reset Form
    setSelectedClientId('');
    setFormData({
      date: new Date().toISOString().split('T')[0],
      address: '',
      driver: '',
      itemsCount: 1
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Livraisons (BL)</h2>
          <p className="text-slate-500">Gestion des expéditions et suivis de livraison</p>
        </div>
        <div className="flex gap-2">
            <Button icon={Truck} onClick={() => setIsModalOpen(true)}>Nouveau Bon de Livraison</Button>
        </div>
      </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="En attente" value={deliveries.filter(d => d.status === DeliveryStatus.PENDING).length.toString()} icon={Clock} color="yellow" />
        <StatCard title="Livrés ce mois" value={deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length.toString()} icon={CheckCircle} color="green" trend="+12%" trendUp={true} />
        <StatCard title="Total Expéditions" value={deliveries.length.toString()} icon={Truck} color="blue" />
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <button 
            onClick={() => setActiveTab('all')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Tous les BL
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            En cours / À livrer
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Historique
          </button>
        </nav>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Rechercher par client ou référence BL..." 
              icon={Search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={Calendar}>Date</Button>
            <Button variant="outline" icon={Filter}>Statut</Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="py-4 px-4">Référence</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Client</th>
                <th className="py-4 px-4">Lieu de Livraison</th>
                <th className="py-4 px-4 text-center">Colis/Articles</th>
                <th className="py-4 px-4 text-center">Statut</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-brand-600 cursor-pointer">{delivery.reference}</span>
                        {delivery.quoteReference && <span className="text-xs text-slate-400">Via {delivery.quoteReference}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{delivery.date}</td>
                  <td className="py-4 px-4 font-medium text-slate-900">{delivery.clientName}</td>
                  <td className="py-4 px-4 text-slate-500">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="truncate max-w-[200px]" title={delivery.address}>{delivery.address}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-600 text-xs font-medium">
                        <Package size={12} /> {delivery.itemsCount}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {getStatusBadge(delivery.status)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="text-slate-400 hover:text-brand-600 transition-colors" title="Télécharger BL">
                            <Download size={18} />
                        </button>
                        {delivery.status !== DeliveryStatus.DELIVERED && (
                            <button 
                              onClick={() => updateDeliveryStatus(delivery.id, DeliveryStatus.DELIVERED)}
                              className="text-slate-400 hover:text-emerald-600 transition-colors" 
                              title="Marquer Livré"
                            >
                                <CheckCircle size={18} />
                            </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                  <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                          Aucun bon de livraison trouvé.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Delivery Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer un Bon de Livraison">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Client" value={selectedClientId} onChange={handleClientChange} required>
            <option value="">Sélectionner un client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </Select>

          <Input 
            label="Date de Livraison" 
            type="date" 
            required 
            value={formData.date} 
            onChange={e => setFormData({...formData, date: e.target.value})} 
          />

          <Input 
            label="Adresse de Livraison" 
            required 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})} 
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Chauffeur / Livreur" 
              placeholder="Nom du livreur" 
              value={formData.driver} 
              onChange={e => setFormData({...formData, driver: e.target.value})} 
            />
            <Input 
              label="Nombre de Colis" 
              type="number" 
              min="1" 
              required 
              value={formData.itemsCount} 
              onChange={e => setFormData({...formData, itemsCount: parseInt(e.target.value)})} 
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit">Générer BL</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};