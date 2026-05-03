import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PricingPage = () => {
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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col pt-24 pb-12">
      
      <div className="max-w-[980px] w-full mx-auto px-6 mt-10">
        <div className="text-center mb-16">
          <h1 className="font-geist text-[56px] leading-[1.07] font-semibold text-[#1d1d1f] tracking-tight mb-4">{t('pricing.title')}</h1>
          <p className="font-geist text-[21px] text-[#1d1d1f] opacity-80 leading-[1.19]">{t('pricing.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[8px] p-8 shadow-[0px_5px_30px_0px_rgba(0,0,0,0.1)] border-none flex flex-col h-full hover:scale-[1.02] transition-transform duration-500"
            >
              <h3 className="font-geist text-[21px] leading-[1.19] font-bold text-[#1d1d1f] tracking-tight mb-2">{t(plan.titleKey)}</h3>
              <p className="font-geist text-[14px] text-[#1d1d1f] opacity-80 mb-8">{t(plan.descKey)}</p>
              
              <div className="mt-auto mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-geist text-[40px] font-semibold text-[#1d1d1f] tracking-tight">{plan.price}</span>
                  <span className="font-geist text-[14px] text-[#1d1d1f] opacity-80 font-normal tracking-tight">{t('pricing.currency')}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/book')}
                className="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-geist font-normal text-[17px] py-[8px] px-[15px] rounded-[8px] transition-colors"
              >
                {t('pricing.book')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
