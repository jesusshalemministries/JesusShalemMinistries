import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
    try {
      const fetchJson = async (url) => {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            return data;
          }
        } catch (e) {
          console.error('Fetch error for', url, e);
        }
        return null;
      };

      const [settingsData, ministriesData, sermonsData, eventsData, galleryData] = await Promise.all([
        fetchJson('/api/settings'),
        fetchJson('/api/ministries'),
        fetchJson('/api/sermons'),
        fetchJson('/api/events'),
        fetchJson('/api/gallery')
      ]);

      if (settingsData) setSettings(settingsData);
      else {
        // Fallback to prevent eternal loading
        setSettings({
          churchName: { en: "Jesus Shalem Ministries", te: "యేసు శాలేము మినిస్ట్రీస్" },
          pastorName: { en: "Pastor Mande. SHALEM RAJU", te: "పాస్టర్ మందే. శాలేము రాజు" },
          phone: "+91 7981788313",
          email: "JesusShalemMinistries@gmail.com",
          address: { en: "Ponnavaram", te: "పొన్నవరం" },
          instagram: "jesus_shalem_ministries",
          instagramLink: "https://www.instagram.com/jesus_shalem_ministries?igsh=ajljZjB1NnB3ZXBi",
          whatsappName: "Jesus Shalem Ministries",
          whatsappLink: "https://whatsapp.com/channel/0029VbDHZ7XISTkF4bpo6P1q",
          youtubeName: "Jesus Shalem Ministries",
          youtubeLink: "https://youtube.com/@jesusshalemministries?si=m7OCOrD0zA2R6LLk",
          logoUrl: "/src/assets/images/church_logo_new_1784635370468.jpg",
          heroBannerUrl: "/src/assets/images/church_building_new_1784636792290.jpg",
          pastorPortraitUrl: "/uploads/image-1785906876231-728335918.jpg",
          pastorPortraitWidthHome: "260px",
          pastorPortraitHeightHome: "280px",
          pastorPortraitHeightBio: "380px",
          heroSliderHeight: "85vh",
          bibleVerse: { verse: { en: "", te: "" }, reference: { en: "", te: "" } },
          mission: { en: "", te: "" },
          vision: { en: "", te: "" },
          donationUpi: "",
          donationQrCode: "",
          bankDetails: { bankName: "", accountName: "", accountNumber: "", ifscCode: "", branch: "" },
          seoKeywords: "",
          seoDescription: "",
          footerText: { en: "", te: "" },
          aboutHistory: { en: "", te: "" }
        });
      }

      if (ministriesData) setMinistries(ministriesData);
      if (sermonsData) setSermons(sermonsData);
      if (eventsData) setEvents(eventsData);
      if (galleryData) setGallery(galleryData);

    } catch (err) {
`;

code = code.replace(/try\s*\{\s*console\.log\('Starting fetch\.\.\.'\);\s*const\s*\[resSettings[\s\S]*?resGallery\.json\(\)\);\s*\}\s*catch\s*\(err\)\s*\{/, replacement.trim() + " {");
fs.writeFileSync('src/App.tsx', code);
