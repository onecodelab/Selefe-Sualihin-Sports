import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Step 1: Try to Sign In
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const handleRedirect = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (data?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    };

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        } else if (signUpData.user) {
          // New users always go to home
          navigate('/');
          return;
        }
      }
      
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (signInData.user) {
      await handleRedirect(signInData.user.id);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col pt-24 pb-12">
      
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[440px] w-full bg-white rounded-[24px] shadow-[0px_20px_60px_rgba(0,0,0,0.05)] p-8 md:p-12 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
              <img src="/assets/logo.png" alt="Logo" className="w-10 h-auto opacity-80" />
            </div>
            <h1 className="font-geist text-[32px] font-bold text-gray-900 tracking-tight leading-tight">{t('login.welcome')}</h1>
            <p className="font-geist text-gray-400 mt-2 text-sm font-medium">{t('login.subtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs font-bold flex items-center gap-2 border border-red-100">
              <span className="text-sm">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="font-geist text-[12px] text-gray-400 font-black uppercase tracking-widest ml-1">{t('login.email')}</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0071e3] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#0071e3] focus:bg-white transition-all font-geist text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-geist text-[12px] text-gray-400 font-black uppercase tracking-widest ml-1">{t('login.password')}</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0071e3] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#0071e3] focus:bg-white transition-all font-geist text-gray-900"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-geist font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>{t('login.button')}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="font-geist text-xs text-gray-400 leading-relaxed">
              {t('login.register')}<br />
              Secure authentication powered by Supabase.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
