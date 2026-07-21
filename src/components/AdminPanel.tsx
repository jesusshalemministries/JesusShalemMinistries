import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, BookOpen, Calendar, Heart, Shield, RefreshCw, Plus, Edit2, Trash2, Check, X, Bell, User, Layout, ArrowLeft, Eye } from 'lucide-react';
import { translations } from '../translations';
import { Language, ChurchSettings, Ministry, Sermon, Event, PrayerRequest, NewsLetter } from '../types';

interface AdminPanelProps {
  currentLanguage: Language;
  onBackToWeb: () => void;
  settings: ChurchSettings;
  onSettingsUpdate: (newSettings: ChurchSettings) => void;
  ministries: Ministry[];
  onMinistriesUpdate: (newMin: Ministry[]) => void;
  sermons: Sermon[];
  onSermonsUpdate: (newSer: Sermon[]) => void;
  events: Event[];
  onEventsUpdate: (newEv: Event[]) => void;
  token: string;
}

export default function AdminPanel({
  currentLanguage,
  onBackToWeb,
  settings,
  onSettingsUpdate,
  ministries,
  onMinistriesUpdate,
  sermons,
  onSermonsUpdate,
  events,
  onEventsUpdate,
  token,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'ministries' | 'sermons' | 'events' | 'prayers' | 'newsletters'>('settings');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Settings local state
  const [localSettings, setLocalSettings] = useState<ChurchSettings>(settings);

  // Ministries local state
  const [selectedMinIndex, setSelectedMinIndex] = useState<number>(0);
  const [minEdit, setMinEdit] = useState<Ministry>(ministries[0]);

  // Sermons state & forms
  const [editingSermonId, setEditingSermonId] = useState<string | null>(null);
  const [sermonForm, setSermonForm] = useState<Partial<Sermon>>({
    title: { en: '', te: '' },
    speaker: { en: '', te: '' },
    description: { en: '', te: '' },
    category: { en: '', te: '' },
    youtubeId: '',
    isFeatured: false
  });

  // Events state & forms
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: { en: '', te: '' },
    location: { en: '', te: '' },
    description: { en: '', te: '' },
    date: '',
    isPast: false
  });

  // Prayer requests & newsletters fetched from backend
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [newsletters, setNewsletters] = useState<NewsLetter[]>([]);

  const t = translations[currentLanguage];

  // Fetch private resources on mount / tab change
  useEffect(() => {
    if (activeTab === 'prayers') {
      fetchPrayers();
    } else if (activeTab === 'newsletters') {
      fetchNewsletters();
    }
  }, [activeTab]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (ministries[selectedMinIndex]) {
      setMinEdit(ministries[selectedMinIndex]);
    }
  }, [selectedMinIndex, ministries]);

  const fetchPrayers = async () => {
    try {
      const res = await fetch('/api/prayer-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrayers(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNewsletters = async () => {
    try {
      const res = await fetch('/api/newsletters', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNewsletters(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Settings Save
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(localSettings)
      });
      if (response.ok) {
        const data = await response.json();
        onSettingsUpdate(data.settings);
        showStatus('Global Settings Persisted Successfully! ✓');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Ministry Save
  const handleMinistrySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedList = [...ministries];
      updatedList[selectedMinIndex] = minEdit;

      const response = await fetch('/api/ministries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedList)
      });

      if (response.ok) {
        const data = await response.json();
        onMinistriesUpdate(data.ministries);
        showStatus(`${minEdit.name.en} Ministry Saved! ✓`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Sermon Submit (Create/Update)
  const handleSermonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingSermonId ? `/api/sermons/${editingSermonId}` : '/api/sermons';
      const method = editingSermonId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sermonForm)
      });

      if (response.ok) {
        const data = await response.json();
        onSermonsUpdate(data.sermons);
        setEditingSermonId(null);
        setSermonForm({
          title: { en: '', te: '' },
          speaker: { en: '', te: '' },
          description: { en: '', te: '' },
          category: { en: '', te: '' },
          youtubeId: '',
          isFeatured: false
        });
        showStatus('Sermon Archives Updated! ✓');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Sermon Delete
  const handleSermonDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return;
    try {
      const response = await fetch(`/api/sermons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        onSermonsUpdate(data.sermons);
        showStatus('Sermon Deleted!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Event Submit (Create/Update)
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingEventId ? `/api/events/${editingEventId}` : '/api/events';
      const method = editingEventId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });

      if (response.ok) {
        const data = await response.json();
        onEventsUpdate(data.events);
        setEditingEventId(null);
        setEventForm({
          title: { en: '', te: '' },
          location: { en: '', te: '' },
          description: { en: '', te: '' },
          date: '',
          isPast: false
        });
        showStatus('Crusade Events updated! ✓');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Event Delete
  const handleEventDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        onEventsUpdate(data.events);
        showStatus('Event Deleted!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Prayer Request status moderation
  const handlePrayerStatusChange = async (id: string, newStatus: 'Pending' | 'Praying' | 'Answered') => {
    try {
      const response = await fetch(`/api/prayer-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchPrayers();
        showStatus('Prayer Request Status Updated!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Prayer Request Delete
  const handlePrayerDelete = async (id: string) => {
    if (!confirm('Delete this prayer request?')) return;
    try {
      const response = await fetch(`/api/prayer-requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchPrayers();
        showStatus('Prayer Request Purged!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col lg:flex-row" id="admin_cms_panel">
      
      {/* Sidebar Navigation Panel */}
      <div className="w-full lg:w-64 bg-[#141414] border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20 p-6 flex flex-col justify-between shrink-0" id="admin_sidebar">
        
        <div className="space-y-8">
          {/* Logo Brand info */}
          <div className="flex items-center space-x-3 pb-6 border-b border-neutral-800">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 p-1 flex items-center justify-center bg-black">
              <Shield size={18} className="text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white uppercase">CMS CENTER</h2>
              <span className="text-[9px] text-[#D4AF37] font-mono tracking-widest block">ADMIN SECURED</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="space-y-1" id="admin_nav_tabs">
            {[
              { id: 'settings', label: 'Church Settings', icon: <Settings size={14} /> },
              { id: 'ministries', label: 'Ministry Editor', icon: <BookOpen size={14} /> },
              { id: 'sermons', label: 'Sermons CRUD', icon: <Layout size={14} /> },
              { id: 'events', label: 'Events CRUD', icon: <Calendar size={14} /> },
              { id: 'prayers', label: 'Prayers Wall', icon: <Heart size={14} /> },
              { id: 'newsletters', label: 'Newsletter Inbox', icon: <Bell size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-semibold uppercase tracking-widest rounded transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Action back buttons */}
        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <button
            onClick={onBackToWeb}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-xs uppercase tracking-widest font-bold text-neutral-300 transition"
          >
            <ArrowLeft size={13} />
            <span>{t.backToWeb}</span>
          </button>
          <div className="text-[9px] font-mono text-neutral-600 text-center uppercase tracking-wider">
            Powered by JSM Core Engine
          </div>
        </div>

      </div>

      {/* Main CMS Tab Dashboard Panel */}
      <div className="flex-grow p-6 sm:p-10 max-w-5xl overflow-y-auto" id="admin_main_workspace">
        
        {/* Status Line */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-sans">
              {activeTab} Management Workspace
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Directly edit and persist database schema values instantly. No manual code updates required.
            </p>
          </div>

          <AnimatePresence>
            {saveStatus && (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 sm:mt-0 inline-block px-3 py-1 bg-green-500/15 border border-green-500 text-green-400 text-xs font-bold font-mono rounded"
              >
                {saveStatus}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Workspaces by Tab */}
        <div id="tab_workspace_contents">
          
          {/* TAB 1: CHURCH SETTINGS GENERAL CONFIG */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSave} className="space-y-6" id="settings_cms_form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Church Name English */}
                <div className="space-y-1">
                  <label htmlFor="settings_name_en" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Church Name (English)</label>
                  <input
                    id="settings_name_en"
                    type="text"
                    required
                    value={localSettings.churchName.en}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      churchName: { ...localSettings.churchName, en: e.target.value }
                    })}
                    className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Church Name Telugu */}
                <div className="space-y-1">
                  <label htmlFor="settings_name_te" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Church Name (Telugu)</label>
                  <input
                    id="settings_name_te"
                    type="text"
                    required
                    value={localSettings.churchName.te}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      churchName: { ...localSettings.churchName, te: e.target.value }
                    })}
                    className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Pastor Name English */}
                <div className="space-y-1">
                  <label htmlFor="settings_pastor_en" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Pastor Name (English)</label>
                  <input
                    id="settings_pastor_en"
                    type="text"
                    required
                    value={localSettings.pastorName.en}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      pastorName: { ...localSettings.pastorName, en: e.target.value }
                    })}
                    className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Pastor Name Telugu */}
                <div className="space-y-1">
                  <label htmlFor="settings_pastor_te" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Pastor Name (Telugu)</label>
                  <input
                    id="settings_pastor_te"
                    type="text"
                    required
                    value={localSettings.pastorName.te}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      pastorName: { ...localSettings.pastorName, te: e.target.value }
                    })}
                    className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Contact phone */}
                <div className="space-y-1">
                  <label htmlFor="settings_phone" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Contact Phone</label>
                  <input
                    id="settings_phone"
                    type="text"
                    required
                    value={localSettings.contactPhone}
                    onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                    className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Contact email */}
                <div className="space-y-1">
                  <label htmlFor="settings_email" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Contact Email</label>
                  <input
                    id="settings_email"
                    type="email"
                    required
                    value={localSettings.contactEmail}
                    onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                    className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

              </div>

              {/* Image & Size Configuration */}
              <div className="p-4 border border-[#D4AF37]/20 bg-black/50 rounded space-y-4">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">Image URLs & Display Sizes Configuration</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Church Image URL */}
                  <div className="space-y-1">
                    <label htmlFor="settings_hero_url" className="block text-[9px] font-mono text-neutral-400 uppercase">Church Image URL (Hero Slider)</label>
                    <input
                      id="settings_hero_url"
                      type="text"
                      required
                      value={localSettings.heroBannerUrl}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        heroBannerUrl: e.target.value
                      })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Church Image Height */}
                  <div className="space-y-1">
                    <label htmlFor="settings_hero_height" className="block text-[9px] font-mono text-neutral-400 uppercase">Church Image Height (Hero Slider)</label>
                    <select
                      id="settings_hero_height"
                      value={localSettings.heroSliderHeight}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        heroSliderHeight: e.target.value
                      })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="50vh">Short (50vh)</option>
                      <option value="65vh">Compact (65vh)</option>
                      <option value="75vh">Standard (75vh)</option>
                      <option value="85vh">Tall (85vh - Default)</option>
                      <option value="95vh">Extra Tall (95vh)</option>
                      <option value="100vh">Full Screen (100vh)</option>
                    </select>
                  </div>

                  {/* Pastor Image URL */}
                  <div className="space-y-1">
                    <label htmlFor="settings_pastor_url" className="block text-[9px] font-mono text-neutral-400 uppercase">Pastor Image URL (Portrait)</label>
                    <input
                      id="settings_pastor_url"
                      type="text"
                      required
                      value={localSettings.pastorPortraitUrl}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        pastorPortraitUrl: e.target.value
                      })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Pastor Image Sizes */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-neutral-400 uppercase">Pastor Image Sizing (CSS Width/Height)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <span className="block text-[8px] font-mono text-neutral-500 uppercase">Home Width</span>
                        <input
                          type="text"
                          required
                          value={localSettings.pastorPortraitWidthHome}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            pastorPortraitWidthHome: e.target.value
                          })}
                          className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-xs font-mono text-center focus:outline-none focus:border-[#D4AF37]"
                          placeholder="260px"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[8px] font-mono text-neutral-500 uppercase">Home Height</span>
                        <input
                          type="text"
                          required
                          value={localSettings.pastorPortraitHeightHome}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            pastorPortraitHeightHome: e.target.value
                          })}
                          className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-xs font-mono text-center focus:outline-none focus:border-[#D4AF37]"
                          placeholder="280px"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[8px] font-mono text-neutral-500 uppercase">Bio Height</span>
                        <input
                          type="text"
                          required
                          value={localSettings.pastorPortraitHeightBio}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            pastorPortraitHeightBio: e.target.value
                          })}
                          className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-xs font-mono text-center focus:outline-none focus:border-[#D4AF37]"
                          placeholder="380px"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dynamic Bible Verse of the Day (editable) */}
              <div className="p-4 border border-[#D4AF37]/20 bg-black/50 rounded space-y-4">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">Featured Header Bible Verse</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="verse_en" className="block text-[9px] font-mono text-neutral-400">Verse (English)</label>
                    <textarea
                      id="verse_en"
                      rows={2}
                      value={localSettings.bibleVerse.verse.en}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        bibleVerse: {
                          ...localSettings.bibleVerse,
                          verse: { ...localSettings.bibleVerse.verse, en: e.target.value }
                        }
                      })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded p-2.5 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="verse_ref_en" className="block text-[9px] font-mono text-neutral-400">Reference (English)</label>
                    <input
                      id="verse_ref_en"
                      type="text"
                      value={localSettings.bibleVerse.reference.en}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        bibleVerse: {
                          ...localSettings.bibleVerse,
                          reference: { ...localSettings.bibleVerse.reference, en: e.target.value }
                        }
                      })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest rounded flex items-center space-x-1.5 hover:opacity-95 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  <RefreshCw className={isSaving ? 'animate-spin' : ''} size={14} />
                  <span>Save General Config</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MINISTRIES BILINGUAL CONTENT CMS */}
          {activeTab === 'ministries' && (
            <div className="space-y-8" id="ministry_cms_section">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {ministries.map((min, idx) => (
                  <button
                    key={min.id}
                    onClick={() => setSelectedMinIndex(idx)}
                    className={`px-4 py-2.5 text-[10px] uppercase font-mono tracking-widest border rounded shrink-0 ${
                      selectedMinIndex === idx
                        ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                        : 'bg-[#141414] border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {min.id}
                  </button>
                ))}
              </div>

              <form onSubmit={handleMinistrySave} className="space-y-6" id="ministry_edit_form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name EN */}
                  <div className="space-y-1">
                    <label htmlFor="min_name_en" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Ministry Name (English)</label>
                    <input
                      id="min_name_en"
                      type="text"
                      required
                      value={minEdit.name.en}
                      onChange={(e) => setMinEdit({ ...minEdit, name: { ...minEdit.name, en: e.target.value } })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs"
                    />
                  </div>

                  {/* Name TE */}
                  <div className="space-y-1">
                    <label htmlFor="min_name_te" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Ministry Name (Telugu)</label>
                    <input
                      id="min_name_te"
                      type="text"
                      required
                      value={minEdit.name.te}
                      onChange={(e) => setMinEdit({ ...minEdit, name: { ...minEdit.name, te: e.target.value } })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="min_image" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Ministry Image URL</label>
                    <input
                      id="min_image"
                      type="text"
                      required
                      value={minEdit.imageUrl}
                      onChange={(e) => setMinEdit({ ...minEdit, imageUrl: e.target.value })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs font-mono"
                    />
                  </div>

                  {/* Devotional Content EN */}
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="min_content_en" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Devotional Content Brief (English)</label>
                    <textarea
                      id="min_content_en"
                      rows={4}
                      value={minEdit.content.en}
                      onChange={(e) => setMinEdit({ ...minEdit, content: { ...minEdit.content, en: e.target.value } })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs"
                    />
                  </div>

                  {/* Devotional Content TE */}
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="min_content_te" className="block text-[10px] font-mono text-[#D4AF37] uppercase">Devotional Content Brief (Telugu)</label>
                    <textarea
                      id="min_content_te"
                      rows={4}
                      value={minEdit.content.te}
                      onChange={(e) => setMinEdit({ ...minEdit, content: { ...minEdit.content, te: e.target.value } })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded px-4 py-3 text-xs"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest rounded flex items-center space-x-1.5 hover:opacity-95 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  >
                    <RefreshCw className={isSaving ? 'animate-spin' : ''} size={14} />
                    <span>Save Ministry CMS Content</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SERMONS FULL CRUD */}
          {activeTab === 'sermons' && (
            <div className="space-y-8" id="sermons_crud_section">
              
              {/* Creator/Editor Form */}
              <form onSubmit={handleSermonSubmit} className="bg-[#141414] border border-[#D4AF37]/25 p-6 rounded-lg space-y-4" id="sermon_crud_form">
                <h3 className="text-sm font-bold uppercase font-mono text-[#D4AF37] tracking-wider border-b border-neutral-800 pb-2">
                  {editingSermonId ? 'Edit Sermon Archives' : 'Archive New Sermon Teaching'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Title EN */}
                  <div className="space-y-1">
                    <label htmlFor="form_sermon_title_en" className="block text-[9px] font-mono text-neutral-400">Title (English)</label>
                    <input
                      id="form_sermon_title_en"
                      type="text"
                      required
                      value={sermonForm.title?.en}
                      onChange={(e) => setSermonForm({
                        ...sermonForm,
                        title: { ...sermonForm.title!, en: e.target.value }
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs"
                    />
                  </div>

                  {/* Title TE */}
                  <div className="space-y-1">
                    <label htmlFor="form_sermon_title_te" className="block text-[9px] font-mono text-neutral-400">Title (Telugu)</label>
                    <input
                      id="form_sermon_title_te"
                      type="text"
                      required
                      value={sermonForm.title?.te}
                      onChange={(e) => setSermonForm({
                        ...sermonForm,
                        title: { ...sermonForm.title!, te: e.target.value }
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs"
                    />
                  </div>

                  {/* Speaker EN */}
                  <div className="space-y-1">
                    <label htmlFor="form_sermon_speaker_en" className="block text-[9px] font-mono text-neutral-400">Speaker (English)</label>
                    <input
                      id="form_sermon_speaker_en"
                      type="text"
                      required
                      value={sermonForm.speaker?.en}
                      onChange={(e) => setSermonForm({
                        ...sermonForm,
                        speaker: { ...sermonForm.speaker!, en: e.target.value }
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs"
                    />
                  </div>

                  {/* YouTube ID */}
                  <div className="space-y-1">
                    <label htmlFor="form_sermon_youtube" className="block text-[9px] font-mono text-neutral-400">YouTube Video ID</label>
                    <input
                      id="form_sermon_youtube"
                      type="text"
                      required
                      placeholder="e.g., pGvHMyo_r60"
                      value={sermonForm.youtubeId}
                      onChange={(e) => setSermonForm({ ...sermonForm, youtubeId: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs font-mono"
                    />
                  </div>

                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  {editingSermonId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSermonId(null);
                        setSermonForm({
                          title: { en: '', te: '' },
                          speaker: { en: '', te: '' },
                          description: { en: '', te: '' },
                          category: { en: '', te: '' },
                          youtubeId: '',
                          isFeatured: false
                        });
                      }}
                      className="px-4 py-2 border border-neutral-800 text-xs font-semibold rounded text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#D4AF37] text-black font-bold uppercase text-[10px] font-mono tracking-widest rounded flex items-center space-x-1 hover:opacity-90"
                  >
                    <Plus size={12} />
                    <span>{editingSermonId ? 'Update Sermon' : 'Save Sermon'}</span>
                  </button>
                </div>
              </form>

              {/* Data Table */}
              <div className="bg-[#141414] border border-neutral-800 rounded-lg overflow-hidden shadow-lg" id="sermons_table">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-black text-[#D4AF37] font-mono uppercase text-[9px] border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Video Link</th>
                      <th className="p-4">Title (English)</th>
                      <th className="p-4">Speaker</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {sermons.map((ser) => (
                      <tr key={ser.id} className="hover:bg-black/35">
                        <td className="p-4 font-mono text-neutral-400">
                          <a href={`https://youtube.com/watch?v=${ser.youtubeId}`} target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:underline text-[#D4AF37]">
                            <Eye size={12} />
                            <span>{ser.youtubeId}</span>
                          </a>
                        </td>
                        <td className="p-4 font-bold text-white">{ser.title.en}</td>
                        <td className="p-4">{ser.speaker.en}</td>
                        <td className="p-4 font-mono text-[10px] text-neutral-500">{ser.category?.en || 'General'}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingSermonId(ser.id);
                                setSermonForm({
                                  title: ser.title,
                                  speaker: ser.speaker,
                                  description: ser.description,
                                  category: ser.category,
                                  youtubeId: ser.youtubeId,
                                  isFeatured: ser.isFeatured
                                });
                              }}
                              className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                              title="Edit"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleSermonDelete(ser.id)}
                              className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: EVENTS FULL CRUD */}
          {activeTab === 'events' && (
            <div className="space-y-8" id="events_crud_section">
              
              {/* Creator/Editor Form */}
              <form onSubmit={handleEventSubmit} className="bg-[#141414] border border-[#D4AF37]/25 p-6 rounded-lg space-y-4" id="event_crud_form">
                <h3 className="text-sm font-bold uppercase font-mono text-[#D4AF37] tracking-wider border-b border-neutral-800 pb-2">
                  {editingEventId ? 'Edit Event Details' : 'Schedule New Holy Crusade Event'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Title EN */}
                  <div className="space-y-1">
                    <label htmlFor="form_event_title_en" className="block text-[9px] font-mono text-neutral-400">Title (English)</label>
                    <input
                      id="form_event_title_en"
                      type="text"
                      required
                      value={eventForm.title?.en}
                      onChange={(e) => setEventForm({
                        ...eventForm,
                        title: { ...eventForm.title!, en: e.target.value }
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs"
                    />
                  </div>

                  {/* Title TE */}
                  <div className="space-y-1">
                    <label htmlFor="form_event_title_te" className="block text-[9px] font-mono text-neutral-400">Title (Telugu)</label>
                    <input
                      id="form_event_title_te"
                      type="text"
                      required
                      value={eventForm.title?.te}
                      onChange={(e) => setEventForm({
                        ...eventForm,
                        title: { ...eventForm.title!, te: e.target.value }
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs"
                    />
                  </div>

                  {/* Location EN */}
                  <div className="space-y-1">
                    <label htmlFor="form_event_location" className="block text-[9px] font-mono text-neutral-400">Location (English)</label>
                    <input
                      id="form_event_location"
                      type="text"
                      required
                      value={eventForm.location?.en}
                      onChange={(e) => setEventForm({
                        ...eventForm,
                        location: { ...eventForm.location!, en: e.target.value }
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs"
                    />
                  </div>

                  {/* Date ISO */}
                  <div className="space-y-1">
                    <label htmlFor="form_event_date" className="block text-[9px] font-mono text-neutral-400">Event Date & Time</label>
                    <input
                      id="form_event_date"
                      type="datetime-local"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full bg-black border border-neutral-800 rounded p-2 text-xs font-mono"
                    />
                  </div>

                  {/* Description EN */}
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="form_event_desc" className="block text-[9px] font-mono text-neutral-400">Description Brief</label>
                    <textarea
                      id="form_event_desc"
                      rows={3}
                      required
                      value={eventForm.description?.en}
                      onChange={(e) => setEventForm({
                        ...eventForm,
                        description: { ...eventForm.description!, en: e.target.value }
                      })}
                      className="w-full bg-black border border-neutral-800 rounded p-2.5 text-xs font-sans"
                    />
                  </div>

                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEventId(null);
                        setEventForm({
                          title: { en: '', te: '' },
                          location: { en: '', te: '' },
                          description: { en: '', te: '' },
                          date: '',
                          isPast: false
                        });
                      }}
                      className="px-4 py-2 border border-neutral-800 text-xs font-semibold rounded text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#D4AF37] text-black font-bold uppercase text-[10px] font-mono tracking-widest rounded flex items-center space-x-1 hover:opacity-90"
                  >
                    <Plus size={12} />
                    <span>{editingEventId ? 'Update Event' : 'Save Event'}</span>
                  </button>
                </div>
              </form>

              {/* Data Table */}
              <div className="bg-[#141414] border border-neutral-800 rounded-lg overflow-hidden shadow-lg" id="events_table">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-black text-[#D4AF37] font-mono uppercase text-[9px] border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Title (English)</th>
                      <th className="p-4">Date / Time</th>
                      <th className="p-4">Location</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-black/35">
                        <td className="p-4 font-bold text-white">{event.title.en}</td>
                        <td className="p-4 font-mono text-neutral-400">{new Date(event.date).toLocaleString()}</td>
                        <td className="p-4">{event.location.en}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingEventId(event.id);
                                setEventForm({
                                  title: event.title,
                                  location: event.location,
                                  description: event.description,
                                  date: event.date,
                                  isPast: event.isPast
                                });
                              }}
                              className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                              title="Edit"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleEventDelete(event.id)}
                              className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 5: PRAYER SHIELD WALL MANAGER */}
          {activeTab === 'prayers' && (
            <div className="space-y-6" id="prayers_moderation_section">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono text-neutral-400">Total Requests In DB: {prayers.length}</span>
                <button onClick={fetchPrayers} className="p-2 text-[#D4AF37] hover:text-white flex items-center space-x-1 text-xs uppercase font-mono">
                  <RefreshCw size={12} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-4" id="prayers_moderation_cards">
                {prayers.map((pray) => (
                  <div key={pray.id} className="p-5 bg-[#141414] border border-neutral-800 rounded-lg relative space-y-3 shadow-md">
                    
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-white text-sm">{pray.name}</span>
                        <div className="text-[10px] font-mono text-neutral-500 mt-1 flex flex-wrap gap-3">
                          <span>Phone: {pray.phone}</span>
                          {pray.email && <span>Email: {pray.email}</span>}
                          <span>Submitted: {new Date(pray.date).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Status indicator badge */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handlePrayerStatusChange(pray.id, 'Praying')}
                          className={`px-2.5 py-1 text-[9px] font-mono uppercase font-bold rounded border ${
                            pray.status === 'Praying'
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                              : 'bg-black text-neutral-400 border-neutral-800 hover:border-neutral-500'
                          }`}
                        >
                          Praying
                        </button>
                        <button
                          onClick={() => handlePrayerStatusChange(pray.id, 'Answered')}
                          className={`px-2.5 py-1 text-[9px] font-mono uppercase font-bold rounded border ${
                            pray.status === 'Answered'
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-black text-neutral-400 border-neutral-800 hover:border-neutral-500'
                          }`}
                        >
                          Answered
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans italic p-3 bg-black/60 rounded border-l-2 border-[#D4AF37]/50">
                      "{pray.request}"
                    </p>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handlePrayerDelete(pray.id)}
                        className="px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition text-[10px] font-mono uppercase flex items-center space-x-1"
                      >
                        <Trash2 size={10} />
                        <span>Purge Request</span>
                      </button>
                    </div>

                  </div>
                ))}

                {prayers.length === 0 && (
                  <div className="text-center py-20 text-neutral-500">
                    <Heart size={44} className="text-neutral-700 mx-auto mb-2" />
                    <p className="text-sm">No prayer requests inbox logs. Refresh or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: NEWSLETTER SUBSCRIPTION INBOX */}
          {activeTab === 'newsletters' && (
            <div className="space-y-6" id="newsletters_inbox_section">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono text-neutral-400">Newsletter subscribers count: {newsletters.length}</span>
                <button onClick={fetchNewsletters} className="p-2 text-[#D4AF37] hover:text-white flex items-center space-x-1 text-xs uppercase font-mono">
                  <RefreshCw size={12} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="bg-[#141414] border border-neutral-800 rounded-lg overflow-hidden shadow-lg" id="newsletter_table_container">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-black text-[#D4AF37] font-mono uppercase text-[9px] border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Subscribed Date</th>
                      <th className="p-4">Channel Group</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {newsletters.map((nl) => (
                      <tr key={nl.id} className="hover:bg-black/35">
                        <td className="p-4 font-bold text-white font-mono">{nl.email}</td>
                        <td className="p-4 text-neutral-400">{new Date(nl.date).toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
                            General Broadcast
                          </span>
                        </td>
                      </tr>
                    ))}
                    {newsletters.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-neutral-500">
                          No subscribers logged currently.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
