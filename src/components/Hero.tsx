import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,

      },
    },
  };

  return (
    <div className="relative h-[100dvh] w-full bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)] opacity-70"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-transparent to-[66.943%] to-black"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <motion.div
          className="max-w-[1200px] w-full flex flex-col items-center text-center gap-[32px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-geist font-semibold text-[36px] md:text-[56px] leading-[1.07] tracking-tight text-white max-w-[980px]"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-geist text-[21px] font-normal text-white/80 max-w-[600px] mx-auto leading-[1.19] tracking-tight"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Interactive Block (CTA Only) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center mt-4 gap-4 sm:flex-row sm:justify-center"
          >
            <button
              onClick={() => navigate('/book')}
              className="bg-[#0071e3] text-white font-geist font-normal px-[15px] py-[8px] rounded-[980px] text-[17px] transition-transform hover:scale-[1.02] active:bg-[#ededf2] active:text-[#1d1d1f]"
            >
              {t('hero.cta.primary')}
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-transparent border border-white text-white font-geist font-normal px-[15px] py-[8px] rounded-[980px] text-[17px] hover:bg-white hover:text-black transition-colors"
            >
              {t('hero.cta.secondary')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
