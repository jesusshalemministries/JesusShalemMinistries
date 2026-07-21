import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Video, ZoomIn, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Language, GalleryItem } from '../types';

interface GalleryViewProps {
  currentLanguage: Language;
  gallery: GalleryItem[];
}

export default function GalleryView({ currentLanguage, gallery }: GalleryViewProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', ...Array.from(new Set(gallery.map(item => item.category)))];

  // Filtering Logic
  const filteredGallery = gallery.filter((item) => {
    return activeCategory === 'All' || item.category === activeCategory;
  });

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
    }
  };

  return (
    <div className="py-16 bg-[#0B0B0B]" id="gallery_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            Sights of Blessings & Glory
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            A beautiful visual testament to the mighty Crusades, community prayers, children's outreach, and Holy Altar.
          </p>
        </div>

        {/* Gallery Filter Scroller */}
        <div className="flex items-center justify-center space-x-3 mb-10 overflow-x-auto pb-4 scrollbar-none" id="gallery_category_scroller">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxIndex(null);
              }}
              className={`px-5 py-2.5 text-[10px] uppercase font-mono tracking-widest rounded transition-all border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black border-[#D4AF37] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#141414] border-neutral-800 text-neutral-400 hover:border-[#D4AF37]/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery_masonry_grid">
          {filteredGallery.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-72 rounded-lg overflow-hidden border border-[#D4AF37]/15 bg-[#141414] shadow-xl cursor-pointer hover:border-[#D4AF37]/60 transition-colors"
              id={`gallery_grid_item_${item.id}`}
            >
              
              {/* Media Image */}
              <img
                src={item.url}
                alt={item.caption[currentLanguage]}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Hover Dark Vignette Overlay with Zoom Trigger */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-95 transition-all duration-300" />

              {/* Floating detail boxes */}
              <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-[#D4AF37] shadow-md">
                {item.type === 'video' ? <Video size={14} /> : <Image size={14} />}
              </div>

              {/* Caption and Action text bottom */}
              <div className="absolute bottom-5 left-5 right-5 space-y-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[8px] font-mono tracking-widest uppercase">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white tracking-tight leading-snug font-sans group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {item.caption[currentLanguage]}
                </h4>
                <p className="text-[10px] text-neutral-400 tracking-widest font-mono uppercase flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
                  <ZoomIn size={10} />
                  <span>Enlarge Asset</span>
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGallery.length === 0 && (
          <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-800 rounded">
            <Image className="mx-auto text-neutral-600 mb-2" size={32} />
            <p className="text-sm">No media items in this category currently. Visit our Admin CMS to upload photos.</p>
          </div>
        )}

      </div>

      {/* Luxury Cinematic Gallery Lightbox Slider */}
      <AnimatePresence>
        {lightboxIndex !== null && (() => {
          const item = filteredGallery[lightboxIndex];
          if (!item) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex flex-col justify-between p-6 sm:p-10 select-none"
              onClick={() => setLightboxIndex(null)}
              id="gallery_lightbox_overlay"
            >
              
              {/* Top controls */}
              <div className="flex items-center justify-between text-neutral-500 font-mono text-xs w-full max-w-7xl mx-auto">
                <span className="flex items-center space-x-1 uppercase">
                  <Sparkles size={11} className="text-[#D4AF37]" />
                  <span>JSM Media Portal</span>
                </span>
                <div className="flex items-center space-x-4">
                  <span>{lightboxIndex + 1} / {filteredGallery.length}</span>
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 rounded-full border border-neutral-800 bg-[#141414] hover:text-white hover:border-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Main Content Area (Image Frame) */}
              <div className="flex-grow flex items-center justify-between w-full max-w-7xl mx-auto relative my-4">
                
                {/* Prev arrow */}
                <button
                  onClick={handlePrev}
                  className="p-3.5 rounded-full border border-neutral-800 bg-[#141414]/80 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition z-10"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Picture element */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-4xl h-[65vh] flex items-center justify-center p-2 rounded border border-[#D4AF37]/25 bg-black relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={item.url}
                    alt={item.caption[currentLanguage]}
                    className="max-w-full max-h-full object-contain rounded"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Next arrow */}
                <button
                  onClick={handleNext}
                  className="p-3.5 rounded-full border border-neutral-800 bg-[#141414]/80 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition z-10"
                >
                  <ChevronRight size={22} />
                </button>

              </div>

              {/* Bottom Metadata Display */}
              <div className="w-full max-w-4xl mx-auto text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight max-w-3xl mx-auto">
                  {item.caption[currentLanguage]}
                </h3>
              </div>

            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
