import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, ChevronRight, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Booking {
  id: string;
  date: string;
  time_slot: string;
  status: string;
  team_name: string;
  price: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return <CheckCircle size={14} />;
      case 'pending': return <AlertCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-24 pb-12">
      <div className="max-w-6xl w-full mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="font-apple-display text-4xl font-bold text-[#1d1d1f] tracking-tight">{t('dashboard.title')}</h1>
            <p className="font-apple-text text-gray-500 mt-1">{t('dashboard.welcome')}, {user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/book')}
              className="bg-[#0071e3] text-white px-6 py-2.5 rounded-full font-apple-text font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {t('dashboard.new')}
            </button>
            <button 
              onClick={signOut}
              className="bg-white text-gray-700 px-6 py-2.5 rounded-full font-apple-text font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <LogOut size={18} />
              {t('nav.signout')}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-[#0071e3]">
                <Calendar size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.total')}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-apple-display">{bookings.length}</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                <CheckCircle size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.confirmed')}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-apple-display">
                {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                <Clock size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.next')}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-apple-text text-gray-800">Saturday, 4:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bookings Table/List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-apple-display text-xl font-bold text-[#1d1d1f]">{t('dashboard.activity')}</h2>
            <button className="text-[#0071e3] font-bold text-sm hover:underline">{t('dashboard.viewAll')}</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.pitch')}</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.team')}</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.date')}</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.status')}</th>
                  <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-apple-text">
                      Loading...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gray-100 p-4 rounded-full text-gray-300">
                          <Calendar size={32} />
                        </div>
                        <p className="text-gray-500 font-apple-text">{t('dashboard.noBookings')}</p>
                        <button 
                          onClick={() => navigate('/book')}
                          className="text-[#0071e3] font-bold mt-2"
                        >
                          {t('dashboard.bookFirst')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                            P1
                          </div>
                          <div>
                            <p className="font-apple-text font-bold text-sm text-gray-900">Main Pitch</p>
                            <p className="font-apple-text text-[9px] text-gray-400 uppercase font-black tracking-wider">Professional Turf</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-apple-text font-semibold text-sm text-gray-700">{booking.team_name}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <p className="font-apple-text font-bold text-sm text-gray-900">{booking.date}</p>
                          <p className="font-apple-text text-xs text-gray-400">{booking.time_slot}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <p className="font-apple-text font-black text-sm text-gray-900">{booking.price} ETB</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
