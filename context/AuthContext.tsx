import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission } from '../types';

// Mock Users for Demo
const MOCK_USERS: User[] = [
  { 
    id: 'u1', name: 'Amine Admin', email: 'admin@techstock.ma', role: UserRole.ADMIN, 
    permissions: ['manage_users', 'view_finance', 'manage_stock', 'create_sales', 'approve_quotes'],
    avatar: 'https://ui-avatars.com/api/?name=Amine+Admin&background=0ea5e9&color=fff'
  },
  { 
    id: 'u2', name: 'Sarah Sales', email: 'sarah@techstock.ma', role: UserRole.MANAGER, 
    permissions: ['manage_stock', 'create_sales', 'approve_quotes'],
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Sales&background=f43f5e&color=fff'
  },
  { 
    id: 'u3', name: 'Karim Cash', email: 'karim@techstock.ma', role: UserRole.CASHIER, 
    permissions: ['create_sales', 'view_finance'],
    avatar: 'https://ui-avatars.com/api/?name=Karim+Cash&background=10b981&color=fff'
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (perm: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('techstock_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string) => {
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('techstock_session', JSON.stringify(foundUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('techstock_session');
  };

  const hasPermission = (perm: Permission) => {
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    return user.permissions.includes(perm);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};