import React from 'react';
import { TrendingUp, Users, AlertTriangle, DollarSign, Activity, Package, ArrowUpRight, FileText } from 'lucide-react';
import { Card, StatCard, Badge, Button, Select } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { transactions, products, clients, logs, quotes, invoices } = useData();

  // --- Advanced Calculations ---

  // 1. Financial Health
  const currentMonth = new Date().getMonth();
  const monthlyRevenue = transactions
    .filter(t => t.type === 'IN' && new Date(t.date).getMonth() === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'OUT' && new Date(t.date).getMonth() === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = monthlyRevenue - monthlyExpenses;
  const marginPercentage = monthlyRevenue > 0 ? ((netProfit / monthlyRevenue) * 100).toFixed(1) : '0';

  // 2. Stock Health
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.buyPrice), 0);
  const potentialRevenue = products.reduce((acc, p) => acc + (p.stock * p.sellPrice), 0);

  // 3. Operational
  const pendingQuotes = quotes.filter(q => q.status === 'Sent' || q.status === 'Draft').length;
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue' || (i.status === 'Unpaid' && new Date(i.dueDate) < new Date())).length;

  // 4. Charts Data
  const dataSales = [
    { name: 'Lun', sales: 4000, profit: 1200 },
    { name: 'Mar', sales: 3000, profit: 900 },
    { name: 'Mer', sales: 2000, profit: 600 },
    { name: 'Jeu', sales: 2780, profit: 850 },
    { name: 'Ven', sales: 1890, profit: 400 },
    { name: 'Sam', sales: 2390, profit: 700 },
    { name: 'Dim', sales: 3490, profit: 1100 },
  ];

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataCategories = Object.keys(categoryCounts).map(key => ({
    name: key,
    value: categoryCounts[key]
  }));

  const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tableau de Bord Exécutif</h2>
          <p className="text-slate-500">Vue d'ensemble en temps réel & KPIs stratégiques</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" icon={Activity}>Rafraîchir Données</Button>
            <span className="text-xs font-mono text-slate-400">Dernière MAJ: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {(lowStockProducts.length > 0 || overdueInvoices > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {lowStockProducts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                 <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                 <div>
                    <h4 className="font-bold text-amber-800">Alerte Stock Bas</h4>
                    <p className="text-sm text-amber-700 mt-1">
                       {lowStockProducts.length} produits sont sous le seuil de sécurité.
                       <button className="underline ml-2 font-medium">Réapprovisionner</button>
                    </p>
                 </div>
              </div>
           )}
           {overdueInvoices > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg flex items-start gap-3">
                 <DollarSign className="text-rose-600 shrink-0 mt-0.5" size={20} />
                 <div>
                    <h4 className="font-bold text-rose-800">Factures en Retard</h4>
                    <p className="text-sm text-rose-700 mt-1">
                       {overdueInvoices} factures nécessitent une relance immédiate.
                    </p>
                 </div>
              </div>
           )}
        </div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Marge Nette (Mois)" 
          value={`${netProfit.toLocaleString()} MAD`}
          trend={`${marginPercentage}%`} 
          trendUp={netProfit > 0} 
          icon={TrendingUp} 
          color="emerald" 
        />
        <StatCard 
          title="Valeur du Stock" 
          value={`${totalStockValue.toLocaleString()} MAD`} 
          trend="Actif"
          trendUp={true} 
          icon={Package} 
          color="blue" 
        />
        <StatCard 
          title="Devis en Cours" 
          value={pendingQuotes.toString()} 
          trend="Opportunités" 
          trendUp={true} 
          icon={FileText} 
          color="purple" 
        />
        <StatCard 
          title="Clients Actifs" 
          value={clients.length.toString()}
          trend="+2 vs M-1"
          trendUp={true}
          icon={Users} 
          color="indigo" 
        />
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Financial Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Performance Financière (Ventes vs Profit)</h3>
             <Select className="w-32">
                <option>7 Jours</option>
                <option>30 Jours</option>
             </Select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSales}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" name="Ventes" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Inventory Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Répartition du Stock</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
             {dataCategories.slice(0, 3).map((entry, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-600">{entry.name}</span>
                   </div>
                   <span className="font-bold text-slate-900">{entry.value}</span>
                </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Live Operations Feed (Audit) */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-brand-600" />
            Flux d'Activité (Temps Réel)
          </h3>
          <Button variant="outline" size="sm">Voir Journal Audit</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-6">Horodatage</th>
                <th className="py-3 px-6">Utilisateur</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Module</th>
                <th className="py-3 px-6">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3 px-6 text-slate-400 font-mono text-xs">{log.timestamp.split(' ')[1]}</td>
                  <td className="py-3 px-6 font-medium text-slate-900 flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                        {log.user.charAt(0)}
                     </div>
                     {log.user}
                  </td>
                  <td className="py-3 px-6 text-brand-600 font-medium">{log.action}</td>
                  <td className="py-3 px-6">
                    <Badge color="gray">{log.module}</Badge>
                  </td>
                  <td className="py-3 px-6 text-slate-500 max-w-xs truncate group-hover:text-slate-700">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};