import React from 'react';
import { LucideIcon, X } from 'lucide-react';

// --- Badges ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' }> = ({ children, color = 'gray' }) => {
  const styles = {
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    red: 'bg-rose-100 text-rose-800 border-rose-200',
    yellow: 'bg-amber-100 text-amber-800 border-amber-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-slate-100 text-slate-800 border-slate-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[color]}`}>
      {children}
    </span>
  );
};

// --- Cards ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

// --- Stat Card ---
export const StatCard: React.FC<{ title: string; value: string; trend?: string; trendUp?: boolean; icon: LucideIcon; color: 'blue' | 'purple' | 'emerald' | 'rose' }> = ({
  title, value, trend, trendUp, icon: Icon, color
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <Card className="p-6 transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {trend && (
            <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
              <span className="text-slate-400 ml-1 font-normal">vs mois dernier</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', icon: Icon, className = '', ...props 
}) => {
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-200',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};

// --- Input ---
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: LucideIcon }> = ({ label, icon: Icon, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon size={16} />
        </div>
      )}
      <input 
        className={`block w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 ${Icon ? 'pl-10' : 'pl-3'} ${className}`} 
        {...props} 
      />
    </div>
  </div>
);

// --- Select ---
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <select 
      className={`block w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 px-3 ${className}`} 
      {...props} 
    >
      {children}
    </select>
  </div>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};