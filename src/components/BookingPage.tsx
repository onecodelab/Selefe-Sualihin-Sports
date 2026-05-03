import { useState } from 'react';

import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = nextDate.getDate();
      const monthName = nextDate.toLocaleDateString('en-US', { month: 'short' });
      const fullDateStr = `${dayName}, ${monthName} ${dayNumber}`;
      dates.push({
        dayName,
        dayNumber,
        monthName,
        fullDateStr,
        isToday: i === 0
      });
    }
    return dates;
  };

  const [dates] = useState(generateDates());

  const [formData, setFormData] = useState({
    name: '',
    teamName: '',
    phone: '',
    date: dates[0].fullDateStr,
    timeSlot: '',
  });

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-12">
      <Navbar />
      
      <div className="max-w-3xl w-full mx-auto px-6">
        {/* Timeline Progress */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-geist font-medium transition-colors duration-300 ${
                  step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              <span className={`text-xs font-geist font-medium ${step >= s ? 'text-green-700' : 'text-gray-500'}`}>
                {s === 1 ? 'Contact Details' : s === 2 ? 'Time Slot' : 'Confirmation'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <h2 className="font-geist text-3xl font-bold text-[#373a46] mb-2">Contact Details</h2>
                
                <div className="flex flex-col gap-2">
                  <label className="font-geist text-sm text-gray-600 font-medium">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors font-geist"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-geist text-sm text-gray-600 font-medium">Team Name</label>
                  <input 
                    type="text" 
                    value={formData.teamName}
                    onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                    placeholder="E.g., Addis United"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors font-geist"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-geist text-sm text-gray-600 font-medium">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="09..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors font-geist"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleNext}
                    disabled={!formData.name || !formData.teamName || !formData.phone}
                    className="bg-[#121212] text-white font-geist font-medium px-8 py-3 rounded-full shadow-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
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
                <h2 className="font-geist text-3xl font-bold text-[#373a46] mb-2">Select Date & Time</h2>
                <p className="font-geist text-sm text-gray-500 mb-2">Pitch availability is determined by the admin. Select an open slot. <strong>All times are listed in EAT (East Africa Time).</strong></p>
                
                {/* Date Selection */}
                <div className="flex gap-3 overflow-x-auto pb-2 mb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {dates.map((d) => (
                    <div
                      key={d.fullDateStr}
                      onClick={() => setFormData({...formData, date: d.fullDateStr, timeSlot: ''})}
                      className={`flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-2xl cursor-pointer transition-all border-2 ${
                        formData.date === d.fullDateStr
                          ? 'border-green-600 bg-green-600 text-white shadow-md'
                          : 'border-gray-100 bg-white hover:border-green-300 text-[#373a46]'
                      }`}
                    >
                      <span className={`text-xs font-geist font-medium opacity-80 ${formData.date === d.fullDateStr ? 'text-green-100' : 'text-gray-500'}`}>
                        {d.isToday ? 'Today' : d.dayName}
                      </span>
                      <span className="text-xl font-bold font-geist mt-1 mb-1">{d.dayNumber}</span>
                      <span className={`text-xs font-geist font-medium opacity-80 ${formData.date === d.fullDateStr ? 'text-green-100' : 'text-gray-500'}`}>
                        {d.monthName}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {timeSlots.map((slot) => (
                    <div 
                      key={slot}
                      onClick={() => setFormData({...formData, timeSlot: slot})}
                      className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
                        formData.timeSlot === slot 
                          ? 'border-green-600 bg-green-50 text-green-800 shadow-sm' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <span className="font-geist font-semibold">{slot}</span>
                      <span className="font-geist text-xs mt-1 text-green-600">Available</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button 
                    onClick={handleBack}
                    className="text-gray-500 font-geist font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.timeSlot || !formData.date}
                    className="bg-[#121212] text-white font-geist font-medium px-8 py-3 rounded-full shadow-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review Booking
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
                <h2 className="font-geist text-3xl font-bold text-[#373a46] mb-2">Confirm Booking</h2>
                
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 border border-gray-100">
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500 font-geist text-sm">Team Name</span>
                    <span className="font-geist font-semibold text-[#373a46]">{formData.teamName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500 font-geist text-sm">Contact Name</span>
                    <span className="font-geist font-semibold text-[#373a46]">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500 font-geist text-sm">Phone</span>
                    <span className="font-geist font-semibold text-[#373a46]">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500 font-geist text-sm">Selected Date</span>
                    <span className="font-geist font-semibold text-green-700">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-geist text-sm">Selected Time</span>
                    <span className="font-geist font-semibold text-green-700">{formData.timeSlot}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <p className="font-geist text-sm text-gray-500 text-center mb-2">Payment gateway (Chapa/Telebirr) will be integrated here.</p>
                  <button 
                    onClick={() => alert('Redirecting to Payment Gateway...')}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-geist font-medium px-8 py-4 rounded-full shadow-[0px_8px_20px_-6px_rgba(22,163,74,0.4)] hover:shadow-[0px_12px_25px_-6px_rgba(22,163,74,0.5)] hover:-translate-y-0.5 transition-all"
                  >
                    Proceed to Payment
                  </button>
                  <button 
                    onClick={handleBack}
                    className="w-full text-gray-500 font-geist font-medium py-3 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Back to Selection
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
