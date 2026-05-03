import React from 'react';
import { MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-[980px] w-full mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left Side: Contact & Info */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <img src="/assets/logo.png" alt="Selefe Sualihin Sports" className="h-16 w-auto object-contain rounded-[8px]" />
              <div>
                <h2 className="font-geist font-semibold text-[28px] leading-[1.14] tracking-tight mb-1 text-white">
                  Selefe Sualihin
                </h2>
                <span className="font-geist font-medium text-[12px] tracking-tight text-white/48">Sports Booking</span>
              </div>
            </div>
            
            <p className="font-geist text-[17px] text-white/80 max-w-md leading-[1.47]">
              {t('footer.desc')}
            </p>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="text-white/80 mt-1">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-geist font-semibold text-[17px] text-white mb-1">{t('footer.location')}</h4>
                  <p className="font-geist text-[14px] text-white/80">{t('footer.location.desc')}</p>
                  <p className="font-geist text-[14px] text-white/48 italic">جامع سلف الصالحين</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-white/80 mt-1">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-geist font-semibold text-[17px] text-white mb-1">{t('footer.contact')}</h4>
                  <p className="font-geist text-[14px] text-white/80">0911 79 2332</p>
                  <p className="font-geist text-[14px] text-white/80">info@selefesuualihinsports.com</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <a href="#" className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Right Side: Map */}
          <div className="relative">
            <div className="relative h-[450px] w-full rounded-[12px] overflow-hidden bg-[#1d1d1f]">
              <iframe 
                src="https://maps.google.com/maps?q=Selefe%20Sualihin%20Masjid&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Selefe Sualihin Masjid Location"
                className="grayscale opacity-80"
              ></iframe>
              
              {/* Overlay Controls */}
               <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 pointer-events-none opacity-80">
                <div className="flex gap-2">
                  <div className="bg-[rgba(255,255,255,0.8)] backdrop-blur-[20px] text-black px-4 py-2 rounded-[8px] text-[12px] font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#0071e3] rounded-full"></span>
                    {t('nav.facilities')}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] text-white px-3 py-2 rounded-[8px] text-[12px] font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
                    {t('map.3d')}
                  </div>
                  <div className="bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] text-white px-3 py-2 rounded-[8px] text-[12px] font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    {t('map.reset')}
                  </div>
                </div>

                <div className="bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] rounded-[8px] px-3 py-2 text-[10px] text-white/80">
                  <div className="flex justify-between gap-4">
                    <span>{t('map.pitch')}: <span className="text-white">60°</span></span>
                    <span>{t('map.bearing')}: <span className="text-white">-20°</span></span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-[#0071e3] text-white px-3 py-1 rounded-[980px] text-[10px] font-semibold tracking-tight">
                  Live View
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-geist text-white/48 text-[12px]">
            {t('footer.rights')}
          </p>
          <div className="flex gap-8 font-geist text-[12px] text-white/80">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.refund')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
