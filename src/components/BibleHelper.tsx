import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, BookOpen, Heart, RefreshCw, MessageCircle } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface BibleHelperProps {
  currentLanguage: Language;
}

interface BibleSearchResult {
  verse: string;
  alternateLanguageVerse: string;
  reference: string;
  alternateLanguageReference: string;
  explanation: string;
  pastoralMessage: string;
}

interface VerseOfDay {
  verse: string;
  reference: string;
  explanation: string;
  reflection: string;
}

export default function BibleHelper({ currentLanguage }: BibleHelperProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BibleSearchResult[]>([]);
  const [searchSource, setSearchSource] = useState('');

  const [verseOfDay, setVerseOfDay] = useState<VerseOfDay | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);

  const t = translations[currentLanguage];

  // Fetch verse of the day on mount
  useEffect(() => {
    fetchVerseOfDay();
  }, [currentLanguage]);

  const fetchVerseOfDay = async () => {
    setIsLoadingVerse(true);
    const cacheKey = `jsm_verse_of_day_${currentLanguage}`;
    const cached = localStorage.getItem(cacheKey);
    const now = Date.now();

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Valid for 6 hours
        if (parsed && now - parsed.timestamp < 6 * 60 * 60 * 1000) {
          setVerseOfDay(parsed.data);
          setIsLoadingVerse(false);
          return;
        }
      } catch (e) {
        // Ignore cache parse error and load fresh
      }
    }

    try {
      const response = await fetch(`/api/gemini/bible-verse?lang=${currentLanguage}`);
      if (response.ok) {
        const data = await response.json();
        setVerseOfDay(data);
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }));
      } else {
        throw new Error(`Server returned status: ${response.status}`);
      }
    } catch (e) {
      console.log('Error fetching verse of the day, using client fallback:', e);
      const fallbackVerses: Record<Language, VerseOfDay> = {
        en: {
          verse: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
          reference: "John 3:16",
          explanation: "The ultimate declaration of God's love and grace. Salvation is accessible to everyone who believes in the redemptive work of Jesus Christ.",
          reflection: "May the infinite grace of the Lord Jesus Christ be with your spirit today! Trust in His promise."
        },
        te: {
          verse: "దేవుడు లోకమును ఎంతో ప్రేమించెను; ఆయన తన అద్వితీయ కుమారునిగా పుట్టిన వానియందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయనను అనుగ్రహించెను.",
          reference: "యోహాను 3:16",
          explanation: "దేవుని అపరిమితమైన ప్రేమ మరియు కృపకు ఇది అంతిమ నిదర్శనం. యేసుక్రీస్తునందు విశ్వాసముంచు ప్రతి ఒక్కరికీ రక్షణ ఉచితంగా లభిస్తుంది.",
          reflection: "దేవుని అపరిమితమైన కృప నేడు మీకు తోడుగా ఉండును గాక! ఆయన వాగ్దానములను నమ్మండి."
        }
      };
      const fallback = fallbackVerses[currentLanguage] || fallbackVerses['en'];
      setVerseOfDay(fallback);
      // Cache fallback too to prevent instant retries
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: fallback }));
    } finally {
      setIsLoadingVerse(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/gemini/bible-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          language: currentLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setSearchSource(data.source || '');
      }
    } catch (e) {
      console.error('Error searching bible:', e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-16 bg-[#0B0B0B]" id="bible_helper_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-mono mb-4">
            <Sparkles size={12} className="animate-pulse" />
            <span>AI-POWERED DEVOTIONAL COMPANION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.bibleSearchTitle}
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            {t.bibleSearchSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Scripture Search (7 Cols) */}
          <div className="lg:col-span-7 bg-[#141414] border border-[#D4AF37]/20 rounded-lg p-6 sm:p-8 shadow-2xl relative" id="bible_search_panel">
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#D4AF37]" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-[#D4AF37]" />

            <form onSubmit={handleSearch} className="space-y-4" id="bible_search_form">
              <label htmlFor="scripture_search_input" className="block text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
                {t.searchHoly}
              </label>
              <div className="relative">
                <input
                  id="scripture_search_input"
                  type="text"
                  placeholder={t.bibleSearchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded px-4 py-3.5 pl-11 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 text-neutral-500" size={18} />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold uppercase tracking-widest text-xs rounded hover:opacity-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    <span>CONSULTING HEAVENLY LIBRARIES...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>{t.searchHoly}</span>
                  </>
                )}
              </button>
            </form>

            {/* Results Output */}
            <div className="mt-8" id="bible_search_results">
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-neutral-400 space-y-3"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
                      <BookOpen size={16} className="text-[#D4AF37]" />
                    </div>
                    <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Searching the Scriptures...</p>
                  </motion.div>
                ) : searchResults.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                        {searchResults.length} {searchResults.length === 1 ? 'VERSE' : 'VERSES'} RETRIEVED
                      </span>
                      <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase tracking-widest">
                        {searchSource}
                      </span>
                    </div>

                    {searchResults.map((result, idx) => (
                      <div key={idx} className="space-y-4 border-b border-neutral-800/50 pb-6 last:border-none last:pb-0">
                        
                        {/* Selected Language Verse */}
                        <div className="relative p-5 rounded bg-black/60 border-l-4 border-[#D4AF37] shadow-lg">
                          <blockquote className="text-sm sm:text-base text-white leading-relaxed font-sans font-medium">
                            {result.verse}
                          </blockquote>
                          <cite className="block mt-2 text-xs sm:text-sm font-mono text-[#D4AF37] font-bold not-italic">
                            — {result.reference}
                          </cite>
                        </div>

                        {/* Alternate Language Verse (Mini Accordion / Detail) */}
                        <div className="px-4 py-2 rounded bg-neutral-900/50 border border-neutral-800 text-[11px] text-neutral-400 font-mono flex items-center justify-between">
                          <span>{currentLanguage === 'en' ? 'Telugu Translation:' : 'English Translation:'} <span className="text-neutral-200 italic font-sans">"{result.alternateLanguageVerse}"</span> ({result.alternateLanguageReference})</span>
                        </div>

                        {/* Scriptural Explanation */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest flex items-center space-x-1.5">
                            <BookOpen size={12} />
                            <span>Scriptural Context & Insight</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                            {result.explanation}
                          </p>
                        </div>

                        {/* Pastor Raju's Dynamic Reflection */}
                        <div className="p-4 rounded-md bg-[#D4AF37]/5 border border-[#D4AF37]/10 flex items-start space-x-3 shadow-md">
                          <img
                            src="/src/assets/images/pastor_portrait_1784460224662.jpg"
                            alt="Pastor Shalem Raju portrait"
                            className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <h5 className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">Pastor Shalem Raju Reflection</h5>
                            <p className="text-xs text-neutral-300 italic leading-relaxed">
                              {result.pastoralMessage}
                            </p>
                          </div>
                        </div>

                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded">
                    <BookOpen className="mx-auto text-neutral-600 mb-2" size={32} />
                    <p className="text-sm">Type your query and click search to extract bible truths.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Beautiful Verse of the Day Card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#141414] to-black border border-[#D4AF37]/30 rounded-lg p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between" id="bible_verse_of_the_day">
            
            {/* Top Border Glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest flex items-center space-x-1">
                  <Heart size={12} className="text-red-500" />
                  <span>{t.bibleVerseOfTheDay}</span>
                </span>
                
                <button
                  onClick={fetchVerseOfDay}
                  disabled={isLoadingVerse}
                  className="p-1 rounded text-neutral-500 hover:text-[#D4AF37] transition"
                  title="Generate Fresh Daily Verse"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingVerse ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isLoadingVerse ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                  </div>
                ) : verseOfDay ? (
                  <motion.div
                    key={verseOfDay.reference}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Verse Script */}
                    <div className="space-y-4">
                      <p className="text-lg sm:text-xl font-serif text-white font-semibold leading-relaxed">
                        {verseOfDay.verse}
                      </p>
                      <span className="block text-sm font-mono text-[#D4AF37] font-bold">
                        — {verseOfDay.reference}
                      </span>
                    </div>

                    <div className="h-[1px] bg-neutral-800" />

                    {/* Explanatory Context */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 tracking-wider block uppercase">Spiritual Substance</span>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                        {verseOfDay.explanation}
                      </p>
                    </div>

                    {/* Pastor Daily Reflection */}
                    <div className="p-4 rounded border-l-2 border-[#D4AF37]/50 bg-[#D4AF37]/5">
                      <span className="text-[10px] font-mono text-[#D4AF37] tracking-wider block uppercase font-bold">{t.pastorReflection}</span>
                      <p className="text-xs text-neutral-300 italic mt-1 font-sans">
                        {verseOfDay.reflection}
                      </p>
                    </div>

                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span className="flex items-center space-x-1 uppercase">
                <Sparkles size={10} className="text-[#D4AF37]" />
                <span>Gemini 3.5 Spiritual Grounding</span>
              </span>
              <span>100% SECURE KEY</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
