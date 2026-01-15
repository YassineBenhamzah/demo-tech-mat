import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@techstock.ma');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await login(email);
    if (!success) {
      setError('Identifiants incorrects. Essayez admin@techstock.ma');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-600 text-white mb-4 shadow-lg shadow-brand-900/50">
            <span className="text-3xl font-bold">T</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TechStock Manager</h1>
          <p className="text-slate-400 mt-2">Plateforme de gestion sécurisée</p>
        </div>

        <Card className="bg-white/95 backdrop-blur shadow-2xl border-0 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Connexion</h2>
              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm flex items-center gap-2">
                   <ShieldCheck size={16} /> {error}
                </div>
              )}
              
              <div className="space-y-4">
                <Input 
                  label="Email Professionnel" 
                  type="email" 
                  icon={Mail} 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
                <Input 
                  label="Mot de passe" 
                  type="password" 
                  icon={Lock} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full justify-center h-12 text-base" disabled={loading}>
                {loading ? 'Authentification...' : 'Se connecter'}
                {!loading && <ArrowRight size={18} />}
              </Button>
            </div>

            <div className="text-center">
              <a href="#" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">
                Mot de passe oublié ?
              </a>
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center text-slate-500 text-xs">
          <p>&copy; 2024 TechStock Systems. Secured by SSL/TLS.</p>
        </div>
      </div>
    </div>
  );
};