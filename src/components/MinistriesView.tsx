import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, Play, Heart, Flame, Sparkles } from 'lucide-react';
import { Language, Ministry } from '../types';

interface MinistriesViewProps {
  currentLanguage: Language;
  ministries: Ministry[];
}

export default function MinistriesView({ currentLanguage, ministries }: MinistriesViewProps) {
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null);

  // Helper icons representing each ministry
  const getMinistryIcon = (id: string) => {
    switch (id) {
      case 'youth': return <Users size={20} />;
      case 'children': return <Heart size={20} />;
      case 'women': return <Sparkles size={20} />;
      case 'men': return <BookOpen size={20} />;
      case 'worship': return <Play size={20} />;
      case 'prayer': return <Flame size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  return (
    <div className="py-16 bg-[#0B0B0B]" id="ministries_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2">
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] font-mono uppercase tracking-[0.2em] text-xs">COMMUNITY & GROWTH</span>
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase mt-2">
            Our Holy Ministries
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Discover a spiritual home where you can grow, serve, worship, and build lifelong bonds in Christ.
          </p>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="ministries_grid">
          {ministries.map((min) => {
            const isSelected = selectedMinistry === min.id;
            return (
              <motion.div
                key={min.id}
                layoutId={`ministry-card-${min.id}`}
                className="bg-[#141414] border border-[#D4AF37]/25 rounded-lg overflow-hidden flex flex-col justify-between shadow-2xl relative group cursor-pointer hover:border-[#D4AF37] transition-colors"
                onClick={() => setSelectedMinistry(isSelected ? null : min.id)}
                id={`ministry_card_${min.id}`}
              >
                {/* Image & Header */}
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={min.imageUrl}
                    alt={min.name[currentLanguage]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
                  
                  {/* Category Pill Icon */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0B0B0B]/80 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase">
                    {getMinistryIcon(min.id)}
                    <span>{min.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow space-y-3">
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#D4AF37] transition-colors">
                    {min.name[currentLanguage]}
                  </h3>
                  <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                    {min.title[currentLanguage]}
                  </p>
                  <p className="text-xs text-neutral-400 line-clamp-3">
                    {min.description[currentLanguage]}
                  </p>
                </div>

                {/* Card Action footer */}
                <div className="p-5 pt-0">
                  <button className="w-full py-2.5 bg-neutral-900 border border-[#D4AF37]/20 group-hover:border-[#D4AF37] text-white hover:text-black hover:bg-[#D4AF37] text-[10px] font-mono uppercase tracking-widest rounded transition-all duration-300">
                    {isSelected ? 'Collapse Details' : 'Explore Ministry'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Expandable Panel (AnimatePresence Overlay) */}
        <AnimatePresence>
          {selectedMinistry && (() => {
            const min = ministries.find(m => m.id === selectedMinistry);
            if (!min) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="mt-12 p-6 sm:p-10 bg-gradient-to-r from-[#141414] to-black border border-[#D4AF37] rounded-lg shadow-2xl relative"
                id="expanded_ministry_details"
              >
                {/* Corner Ornaments */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedMinistry(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 hover:bg-[#D4AF37] hover:text-black text-neutral-400 transition-colors border border-neutral-800"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Photo Column */}
                  <div className="lg:col-span-4 h-64 lg:h-80 rounded overflow-hidden border border-[#D4AF37]/30 bg-black shadow-lg">
                    <img
                      src={min.imageUrl}
                      alt={min.name[currentLanguage]}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Text Column */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center space-x-2 text-[#D4AF37]">
                      {getMinistryIcon(min.id)}
                      <span className="text-xs font-mono uppercase tracking-widest">{min.id} Fellowship</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {min.name[currentLanguage]}
                    </h3>
                    
                    <p className="text-sm font-semibold text-[#D4AF37] italic leading-none font-sans">
                      "{min.title[currentLanguage]}"
                    </p>

                    <div className="h-[1px] bg-neutral-800 my-4" />

                    <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      <p className="font-medium text-white">
                        {min.description[currentLanguage]}
                      </p>
                      <p className="whitespace-pre-line text-neutral-400">
                        {min.content[currentLanguage]}
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

      </div>
    </div>
  );
}
