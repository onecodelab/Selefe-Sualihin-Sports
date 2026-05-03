import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, ChevronRight, Lock, Unlock, AlertTriangle, User, Mail, Phone, History } from 'lucide-react';
import { toEthiopianDate, getEthiopianMonthName } from '../../lib/ethiopianCalendar';
import { useLanguage } from '../../contexts/LanguageContext';

const GET_SLOTS_FOR_DATE = (dateStr: string | null) => {
  if (!dateStr || dateStr.startsWith('Tue')) return [];

  const commonSlots = [
    '07:30 - 09:30 (EAT)',
    '10:30 - 12:00 (EAT)',
    '02:00 - 04:00 (EAT) Evening',
  ];

  const isWeekend = dateStr.startsWith('Sat') || dateStr.startsWith('Sun');

  if (isWeekend) {
    return [
      '12:00 - 01:00 (EAT)',
      '01:00 - 05:00 (EAT)',
      '05:00 - 06:00 (EAT)',
      ...commonSlots
    ];
  }

  return [
    '12:00 - 02:00 (EAT)',
    '02:00 - 04:00 (EAT)',
    '04:00 - 06:00 (EAT)',
    ...commonSlots
  ];
};

interface ScheduleEntry {
  id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  blocked_reason: string | null;
}

interface BookingEntry {
  date: string;
  time_slot: string;
  status: string;
  team_name: string;
  user_email?: string;
  phone?: string;
}

const checkIsPast = (dateStr: string | null) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const parts = dateStr.split(' ');
  const monthName = parts[1].replace(',', '');
  const dayNum = parseInt(parts[2]);
  
  const d = new Date(`${monthName} ${dayNum}, ${new Date().getFullYear()}`);
  return d < today;
};

const AdminSchedule = () => {
  const { language, t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  const isPast = selectedDate ? checkIsPast(selectedDate) : false;

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const formatDateStr = (dayNumber: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayName}, ${monthName} ${dayNumber}`;
  };

  const isToday = (dayNumber: number) => {
    const today = new Date();
    return today.getDate() === dayNumber && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };

  useEffect(() => {
    if (selectedDate) {
      fetchDateData(selectedDate);
    }
  }, [selectedDate]);

  const fetchDateData = async (dateStr: string) => {
    setLoading(true);
    const [scheduleRes, bookingsRes] = await Promise.all([
      supabase.from('schedule').select('*').eq('date', dateStr),
      supabase.from('bookings').select('date, time_slot, status, team_name, user_email, phone').eq('date', dateStr).in('status', ['Confirmed', 'Pending']),
    ]);

    if (scheduleRes.data) setSchedule(scheduleRes.data);
    if (bookingsRes.data) setBookings(bookingsRes.data);
    setLoading(false);
  };

  const getSlotStatus = (slot: string) => {
    const scheduleEntry = schedule.find(s => s.time_slot === slot);
    const booking = bookings.find(b => b.time_slot === slot);

    if (scheduleEntry && !scheduleEntry.is_available) {
      return { 
        status: 'blocked', 
        reason: scheduleEntry.blocked_reason || 'Blocked by admin', 
        color: 'bg-red-50 border-red-200 text-red-700' 
      };
    }
    if (booking) {
      return { 
        status: 'booked', 
        reason: `${booking.team_name} (${booking.status})`, 
        color: 'bg-blue-50 border-blue-200 text-[#0071e3]',
        contact: {
          team: booking.team_name,
          email: booking.user_email,
          phone: booking.phone
        }
      };
    }
    return { status: 'available', reason: 'Open for booking', color: 'bg-green-50 border-green-200 text-green-700' };
  };

  const toggleSlot = async (slot: string) => {
    if (!selectedDate || isPast) return;
    const existing = schedule.find(s => s.time_slot === slot);
    if (existing) {
      const { error } = await supabase
        .from('schedule')
        .update({ is_available: !existing.is_available, blocked_reason: existing.is_available ? (blockReason || 'Blocked by admin') : null })
        .eq('id', existing.id);
      if (!error) {
        setSchedule(prev => prev.map(s => 
          s.id === existing.id ? { ...s, is_available: !s.is_available, blocked_reason: s.is_available ? (blockReason || 'Blocked by admin') : null } : s
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('schedule')
        .insert([{ date: selectedDate, time_slot: slot, is_available: false, blocked_reason: blockReason || 'Blocked by admin' }])
        .select();
      if (!error && data) setSchedule(prev => [...prev, data[0]]);
    }
  };

  const blockEntireDay = async () => {
    if (!selectedDate || isPast) return;
    setLoading(true);
    for (const slot of GET_SLOTS_FOR_DATE(selectedDate)) {
      const existing = schedule.find(s => s.time_slot === slot);
      if (!existing) {
        await supabase.from('schedule').insert([{ date: selectedDate, time_slot: slot, is_available: false, blocked_reason: blockReason || 'Full day blocked' }]);
      } else if (existing.is_available) {
        await supabase.from('schedule').update({ is_available: false, blocked_reason: blockReason || 'Full day blocked' }).eq('id', existing.id);
      }
    }
    await fetchDateData(selectedDate);
    setLoading(false);
  };

  const openEntireDay = async () => {
    if (!selectedDate || isPast) return;
    setLoading(true);
    const { error } = await supabase.from('schedule').delete().eq('date', selectedDate);
    if (!error) setSchedule([]);
    setLoading(false);
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-apple-display text-3xl font-bold text-gray-900 tracking-tight">{t('admin.schedule')}</h1>
        <p className="font-apple-text text-gray-400 mt-1">Control which time slots are available for each day</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-apple-display font-bold text-gray-900 flex flex-col items-center">
              <span>{monthName}</span>
              {language === 'am' && (
                <span className="text-[10px] text-[#0071e3] font-black uppercase tracking-widest mt-0.5">
                  {getEthiopianMonthName(toEthiopianDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)).month)} {toEthiopianDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)).year}
                </span>
              )}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              return (
                <button
                  key={i}
                  disabled={day === null}
                  onClick={() => day && setSelectedDate(formatDateStr(day))}
                  className={`aspect-square rounded-lg md:rounded-xl flex flex-col items-center justify-center text-[12px] md:text-sm font-apple-text transition-all relative ${
                    day === null ? 'invisible' :
                    selectedDate === (day ? formatDateStr(day) : '') ? 'bg-[#0071e3] text-white font-bold shadow-lg shadow-[#0071e3]/20' :
                    isToday(day) ? 'bg-gray-900 text-white font-bold' :
                    'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  {day}
                  {day && language === 'am' && (
                    <span className="absolute top-1 right-1.5 text-[8px] opacity-50 font-black">
                      {toEthiopianDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)).day}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div> Open
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0071e3]"></div> Booked
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div> Blocked
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
              <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-200">
                <CalendarIcon size={40} />
              </div>
              <h3 className="font-apple-display text-lg font-bold text-gray-400 mb-2">Select a Date</h3>
              <p className="font-apple-text text-xs text-gray-300">Click a day to manage its schedule</p>
            </div>
          ) : (
            <div>
              <div className="px-6 py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                <div className="flex items-center gap-3">
                   {isPast && <div className="p-2 bg-gray-900 text-white rounded-xl"><History size={20} /></div>}
                   <div>
                    <h2 className="font-apple-display text-lg font-bold text-gray-900">{selectedDate}</h2>
                    <p className="font-apple-text text-[10px] font-bold text-[#0071e3] uppercase tracking-widest mt-0.5">
                      {isPast ? 'Booking History (Read-Only)' : 'Manage Availability'}
                    </p>
                  </div>
                </div>
                {!isPast && (
                  <div className="flex gap-2">
                    <button onClick={openEntireDay} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100 text-[#0071e3] text-[10px] font-bold hover:bg-blue-50 transition-colors shadow-sm"><Unlock size={14} /> Open All</button>
                    <button onClick={blockEntireDay} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold hover:bg-red-100 transition-colors shadow-sm"><Lock size={14} /> Block All</button>
                  </div>
                )}
              </div>

              {!isPast && (
                <div className="px-6 py-4 border-b border-gray-50">
                  <label className="font-apple-text text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 block">Block Reason (optional)</label>
                  <input type="text" placeholder="e.g., Maintenance, Private Event..." value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl font-apple-text text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30" />
                </div>
              )}

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12 text-gray-400 font-apple-text">Loading slots...</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {GET_SLOTS_FOR_DATE(selectedDate).map((slot) => {
                      const { status, reason, color, contact } = getSlotStatus(slot);
                      return (
                        <div key={slot} className={`p-4 rounded-xl border-2 transition-all ${color}`}>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${status === 'available' ? 'bg-green-500' : status === 'booked' ? 'bg-[#0071e3]' : 'bg-red-500'}`}></div>
                                <div>
                                  <p className="font-apple-text font-bold text-sm">{slot}</p>
                                  <p className="font-apple-text text-xs opacity-70">{reason}</p>
                                </div>
                              </div>
                              {!isPast && (
                                <button
                                  onClick={() => toggleSlot(slot)}
                                  disabled={status === 'booked'}
                                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${status === 'booked' ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : status === 'blocked' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                >
                                  {status === 'blocked' ? 'Unblock' : status === 'booked' ? 'Booked' : 'Block'}
                                </button>
                              )}
                            </div>

                            {status === 'booked' && contact && (
                              <div className="mt-2 pt-4 border-t border-blue-100 flex flex-wrap gap-x-6 gap-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="bg-blue-100 p-1.5 rounded-lg text-[#0071e3]"><User size={14} /></div>
                                  <p className="font-apple-text text-xs font-bold text-blue-900">{contact.team}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="bg-blue-100 p-1.5 rounded-lg text-[#0071e3]"><Mail size={14} /></div>
                                  <p className="font-apple-text text-xs text-blue-700">{contact.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="bg-blue-100 p-1.5 rounded-lg text-[#0071e3]"><Phone size={14} /></div>
                                  <p className="font-apple-text text-xs text-blue-700">{contact.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default AdminSchedule;
