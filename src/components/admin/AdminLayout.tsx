import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, CalendarDays, ListChecks, LogOut, ChevronLeft, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('admin.overview'), icon: LayoutDashboard, path: '/admin' },
    { label: t('admin.bookings'), icon: ListChecks, path: '/admin/bookings' },
    { label: t('admin.schedule'), icon: CalendarDays, path: '/admin/schedule' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#121212] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Logo" className="h-8 w-auto" />
          <div>
            <p className="font-apple-display font-bold text-sm">Selefe Sualihin</p>
            <p className="font-apple-text text-[10px] text-[#0071e3] font-bold uppercase tracking-widest">Admin</p>
          </div>
        </div>
        <button onClick={toggleMobileMenu} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo (Desktop) */}
        <div className="hidden md:block p-8 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="h-12 w-auto" />
            <div>
              <p className="font-apple-display font-bold text-base text-gray-900 leading-tight">Selefe Sualihin</p>
              <p className="font-apple-text text-[10px] text-[#0071e3] font-black uppercase tracking-[0.2em] mt-0.5">{t('nav.admin')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl font-apple-text text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#0071e3] text-white shadow-xl shadow-[#0071e3]/20'
                    : 'text-gray-500 hover:bg-[#f5f5f7] hover:text-gray-900'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Actions */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/50">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-apple-text font-bold text-gray-400 hover:text-gray-700 hover:bg-white transition-all mb-4 border border-transparent hover:border-gray-100"
          >
            <ChevronLeft size={16} />
            {t('nav.home')}
          </button>
          
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#0071e3] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-[#0071e3]/20">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-apple-text text-xs font-black text-gray-900 truncate uppercase tracking-tight">{user?.email?.split('@')[0]}</p>
              <p className="font-apple-text text-[10px] text-gray-400 font-bold">Manager</p>
            </div>
            <button 
              onClick={signOut} 
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-red-50"
              title={t('nav.signout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-x-hidden pt-6 md:pt-0">
        <div className="max-w-[1400px] mx-auto p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
