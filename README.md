# Jesus Shalem Ministries (JSM) — Premium Full-Stack Church Website & Admin CMS

A high-performance, responsive, luxury-designed full-stack website built for **Jesus Shalem Ministries (Ponnavaram, Kanchikacharla)**. This application combines a premium frontend (Black, Gold, and White theme) with an integrated Express-based backend server and an automated, file-persisted Admin CMS.

---

## 🎨 Architectural & Design Philosophy

- **Premium Luxury Theme**: Built using a strict, intentional color scheme—deep obsidian blacks (`#0B0B0B`, `#141414`), polished metallic golds (`#D4AF37`, `#AA7C11`), and spacious negative-space layouts.
- **Bilingual Core Localization**: Fully localized in English and Telugu (`en` | `te`) utilizing an instant, state-synchronized reactive translation dictionary.
- **Robust Full-Stack Model**: Exposes RESTful JSON endpoints under `/api/*` backed by a file-persisted database manager that prevents concurrent write collisions.
- **AI-Powered Sacred Helpers**: Incorporates server-side **Google Gemini SDK** integrations to power:
  1. An intelligent *Verse of the Day* context-generation engine.
  2. A natural language *Sacred Bible Search Helper* capable of identifying Scripture passages based on feelings, situations, or topics.

---

## 🚀 Key Features

### ⛪ Public Portals
1. **Interactive Hero Slider**: Fully customizable slide-banners showcasing active crusades and healing assemblies.
2. **Ministries Dashboard**: Category-driven grid (Youth, Kids, Women, Worship, Village outreaches) supporting rich translations.
3. **Sermon Video Archive**: Embedded responsive YouTube players, cataloging previous scripture expositions by Pastor Shalem Raju.
4. **Interactive Crusade Registration**: Countdowns, maps, and visitor registration forms that update registration metrics in real-time.
5. **Masonry Photo Gallery**: Dynamic high-contrast lightbox viewer featuring high-resolution historical highlights of assemblies.
6. **Simulated High-Definition Live stream**: Immersive simulated stream complete with live global congregational prayer chat rooms.
7. **Bilingual Prayer Wall**: Interactive prayer request form allowing visitors to post requests and watch them get updated as "Praying" or "Answered" by pastors.
8. **Digital Donation Desk**: Safe, luxury portal facilitating UPI scan codes, copyable IFSC bank details, and an open offering ledger for absolute accountability.

### 🔐 Secure Admin CMS
- **Credentials**: Available in the development server profile (configured in `server/auth.ts`).
- **Live State Customizer**: Dynamic schema updates to adjust church email, addresses, branding logos, banners, and default bible verses on-the-fly.
- **Resource Management**: Complete, validation-secure CRUD interfaces for:
  - **Sermons Archive**: Add, edit, or delete preaching entries and youtubeIds.
  - **Crusades/Events**: Launch new countdown timelines.
  - **Ministries Directory**: Expand the congregation's outreach pillars.
- **Shepherd Inbox & Moderation**:
  - Active list to review and mark submitted **Prayer Requests** as "Praying" or "Answered".
  - Manage **Visitor Registrations** (Volunteers and Covenant family members).
  - Secure **Activity Logs** monitor admin movements with simulated IP indicators.

---

## 🛠️ Project Structure

```bash
├── server.ts                 # Full-stack Express server entrypoint (Vite Dev Middleware routing)
├── server/
│   ├── db.ts                 # JSON-file backed persistent DB manager & fallback seeds
│   └── auth.ts               # Basic Session Auth & Admin verification logic
├── src/
│   ├── App.tsx               # Main frontend orchestrator & view router
│   ├── main.tsx              # React client hydration entrypoint
│   ├── index.css             # Custom Inter/JetBrains typography and global scrollbar rules
│   ├── translations.ts       # Bilingual dictionary (English & Telugu)
│   ├── types.ts              # Absolute TypeScript interfaces for databases, sermons, events
│   └── components/
│       ├── Navbar.tsx        # Responsive mobile-first navigation and language-toggle
│       ├── HeroSlider.tsx    # Luxury home hero slider & banner customizer target
│       ├── BibleHelper.tsx   # AI-powered Scripture search tool (Gemini API)
│       ├── MinistriesView.tsx# Bento grid ministries directory
│       ├── SermonsView.tsx   # YouTube sermon player & catalog
│       ├── EventsView.tsx    # Live crusade count and registration form
│       ├── GalleryView.tsx   # Photo gallery and fluid lightbox modal
│       ├── LiveStreamView.tsx# Immersive live stream & real-time chat simulator
│       ├── PrayerRequestForm.tsx # Dual form and public prayer wall
│       ├── DonateSection.tsx # Digital donation ledger and UPI/Bank portal
│       └── AdminPanel.tsx    # Complete CMS dashboard, inbox list, and system log
```

---

## ⚙️ Development & Deployment

### Environment Configuration
Configure your `.env` or Secrets panel with:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

### Command Execution scripts
All scripts are automated inside `package.json`:
- **Run Development Environment**: `npm run dev`
- **Compile Production Bundle**: `npm run build`
- **Start Production Container**: `npm run start`

---

## 🕊️ Dedication

This website stands as a digital beacon dedicated to the glory of our Lord **Jesus Christ**, supporting the humble evangelical hands of **Pastor Mande. SHALEM RAJU** in Ponnavaram, Kanchikacharla, NTR District, Andhra Pradesh. May souls be saved, bodies healed, and villages restored!
