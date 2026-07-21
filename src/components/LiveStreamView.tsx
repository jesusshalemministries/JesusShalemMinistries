import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Flame, Send, MessageSquare, Radio, Users, Sparkles, AlertCircle } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface LiveStreamViewProps {
  currentLanguage: Language;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  isPastor?: boolean;
}

export default function LiveStreamView({ currentLanguage }: LiveStreamViewProps) {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Elder Suresh', message: 'Praise the Lord! Praying with family from Kanchikacharla.', time: '10:00 AM' },
    { id: '2', user: 'Sister Grace', message: 'Hallelujah! The worship is so anointed today.', time: '10:01 AM' },
    { id: '3', user: 'Pastor Mande. SHALEM RAJU', message: 'Blessings to everyone joining. Prepare your hearts for a mighty healing word today.', time: '10:02 AM', isPastor: true },
    { id: '4', user: 'David K.', message: 'Pray for my daughter\'s health, she is suffering from severe fever.', time: '10:03 AM' },
    { id: '5', user: 'Mercy Latha', message: 'Amen! God is good.', time: '10:04 AM' }
  ]);

  const [viewerCount, setViewerCount] = useState(148);
  const [isLive, setIsLive] = useState(true);

  const t = translations[currentLanguage];
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulate dynamic congregation messages and viewer counts
  useEffect(() => {
    const praisePhrases = [
      'Praise the Lord! Amen.',
      'Hallelujah! God bless Shalem Raju garu.',
      'Amen! Truly a powerful sermon.',
      'Praying for physical healing and spiritual deliverance today.',
      'Glory to Jesus Christ!',
      'Lord hear our intercessory prayers.',
      'Blessed to hear this heavenly scriptural exposition.'
    ];
    const userNames = ['Brother Srinivas', 'Krupa Rao', 'Sneha Latha', 'Disciple Anand', 'Mary Pushpa', 'John David', 'Sister Jyothi'];

    const interval = setInterval(() => {
      // randomly add a message
      if (Math.random() > 0.4) {
        const randomName = userNames[Math.floor(Math.random() * userNames.length)];
        const randomMsg = praisePhrases[Math.floor(Math.random() * praisePhrases.length)];
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setChatMessages(prev => [
          ...prev,
          { id: String(Date.now()), user: randomName, message: randomMsg, time: now }
        ]);
      }

      // fluctuate viewer count slightly
      setViewerCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [
      ...prev,
      { id: String(Date.now()), user: 'You (Disciple)', message: inputText, time: now }
    ]);
    setInputText('');
  };

  return (
    <div className="py-16 bg-[#0B0B0B]" id="live_stream_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-mono mb-4">
            <Radio size={12} className="animate-pulse" />
            <span>HEAVENLY DIGITAL SANCTUARY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.liveStreamTitle}
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            {t.liveStreamSub}
          </p>
        </div>

        {/* Live Container (Grid of Video Player + Live Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="live_stream_grid">
          
          {/* Video Player (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#141414] border border-[#D4AF37]/20 rounded-lg overflow-hidden shadow-2xl relative" id="live_broadcast_player">
            
            {/* Header Status line */}
            <div className="p-4 bg-black border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase">{t.liveNow}</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono text-neutral-400">
                <span className="flex items-center space-x-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                  <Users size={11} />
                  <span>{viewerCount} VIEWERS</span>
                </span>
                <span>PONNAVARAM SERVER</span>
              </div>
            </div>

            {/* Video Area */}
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {isLive ? (
                // Play live stream loop or placeholder Youtube video
                <iframe
                  title="JSM Live stream loop"
                  src="https://www.youtube.com/embed/pGvHMyo_r60?autoplay=1&mute=1&loop=1&playlist=pGvHMyo_r60"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              ) : (
                <div className="text-center space-y-4 p-8 text-neutral-500">
                  <AlertCircle className="mx-auto text-neutral-700" size={48} />
                  <p className="text-sm font-sans">No live stream currently broadcasted.</p>
                  <p className="text-xs font-mono uppercase text-[#D4AF37]">{t.streamCountdown}</p>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="p-5 bg-black border-t border-neutral-800 space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Sunday Glory Worship & Deliverance Service (Live Altar)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Experience divine fellowship led by Pastor Mande. SHALEM RAJU from Ponnavaram Temple, featuring prophetic praise, testimonies of healing, and intercessory prayer.
              </p>
            </div>

          </div>

          {/* Interactive Chat Board (4 Cols) */}
          <div className="lg:col-span-4 bg-[#141414] border border-[#D4AF37]/20 rounded-lg flex flex-col h-[500px] lg:h-auto shadow-2xl overflow-hidden" id="live_chat_container">
            
            {/* Chat header */}
            <div className="p-4 bg-black border-b border-neutral-800 flex items-center space-x-2">
              <MessageSquare size={16} className="text-[#D4AF37]" />
              <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">{t.chatTitle}</h4>
            </div>

            {/* Chat list viewport */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-black/30 scrollbar-none" id="chat_messages_scroller">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded text-xs space-y-1 shadow-sm border ${
                    msg.isPastor
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37]/45'
                      : msg.user.startsWith('You')
                      ? 'bg-[#141414] border-neutral-800 text-right self-end ml-auto'
                      : 'bg-black/80 border-neutral-800'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 ${msg.user.startsWith('You') ? 'justify-end' : ''}`}>
                    {msg.isPastor && <Flame size={10} className="text-red-500 animate-pulse shrink-0" />}
                    <span className={`font-mono font-bold ${msg.isPastor ? 'text-[#D4AF37]' : 'text-neutral-400'}`}>
                      {msg.user}
                    </span>
                    <span className="text-[9px] text-neutral-600 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-neutral-200 font-sans break-words">{msg.message}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-black border-t border-neutral-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder={t.chatPlaceholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow bg-[#141414] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="p-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black rounded hover:opacity-90 transition shadow-md"
              >
                <Send size={12} />
              </button>
            </form>

          </div>

        </div>

        {/* Previous Streams List */}
        <div className="mt-16 space-y-6" id="previous_broadcasts_archive">
          <h3 className="text-xl font-bold uppercase text-[#D4AF37] tracking-wider border-b border-neutral-800 pb-3 flex items-center space-x-2">
            <Radio size={16} />
            <span>{t.prevStreams}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { id: '1', title: 'Ponnavaram Gospel Crusade Day 1', date: 'July 11, 2026', views: '2.4K views', dur: '1:45:20', youtubeId: 'pGvHMyo_r60' },
              { id: '2', title: 'Friday Healing & Prayer Anointing', date: 'July 09, 2026', views: '1.8K views', dur: '2:10:45', youtubeId: '6Wc6q7D_tB4' },
              { id: '3', title: 'Glorious Sunday Worship & Deliverance', date: 'July 05, 2026', views: '3.1K views', dur: '1:58:30', youtubeId: 'e2q3I6g68qM' },
              { id: '4', title: 'Covenant Family Blessings Sermon', date: 'June 28, 2026', views: '1.2K views', dur: '1:24:12', youtubeId: 'pGvHMyo_r60' }
            ].map((stream) => (
              <div key={stream.id} className="bg-[#141414] border border-neutral-800/80 rounded overflow-hidden group shadow" id={`prev_stream_card_${stream.id}`}>
                
                {/* Thumbnail */}
                <div className="relative h-32 bg-black">
                  <img
                    src={`https://img.youtube.com/vi/${stream.youtubeId}/mqdefault.jpg`}
                    alt={stream.title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <Play size={14} className="text-[#D4AF37]" />
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-mono text-neutral-400">
                    {stream.dur}
                  </span>
                </div>

                {/* Metadata */}
                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-300 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {stream.title}
                  </h4>
                  <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500">
                    <span>{stream.date}</span>
                    <span>{stream.views}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
