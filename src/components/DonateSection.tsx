import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CreditCard, QrCode, Copy, CheckCircle, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface DonateSectionProps {
  currentLanguage: Language;
}

export default function DonateSection({ currentLanguage }: DonateSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successOffering, setSuccessOffering] = useState(false);
  const [offeringData, setOfferingData] = useState({ donor: '', amount: '', purpose: 'Offering' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[currentLanguage];

  const bankDetails = {
    accountName: 'MANDE SHALEM RAJU',
    bankName: 'UNION BANK OF INDIA',
    accountNumber: '531102010011425',
    ifscCode: 'UBIN0553115',
    branch: 'KANCHIKACHARLA',
    upiId: '7981788313@ybl'
  };

  // Mock ledger to simulate active giving transparency
  const [offeringsLedger, setOfferingsLedger] = useState([
    { id: '1', donor: 'Elder David', amount: '₹5,000', date: 'July 18, 2026', purpose: 'Tithes' },
    { id: '2', donor: 'Sister Krupa', amount: '₹1,500', date: 'July 17, 2026', purpose: 'Poor Feeding' },
    { id: '3', donor: 'Anonymous Believer', amount: '₹10,000', date: 'July 15, 2026', purpose: 'Village Gospel Outreaches' },
    { id: '4', donor: 'Brother Anand', amount: '₹2,000', date: 'July 14, 2026', purpose: 'General Offering' }
  ]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleOfferingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringData.donor || !offeringData.amount) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate database addition locally
      const formattedAmt = `₹${Number(offeringData.amount).toLocaleString()}`;
      const now = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
      
      setOfferingsLedger(prev => [
        { id: String(Date.now()), donor: offeringData.donor, amount: formattedAmt, date: now, purpose: offeringData.purpose },
        ...prev
      ]);
      
      setSuccessOffering(true);
      setOfferingData({ donor: '', amount: '', purpose: 'Offering' });
      setIsSubmitting(false);

      setTimeout(() => setSuccessOffering(false), 6000);
    }, 1200);
  };

  // Generate UPI QR Code URL dynamically
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(bankDetails.accountName)}&cu=INR`;

  return (
    <div className="py-16 bg-[#0B0B0B]" id="donation_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2">
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] font-mono uppercase tracking-[0.2em] text-xs">ONLINE ALMS & TITHES</span>
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase mt-2">
            {t.donationMessage}
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            {t.donationSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Instant UPI & QR (5 Cols) */}
          <div className="lg:col-span-5 bg-[#141414] border border-[#D4AF37]/25 rounded-lg p-6 sm:p-8 shadow-2xl relative text-center space-y-6" id="upi_qr_container">
            
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#D4AF37]" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-[#D4AF37]" />

            <div className="flex items-center justify-center space-x-2 text-[#D4AF37]">
              <Smartphone size={20} />
              <h3 className="text-sm font-mono uppercase font-bold tracking-widest">{t.upiDonation}</h3>
            </div>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Scan the official church QR code below using GPay, PhonePe, Paytm, BHIM, or any UPI bank app to transfer offerings instantly.
            </p>

            {/* Simulated QR Code Wrapper */}
            <div className="relative w-48 h-48 mx-auto p-2 bg-white rounded border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center">
              <img
                src={upiQrUrl}
                alt="Jesus Shalem Ministries UPI QR Code"
                className="w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Official JSM UPI Handle</span>
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-black border border-neutral-800 text-xs font-mono text-neutral-300">
                <span>{bankDetails.upiId}</span>
                <button
                  onClick={() => handleCopy(bankDetails.upiId, 'upi')}
                  className="text-neutral-500 hover:text-[#D4AF37] transition"
                  title="Copy UPI ID"
                >
                  {copiedField === 'upi' ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] font-mono text-neutral-500">
              <ShieldCheck size={14} className="text-green-500" />
              <span>100% SECURE DIRECT TO CHURCH TRUSTEE ACCOUNTS</span>
            </div>

          </div>

          {/* Middle Column: Bank Details & Ledger Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Direct Bank Card */}
            <div className="bg-[#141414] border border-[#D4AF37]/20 rounded-lg p-6 sm:p-8 shadow-2xl relative" id="bank_card_container">
              
              <div className="flex items-center space-x-2 text-[#D4AF37] mb-6">
                <CreditCard size={18} />
                <h3 className="text-sm font-mono uppercase font-bold tracking-widest">{t.bankTitle}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="bank_details_fields">
                
                {[
                  { label: t.accountName, val: bankDetails.accountName, key: 'name' },
                  { label: t.bankName, val: bankDetails.bankName, key: 'bank' },
                  { label: t.accountNum, val: bankDetails.accountNumber, key: 'num', copyable: true },
                  { label: t.ifsc, val: bankDetails.ifscCode, key: 'ifsc', copyable: true },
                  { label: t.branch, val: bankDetails.branch, key: 'branch' }
                ].map((field) => (
                  <div key={field.label} className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                      {field.label}
                    </span>
                    <div className="flex items-center justify-between p-3 rounded bg-black border border-neutral-800 text-xs text-white">
                      <span className="font-sans font-medium tracking-wide">{field.val}</span>
                      {field.copyable && (
                        <button
                          onClick={() => handleCopy(field.val, field.key)}
                          className="text-neutral-500 hover:text-[#D4AF37] transition"
                        >
                          {copiedField === field.key ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Offline Giving Confirmation Form */}
            <div className="bg-[#141414] border border-neutral-800 rounded-lg p-6 shadow-xl relative" id="offering_log_container">
              <h3 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest mb-4 flex items-center space-x-1">
                <Heart size={14} className="text-red-500" />
                <span>Submit Offering Affirmation</span>
              </h3>

              <AnimatePresence mode="wait">
                {successOffering ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 rounded border border-green-500/30 bg-green-500/5 text-center space-y-2"
                    id="offering_success_banner"
                  >
                    <CheckCircle className="text-green-500 mx-auto" size={28} />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t.thankYouTitle}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-md mx-auto">
                      {t.thankYouMessage}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleOfferingSubmit} className="space-y-4" id="offering_form">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label htmlFor="offering_donor" className="block text-[9px] font-mono text-neutral-400 uppercase">Donor Name</label>
                        <input
                          id="offering_donor"
                          type="text"
                          required
                          placeholder="e.g., Brother Srinivas"
                          value={offeringData.donor || ''}
                          onChange={(e) => setOfferingData({ ...offeringData, donor: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="offering_amount" className="block text-[9px] font-mono text-neutral-400 uppercase">Amount (INR)</label>
                        <input
                          id="offering_amount"
                          type="number"
                          required
                          placeholder="e.g., 5000"
                          value={offeringData.amount || ''}
                          onChange={(e) => setOfferingData({ ...offeringData, amount: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="offering_purpose" className="block text-[9px] font-mono text-neutral-400 uppercase">Purpose</label>
                        <select
                          id="offering_purpose"
                          value={offeringData.purpose || ''}
                          onChange={(e) => setOfferingData({ ...offeringData, purpose: e.target.value })}
                          className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="General Offering">General Offering</option>
                          <option value="Tithes">Holy Tithes</option>
                          <option value="Poor Feeding">Feeding the Poor</option>
                          <option value="Gospel Outreaches">Gospel Crusades</option>
                        </select>
                      </div>

                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold uppercase text-[10px] font-mono tracking-widest rounded flex items-center space-x-1.5 hover:opacity-95 transition disabled:opacity-50"
                      >
                        <span>Affirm Gift</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>

            {/* Offering Ledger stream */}
            <div className="bg-[#141414] border border-neutral-800 rounded-lg p-6 shadow-xl" id="offering_ledger">
              <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center space-x-2 border-b border-neutral-800 pb-2">
                <Heart size={12} className="text-red-500 animate-pulse" />
                <span>{t.donationHistory}</span>
              </h4>

              <div className="space-y-3 overflow-y-auto max-h-[160px] scrollbar-none pr-1">
                {offeringsLedger.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded bg-black border border-neutral-800/60 text-xs font-sans">
                    <div>
                      <span className="font-bold text-neutral-300 block leading-none">{item.donor}</span>
                      <span className="text-[10px] text-neutral-500 font-mono mt-1 block">{item.purpose} • {item.date}</span>
                    </div>
                    <span className="font-mono text-[#D4AF37] font-bold text-sm bg-[#D4AF37]/5 border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
