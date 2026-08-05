import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './translations';
import { ChurchSettings, Ministry, Sermon, Event, GalleryItem, Language } from './types';

// Components
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import BibleHelper from './components/BibleHelper';
import MinistriesView from './components/MinistriesView';
import SermonsView from './components/SermonsView';
import EventsView from './components/EventsView';
import GalleryView from './components/GalleryView';
import LiveStreamView from './components/LiveStreamView';
import PrayerRequestForm from './components/PrayerRequestForm';
import DonateSection from './components/DonateSection';
import AdminPanel from './components/AdminPanel';

// Icons
import { Phone, Mail, MapPin, Sparkles, Send, CheckCircle, ShieldAlert, Heart, Calendar, Play, BookOpen, Quote, RefreshCw, X, ExternalLink, Share2, Facebook, Twitter, MessageCircle, Search, Youtube, Instagram } from 'lucide-react';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState<string>('home');
  
  // App settings & collections states
  const [settings, setSettings] = useState<ChurchSettings | null>(null);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Admin state
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // General church visitor registrations states
  const [modalType, setModalType] = useState<'member' | 'volunteer' | null>(null);
  const [visitorForm, setVisitorForm] = useState({ name: '', phone: '', email: '', comments: '' });
  const [visitorSuccess, setVisitorSuccess] = useState(false);

  // Testimonial submission state
  const [testForm, setTestForm] = useState({ name: '', description: '' });
  const [testSuccess, setTestSuccess] = useState(false);
  const [testimonials, setTestimonials] = useState([
    { id: '1', name: 'Sister Mary Latha', text: 'I was suffering from severe knee pain for over 5 years. During the Ponnavaram Healing Crusade, Pastor Shalem Raju laid hands on me and prayed. Instantly, all pain left me, and I can walk normally now! Hallelujah!', verified: true },
    { id: '2', name: 'Brother Suresh Kumar', text: 'Our family was in immense debt and financial anxiety. We submitted a prayer request through Jesus Shalem Ministries. God opened an incredible door and healed our family business. Praise Jesus!', verified: true }
  ]);

  const [activeHomeVideoId, setActiveHomeVideoId] = useState<string | null>(null);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');

  const t = translations[currentLanguage];

  // Fetch all initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Auto-login bypass to remove password and username prompts
  useEffect(() => {
    if (currentPage === 'admin_login') {
      setAdminLoggedIn(true);
      setAdminToken('jsm_direct_access_bypass');
      setCurrentPage('admin');
    }
  }, [currentPage]);

  const fetchInitialData = async () => {
    try {
      const [resSettings, resMinistries, resSermons, resEvents, resGallery] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/ministries'),
        fetch('/api/sermons'),
        fetch('/api/events'),
        fetch('/api/gallery')
      ]);

      if (resSettings.ok) setSettings(await resSettings.json());
      if (resMinistries.ok) setMinistries(await resMinistries.json());
      if (resSermons.ok) setSermons(await resSermons.json());
      if (resEvents.ok) setEvents(await resEvents.json());
      if (resGallery.ok) setGallery(await resGallery.json());

    } catch (err) {
      console.error('Error fetching initial database content:', err);
    }
  };

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });

      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        setAdminLoggedIn(true);
        setCurrentPage('admin');
        setAdminUsername('');
        setAdminPassword('');
      } else {
        setAdminError(t.loginError);
      }
    } catch (err) {
      setAdminError('Server communication failed.');
    }
  };

  // Logout handler
  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    setAdminToken('');
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  // Newsletter weekly subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsSubscribing(true);
    try {
      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });

      if (response.ok) {
        setNewsletterSuccess(true);
        setNewsletterEmail('');
        setTimeout(() => setNewsletterSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Newsletter error:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle church visitor register (membership / volunteer)
  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorForm.name || !visitorForm.phone) return;

    // Simulate persistent save locally and show beautiful banner
    setVisitorSuccess(true);
    setVisitorForm({ name: '', phone: '', email: '', comments: '' });
    setTimeout(() => {
      setVisitorSuccess(false);
      setModalType(null);
    }, 5000);
  };

  // Handle local blessing story testimonial submission
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.name || !testForm.description) return;

    setTestimonials(prev => [
      ...prev,
      { id: String(Date.now()), name: testForm.name, text: testForm.description, verified: false }
    ]);
    setTestSuccess(true);
    setTestForm({ name: '', description: '' });
    setTimeout(() => setTestSuccess(false), 5000);
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin" />
        <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase">LOADING FAITH SYSTEM ALCOVES...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-between selection:bg-[#D4AF37]/30" id="church_app_root">
      
      {/* Dynamic Header & Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        adminLoggedIn={adminLoggedIn}
        onLogout={handleAdminLogout}
      />

      {/* Main Workspace Layout Router */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* 1. HOME VIEW */}
            {currentPage === 'home' && (
              <div className="space-y-0" id="home_view_container">
                {/* Hero Banner Slider */}
                <HeroSlider
                  currentLanguage={currentLanguage}
                  settings={settings}
                  setCurrentPage={setCurrentPage}
                />

                {/* Online Bible Search & Verse of the Day Carousel */}
                <BibleHelper currentLanguage={currentLanguage} />

                {/* Church and Pastor Introduction Bento Row */}
                <div className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#141414] border-t border-neutral-900" id="welcome_bento_row">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      {/* Left: Beautiful portrait card (smaller and less focal) */}
                      <div className="lg:col-span-4" id="pastor_home_teaser">
                        <div 
                          style={{
                            height: settings.pastorPortraitHeightHome || '280px',
                            maxWidth: settings.pastorPortraitWidthHome || '260px'
                          }}
                          className="rounded-lg overflow-hidden border border-neutral-800 bg-black shadow-lg mx-auto"
                        >
                          <img
                            src={settings.pastorPortraitUrl}
                            alt="Pastor Mande. Shalem Raju Portrait"
                            className="w-full h-full object-cover transition-all duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-center mt-3">
                          <h4 className="text-xs font-bold text-[#D4AF37] font-sans">Pastor Mande. SHALEM RAJU</h4>
                          <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">Lead Pastor & Evangelist</p>
                        </div>
                      </div>

                      {/* Right: Message brief */}
                      <div className="lg:col-span-8 space-y-6" id="welcome_message_teases">
                        <div className="inline-flex items-center space-x-2 text-[#D4AF37]">
                          <span className="h-[1px] w-6 bg-[#D4AF37]" />
                          <span className="text-[10px] font-mono tracking-widest uppercase">{t.welcome}</span>
                        </div>

                        <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                          Restoring Broken Paths, Illuminating Souls with Gospel Grace
                        </h3>

                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                          Jesus Shalem Ministries was established in Ponnavaram, Kanchikacharla with a pure prophetic commission: to proclaim healing, release the captives, and ignite village outreaches with the eternal word of faith. Led by Pastor Shalem Raju, our sanctuary remains an oasis of miracles.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <button
                            onClick={() => setCurrentPage('about')}
                            className="flex items-center justify-between p-4 rounded border border-neutral-800 hover:border-[#D4AF37] hover:bg-neutral-900 transition text-left"
                          >
                            <div>
                              <span className="block text-xs font-bold uppercase text-white tracking-wider">{t.aboutChurch}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">Our History & Core Creed</span>
                            </div>
                            <span className="text-[#D4AF37] font-serif">→</span>
                          </button>

                          <button
                            onClick={() => setCurrentPage('pastor')}
                            className="flex items-center justify-between p-4 rounded border border-neutral-800 hover:border-[#D4AF37] hover:bg-neutral-900 transition text-left"
                          >
                            <div>
                              <span className="block text-xs font-bold uppercase text-white tracking-wider">{t.aboutPastor}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">Pastor Mande. Shalem Raju</span>
                            </div>
                            <span className="text-[#D4AF37] font-serif">→</span>
                          </button>
                        </div>

                        {/* Interactive Membership Callout */}
                        <div className="p-4 rounded border border-dashed border-[#D4AF37]/30 bg-[#D4AF37]/5 flex flex-wrap gap-4 items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white block">Belong to the Covenant Family</span>
                            <p className="text-[10px] text-neutral-400">Register as an official congregation member or volunteer today.</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setModalType('member'); setVisitorForm({ name: '', phone: '', email: '', comments: '' }); }}
                              className="px-3.5 py-2 rounded bg-[#D4AF37] text-black font-bold uppercase text-[9px] font-mono tracking-wider hover:opacity-90"
                            >
                              Register Member
                            </button>
                            <button
                              onClick={() => { setModalType('volunteer'); setVisitorForm({ name: '', phone: '', email: '', comments: '' }); }}
                              className="px-3.5 py-2 rounded border border-neutral-800 text-white font-bold uppercase text-[9px] font-mono tracking-wider hover:border-white"
                            >
                              Volunteer
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>

                {/* Latest Video Messages Section */}
                <div className="py-20 bg-black border-t border-b border-neutral-900" id="home_latest_videos_row">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
                      <div className="space-y-2">
                        <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest block">{t.latestSermons}</span>
                        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                          {t.latestMessageVideos}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-2xl">
                          {t.latestMessageVideosSub}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage('sermons')}
                        className="mt-4 md:mt-0 px-4 py-2 rounded border border-neutral-800 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-neutral-900 text-xs font-mono uppercase tracking-wider transition"
                      >
                        {t.viewAllSermons} →
                      </button>
                    </div>

                    {/* Real-time Video Search Bar */}
                    <div className="mb-10 max-w-md" id="home_video_search_container">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                          <Search size={15} className="text-neutral-500" />
                        </span>
                        <input
                          type="text"
                          value={videoSearchQuery}
                          onChange={(e) => setVideoSearchQuery(e.target.value)}
                          placeholder={t.searchVideosPlaceholder}
                          className="w-full bg-neutral-900/65 border border-neutral-800 text-white rounded-lg pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]/50 placeholder-neutral-500 font-sans transition"
                        />
                        {videoSearchQuery && (
                          <button
                            onClick={() => setVideoSearchQuery('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500 hover:text-white transition"
                            title="Clear Search"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {sermons && sermons.length > 0 ? (
                      (() => {
                        const filteredHomeSermons = sermons.filter((sermon) => {
                          if (!videoSearchQuery.trim()) return true;
                          const q = videoSearchQuery.toLowerCase();
                          const title = (sermon.title[currentLanguage] || '').toLowerCase();
                          const category = (sermon.category[currentLanguage] || '').toLowerCase();
                          return title.includes(q) || category.includes(q);
                        });

                        return filteredHomeSermons.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="home_videos_grid">
                            {filteredHomeSermons.slice(0, 3).map((sermon) => (
                              <motion.div
                                key={sermon.id}
                                className="bg-[#141414] border border-neutral-800 rounded-lg overflow-hidden group flex flex-col h-full shadow-lg"
                                whileHover={{ scale: 1.02, borderColor: '#D4AF37' }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                              >
                                {/* Video Thumbnail with Hover Overlay */}
                                <div className="relative aspect-video w-full overflow-hidden bg-black border-b border-neutral-800 shrink-0">
                                  <img
                                    src={`https://img.youtube.com/vi/${sermon.youtubeId}/hqdefault.jpg`}
                                    alt={sermon.title[currentLanguage]}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                    <button
                                      onClick={() => setActiveHomeVideoId(sermon.youtubeId)}
                                      className="p-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black hover:scale-110 shadow-lg transition duration-300"
                                      aria-label="Play Message Video"
                                    >
                                      <Play size={16} className="fill-current text-black ml-0.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
                                      <span>{sermon.category[currentLanguage]}</span>
                                      <span>{sermon.date}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition line-clamp-1">
                                      {sermon.title[currentLanguage]}
                                    </h4>
                                    <p className="text-[11px] text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                                      {sermon.description[currentLanguage]}
                                    </p>
                                  </div>

                                  {/* Elegant Share Row */}
                                  <div className="pt-2.5 border-t border-neutral-900/60 flex items-center justify-between" id={`share_row_home_${sermon.id}`}>
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                                      <Share2 size={10} className="text-[#D4AF37]" /> Share:
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <a
                                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(sermon.title[currentLanguage] + ' - Watch this power-filled message from Jesus Shalem Ministries: https://www.youtube.com/watch?v=' + sermon.youtubeId)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on WhatsApp"
                                        className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/30 transition duration-200"
                                        id={`share_whatsapp_${sermon.id}`}
                                      >
                                        <MessageCircle size={12} className="stroke-[2.5]" />
                                      </a>
                                      <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.youtube.com/watch?v=' + sermon.youtubeId)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on Facebook"
                                        className="p-1.5 rounded bg-blue-600/10 hover:bg-blue-600/25 text-blue-400 border border-blue-600/10 hover:border-blue-600/30 transition duration-200"
                                        id={`share_facebook_${sermon.id}`}
                                      >
                                        <Facebook size={12} className="stroke-[2.5]" />
                                      </a>
                                      <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(sermon.title[currentLanguage] + ' - Watch this power-filled message from Jesus Shalem Ministries:')}&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + sermon.youtubeId)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on Twitter"
                                        className="p-1.5 rounded bg-sky-500/10 hover:bg-sky-500/25 text-sky-400 border border-sky-500/10 hover:border-sky-500/30 transition duration-200"
                                        id={`share_twitter_${sermon.id}`}
                                      >
                                        <Twitter size={12} className="stroke-[2.5]" />
                                      </a>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                                    <button
                                      onClick={() => setActiveHomeVideoId(sermon.youtubeId)}
                                      className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] hover:underline font-bold flex items-center space-x-1"
                                    >
                                      <span>Watch Video</span>
                                    </button>
                                    <a
                                      href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition flex items-center space-x-1"
                                    >
                                      <span>YouTube Link</span>
                                      <span className="text-[10px] shrink-0">↗</span>
                                    </a>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16 border border-dashed border-neutral-800/60 rounded-xl bg-neutral-900/10" id="home_videos_no_results">
                            <p className="text-sm text-neutral-400 font-sans">{t.noVideosFound}</p>
                            <button
                              onClick={() => setVideoSearchQuery('')}
                              className="mt-3 text-xs text-[#D4AF37] hover:underline font-mono uppercase tracking-wider"
                            >
                              Reset Search
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-xs font-mono text-center text-neutral-500 py-10">No message videos loaded.</p>
                    )}

                  </div>
                </div>

                {/* Grace statistics counts */}
                <div className="py-16 bg-[#0B0B0B] border-t border-b border-neutral-900" id="statistics_counters_row">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">{t.statistics}</h3>
                      <p className="text-xs text-neutral-400 mt-2">{t.statsSub}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8" id="stats_row_grid">
                      {[
                        { label: t.activeMembers, num: '1,500+' },
                        { label: t.savedSouls, num: '10,000+' },
                        { label: t.villageMinistries, num: '32+' },
                        { label: t.prayersAnswered, num: '5,000+' }
                      ].map((item) => (
                        <div key={item.label} className="p-6 rounded bg-[#141414] border border-neutral-800 text-center relative group hover:border-[#D4AF37]/40 transition">
                          <span className="block text-3xl sm:text-5xl font-extrabold font-mono text-[#D4AF37] tracking-tight group-hover:scale-105 transition-transform duration-300">
                            {item.num}
                          </span>
                          <span className="block text-[10px] text-neutral-400 tracking-widest font-mono uppercase mt-2">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimony Sliders */}
                <div className="py-20 bg-[#141414]" id="home_testimonials_section">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                      
                      {/* Left: Slide viewport */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="space-y-2">
                          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest block">{t.testimonials}</span>
                          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                            {t.testimonialTitle}
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-lg">
                            {t.testimonialSub}
                          </p>
                        </div>

                        <div className="space-y-4" id="testimonials_viewport_cards">
                          {testimonials.filter(x => x.verified).map((item) => (
                            <div key={item.id} className="p-6 rounded-lg bg-black border border-neutral-800 relative space-y-3 shadow-lg">
                              <Quote className="absolute right-6 top-6 text-[#D4AF37]/10" size={48} />
                              <blockquote className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans italic">
                                "{item.text}"
                              </blockquote>
                              <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                <cite className="text-xs font-bold text-[#D4AF37] not-italic font-mono">{item.name}</cite>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Submit testimony form */}
                      <div className="lg:col-span-5 bg-black border border-neutral-800 rounded-lg p-6 sm:p-8 relative shadow-xl" id="testimony_submission_card">
                        <h4 className="text-sm font-bold uppercase font-mono text-[#D4AF37] tracking-wider mb-4 border-b border-neutral-800 pb-2">
                          {t.shareTestimonial}
                        </h4>

                        <AnimatePresence mode="wait">
                          {testSuccess ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-5 rounded border border-green-500/30 bg-green-500/5 text-center space-y-2"
                            >
                              <CheckCircle size={28} className="text-green-500 mx-auto" />
                              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                                {t.testimonialSuccess}
                              </p>
                            </motion.div>
                          ) : (
                            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                              <div className="space-y-1">
                                <label htmlFor="test_name" className="block text-[9px] font-mono text-neutral-400 uppercase">Your Name</label>
                                <input
                                  id="test_name"
                                  type="text"
                                  required
                                  placeholder="e.g., Sister Grace"
                                  value={testForm.name || ''}
                                  onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                                  className="w-full bg-[#141414] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label htmlFor="test_description" className="block text-[9px] font-mono text-neutral-400 uppercase">Your Miracle/Testimony</label>
                                <textarea
                                  id="test_description"
                                  rows={4}
                                  required
                                  placeholder={t.testimonialPlaceholder}
                                  value={testForm.description || ''}
                                  onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                                  className="w-full bg-[#141414] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full py-2.5 bg-[#D4AF37] text-black font-bold uppercase text-[10px] font-mono tracking-widest rounded hover:opacity-90 transition"
                              >
                                Submit Story
                              </button>
                            </form>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. ABOUT CHURCH VIEW */}
            {currentPage === 'about' && (
              <div className="py-16 bg-[#0B0B0B]" id="about_view_container">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">{t.aboutChurch}</h2>
                    <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest mt-2">Jesus Shalem Ministries History</p>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-6 font-sans">
                    <div className="p-6 rounded bg-[#141414] border border-[#D4AF37]/20 relative">
                      <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">{t.churchHistory}</h3>
                      <p>
                        Established in the serene landscape of Ponnavaram, Kanchikacharla, Jesus Shalem Ministries began as a humble prayer fellowship under the guidance of Pastor Mande. SHALEM RAJU. Commissioned with a calling of healing and village restoration, the ministry witnessed immediate outbreaks of scriptural deliverance, attracting hundreds of believers who saw physical, mental, and financial chains break.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="p-5 rounded bg-black border border-neutral-800 space-y-2">
                        <h4 className="text-sm font-bold text-[#D4AF37] uppercase font-mono">{t.mission}</h4>
                        <p className="text-xs text-neutral-400">
                          To take the pure, uncompromised Gospel of Jesus Christ to the deepest rural corners of Andhra Pradesh, feeding the poor, declaring physical healing, and discipling generation leaders.
                        </p>
                      </div>

                      <div className="p-5 rounded bg-black border border-neutral-800 space-y-2">
                        <h4 className="text-sm font-bold text-[#D4AF37] uppercase font-mono">{t.vision}</h4>
                        <p className="text-xs text-neutral-400">
                          Establishing an dynamic, collaborative network of local prayer cells, upgrading the central Ponnavaram sanctuary, and broadcast healing crusades to global audiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ABOUT PASTOR VIEW */}
            {currentPage === 'pastor' && (
              <div className="py-16 bg-[#0B0B0B]" id="pastor_view_container">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">{t.aboutPastor}</h2>
                    <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest mt-2">Pastor Mande. SHALEM RAJU</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="pastor_view_bio_grid">
                    
                    <div 
                      style={{
                        height: settings.pastorPortraitHeightBio || '380px'
                      }}
                      className="md:col-span-5 rounded-lg overflow-hidden border border-[#D4AF37]/35 bg-black shadow-2xl"
                    >
                      <img
                        src={settings.pastorPortraitUrl}
                        alt="Pastor Shalem Raju biography pose"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">{t.biography}</h3>
                      <p>
                        Pastor Mande. SHALEM RAJU is an anointed lead evangelist, intercessor, and shepherd based in Ponnavaram. For over a decade, his services have been designated by mighty manifestations of physical healing, spiritual release, and family restoration.
                      </p>
                      <p>
                        With a deep burden for local village families, he leads weekly outreaches, counselling, and active Bible study groups, restoring broken households in faith. Contact Pastor Shalem Raju directly on his mobile: <strong className="text-white font-mono font-bold">+91 7981788313</strong> for personal prayers, home blessings, and counseling counseling counselor help.
                      </p>
                      
                      <div className="p-4 rounded border border-neutral-800 bg-[#141414] font-mono text-[10px] text-neutral-400 space-y-1">
                        <span className="text-[#D4AF37] font-bold block uppercase mb-1">Covenant Contact Info</span>
                        <span>• Email: JesusShalemMinistries@gmail.com</span>
                        <span>• Address: Ponnavaram, Kanchikacharla</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 4. MINISTRIES VIEW */}
            {currentPage === 'ministries' && (
              <MinistriesView currentLanguage={currentLanguage} ministries={ministries} />
            )}

            {/* 5. SERMONS VIEW */}
            {currentPage === 'sermons' && (
              <SermonsView currentLanguage={currentLanguage} sermons={sermons} />
            )}

            {/* 6. GALLERY VIEW */}
            {currentPage === 'gallery' && (
              <GalleryView currentLanguage={currentLanguage} gallery={gallery} />
            )}

            {/* 7. EVENTS VIEW */}
            {currentPage === 'events' && (
              <EventsView
                currentLanguage={currentLanguage}
                events={events}
                onEventRegistered={(evId) => {
                  // increment registration count in local list state
                  setEvents(prev => prev.map(ev => {
                    if (ev.id === evId) {
                      return { ...ev, registrationCount: (ev.registrationCount || 0) + 1 };
                    }
                    return ev;
                  }));
                }}
              />
            )}

            {/* 8. LIVE STREAM VIEW */}
            {currentPage === 'live' && (
              <LiveStreamView currentLanguage={currentLanguage} />
            )}

            {/* 9. PRAYER REQUEST VIEW */}
            {currentPage === 'prayer' && (
              <PrayerRequestForm currentLanguage={currentLanguage} />
            )}

            {/* 10. TESTIMONIALS VIEW */}
            {currentPage === 'testimonials' && (
              <div className="py-16 bg-[#0B0B0B]" id="testimonials_page_view">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">{t.testimonials}</h2>
                    <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest mt-2">{t.testimonialTitle}</p>
                  </div>

                  <div className="space-y-6" id="testimonials_page_grid">
                    {testimonials.map((item) => (
                      <div key={item.id} className="p-6 rounded bg-[#141414] border border-neutral-800 space-y-3 shadow-md relative">
                        <Quote className="absolute right-6 top-6 text-[#D4AF37]/5" size={44} />
                        <blockquote className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed font-sans">
                          "{item.text}"
                        </blockquote>
                        <div className="flex items-center space-x-2 border-t border-neutral-800 pt-3">
                          <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                          <cite className="text-xs font-bold text-white not-italic font-mono">{item.name}</cite>
                          {!item.verified && (
                            <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded ml-auto">
                              Pending Review
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 11. CONTACT VIEW */}
            {currentPage === 'contact' && (
              <div className="py-16 bg-[#0B0B0B]" id="contact_view_container">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">{t.contactUs}</h2>
                    <p className="text-xs text-neutral-400 mt-2">Coordinate or visit our central sanctuary in Ponnavaram.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="contact_grid_row">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-5 bg-[#141414] border border-neutral-800 rounded-lg p-6 sm:p-8 space-y-8 flex flex-col justify-between" id="contact_details_pane">
                      
                      <div className="space-y-6">
                        <h3 className="text-sm font-mono text-[#D4AF37] uppercase tracking-widest font-bold">Temple Details</h3>
                        
                        <div className="space-y-4 text-xs font-mono text-neutral-300">
                          <div className="flex items-start space-x-3">
                            <Phone size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
                            <div>
                              <span className="block text-neutral-500 text-[10px] uppercase">Phone Hotline</span>
                              <span>+91 7981788313</span>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Mail size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
                            <div>
                              <span className="block text-neutral-500 text-[10px] uppercase">Email Support</span>
                              <span>JesusShalemMinistries@gmail.com</span>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <MapPin size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
                            <div>
                              <span className="block text-neutral-500 text-[10px] uppercase">Sanctuary Address</span>
                              <span className="whitespace-pre-line font-sans font-medium text-white">{settings.churchAddress || "Ponnavaram, Kanchikacharla, NTR District, Andhra Pradesh, India"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-800 space-y-3">
                          <span className="block text-neutral-500 text-[10px] uppercase font-mono">Official Channels</span>
                          
                          <div className="space-y-3">
                            <a
                              href={settings.youtubeLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center space-x-3 hover:text-red-500 transition-colors group"
                            >
                              <Youtube size={16} className="text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="text-xs">
                                <span className="text-white block font-sans font-bold group-hover:underline">{settings.youtubeName || "Jesus Shalem Ministries"}</span>
                                <span className="text-neutral-500 text-[9px] block">Subscribe on YouTube</span>
                              </div>
                            </a>

                            <a
                              href={settings.instagramLink || "https://www.instagram.com/jesus_shalem_ministries?igsh=ajljZjB1NnB3ZXBi"}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center space-x-3 hover:text-pink-500 transition-colors group"
                            >
                              <Instagram size={16} className="text-pink-500 shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="text-xs">
                                <span className="text-white block font-sans font-bold group-hover:underline">@{settings.instagram || "jesus_shalem_ministries"}</span>
                                <span className="text-neutral-500 text-[9px] block">Follow on Instagram</span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Office hours and WhatsApp buttons */}
                      <div className="pt-6 border-t border-neutral-800 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase block">{t.officeHours}</span>
                          <p className="text-xs text-neutral-300">{t.weekdays}</p>
                          <p className="text-xs text-[#D4AF37] font-semibold">{t.sundays}</p>
                        </div>

                        <a
                          href={settings.whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center space-x-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-widest text-xs rounded transition shadow-lg font-mono"
                        >
                          <Send size={13} />
                          <span>Join WhatsApp Channel</span>
                        </a>
                      </div>

                    </div>

                    {/* Right Column: Simulated Google Maps Card */}
                    <div className="lg:col-span-7 bg-[#141414] border border-[#D4AF37]/25 rounded-lg overflow-hidden shadow-2xl relative flex flex-col justify-between" id="maps_placeholder_pane">
                      
                      <div className="p-6 bg-black border-b border-neutral-800">
                        <h3 className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest">Interactive Altar Location Map</h3>
                      </div>

                      {/* Map Box */}
                      <div className="flex-grow min-h-[300px] bg-black/60 relative flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <MapPin size={36} className="text-[#D4AF37] animate-bounce" />
                        <p className="text-sm font-sans font-bold text-white max-w-sm">Ponnavaram Sanctuary Temple</p>
                        <p className="text-xs text-neutral-400 font-mono">Latitude: 16.7118 • Longitude: 80.2982</p>
                        <a
                          href="https://maps.google.com/?q=Ponnavaram+Kanchikacharla"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-neutral-900 border border-[#D4AF37]/45 text-neutral-300 hover:text-white hover:border-[#D4AF37] text-xs font-mono uppercase tracking-wider rounded transition"
                        >
                          Open in Google Maps
                        </a>
                      </div>

                      <div className="p-4 text-[10px] font-mono text-neutral-500 text-center uppercase tracking-wider border-t border-neutral-800">
                        Kanchikacharla Mandalam, NTR District, Andhra Pradesh, India.
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 12. DONATE VIEW */}
            {currentPage === 'donate' && (
              <DonateSection currentLanguage={currentLanguage} settings={settings} />
            )}

            {/* 13. ADMIN LOGIN PORTAL VIEW */}
            {currentPage === 'admin_login' && (
              <div className="py-20 bg-[#0B0B0B]" id="admin_login_portal">
                <div className="max-w-md mx-auto px-4">
                  <div className="bg-[#141414] border border-[#D4AF37]/35 rounded-lg p-6 sm:p-8 shadow-2xl relative space-y-6" id="login_card">
                    <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#D4AF37]" />
                    <div className="absolute top-0 left-0 w-[1px] h-8 bg-[#D4AF37]" />

                    <div className="text-center space-y-2">
                      <ShieldAlert size={36} className="text-[#D4AF37] mx-auto animate-pulse" />
                      <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wider">
                        {t.adminLoginTitle}
                      </h2>
                      <p className="text-xs text-neutral-400 font-sans">
                        {t.adminLoginSub}
                      </p>
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-4" id="login_form">
                      {adminError && (
                        <p className="p-2.5 rounded bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono text-center">
                          {adminError}
                        </p>
                      )}

                      <div className="space-y-1">
                        <label htmlFor="login_user" className="block text-xs font-mono text-neutral-400 uppercase">{t.username}</label>
                        <input
                          id="login_user"
                          type="text"
                          required
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          className="w-full bg-black border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="login_pass" className="block text-xs font-mono text-neutral-400 uppercase">{t.password}</label>
                        <input
                          id="login_pass"
                          type="password"
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-black border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold uppercase text-xs tracking-widest rounded hover:opacity-90 transition shadow-lg"
                      >
                        {t.login}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 14. ADMIN WORKSPACE AREA VIEW */}
            {currentPage === 'admin' && adminLoggedIn && (
              <AdminPanel
                currentLanguage={currentLanguage}
                onBackToWeb={() => setCurrentPage('home')}
                settings={settings}
                onSettingsUpdate={(nSet) => setSettings(nSet)}
                ministries={ministries}
                onMinistriesUpdate={(nMin) => setMinistries(nMin)}
                sermons={sermons}
                onSermonsUpdate={(nSer) => setSermons(nSer)}
                events={events}
                onEventsUpdate={(nEv) => setEvents(nEv)}
                gallery={gallery}
                onGalleryUpdate={(nGal) => setGallery(nGal)}
                token={adminToken}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Standard Elegant Newsletter Footer Strip */}
      {currentPage !== 'admin' && (
        <section className="py-16 bg-gradient-to-t from-black to-[#0F0F0F] border-t border-[#D4AF37]/20" id="newsletter_signup_strip">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">{t.newsletterTitle}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">{t.newsletterSub}</p>
              </div>

              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {newsletterSuccess ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm flex items-center space-x-2"
                    >
                      <CheckCircle size={16} />
                      <span>{t.subscribeSuccess}</span>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        required
                        placeholder={t.placeholderEmail}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-grow bg-black border border-neutral-800 text-white rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="submit"
                        disabled={isSubscribing}
                        className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-extrabold uppercase tracking-widest text-[10px] font-mono rounded transition disabled:opacity-50 shrink-0"
                      >
                        {isSubscribing ? 'SUBSCRIBING...' : t.subscribe}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Secure Luxury Church Footer */}
      {currentPage !== 'admin' && (
        <footer className="bg-black border-t border-neutral-900 py-12" id="church_footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-neutral-400 text-xs font-sans">
            
            {/* Left brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/src/assets/images/church_logo_new_1784635370468.jpg"
                  alt="Jesus Shalem Ministries branding logo footer"
                  className="w-8 h-8 rounded-full border border-[#D4AF37]"
                  referrerPolicy="no-referrer"
                />
                <span className="text-base font-bold bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent uppercase tracking-wider">
                  {settings.churchName[currentLanguage]}
                </span>
              </div>
              
              <p className="text-neutral-500 leading-relaxed text-[11px]">
                Under the anointed pastoral oversight of Pastor Mande. SHALEM RAJU, Jesus Shalem Ministries serves as a divine channel of deliverance, prophecy, and village evangelism in NTR District, Andhra Pradesh.
              </p>
            </div>

            {/* Quick links column */}
            <div className="md:col-span-3 space-y-3" id="footer_quick_links">
              <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-white border-b border-neutral-900 pb-1.5">{t.quickLinks}</h4>
              <ul className="space-y-1.5 text-[11px] font-mono uppercase tracking-wider">
                <li>
                  <button onClick={() => setCurrentPage('home')} className="hover:text-[#D4AF37] transition">
                    — {t.home}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('about')} className="hover:text-[#D4AF37] transition">
                    — {t.aboutChurch}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('ministries')} className="hover:text-[#D4AF37] transition">
                    — {t.ministries}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('sermons')} className="hover:text-[#D4AF37] transition">
                    — {t.sermons}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('donate')} className="hover:text-[#D4AF37] transition">
                    — {t.donate}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact details footer column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-white border-b border-neutral-900 pb-1.5">{t.contactUs}</h4>
              <p className="text-[11px] leading-relaxed">
                <strong>Address:</strong> Ponnavaram, Kanchikacharla Mandalam, NTR District, Andhra Pradesh, India.
              </p>
              <p className="text-[11px] font-mono">
                <strong>Mobile Hotline:</strong> +91 7981788313
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={settings.youtubeLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Subscribe on YouTube"
                  className="text-neutral-500 hover:text-red-500 transition-colors p-1.5 bg-[#0B0B0B] hover:bg-black rounded border border-neutral-900 hover:border-neutral-800 transition-all"
                >
                  <Youtube size={14} />
                </a>
                <a
                  href={settings.instagramLink || "https://www.instagram.com/jesus_shalem_ministries?igsh=ajljZjB1NnB3ZXBi"}
                  target="_blank"
                  rel="noreferrer"
                  title="Follow on Instagram"
                  className="text-neutral-500 hover:text-pink-500 transition-colors p-1.5 bg-[#0B0B0B] hover:bg-black rounded border border-neutral-900 hover:border-neutral-800 transition-all"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href={settings.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Join our WhatsApp Channel"
                  className="text-neutral-500 hover:text-green-500 transition-colors p-1.5 bg-[#0B0B0B] hover:bg-black rounded border border-neutral-900 hover:border-neutral-800 transition-all"
                >
                  <Send size={14} />
                </a>
              </div>
            </div>

          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-neutral-900 text-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest flex flex-col sm:flex-row justify-between items-center gap-3">
            <span>© 2026 Jesus Shalem Ministries. All Rights Reserved.</span>
            <span 
              onClick={() => setCurrentPage(adminLoggedIn ? 'admin' : 'admin_login')}
              onDoubleClick={() => setCurrentPage(adminLoggedIn ? 'admin' : 'admin_login')}
              className="cursor-pointer select-none hover:text-[#D4AF37] transition-colors font-semibold"
              title="Click or double-click to access admin panel"
            >
              SERVERS
            </span>
          </div>
        </footer>
      )}

      {/* Visitor Registrations Lightbox Overlay Modal */}
      <AnimatePresence>
        {modalType && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            id="visitor_modal_overlay"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#141414] border border-[#D4AF37]/30 rounded-lg p-6 sm:p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-900 hover:bg-[#D4AF37] hover:text-black text-neutral-400 transition"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <Sparkles size={28} className="text-[#D4AF37] mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {modalType === 'member' ? t.membershipBtn : t.volunteerBtn}
                </h3>
                <p className="text-xs text-neutral-400 font-sans">
                  Register directly into the covenant rolls of Jesus Shalem Ministries.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {visitorSuccess ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 rounded border border-green-500/30 bg-green-500/10 text-center space-y-2 text-green-400 text-xs sm:text-sm"
                  >
                    <CheckCircle className="mx-auto" size={24} />
                    <span>{modalType === 'member' ? t.memberSuccess : t.volunteerSuccess}</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleVisitorSubmit} className="space-y-4" id="visitor_register_form">
                    
                    <div className="space-y-1">
                      <label htmlFor="vis_name" className="block text-[10px] font-mono text-neutral-400 uppercase">{t.placeholderName}</label>
                      <input
                        id="vis_name"
                        type="text"
                        required
                        value={visitorForm.name || ''}
                        onChange={(e) => setVisitorForm({ ...visitorForm, name: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="vis_phone" className="block text-[10px] font-mono text-neutral-400 uppercase">{t.placeholderPhone}</label>
                      <input
                        id="vis_phone"
                        type="tel"
                        required
                        value={visitorForm.phone || ''}
                        onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="vis_email" className="block text-[10px] font-mono text-neutral-400 uppercase">{t.placeholderEmail}</label>
                      <input
                        id="vis_email"
                        type="email"
                        value={visitorForm.email || ''}
                        onChange={(e) => setVisitorForm({ ...visitorForm, email: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white rounded px-3 py-2 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest rounded hover:opacity-90 transition"
                    >
                      Submit Registration
                    </button>

                  </form>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Home Page Video Modal Player */}
      <AnimatePresence>
        {activeHomeVideoId && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            id="home_video_modal_overlay"
            onClick={() => setActiveHomeVideoId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#141414] border border-[#D4AF37]/30 rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveHomeVideoId(null)}
                className="absolute -top-12 sm:top-4 -right-2 sm:right-4 z-10 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-[#D4AF37] transition"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                <iframe
                  title="Home sermon video player"
                  src={`https://www.youtube.com/embed/${activeHomeVideoId}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              </div>

              <div className="p-4 bg-black flex items-center justify-between text-[10px] font-mono text-neutral-500 border-t border-neutral-900">
                <span>JESUS SHALEM MINISTRIES VIDEO PORTAL</span>
                <a
                  href={`https://youtube.com/watch?v=${activeHomeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-[#D4AF37] hover:underline"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
