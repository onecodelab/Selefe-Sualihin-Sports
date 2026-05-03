import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

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
          <h2 className="font-geist text-[40px] leading-[1.1] tracking-tight font-semibold text-[#1d1d1f] mb-4">{t('pricing.title')}</h2>
          <p className="font-geist text-[17px] leading-[1.47] text-[#1d1d1f] opacity-80">{t('pricing.subtitle')}</p>
        </div>

        {/* Horizontal scroll container on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className="min-w-[300px] snap-center bg-white rounded-[12px] p-8 flex flex-col h-full shadow-[0px_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:scale-[1.02] border border-gray-50"
            >
              <h3 className="font-geist text-[24px] leading-tight font-bold text-[#1d1d1f] tracking-tight mb-2">{t(plan.titleKey)}</h3>
              <p className="font-geist text-[14px] text-gray-500 mb-8">{t(plan.descKey)}</p>
              
              <div className="mt-auto mb-8 flex items-baseline gap-2">
                <span className="font-geist text-[48px] font-bold text-[#1d1d1f] tracking-tighter">{plan.price}</span>
                <span className="font-geist text-[24px] text-gray-400 font-medium">{t('pricing.currency')}</span>
              </div>
              
              <button 
                onClick={() => navigate('/book')}
                className="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-geist font-normal text-[17px] py-3 px-6 rounded-xl transition-all active:scale-[0.98]"
              >
                {t('pricing.book')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
