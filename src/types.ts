export type Language = 'en' | 'te';

export interface ChurchSettings {
  churchName: { en: string; te: string };
  pastorName: { en: string; te: string };
  phone: string;
  email: string;
  address: { en: string; te: string };
  instagram: string;
  instagramLink: string;
  whatsappName: string;
  whatsappLink: string;
  youtubeName: string;
  youtubeLink: string;
  logoUrl: string;
  heroBannerUrl: string;
  pastorPortraitUrl: string;
  pastorPortraitWidthHome: string;
  pastorPortraitHeightHome: string;
  pastorPortraitHeightBio: string;
  heroSliderHeight: string;
  bibleVerse: {
    verse: { en: string; te: string };
    reference: { en: string; te: string };
  };
  mission: { en: string; te: string };
  vision: { en: string; te: string };
  donationUpi: string;
  donationQrCode: string; // Base64 or URL
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  seoKeywords: string;
  seoDescription: string;
  footerText: { en: string; te: string };
  aboutHistory: { en: string; te: string };
}

export interface PastorDetails {
  name: { en: string; te: string };
  photoUrl: string;
  bio: { en: string; te: string };
  journey: { en: string; te: string };
  vision: { en: string; te: string };
  achievements: { en: string; te: string }[];
  socials: {
    instagram: string;
    youtube: string;
    whatsapp: string;
  };
}

export interface Ministry {
  id: string;
  name: { en: string; te: string };
  title: { en: string; te: string };
  description: { en: string; te: string };
  content: { en: string; te: string };
  imageUrl: string;
  category: 'youth' | 'children' | 'women' | 'men' | 'worship' | 'prayer' | 'evangelism' | 'study';
}

export interface Sermon {
  id: string;
  title: { en: string; te: string };
  description: { en: string; te: string };
  speaker: { en: string; te: string };
  date: string;
  category: { en: string; te: string };
  youtubeId: string; // YouTube video ID for embedding
  isFeatured: boolean;
}

export interface Event {
  id: string;
  title: { en: string; te: string };
  description: { en: string; te: string };
  date: string; // ISO date string
  location: { en: string; te: string };
  imageUrl: string;
  isPast: boolean;
  registrationCount: number;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: { en: string; te: string };
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: { en: string; te: string };
  avatarUrl: string;
  rating: number;
  isApproved: boolean;
  date: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  request: string;
  status: 'Pending' | 'Praying' | 'Answered';
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  amount: number;
  email: string;
  phone: string;
  date: string;
  method: 'UPI' | 'Bank Transfer';
  status: 'Pending' | 'Completed';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  date: string;
  ip?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'prayer' | 'contact' | 'donation' | 'registration';
}

export interface NewsLetter {
  id: string;
  email: string;
  date: string;
}

export interface ChurchDatabase {
  settings: ChurchSettings;
  pastor: PastorDetails;
  ministries: Ministry[];
  sermons: Sermon[];
  events: Event[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  prayerRequests: PrayerRequest[];
  contactMessages: ContactMessage[];
  donations: DonationRecord[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  newsletters: NewsLetter[];
}
