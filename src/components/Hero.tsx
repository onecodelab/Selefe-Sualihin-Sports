import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

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
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-white">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white"></div>
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
            className="font-geist font-medium text-[50px] md:text-[80px] leading-[1.1] tracking-[-0.04em] text-gray-900"
          >
            Premium{' '}
            <span
              className="font-instrument italic text-[60px] md:text-[100px] font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              pitch booking
            </span>{' '}
            <br className="hidden md:block" />
            for your football team
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-geist text-[18px] text-[#373a46] opacity-80 max-w-[400px] mx-auto leading-relaxed"
          >
            Seamlessly book top-tier pitches for your next training or match.
          </motion.p>

          {/* Interactive Block (CTA Only) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center mt-4"
          >
            <button
              onClick={() => navigate('/book')}
              className="bg-gradient-to-b from-[#2a2a2a] to-[#121212] text-white font-geist font-medium px-10 py-5 rounded-[40px] text-lg shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25),inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Pitch Now
            </button>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
