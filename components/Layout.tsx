import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Truck, Wallet, FileText, Settings,
  LogOut, Menu, X, Bell, Moon, Sun, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // RBAC Menu Filtering
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [] }, // All
    { id: 'inventory', label: 'Stock & Produits', icon: Package, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'sales', label: 'Ventes & Devis', icon: ShoppingCart, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER] },
    { id: 'clients', label: 'Clients & Tiers', icon: Users, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'logistics', label: 'Livraisons (BL)', icon: Truck, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'finance', label: 'Finance & Caisse', icon: Wallet, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
    { id: 'reports', label: 'Rapports & Audit', icon: FileText, roles: [UserRole.ADMIN] },
  ];

  const menuItems = allMenuItems.filter(item => 
    item.roles.length === 0 || (user && item.roles.includes(user.role))
  );

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`flex h-screen bg-slate-50 text-slate-900 overflow-hidden ${darkMode ? 'dark:bg-slate-900 dark:text-slate-100' : ''}`}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl z-20">
        <div className="p-6 border-b border-slate-700 bg-slate-900">
          <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-brand-900">T</div>
            TechStock
          </h1>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-semibold">Enterprise Edition</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activePage === item.id 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activePage === item.id ? 'animate-pulse' : ''} />
              <span className="font-medium tracking-wide text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
            <img 
              src={user?.avatar || 'https://via.placeholder.com/40'} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-brand-500"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <div className="flex items-center gap-1 text-xs text-brand-400">
                 <Shield size={10} /> {user?.role}
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors py-2 rounded hover:bg-slate-800"
          >
            <LogOut size={14} /> Déconnexion sécurisée
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-300">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600 p-2 rounded hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block">
              {menuItems.find(i => i.id === activePage)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative cursor-pointer text-slate-500 hover:text-brand-600 transition-colors p-2">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>

       {/* Mobile Overlay */}
       {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-white z-40 transform transition-transform duration-300 md:hidden shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex justify-between items-center border-b border-slate-800">
          <h1 className="font-bold text-lg flex items-center gap-2"><div className="w-6 h-6 bg-brand-500 rounded"></div> TechStock</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                activePage === item.id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-slate-800 rounded-lg mt-8">
            <LogOut size={20} /> Déconnexion
          </button>
        </nav>
      </aside>
    </div>
  );
};