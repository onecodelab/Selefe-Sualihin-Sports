import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, CheckCircle, XCircle, DollarSign, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Booking {
  id: string;
  team_name: string;
  contact_name: string;
  phone: string;
  date: string;
  time_slot: string;
  status: string;
  price: number;
  payment_status: string;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
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

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const updatePaymentStatus = async (id: string, payment_status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ payment_status })
      .eq('id', id);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, payment_status } : b));
    }
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = b.team_name.toLowerCase().includes(search.toLowerCase()) ||
      b.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      b.date.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-apple-display text-3xl font-bold text-gray-900 tracking-tight">{t('admin.bookings')}</h1>
        <p className="font-apple-text text-gray-400 mt-1">Approve, cancel, and track all reservations</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl font-apple-text text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-xl font-apple-text text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'bg-gray-900 text-white shadow-lg shadow-black/10'
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('dashboard.team')}</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('dashboard.date')}</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('dashboard.status')}</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-apple-text">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-apple-text">No bookings found</td></tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                          {b.team_name.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="font-apple-text font-bold text-sm text-gray-900">{b.team_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-apple-text text-sm text-gray-700">{b.contact_name}</p>
                      <p className="font-apple-text text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {b.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-apple-text font-bold text-sm text-gray-900">{b.date}</p>
                      <p className="font-apple-text text-xs text-gray-400">{b.time_slot}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
                        b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.payment_status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {b.payment_status === 'paid' ? '💰 Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              title="Cancel"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {b.payment_status !== 'paid' && b.status === 'Confirmed' && (
                          <button
                            onClick={() => updatePaymentStatus(b.id, 'paid')}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Mark as Paid"
                          >
                            <DollarSign size={16} />
                          </button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
