import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toEthiopianDate, getEthiopianMonthName, getEthiopianDayName } from '../lib/ethiopianCalendar';

const BookingPage = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = nextDate.getDate();
      const monthName = nextDate.toLocaleDateString('en-US', { month: 'short' });
      const fullDateStr = `${dayName}, ${monthName} ${dayNumber}`;
      
      const eth = toEthiopianDate(nextDate);
      
      dates.push({
        dayName,
        dayNumber,
        monthName,
        fullDateStr,
        isToday: i === 0,
        ethDay: eth.day,
        ethMonth: eth.monthName,
        ethDayName: getEthiopianDayName(nextDate)
      });
    }
    return dates;
  };

  const [dates] = useState(generateDates());
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    teamName: '',
    phone: '',
    date: dates[0].fullDateStr,
    timeSlot: '',
  });

  useEffect(() => {
    if (user && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.email?.split('@')[0] || '' }));
    }
  }, [user]);

  // Fetch occupied slots whenever the selected date changes
  useEffect(() => {
    fetchOccupiedSlots(formData.date);
  }, [formData.date]);

  const fetchOccupiedSlots = async (selectedDate: string) => {
    setLoading(true);

    // Check both: bookings AND admin-blocked schedule entries
    const [bookingsRes, scheduleRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('time_slot')
        .eq('date', selectedDate)
        .in('status', ['Confirmed', 'Pending']),
      supabase
        .from('schedule')
        .select('time_slot')
        .eq('date', selectedDate)
        .eq('is_available', false),
    ]);

    const bookedSlots = bookingsRes.data?.map(b => b.time_slot) || [];
    const blockedSlots = scheduleRes.data?.map(s => s.time_slot) || [];
    
    // Merge both lists (no duplicates)
    const allUnavailable = [...new Set([...bookedSlots, ...blockedSlots])];
    setOccupiedSlots(allUnavailable);
    setLoading(false);
  };


  const getSlotsForDate = (dateStr: string) => {
    if (dateStr.startsWith('Tue')) return [];

    const isWeekend = dateStr.startsWith('Sat') || dateStr.startsWith('Sun');

    if (isWeekend) {
      return [
        '07:30 - 09:30 (EAT)', // 2h
        '10:30 - 12:30 (EAT)', // 2h
        '12:30 - 01:30 (EAT)', // 1h
        '01:30 - 03:30 (EAT)', // 2h
        '03:30 - 05:30 (EAT)', // 2h
        '05:30 - 06:30 (EAT)', // 1h
      ];
    }

    return [
      '07:30 - 09:30 (EAT)', // 2h
      '10:30 - 11:30 (EAT)', // 1h
      '12:00 - 02:00 (EAT)', // 2h
      '02:00 - 04:00 (EAT)', // 2h
      '04:00 - 06:00 (EAT)', // 2h
    ];
  };

  const activeTimeSlots = getSlotsForDate(formData.date);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const calculatePrice = (dateStr: string, timeSlot: string) => {
    if (dateStr.startsWith('Tue')) return 0;

    const isWeekend = dateStr.startsWith('Sat') || dateStr.startsWith('Sun');
    
    // Check for 1 hour duration
    const is1Hour = timeSlot.includes('11:30') || timeSlot.includes('12:30 - 01:30') || timeSlot.includes('05:30 - 06:30');
    
    if (isWeekend) {
      return is1Hour ? 1000 : 1500;
    } else {
      return is1Hour ? 750 : 1200;
    }
  };

  const handleBooking = async () => {
    if (!user) {
      setError('You must be signed in to book a pitch.');
      navigate('/login');
      return;
    }

    if (formData.date.startsWith('Tue')) {
      setError('Bookings are not available on Tuesdays.');
      return;
    }

    setLoading(true);
    setError(null);

    const price = calculatePrice(formData.date, formData.timeSlot);

    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: user.id,
          team_name: formData.teamName,
          contact_name: formData.name,
          phone: formData.phone,
          date: formData.date,
          time_slot: formData.timeSlot,
          status: 'Pending',
          price: price
        }
      ]);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success!
      setStep(4); // Success step
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col pt-24 pb-12">
      
      <div className="max-w-[980px] w-full mx-auto px-6">
        {/* Timeline Progress */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-black/5 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0071e3] -z-10 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-[#f5f5f7] px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-geist font-medium transition-colors duration-300 ${
                  step >= s ? 'bg-[#0071e3] text-white' : 'bg-black/5 text-[#1d1d1f]'
                }`}
              >
                {s}
              </div>
              <span className={`text-[12px] font-geist font-medium tracking-tight ${step >= s ? 'text-[#0071e3]' : 'text-[#1d1d1f] opacity-48'}`}>
                {s === 1 ? t('booking.step1') : s === 2 ? t('booking.step2') : s === 3 ? t('booking.step3') : t('Done')}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[12px] shadow-[0px_5px_30px_0px_rgba(0,0,0,0.1)] p-6 md:p-12 overflow-hidden">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-geist font-medium text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <h2 className="font-geist text-[28px] leading-[1.14] font-semibold text-[#1d1d1f] tracking-tight mb-2">{t('booking.contact.title')}</h2>
                
                <div className="flex flex-col gap-2">
                  <label className="font-geist text-[14px] text-[#1d1d1f] font-medium opacity-80">{t('booking.name')}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t('booking.name.placeholder')}
                    className="w-full bg-[#fafafc] border-[3px] border-[rgba(0,0,0,0.04)] rounded-[11px] px-[14px] py-[10px] outline-none focus:border-[#0071e3] focus:bg-white transition-colors font-geist text-[17px] text-[#1d1d1f]"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-geist text-[14px] text-[#1d1d1f] font-medium opacity-80">{t('booking.team')}</label>
                  <input 
                    type="text" 
                    value={formData.teamName}
                    onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                    placeholder={t('booking.team.placeholder')}
                    className="w-full bg-[#fafafc] border-[3px] border-[rgba(0,0,0,0.04)] rounded-[11px] px-[14px] py-[10px] outline-none focus:border-[#0071e3] focus:bg-white transition-colors font-geist text-[17px] text-[#1d1d1f]"
                  />
                </div>
 
                <div className="flex flex-col gap-2">
                  <label className="font-geist text-[14px] text-[#1d1d1f] font-medium opacity-80">{t('booking.phone')}</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder={t('booking.phone.placeholder')}
                    className="w-full bg-[#fafafc] border-[3px] border-[rgba(0,0,0,0.04)] rounded-[11px] px-[14px] py-[10px] outline-none focus:border-[#0071e3] focus:bg-white transition-colors font-geist text-[17px] text-[#1d1d1f]"
                  />
                </div>
 
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleNext}
                    disabled={!formData.name || !formData.teamName || !formData.phone}
                    className="font-geist font-normal text-[17px] px-8 py-3 rounded-xl transition-colors disabled:bg-gray-100 disabled:text-gray-400 bg-[#0071e3] hover:bg-[#0077ED] text-white"
                  >
                    {t('booking.continue')}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <h2 className="font-geist text-[28px] leading-[1.14] font-semibold text-[#1d1d1f] tracking-tight mb-2">{t('booking.datetime.title')}</h2>
                
                {/* Date Selection */}
                <div className="flex gap-3 overflow-x-auto pb-2 mb-2 no-scrollbar">
                  {dates.map((d) => (
                    <div
                      key={d.fullDateStr}
                      onClick={() => setFormData({...formData, date: d.fullDateStr, timeSlot: ''})}
                      className={`flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-xl cursor-pointer transition-all border-2 ${
                        formData.date === d.fullDateStr
                          ? 'border-[#0071e3] bg-[#0071e3] text-white'
                          : 'border-transparent bg-[#f5f5f7] hover:border-[#0071e3]/30 text-[#1d1d1f]'
                      }`}
                    >
                      <span className="text-[12px] font-geist font-medium opacity-80">
                        {language === 'am' ? d.ethDayName : d.dayName}
                      </span>
                      <span className="text-[21px] font-bold font-geist">
                        {language === 'am' ? d.ethDay : d.dayNumber}
                      </span>
                      <span className="text-[12px] font-geist font-medium opacity-80">
                        {language === 'am' ? d.ethMonth : d.monthName}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 relative min-h-[200px]">
                  {loading && step === 2 && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl font-geist text-sm text-[#0071e3] font-bold">
                      Checking availability...
                    </div>
                  )}
                  
                  {activeTimeSlots.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    return (
                      <div 
                        key={slot}
                        onClick={() => !isOccupied && setFormData({...formData, timeSlot: slot})}
                        className={`border-[2px] rounded-xl p-4 flex flex-col items-center justify-center transition-all ${
                          isOccupied 
                            ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60' 
                            : formData.timeSlot === slot 
                              ? 'border-[#0071e3] bg-white text-[#1d1d1f] cursor-pointer shadow-md' 
                              : 'border-transparent bg-[#f5f5f7] hover:border-[#0071e3]/30 text-[#1d1d1f] cursor-pointer'
                        }`}
                      >
                        <span className={`font-geist font-semibold text-[17px] ${isOccupied ? 'text-gray-400 line-through' : 'text-[#1d1d1f]'}`}>
                          {slot}
                        </span>
                        <span className={`font-geist text-[12px] mt-1 font-bold ${isOccupied ? 'text-red-400' : 'text-[#0071e3]'}`}>
                          {isOccupied ? 'Occupied' : t('booking.available')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={handleBack} className="text-[#0071e3] font-geist font-bold">{t('booking.back')}</button>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.timeSlot || !formData.date}
                    className="font-geist font-normal text-[17px] px-8 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ED] text-white disabled:opacity-50"
                  >
                    {t('booking.review')}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <h2 className="font-geist text-[28px] leading-[1.14] font-semibold text-[#1d1d1f] tracking-tight mb-2">{t('booking.confirm.title')}</h2>
                
                <div className="bg-[#f5f5f7] rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex justify-between border-b border-black/5 pb-3">
                    <span className="text-gray-500 font-geist text-[14px]">{t('booking.confirm.team')}</span>
                    <span className="font-geist font-semibold text-[#1d1d1f]">{formData.teamName}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-3">
                    <span className="text-gray-500 font-geist text-[14px]">{t('booking.confirm.date')}</span>
                    <span className="font-geist font-semibold text-[#1d1d1f]">{formData.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-3">
                    <span className="text-gray-500 font-geist text-[14px]">{t('booking.confirm.time')}</span>
                    <span className="font-geist font-semibold text-[#1d1d1f]">{formData.timeSlot}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500 font-geist text-[14px]">{t('dashboard.amount')}</span>
                    <span className="font-geist font-black text-[21px] text-[#0071e3]">{calculatePrice(formData.date, formData.timeSlot)} {t('pricing.currency')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button 
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full bg-[#0071e3] text-white font-geist font-bold py-4 rounded-xl hover:bg-[#0077ED] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : t('booking.payment.proceed')}
                  </button>
                  <button onClick={handleBack} className="text-[#0071e3] font-geist font-bold">{t('booking.payment.back')}</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-6 py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={40} />
                </div>
                <h2 className="font-geist text-3xl font-bold text-[#1d1d1f]">{t('booking.success.title') || 'Booking Successful!'}</h2>
                <p className="font-geist text-gray-500 max-w-sm">
                  {t('booking.success.desc') || 'Your pitch reservation has been received. Check your dashboard for status.'}
                </p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#1d1d1f] text-white px-10 py-4 rounded-2xl font-geist font-bold mt-4 shadow-xl hover:scale-105 transition-all"
                >
                  {t('nav.dashboard')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
