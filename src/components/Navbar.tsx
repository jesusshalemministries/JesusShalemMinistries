import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, User, ShieldAlert, Heart } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface NavbarProps {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  adminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({
  currentLanguage,
  setCurrentLanguage,
  currentPage,
  setCurrentPage,
  adminLoggedIn,
  onLogout,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[currentLanguage];

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.aboutChurch },
    { id: 'pastor', label: t.aboutPastor },
    { id: 'ministries', label: t.ministries },
    { id: 'sermons', label: t.sermons },
    { id: 'gallery', label: t.gallery },
    { id: 'events', label: t.events },
    { id: 'live', label: t.liveStream },
    { id: 'prayer', label: t.prayerRequest },
    { id: 'testimonials', label: t.testimonials },
    { id: 'contact', label: t.contact },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-xl" id="church_navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { setCurrentPage('home'); setIsOpen(false); }}
            id="brand_logo_wrapper"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-black flex items-center justify-center">
              <img 
                src="/src/assets/images/church_logo_new_1784635370468.jpg" 
                alt="Jesus Shalem Ministries Logo" 
                className="w-10 h-10 object-cover group-hover:scale-110 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] bg-clip-text text-transparent uppercase">
                Jesus Shalem
              </h1>
              <p className="text-[10px] text-neutral-400 tracking-[0.25em] font-mono leading-none">
                MINISTRIES
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1" id="desktop_nav_links">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 border-b-2 hover:text-[#D4AF37] ${
                  currentPage === item.id 
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' 
                    : 'border-transparent text-neutral-300 hover:border-[#D4AF37]/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4" id="desktop_action_btns">
            
            {/* Donate CTA */}
            <button
              onClick={() => setCurrentPage('donate')}
              className={`flex items-center space-x-1 px-4 py-2 text-xs uppercase tracking-widest font-bold rounded border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 ${
                currentPage === 'donate' ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-[#D4AF37]'
              }`}
            >
              <Heart size={14} className="animate-pulse" />
              <span>{t.donate}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'te' : 'en')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-neutral-800 text-neutral-300 hover:border-[#D4AF37] hover:text-white text-xs font-medium transition-all duration-300 bg-[#141414]"
              title="Toggle Language / భాష మార్చండి"
            >
              <Globe size={14} className="text-[#D4AF37]" />
              <span>{currentLanguage === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Admin CMS Access */}
            {adminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="p-2 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs uppercase font-mono transition-all duration-300"
                  title="Admin CMS Dashboard"
                >
                  <ShieldAlert size={14} />
                </button>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded text-[10px] text-neutral-400 border border-neutral-800 hover:text-white hover:border-red-500 transition-all duration-300"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('admin_login')}
                className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:border-[#D4AF37] hover:text-white transition-all duration-300 bg-[#141414]"
                title="Admin Login Portal"
              >
                <User size={15} />
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center space-x-3 lg:hidden" id="mobile_nav_controls">
            
            {/* Language Switcher Mobile */}
            <button
              onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'te' : 'en')}
              className="p-2 rounded-full border border-neutral-800 text-[#D4AF37] bg-[#141414] hover:border-[#D4AF37] text-xs transition-all duration-300"
            >
              <Globe size={15} />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-neutral-300 hover:text-[#D4AF37] focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0F0F0F] border-b border-[#D4AF37]/30 px-4 pt-2 pb-6 space-y-2 shadow-2xl"
            id="mobile_nav_drawer"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-widest rounded transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-4 border-[#D4AF37]'
                    : 'text-neutral-300 hover:bg-[#141414] hover:text-[#D4AF37]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-neutral-800 space-y-3 px-2">
              
              <button
                onClick={() => {
                  setCurrentPage('donate');
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold uppercase tracking-widest text-xs rounded hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                <Heart size={15} />
                <span>{t.donate}</span>
              </button>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">ADMIN CMS PORTAL</span>
                {adminLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setCurrentPage('admin');
                        setIsOpen(false);
                      }}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-mono uppercase rounded"
                    >
                      CMS Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      {t.logout}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentPage('admin_login');
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-neutral-800 text-neutral-300 rounded text-xs bg-[#141414]"
                  >
                    <User size={13} className="text-[#D4AF37]" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
