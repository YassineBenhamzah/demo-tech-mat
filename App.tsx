import React, { useState, Suspense } from 'react';
import { Layout } from './components/Layout';
import { Activity } from 'lucide-react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Inventory = React.lazy(() => import('./pages/Inventory').then(module => ({ default: module.Inventory })));
const Sales = React.lazy(() => import('./pages/Sales').then(module => ({ default: module.Sales })));
const Finance = React.lazy(() => import('./pages/Finance').then(module => ({ default: module.Finance })));
const Clients = React.lazy(() => import('./pages/Clients').then(module => ({ default: module.Clients })));
const Reports = React.lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const Logistics = React.lazy(() => import('./pages/Logistics').then(module => ({ default: module.Logistics })));

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-500 font-medium animate-pulse">Chargement sécurisé...</p>
  </div>
);

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'clients': return <Clients />;
      case 'logistics': return <Logistics />;
      case 'finance': return <Finance />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <Layout activePage={currentPage} onNavigate={setCurrentPage}>
        <Suspense fallback={<LoadingSpinner />}>
          {renderPage()}
        </Suspense>
      </Layout>
    </DataProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default App;