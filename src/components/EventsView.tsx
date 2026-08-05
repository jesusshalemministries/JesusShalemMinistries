import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, Clock, Send, Ticket, CheckCircle, Sparkles } from 'lucide-react';
import { translations } from '../translations';
import { Language, Event } from '../types';

interface EventsViewProps {
  currentLanguage: Language;
  events: Event[];
  onEventRegistered: (eventId: string) => void;
}

export default function EventsView({ currentLanguage, events, onEventRegistered }: EventsViewProps) {
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [successEventId, setSuccessEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[currentLanguage];

  // Divide into upcoming and past
  const upcomingEvents = events.filter(e => !e.isPast);
  const pastEvents = events.filter(e => e.isPast);

  // Countdown timer for primary upcoming event (Ponnavaram Healing Crusades)
  const primaryEvent = upcomingEvents[0];
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!primaryEvent) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(primaryEvent.date) - +new Date();
      let tempTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        tempTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(tempTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [primaryEvent]);

  // Handle Event Registration Form Submit
  const handleRegister = async (e: React.FormEvent, eventId: string) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        onEventRegistered(eventId); // update local state
        setSuccessEventId(eventId);
        setFormData({ name: '', email: '', phone: '' });
        
        // hide success banner after 5 seconds
        setTimeout(() => {
          setSuccessEventId(null);
          setRegisteringEventId(null);
        }, 5000);
      }
    } catch (err) {
      console.error('Error registering for event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-[#0B0B0B]" id="events_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            Holy Crusades & Congregational Gatherings
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Be part of our mighty upcoming gatherings. Save your seats in faith, and invite the sick, oppressed, and seeking.
          </p>
        </div>

        {/* Dynamic Countdown Timer Widget (Primary Event) */}
        {primaryEvent && (
          <div className="mb-16 p-6 sm:p-10 bg-gradient-to-r from-black via-[#141414] to-black border-2 border-[#D4AF37] rounded-lg shadow-2xl relative overflow-hidden" id="event_countdown_widget">
            {/* Background geometric flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Event Meta Column */}
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono font-bold tracking-widest uppercase animate-pulse">
                  <Clock size={11} />
                  <span>CRUSADE COUNTDOWN</span>
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {primaryEvent.title[currentLanguage]}
                </h3>
                <div className="space-y-2 text-xs text-neutral-300 font-mono">
                  <div className="flex items-center space-x-2">
                    <Calendar size={13} className="text-[#D4AF37]" />
                    <span>{new Date(primaryEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={13} className="text-[#D4AF37]" />
                    <span>{primaryEvent.location[currentLanguage]}</span>
                  </div>
                </div>
              </div>

              {/* Grid of countdown boxes */}
              <div className="lg:col-span-7 flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-end" id="countdown_clock_boxes">
                
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINUTES', val: timeLeft.minutes },
                  { label: 'SECONDS', val: timeLeft.seconds }
                ].map((item) => (
                  <div key={item.label} className="w-16 sm:w-24 p-3 sm:p-5 rounded bg-black/90 border border-[#D4AF37]/30 text-center shadow-lg">
                    <span className="block text-xl sm:text-4xl font-extrabold font-mono text-[#D4AF37] tracking-tight">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="block text-[8px] sm:text-[10px] text-neutral-400 tracking-wider font-mono uppercase mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}

              </div>

            </div>
          </div>
        )}

        {/* Upcoming Events List */}
        <div className="space-y-8" id="upcoming_events_list">
          <h3 className="text-xl font-bold uppercase text-[#D4AF37] tracking-wider border-b border-neutral-800 pb-3 flex items-center space-x-2">
            <Ticket size={18} />
            <span>{t.upcomingEvents}</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => {
              const isRegistering = registeringEventId === event.id;
              const isSuccess = successEventId === event.id;

              return (
                <div
                  key={event.id}
                  className="bg-[#141414] border border-[#D4AF37]/20 rounded-lg overflow-hidden flex flex-col justify-between shadow-2xl relative"
                  id={`event_card_${event.id}`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-1 rounded uppercase tracking-widest">
                        UPCOMING FELLOWSHIP
                      </span>
                      <span className="flex items-center space-x-1 text-xs font-mono text-neutral-500">
                        <Users size={12} className="text-[#D4AF37]" />
                        <span>{event.registrationCount || 0} Registered</span>
                      </span>
                    </div>

                    <h4 className="text-xl font-extrabold text-white tracking-tight">
                      {event.title[currentLanguage]}
                    </h4>

                    <div className="space-y-2 text-xs font-mono text-neutral-400">
                      <div className="flex items-center space-x-2">
                        <Calendar size={13} className="text-[#D4AF37]" />
                        <span>{new Date(event.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={13} className="text-[#D4AF37]" />
                        <span>{event.location[currentLanguage]}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                      {event.description[currentLanguage]}
                    </p>
                  </div>

                  {/* Expandable Registration form */}
                  <div className="border-t border-neutral-800 p-6 bg-black/45">
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 rounded border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm flex items-center space-x-2.5"
                        >
                          <CheckCircle size={18} className="shrink-0" />
                          <span>{t.registerSuccess}</span>
                        </motion.div>
                      ) : isRegistering ? (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={(e) => handleRegister(e, event.id)}
                          className="space-y-4"
                          id={`register_form_${event.id}`}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              required
                              placeholder={t.placeholderName}
                              value={formData.name || ''}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-[#141414] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                            <input
                              type="tel"
                              required
                              placeholder={t.placeholderPhone}
                              value={formData.phone || ''}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-[#141414] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                            <input
                              type="email"
                              placeholder={t.placeholderEmail}
                              value={formData.email || ''}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-[#141414] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          
                          <div className="flex space-x-2 justify-end text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={() => setRegisteringEventId(null)}
                              className="px-3 py-2 rounded text-neutral-500 hover:text-white transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-[#D4AF37] text-black font-bold uppercase rounded flex items-center space-x-1 hover:opacity-90 transition disabled:opacity-50"
                            >
                              <Send size={10} />
                              <span>{t.registerNow}</span>
                            </button>
                          </div>
                        </motion.form>
                      ) : (
                        <button
                          onClick={() => setRegisteringEventId(event.id)}
                          className="w-full flex items-center justify-center space-x-2 py-3 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white text-xs uppercase font-mono tracking-widest rounded transition duration-300"
                        >
                          <Sparkles size={11} className="text-[#D4AF37]" />
                          <span>{t.registerNow}</span>
                        </button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {upcomingEvents.length === 0 && (
            <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded">
              <Calendar className="mx-auto text-neutral-600 mb-2" size={32} />
              <p className="text-sm">No upcoming events currently scheduled. Check back soon for revival updates.</p>
            </div>
          )}
        </div>

        {/* Past Events Archive */}
        <div className="mt-16 space-y-6" id="past_events_archive">
          <h3 className="text-xl font-bold uppercase text-[#D4AF37] tracking-wider border-b border-neutral-800 pb-3">
            {t.pastEvents}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#141414]/60 border border-neutral-800/80 rounded p-5 space-y-3 shadow-md"
                id={`past_event_card_${event.id}`}
              >
                <span className="text-[9px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded tracking-widest uppercase">
                  PAST EVENT
                </span>
                <h4 className="text-base font-bold text-neutral-300">
                  {event.title[currentLanguage]}
                </h4>
                <div className="space-y-1 text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={11} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin size={11} />
                    <span>{event.location[currentLanguage]}</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans line-clamp-3">
                  {event.description[currentLanguage]}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
