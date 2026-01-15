import React, { useState } from 'react';
import { Search, Plus, Filter, AlertCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, Button, Input, Badge, Modal, Select } from '../components/ui';
import { CATEGORIES } from '../constants';
import { ProductStatus } from '../types';
import { useData } from '../context/DataContext';

export const Inventory: React.FC = () => {
  const { products, addProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: '', name: '', category: 'Laptop', brand: '', buyPrice: 0, sellPrice: 0, stock: 0, minStock: 5, location: 'Magasin', tva: 20
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (stock: number, min: number) => {
    if (stock === 0) return 'red';
    if (stock <= min) return 'yellow';
    return 'green';
  };

  const getStatusLabel = (stock: number, min: number) => {
    if (stock === 0) return ProductStatus.OUT_OF_STOCK;
    if (stock <= min) return ProductStatus.LOW_STOCK;
    return ProductStatus.AVAILABLE;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setIsModalOpen(false);
    setNewProduct({
        code: '', name: '', category: 'Laptop', brand: '', buyPrice: 0, sellPrice: 0, stock: 0, minStock: 5, location: 'Magasin', tva: 20
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion de Stock</h2>
          <p className="text-slate-500">Gérez vos produits, prix et inventaire</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nouveau Produit</Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Rechercher par nom, code ou référence..." 
              icon={Search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">Toutes catégories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Button variant="outline" icon={Filter}>Filtres</Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="py-4 px-4 w-12"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /></th>
                <th className="py-4 px-4">Produit</th>
                <th className="py-4 px-4">Catégorie</th>
                <th className="py-4 px-4 text-right">Prix Achat</th>
                <th className="py-4 px-4 text-right">Prix Vente</th>
                <th className="py-4 px-4 text-center">Stock</th>
                <th className="py-4 px-4">Statut</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredProducts.map((product) => {
                const statusColor = getStatusColor(product.stock, product.minStock);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-4"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /></td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{product.name}</span>
                        <span className="text-xs text-slate-500">Ref: {product.code}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{product.category}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-slate-500">{product.buyPrice} MAD</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900">{product.sellPrice} MAD</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold">{product.stock}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge color={statusColor}>
                        {getStatusLabel(product.stock, product.minStock)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <AlertCircle className="mx-auto mb-3 text-slate-300" size={48} />
            <p>Aucun produit trouvé pour votre recherche.</p>
          </div>
        )}
      </Card>

      {/* New Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un Produit">
        <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Input label="Code Référence" required value={newProduct.code} onChange={e => setNewProduct({...newProduct, code: e.target.value})} />
                <Input label="Marque" required value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
            </div>
            <Input label="Nom du Produit" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            
            <Select label="Catégorie" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>

            <div className="grid grid-cols-2 gap-4">
                <Input label="Prix Achat (HT)" type="number" required value={newProduct.buyPrice} onChange={e => setNewProduct({...newProduct, buyPrice: parseFloat(e.target.value)})} />
                <Input label="Prix Vente (TTC)" type="number" required value={newProduct.sellPrice} onChange={e => setNewProduct({...newProduct, sellPrice: parseFloat(e.target.value)})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input label="Stock Initial" type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
                <Input label="Seuil Alerte" type="number" required value={newProduct.minStock} onChange={e => setNewProduct({...newProduct, minStock: parseInt(e.target.value)})} />
            </div>

            <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};