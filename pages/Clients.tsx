import React, { useState } from 'react';
import { Search, Plus, Filter, User, Building, Phone, Mail, MapPin } from 'lucide-react';
import { Card, Button, Input, Badge, Modal, Select } from '../components/ui';
import { useData } from '../context/DataContext';

export const Clients: React.FC = () => {
  const { clients, suppliers, addClient, addSupplier } = useData();
  const [activeTab, setActiveTab] = useState<'clients' | 'suppliers'>('clients');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '', address: '', type: 'Particulier' as const });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(s => 
    s.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(newClient);
    setIsClientModalOpen(false);
    setNewClient({ name: '', company: '', email: '', phone: '', address: '', type: 'Particulier' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Clients & Tiers</h2>
          <p className="text-slate-500">Gérez votre base de clients et vos fournisseurs</p>
        </div>
        <div className="flex gap-2">
          <Button icon={Plus} onClick={() => activeTab === 'clients' && setIsClientModalOpen(true)}>
            {activeTab === 'clients' ? 'Nouveau Client' : 'Nouveau Fournisseur'}
          </Button>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <button 
            onClick={() => { setActiveTab('clients'); setSearchTerm(''); }}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'clients' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <User size={18} />
            Clients
            <Badge color="blue">{clients.length}</Badge>
          </button>
          <button 
            onClick={() => { setActiveTab('suppliers'); setSearchTerm(''); }}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'suppliers' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Building size={18} />
            Fournisseurs
            <Badge color="purple">{suppliers.length}</Badge>
          </button>
        </nav>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder={`Rechercher un ${activeTab === 'clients' ? 'client' : 'fournisseur'}...`} 
              icon={Search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={Filter}>Filtres</Button>
        </div>

        {activeTab === 'clients' ? (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="py-4 px-4">Nom / Société</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4 text-right">Solde</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{client.company || client.name}</span>
                        {client.company && <span className="text-xs text-slate-500">{client.name}</span>}
                        {client.ice && <span className="text-xs text-slate-400">ICE: {client.ice}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 text-slate-600">
                        <div className="flex items-center gap-2"><Phone size={14} /> {client.phone}</div>
                        <div className="flex items-center gap-2"><Mail size={14} /> {client.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge color={client.type === 'Professionnel' ? 'blue' : 'gray'}>{client.type}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-bold ${client.creditBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {client.creditBalance.toLocaleString()} MAD
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button variant="outline" size="sm">Détails</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="py-4 px-4">Société</th>
                  <th className="py-4 px-4">Interlocuteur</th>
                  <th className="py-4 px-4">Catégorie</th>
                  <th className="py-4 px-4">Adresse</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{supplier.company}</span>
                        <span className="text-xs text-slate-400">ICE: {supplier.ice}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-medium">{supplier.contactName}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <Phone size={12} /> {supplier.phone}
                        </div>
                         <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail size={12} /> {supplier.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge color="purple">{supplier.category}</Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm max-w-xs truncate">
                        <div className="flex items-center gap-2">
                             <MapPin size={14} className="text-slate-400" />
                             {supplier.address}
                        </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button variant="outline" size="sm">Fiche</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Ajouter un Client">
        <form onSubmit={handleAddClient} className="space-y-4">
            <Input label="Nom Complet" required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
            <Input label="Société (Optionnel)" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Email" type="email" required value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                <Input label="Téléphone" required value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
            </div>
            <Input label="Adresse" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
            <Select label="Type Client" value={newClient.type} onChange={e => setNewClient({...newClient, type: e.target.value as any})}>
                <option value="Particulier">Particulier</option>
                <option value="Professionnel">Professionnel</option>
            </Select>
            <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsClientModalOpen(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};