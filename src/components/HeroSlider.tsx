import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { translations } from '../translations';
import { Language, ChurchSettings } from '../types';

interface HeroSliderProps {
  currentLanguage: Language;
  settings: ChurchSettings;
  setCurrentPage: (page: string) => void;
}

export default function HeroSlider({ currentLanguage, settings, setCurrentPage }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = translations[currentLanguage];

  const slides = [
    {
      image: settings.heroBannerUrl,
      title: settings.churchName[currentLanguage],
      subtitle: currentLanguage === 'en' ? 'Where Healing, Grace, and Restoration Abounds' : 'స్వస్థత, కృప మరియు పునరుద్ధరణల దివ్య నిలయం',
      verse: settings.bibleVerse.verse[currentLanguage],
      ref: settings.bibleVerse.reference[currentLanguage]
    },
    {
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1920',
      title: currentLanguage === 'en' ? 'Lifting Heavenly Praises' : 'పరలోక స్తుతుల ఆరాధన',
      subtitle: currentLanguage === 'en' ? 'Join our anointed worship team in spirit and in truth' : 'ఆత్మతోను సత్యముతోను ఆరాధించుటకు మాతో చేరండి',
      verse: currentLanguage === 'en' ? '"Enter his gates with thanksgiving and his courts with praise."' : '"కృతజ్ఞతాస్తుతులు చెల్లించుచు ఆయన గుమ్మములలో ప్రవేశించుడి."',
      ref: currentLanguage === 'en' ? 'Psalm 100:4' : 'కీర్తనలు 100:4'
    },
    {
      image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=1920',
      title: currentLanguage === 'en' ? 'Miracles & Deliverance' : 'అద్భుతాలు & విడుదల సభలు',
      subtitle: currentLanguage === 'en' ? 'Experience the supernatural healing power of Lord Jesus' : 'ప్రభువైన యేసుక్రీస్తు యొక్క అద్భుత స్వస్థత శక్తులను అనుభవించండి',
      verse: currentLanguage === 'en' ? '"Jesus Christ is the same yesterday and today and forever."' : '"యేసుక్రీస్తు నిన్న, నేడు, నిరంతరమును ఏకరీతిగా ఉన్నాడు."',
      ref: currentLanguage === 'en' ? 'Hebrews 13:8' : 'హెబ్రీయులకు 13:8'
    }
  ];

  // Auto slide every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      style={{
        height: settings.heroSliderHeight || '85vh'
      }}
      className="relative w-full overflow-hidden bg-black border-b border-[#D4AF37]/30" 
      id="hero_slider"
    >
      
      {/* Slider Carousel Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
          id={`hero_slide_bg_${currentIndex}`}
        />
      </AnimatePresence>

      {/* Luxury Dark Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-at-c from-black/20 via-black/80 to-[#0B0B0B]" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

      {/* Gold Rimmed Content Card container */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center z-10 space-y-6">
          
          {/* Animated Gold Cross Divider */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-3"
            id="hero_cross_divider"
          >
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] font-serif text-lg">✙</span>
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[11px] sm:text-xs font-mono tracking-[0.4em] text-[#D4AF37] uppercase"
          >
            {slides[currentIndex].subtitle}
          </motion.p>

          {/* Dynamic Headline */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans text-white leading-tight"
            >
              {slides[currentIndex].title}
            </motion.h2>
          </AnimatePresence>

          {/* Animated Bible Verse Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`verse-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto p-4 sm:p-5 rounded border border-[#D4AF37]/20 bg-black/70 backdrop-blur-md shadow-2xl relative"
              id="hero_verse_box"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4AF37]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4AF37]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4AF37]" />

              <blockquote className="text-sm sm:text-base italic text-neutral-200">
                {slides[currentIndex].verse}
              </blockquote>
              <cite className="block mt-2 text-xs sm:text-sm font-mono text-[#D4AF37] not-italic">
                — {slides[currentIndex].ref}
              </cite>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            id="hero_cta_buttons"
          >
            <button
              onClick={() => setCurrentPage('contact')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Calendar size={15} />
              <span>{t.joinWorship}</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('sermons')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 border border-white/40 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white font-bold text-xs uppercase tracking-widest rounded transition-all duration-300 bg-white/5 backdrop-blur-sm"
            >
              <Play size={15} />
              <span>{t.watchSermons}</span>
            </button>
          </motion.div>

        </div>
      </div>

      {/* Manual Slider Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/10 bg-black/40 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/10 bg-black/40 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300 z-10"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10" id="hero_dot_indicators">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'bg-[#D4AF37] w-6' : 'bg-neutral-600 hover:bg-neutral-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
