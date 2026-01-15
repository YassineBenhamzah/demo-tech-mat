import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, Search, X, BarChart2, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, Button, Input, Badge, Select, StatCard } from '../components/ui';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const Reports: React.FC = () => {
  const { logs, transactions, quotes, deliveries } = useData();
  const [activeTab, setActiveTab] = useState<'reports' | 'audit' | 'analysis'>('reports');
  
  // Filter States for Audit
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  // Analysis State
  const [reportStartDate, setReportStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [reportEndDate, setReportEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // --- Audit Logic ---
  const uniqueModules = ['All', ...Array.from(new Set(logs.map(l => l.module))).sort()];
  
  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      log.user.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      (log.details || '').toLowerCase().includes(searchLower) ||
      log.module.toLowerCase().includes(searchLower);
    
    const matchesModule = filterModule === 'All' || log.module === filterModule;

    let matchesDate = true;
    if (filterDate) {
      const [year, month, day] = filterDate.split('-');
      const searchDateStr = `${day}/${month}/${year}`;
      matchesDate = log.timestamp.startsWith(searchDateStr);
    }

    return matchesSearch && matchesModule && matchesDate;
  });

  const handleExportAuditCSV = () => {
    const headers = ['Date', 'Utilisateur', 'Module', 'Action', 'Détails'];
    const rows = filteredLogs.map(log => [
      `"${log.timestamp}"`,
      `"${log.user}"`,
      `"${log.module}"`,
      `"${log.action}"`,
      `"${(log.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_export.csv`);
    link.click();
  };

  const clearAuditFilters = () => {
    setSearchTerm('');
    setFilterModule('All');
    setFilterDate('');
  };

  // --- Analysis Logic ---
  const getAnalysisData = () => {
    // Filter by Date Range (Inclusive)
    const filteredTransactions = transactions.filter(t => {
       const d = t.date.split(' ')[0]; // Handle 'YYYY-MM-DD HH:mm'
       return d >= reportStartDate && d <= reportEndDate;
    });
    
    const totalIn = filteredTransactions.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'OUT').reduce((acc, t) => acc + t.amount, 0);
    const netResult = totalIn - totalOut;
    
    const filteredQuotes = quotes.filter(q => q.date >= reportStartDate && q.date <= reportEndDate);
    const filteredDeliveries = deliveries.filter(d => d.date >= reportStartDate && d.date <= reportEndDate);

    const chartData = [
        { name: 'Entrées', amount: totalIn },
        { name: 'Sorties', amount: totalOut },
        { name: 'Bénéfice', amount: netResult }
    ];

    return {
        totalIn, totalOut, netResult,
        quotesCount: filteredQuotes.length,
        quotesTotal: filteredQuotes.reduce((acc, q) => acc + q.total, 0),
        deliveriesCount: filteredDeliveries.length,
        transactionsCount: filteredTransactions.length,
        chartData
    };
  };

  const analysis = getAnalysisData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rapports & Historiques</h2>
          <p className="text-slate-500">Analysez vos performances et surveillez la traçabilité</p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('reports')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'reports' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FileText size={18} />
            Documents
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'analysis' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <BarChart2 size={18} />
            Analyse Périodique
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'audit' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <ShieldCheck size={18} />
            Journal d'Audit
            <Badge color="gray">{filteredLogs.length}</Badge>
          </button>
        </nav>
      </div>

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Bilan Financier Mensuel</h3>
            <p className="text-sm text-slate-500 mb-6">Résumé des ventes, achats, charges et bénéfices.</p>
            <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-between" icon={Download}>Octobre 2023.pdf</Button>
                <Button variant="outline" className="w-full justify-between" icon={Download}>Septembre 2023.pdf</Button>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">État de Stock</h3>
            <p className="text-sm text-slate-500 mb-6">Inventaire valorisé et mouvements de stock.</p>
            <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-between" icon={Download}>Inventaire Global.xlsx</Button>
                <Button variant="outline" className="w-full justify-between" icon={Download}>Mouvements (7j).pdf</Button>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Journal TVA</h3>
            <p className="text-sm text-slate-500 mb-6">Export des factures pour la déclaration.</p>
            <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-between" icon={Download}>Ventes T3 2023.csv</Button>
                <Button variant="outline" className="w-full justify-between" icon={Download}>Ventes T2 2023.csv</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
           {/* Date Filter Bar */}
           <Card className="p-4">
              <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <Input 
                        label="Date de début" 
                        type="date" 
                        value={reportStartDate} 
                        onChange={e => setReportStartDate(e.target.value)} 
                      />
                      <Input 
                        label="Date de fin" 
                        type="date" 
                        value={reportEndDate} 
                        onChange={e => setReportEndDate(e.target.value)} 
                      />
                  </div>
                  <div className="text-sm text-slate-500 hidden md:block">
                     Période de {Math.ceil((new Date(reportEndDate).getTime() - new Date(reportStartDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </div>
              </div>
           </Card>

           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Chiffre d'Affaires" value={`${analysis.totalIn.toLocaleString()} MAD`} icon={TrendingUp} color="emerald" />
              <StatCard title="Dépenses Totales" value={`${analysis.totalOut.toLocaleString()} MAD`} icon={TrendingDown} color="rose" />
              <StatCard title="Résultat Net" value={`${analysis.netResult.toLocaleString()} MAD`} icon={DollarSign} color="blue" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <Card className="lg:col-span-2 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Comparatif Financier</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysis.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend />
                        <Bar dataKey="amount" name="Montant (MAD)" radius={[4, 4, 0, 0]}>
                          {analysis.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f43f5e' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
              </Card>

              {/* Operational Stats */}
              <Card className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Volume Opérationnel</h3>
                  <div className="space-y-6">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                              <p className="text-sm text-slate-500">Nouveaux Devis</p>
                              <p className="font-bold text-slate-900">{analysis.quotesCount}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-sm text-slate-500">Montant Total</p>
                              <p className="font-bold text-brand-600">{analysis.quotesTotal.toLocaleString()} MAD</p>
                          </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                              <p className="text-sm text-slate-500">Expéditions (BL)</p>
                              <p className="font-bold text-slate-900">{analysis.deliveriesCount}</p>
                          </div>
                          <div className="p-2 bg-blue-100 text-blue-600 rounded">
                             <Calendar size={20} />
                          </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                              <p className="text-sm text-slate-500">Transactions</p>
                              <p className="font-bold text-slate-900">{analysis.transactionsCount}</p>
                          </div>
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded">
                             <FileText size={20} />
                          </div>
                      </div>
                  </div>
              </Card>
           </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <Card className="p-4">
           {/* Audit Filters */}
           <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="col-span-1 md:col-span-2">
                 <Input 
                  placeholder="Rechercher (Utilisateur, Action)..." 
                  icon={Search} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <Select value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
                 {uniqueModules.map(m => <option key={m} value={m}>{m === 'All' ? 'Tous les modules' : m}</option>)}
               </Select>
               <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full" />
            </div>
            <div className="flex gap-2 items-start">
                 <Button variant="outline" onClick={clearAuditFilters} title="Réinitialiser">
                    <X size={18} />
                 </Button>
                 <Button variant="primary" icon={Download} onClick={handleExportAuditCSV}>
                   Exporter
                 </Button>
            </div>
           </div>

            {/* Audit Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                    <th className="py-4 px-4 whitespace-nowrap">Horodatage</th>
                    <th className="py-4 px-4">Utilisateur</th>
                    <th className="py-4 px-4">Module</th>
                    <th className="py-4 px-4">Action</th>
                    <th className="py-4 px-4 w-1/3">Détails</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap font-mono text-xs">{log.timestamp}</td>
                      <td className="py-4 px-4 font-medium text-slate-900">{log.user}</td>
                      <td className="py-4 px-4"><Badge color="gray">{log.module}</Badge></td>
                      <td className="py-4 px-4 font-medium text-brand-700">{log.action}</td>
                      <td className="py-4 px-4 text-slate-600 break-words">{log.details || '-'}</td>
                      </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500">Aucun historique trouvé.</td></tr>
                )}
                </tbody>
            </table>
            </div>
        </Card>
      )}
    </div>
  );
};