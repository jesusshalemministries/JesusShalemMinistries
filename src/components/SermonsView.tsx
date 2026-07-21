import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, Calendar, User, Tag, ArrowRight, X, ExternalLink, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { translations } from '../translations';
import { Language, Sermon } from '../types';

interface SermonsViewProps {
  currentLanguage: Language;
  sermons: Sermon[];
}

export default function SermonsView({ currentLanguage, sermons }: SermonsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const t = translations[currentLanguage];

  // Extract unique categories for filter
  const categories = ['all', ...Array.from(new Set(sermons.map(s => s.category[currentLanguage])))];

  // Filtering Logic
  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch = 
      sermon.title[currentLanguage].toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker[currentLanguage].toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.description[currentLanguage].toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      sermon.category[currentLanguage] === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredSermon = sermons.find(s => s.isFeatured) || sermons[0];

  return (
    <div className="py-16 bg-[#0B0B0B]" id="sermons_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            Sermons & Scripture Teaching
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Listen to life-transforming sermons, biblical expositions, and spiritual revelations spoken by Pastor Mande. SHALEM RAJU.
          </p>
        </div>

        {/* Search & Category Filter bar */}
        <div className="bg-[#141414] border border-[#D4AF37]/20 p-5 rounded-lg mb-12 flex flex-col md:flex-row items-center gap-4 justify-between" id="sermon_filters_container">
          
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder={t.searchSermons}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-neutral-800 text-white rounded px-4 py-3 pl-11 text-xs focus:outline-none focus:border-[#D4AF37] transition-all font-sans"
            />
            <Search className="absolute left-3.5 top-3.5 text-neutral-500" size={14} />
          </div>

          {/* Category Pills scrollable */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none" id="sermon_category_scroller">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10px] uppercase font-mono tracking-widest rounded-full transition-all border shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-black border-neutral-800 text-neutral-400 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                {cat === 'all' ? t.allCategories : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Featured Sermon Hero Card */}
        {featuredSermon && !searchQuery && selectedCategory === 'all' && (
          <div className="bg-gradient-to-r from-[#141414] to-black border border-[#D4AF37]/40 rounded-lg overflow-hidden shadow-2xl mb-16 relative" id="featured_sermon_hero">
            
            {/* Elegant corner ribbons */}
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#D4AF37] text-black font-mono text-[9px] font-bold tracking-widest uppercase rounded-bl">
              FEATURED DISCIPLESHIP
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
              
              {/* Thumbnail Play button */}
              <div className="lg:col-span-5 relative h-56 sm:h-72 w-full rounded overflow-hidden bg-black group shadow-xl border border-neutral-800">
                <img
                  src={`https://img.youtube.com/vi/${featuredSermon.youtubeId}/hqdefault.jpg`}
                  alt={featuredSermon.title[currentLanguage]}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setActiveVideoId(featuredSermon.youtubeId)}
                    className="p-5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black hover:scale-110 shadow-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition duration-300"
                    aria-label="Play Featured Sermon"
                  >
                    <Play size={24} className="fill-current text-black" />
                  </button>
                </div>
              </div>

              {/* Text metadata */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-400">
                  <span className="flex items-center space-x-1">
                    <User size={12} className="text-[#D4AF37]" />
                    <span>{featuredSermon.speaker[currentLanguage]}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar size={12} className="text-[#D4AF37]" />
                    <span>{featuredSermon.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Tag size={12} className="text-[#D4AF37]" />
                    <span>{featuredSermon.category[currentLanguage]}</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {featuredSermon.title[currentLanguage]}
                </h3>
                
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                  {featuredSermon.description[currentLanguage]}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveVideoId(featuredSermon.youtubeId)}
                    className="flex items-center space-x-2 px-5 py-3 rounded bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-xs uppercase font-mono tracking-widest font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition"
                  >
                    <span>{t.watchNow}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="sermons_grid">
          {filteredSermons.map((sermon) => (
            <motion.div
              key={sermon.id}
              className="bg-[#141414] border border-[#D4AF37]/20 rounded-lg overflow-hidden flex flex-col justify-between shadow-2xl transition group"
              id={`sermon_card_${sermon.id}`}
              whileHover={{ scale: 1.02, borderColor: '#D4AF37' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              
              {/* Thumbnail container */}
              <div className="relative h-48 bg-black overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${sermon.youtubeId}/mqdefault.jpg`}
                  alt={sermon.title[currentLanguage]}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <button
                    onClick={() => setActiveVideoId(sermon.youtubeId)}
                    className="p-4 rounded-full bg-[#D4AF37] text-black shadow-lg transform scale-90 group-hover:scale-100 transition duration-300"
                    aria-label="Play Sermon"
                  >
                    <Play size={18} className="fill-current text-black" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#0B0B0B]/90 border border-[#D4AF37]/30 text-white text-[9px] font-mono uppercase tracking-widest">
                  {sermon.category[currentLanguage]}
                </div>
              </div>

              {/* Description metadata */}
              <div className="p-5 flex-grow space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span className="flex items-center space-x-1">
                    <User size={10} className="text-[#D4AF37]" />
                    <span>{sermon.speaker[currentLanguage]}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar size={10} className="text-[#D4AF37]" />
                    <span>{sermon.date}</span>
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                  {sermon.title[currentLanguage]}
                </h4>
                
                <p className="text-xs text-neutral-400 line-clamp-3">
                  {sermon.description[currentLanguage]}
                </p>

                {/* Elegant Share Row */}
                <div className="pt-2.5 border-t border-neutral-900/60 flex items-center justify-between" id={`share_row_sermons_${sermon.id}`}>
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
                      id={`share_whatsapp_sermon_${sermon.id}`}
                    >
                      <MessageCircle size={12} className="stroke-[2.5]" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.youtube.com/watch?v=' + sermon.youtubeId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on Facebook"
                      className="p-1.5 rounded bg-blue-600/10 hover:bg-blue-600/25 text-blue-400 border border-blue-600/10 hover:border-blue-600/30 transition duration-200"
                      id={`share_facebook_sermon_${sermon.id}`}
                    >
                      <Facebook size={12} className="stroke-[2.5]" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(sermon.title[currentLanguage] + ' - Watch this power-filled message from Jesus Shalem Ministries:')}&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + sermon.youtubeId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on Twitter"
                      className="p-1.5 rounded bg-sky-500/10 hover:bg-sky-500/25 text-sky-400 border border-sky-500/10 hover:border-sky-500/30 transition duration-200"
                      id={`share_twitter_sermon_${sermon.id}`}
                    >
                      <Twitter size={12} className="stroke-[2.5]" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setActiveVideoId(sermon.youtubeId)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded bg-neutral-900 border border-[#D4AF37]/20 group-hover:border-[#D4AF37] text-xs font-mono uppercase text-white hover:bg-[#D4AF37] hover:text-black transition duration-300"
                >
                  <Play size={11} />
                  <span>{t.watchNow}</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSermons.length === 0 && (
          <div className="text-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
            <Search className="mx-auto text-neutral-700 mb-3" size={44} />
            <p className="text-base font-sans">{t.noSermons}</p>
          </div>
        )}

      </div>

      {/* Cinematic Youtube Lightbox overlay Modal */}
      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            id="sermon_video_modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl rounded-lg overflow-hidden border border-[#D4AF37]/50 bg-black shadow-2xl"
              id="sermon_video_frame_container"
            >
              {/* Gold rim corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

              {/* Close controls */}
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute -top-12 sm:top-4 -right-2 sm:right-4 z-10 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-[#D4AF37] transition"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                <iframe
                  title="Sermon video player"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              </div>
              
              <div className="p-4 bg-[#141414] flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-neutral-800">
                <span>JESUS SHALEM MINISTRIES MEDIA CENTER</span>
                <a
                  href={`https://youtube.com/watch?v=${activeVideoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-[#D4AF37] hover:underline"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
