import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, DollarSign, Clock, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Booking {
  id: string;
  team_name: string;
  contact_name: string;
  date: string;
  time_slot: string;
  status: string;
  price: number;
  payment_status: string;
  created_at: string;
}

const AdminOverview = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setBookings(data);
    setLoading(false);
  };

  const totalRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.price || 0), 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const todayBookings = bookings.filter(b => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = today.getDate();
    const monthName = today.toLocaleDateString('en-US', { month: 'short' });
    const todayStr = `${dayName}, ${monthName} ${dayNumber}`;
    return b.date === todayStr;
  });

  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-apple-display text-3xl font-bold text-gray-900 tracking-tight">{t('admin.overview')}</h1>
        <p className="font-apple-text text-gray-400 mt-1">Your pitch operations at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-[#0071e3]"><DollarSign size={22} /></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('admin.revenue')}</span>
          </div>
          <p className="font-apple-display text-3xl font-black text-gray-900">{totalRevenue.toLocaleString()} <span className="text-sm font-bold text-gray-400">ETB</span></p>
          <p className="text-xs text-[#0071e3] font-bold mt-1">From paid bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-[#0071e3]"><Calendar size={22} /></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('dashboard.total')}</span>
          </div>
          <p className="font-apple-display text-3xl font-black text-gray-900">{bookings.length}</p>
          <p className="text-xs text-gray-400 font-bold mt-1">All-time bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600"><Clock size={22} /></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Pending</span>
          </div>
          <p className="font-apple-display text-3xl font-black text-gray-900">{pendingCount}</p>
          <p className="text-xs text-yellow-500 font-bold mt-1">Awaiting approval</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><TrendingUp size={22} /></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Today</span>
          </div>
          <p className="font-apple-display text-3xl font-black text-gray-900">{todayBookings.length}</p>
          <p className="text-xs text-purple-500 font-bold mt-1">Matches today</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-apple-display font-bold text-gray-900">{t('dashboard.activity')}</h2>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Last 5</span>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-8 text-center text-gray-400 font-apple-text">Loading...</div>
            ) : recentBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-apple-text">No bookings yet</div>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                      {b.team_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-apple-text font-bold text-sm text-gray-900">{b.team_name}</p>
                      <p className="font-apple-text text-xs text-gray-400">{b.date} · {b.time_slot}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-apple-display font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-500" />
                <span className="font-apple-text text-sm text-gray-600">Confirmed</span>
              </div>
              <span className="font-apple-display font-black text-gray-900">{confirmedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-yellow-500" />
                <span className="font-apple-text text-sm text-gray-600">Pending</span>
              </div>
              <span className="font-apple-display font-black text-gray-900">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-[#0071e3]" />
                <span className="font-apple-text text-sm text-gray-600">Today's Teams</span>
              </div>
              <span className="font-apple-display font-black text-gray-900">{todayBookings.length}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="font-apple-text text-xs text-gray-400 mb-3">Confirmation Rate</p>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="bg-[#0071e3] h-3 rounded-full transition-all duration-500"
                style={{ width: bookings.length > 0 ? `${(confirmedCount / bookings.length) * 100}%` : '0%' }}
              ></div>
            </div>
            <p className="font-apple-text text-xs text-gray-500 mt-2 font-bold">
              {bookings.length > 0 ? Math.round((confirmedCount / bookings.length) * 100) : 0}% confirmed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
