import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Send, CheckCircle, ShieldAlert, BookOpen, Clock } from 'lucide-react';
import { translations } from '../translations';
import { Language, PrayerRequest } from '../types';

interface PrayerRequestFormProps {
  currentLanguage: Language;
}

export default function PrayerRequestForm({ currentLanguage }: PrayerRequestFormProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', request: '' });
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentPrayers, setRecentPrayers] = useState<PrayerRequest[]>([]);

  const t = translations[currentLanguage];

  // Fetch recent public prayer requests on load
  useEffect(() => {
    fetchRecentPrayers();
  }, []);

  const fetchRecentPrayers = async () => {
    try {
      const response = await fetch('/api/prayer-requests');
      if (response.status === 401) {
        // Preseeded anonymous wall items for general public inspiration!
        setRecentPrayers([
          { id: '1', name: 'Sister Grace', phone: '', email: '', request: 'For my grandmother who is undergoing heart surgery this Friday.', status: 'Praying', date: '2026-07-18T10:30:00Z' },
          { id: '2', name: 'Anonymous Brother', phone: '', email: '', request: 'Seeking deliverance from severe anxiety, depression, and family financial burdens.', status: 'Answered', date: '2026-07-15T08:15:00Z' },
          { id: '3', name: 'Srinivas', phone: '', email: '', request: 'Pray for my daughter\'s final competitive exams and her career path.', status: 'Praying', date: '2026-07-12T14:20:00Z' }
        ]);
      } else if (response.ok) {
        const data = await response.json();
        setRecentPrayers(data.slice(0, 5));
      }
    } catch (e) {
      console.error('Error fetching prayer requests:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.request) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', request: '' });
        fetchRecentPrayers(); // refresh local list
        
        // Hide success message after 6 seconds
        setTimeout(() => setSuccess(false), 6000);
      }
    } catch (e) {
      console.error('Failed to submit prayer request:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: 'Pending' | 'Praying' | 'Answered') => {
    switch (status) {
      case 'Answered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/30 text-[9px] font-mono uppercase font-bold animate-pulse">
            <CheckCircle size={10} />
            <span>ANSWERED / సాక్ష్యం</span>
          </span>
        );
      case 'Praying':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-mono uppercase font-bold animate-pulse">
            <Clock size={10} />
            <span>ACTIVELY PRAYING / ప్రార్థిస్తున్నాము</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 text-[9px] font-mono uppercase font-bold">
            <Clock size={10} />
            <span>PENDING / అభ్యర్థన</span>
          </span>
        );
    }
  };

  return (
    <div className="py-16 bg-[#0B0B0B]" id="prayer_request_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2">
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] font-mono uppercase tracking-[0.2em] text-xs">THRONE OF GRACE</span>
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase mt-2">
            {t.prayerSectionTitle}
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            {t.prayerSectionSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#141414] border border-[#D4AF37]/25 rounded-lg p-6 sm:p-8 shadow-2xl relative" id="prayer_form_container">
            {/* Corner border accents */}
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#D4AF37]" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-[#D4AF37]" />
            
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 sm:p-8 rounded-lg border border-green-500/30 bg-green-500/5 text-center space-y-4"
                  id="prayer_success_alert"
                >
                  <CheckCircle size={48} className="text-green-500 mx-auto" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Request Received</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-md mx-auto">
                    {t.successRequest}
                  </p>
                  <p className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">
                    Matthew 18:19: "Again I say to you, if two of you agree on earth about anything they ask, it will be done for them by my Father in heaven."
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" id="prayer_request_entry_form">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="prayer_name" className="block text-xs font-mono tracking-widest text-neutral-400 uppercase">
                        {t.placeholderName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="prayer_name"
                        type="text"
                        required
                        placeholder="e.g., Srinivas Rao"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white rounded px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4AF37] transition font-sans"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="prayer_phone" className="block text-xs font-mono tracking-widest text-neutral-400 uppercase">
                        {t.placeholderPhone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="prayer_phone"
                        type="tel"
                        required
                        placeholder="e.g., +91 98480xxxxx"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white rounded px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4AF37] transition font-sans"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="prayer_email" className="block text-xs font-mono tracking-widest text-neutral-400 uppercase">
                      {t.placeholderEmail}
                    </label>
                    <input
                      id="prayer_email"
                      type="email"
                      placeholder="e.g., srinivas.rao@gmail.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-neutral-800 text-white rounded px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4AF37] transition font-sans"
                    />
                  </div>

                  {/* Request description */}
                  <div className="space-y-2">
                    <label htmlFor="prayer_description" className="block text-xs font-mono tracking-widest text-neutral-400 uppercase">
                      Describe your Prayer Request <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="prayer_description"
                      rows={5}
                      required
                      placeholder={t.placeholderRequest}
                      value={formData.request || ''}
                      onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                      className="w-full bg-black border border-neutral-800 text-white rounded px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4AF37] transition font-sans resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold uppercase tracking-widest text-xs rounded hover:opacity-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>{t.submitBtn}</span>
                  </button>

                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Dynamic Prayer Wall (5 Cols) */}
          <div className="lg:col-span-5 bg-[#141414] border border-[#D4AF37]/20 rounded-lg p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between" id="prayer_wall">
            
            <div className="space-y-6">
              <h3 className="text-sm font-mono text-[#D4AF37] uppercase tracking-widest flex items-center space-x-2 border-b border-neutral-800 pb-3">
                <Heart size={14} className="text-red-500 animate-pulse" />
                <span>Intercessory Prayer Shield Wall</span>
              </h3>

              <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-none pr-1" id="prayer_requests_stream">
                {recentPrayers.map((pray) => (
                  <div key={pray.id} className="p-4 rounded bg-black border border-neutral-800/80 space-y-2.5">
                    
                    {/* Meta info */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-400 font-bold uppercase">{pray.name}</span>
                      <span>{new Date(pray.date).toLocaleDateString()}</span>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed italic">
                      "{pray.request}"
                    </p>

                    <div className="flex justify-between items-center pt-1 border-t border-neutral-800/50">
                      <span className="text-[9px] font-mono text-neutral-500">JSM SHELD</span>
                      {getStatusBadge(pray.status)}
                    </div>

                  </div>
                ))}

                {recentPrayers.length === 0 && (
                  <div className="text-center py-12 text-neutral-500">
                    <BookOpen className="mx-auto text-neutral-700 mb-2" size={32} />
                    <p className="text-xs">No public prayer requests currently. Submitted items will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-3 bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 leading-relaxed rounded">
              <span className="text-[#D4AF37] font-bold block uppercase mb-1">PROVERBS 15:29</span>
              "The Lord is far from the wicked, but he hears the prayer of the righteous." Under Pastor Shalem Raju\'s intercessory oversight, your requests are handled with absolute confidentiality and scriptural devotion.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
