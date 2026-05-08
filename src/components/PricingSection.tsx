import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const PricingSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const pricingPlans = [
    {
      titleKey: 'pricing.weekday1',
      descKey: 'pricing.weekday.desc',
      price: '750',
    },
    {
      titleKey: 'pricing.weekday2',
      descKey: 'pricing.weekday.desc',
      price: '1200',
    },
    {
      titleKey: 'pricing.weekend1',
      descKey: 'pricing.weekend.desc',
      price: '1000',
    },
    {
      titleKey: 'pricing.weekend2',
      descKey: 'pricing.weekend.desc',
      price: '1500',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#f5f5f7]">
      <div className="max-w-[980px] w-full mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-geist text-[40px] leading-[1.1] tracking-tight font-semibold text-[#1d1d1f] mb-4"
          >
            {t('pricing.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-geist text-[17px] leading-[1.47] text-[#1d1d1f] opacity-80"
          >
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[24px] p-8 flex flex-col h-full shadow-[0px_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0px_10px_40px_rgba(0,0,0,0.08)] hover:scale-[1.02] border border-gray-100"
            >
              <h3 className="font-geist text-[20px] leading-tight font-bold text-[#1d1d1f] tracking-tight mb-2">{t(plan.titleKey)}</h3>
              <p className="font-geist text-[14px] text-gray-500 mb-8 leading-relaxed">{t(plan.descKey)}</p>
              
              <div className="mt-auto mb-8 flex items-baseline gap-2">
                <span className="font-geist text-[48px] font-bold text-[#1d1d1f] tracking-tighter">{plan.price}</span>
                <span className="font-geist text-[18px] text-gray-400 font-medium">{t('pricing.currency')}</span>
              </div>
              
              <button 
                onClick={() => navigate('/book')}
                className="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-geist font-medium text-[15px] py-3.5 px-6 rounded-[980px] transition-all active:scale-[0.96] shadow-sm hover:shadow-md"
              >
                {t('pricing.book')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

