import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { Card, StatCard, Badge, Button } from '../components/ui';
import { useData } from '../context/DataContext';

export const Finance: React.FC = () => {
  const { transactions } = useData();

  // Calculate totals
  const totalIn = transactions.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'OUT').reduce((acc, t) => acc + t.amount, 0);
  const balance = 8450 + totalIn - totalOut - 15600; // Base balance offset for demo + dynamic

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Finance & Caisse</h2>
          <p className="text-slate-500">Suivi de la trésorerie et journal de caisse</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" icon={FileText}>Clôture Journalière</Button>
           <Button icon={ArrowUpRight}>Entrée Caisse</Button>
           <Button variant="danger" icon={ArrowDownLeft}>Sortie Caisse</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Solde Caisse (Espèces)" value={`${balance.toLocaleString()} MAD`} icon={Wallet} color="emerald" trend="+2,400" trendUp={true} />
        <StatCard title="Entrées Aujourd'hui" value={`${totalIn.toLocaleString()} MAD`} icon={ArrowUpRight} color="blue" />
        <StatCard title="Dépenses Aujourd'hui" value={`${totalOut.toLocaleString()} MAD`} icon={ArrowDownLeft} color="rose" />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Journal de Caisse Récent</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500">{t.date}</td>
                  <td className="py-3 px-4">
                    <Badge color={t.type === 'IN' ? 'green' : 'red'}>
                      {t.type === 'IN' ? 'Entrée' : 'Sortie'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{t.description}</td>
                  <td className="py-3 px-4 text-slate-600">{t.method}</td>
                  <td className="py-3 px-4 text-slate-500">{t.user}</td>
                  <td className={`py-3 px-4 text-right font-bold ${t.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount} MAD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};