import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
const resources = {
  en: {
    translation: {
      // General
      "welcome": "Welcome to Lumière Villas",
      "book_now": "Book Now",
      "login": "Login",
      "logout": "Logout",
      "search": "Search anything...",
      
      // Landing Page
      "hero_title": "Luxury Redefined",
      "hero_subtitle": "Experience the ultimate getaway in our exclusive private villas.",
      "discover_villas": "Discover Villas",
      
      // Admin Sidebar
      "dashboard": "Dashboard",
      "villas": "Villas",
      "reservations": "Reservations",
      "calendar": "Calendar",
      "guests": "Guests",
      "billing": "Billing",
      "reports": "Reports",
      "analytics": "Analytics",
      "promo_codes": "Promo Codes",
      "settings": "Settings",
      
      // Booking Form
      "reservation_details": "Reservation Details",
      "first_name": "First Name",
      "last_name": "Last Name",
      "email": "Email",
      "phone": "Phone",
      "check_in": "Check-in",
      "check_out": "Check-out",
      "guests_count": "Guests",
      "booking_summary": "Booking Summary",
      
      // Analytics Dashboard
      "analytics_title": "Analytics Dashboard",
      "analytics_subtitle": "Comprehensive view of operations and revenue",
      "total_revenue": "Total Revenue",
      "avg_daily_rate": "Avg. Daily Rate",
      "revenue_trends": "Revenue Trends",
      "occupancy_villas": "Occupancy by Villa",
      "booking_sources": "Booking Sources"
    }
  },
  hi: {
    translation: {
      // General
      "welcome": "Lumière विला में आपका स्वागत है",
      "book_now": "अभी बुक करें",
      "login": "लॉग इन",
      "logout": "लॉग आउट",
      "search": "कुछ भी खोजें...",
      
      // Landing Page
      "hero_title": "लग्ज़री की नई परिभाषा",
      "hero_subtitle": "हमारे विशेष प्राइवेट विला में बेहतरीन छुट्टियों का अनुभव लें।",
      "discover_villas": "विला खोजें",
      
      // Admin Sidebar
      "dashboard": "डैशबोर्ड",
      "villas": "विला",
      "reservations": "बुकिंग",
      "calendar": "कैलेंडर",
      "guests": "अतिथि",
      "billing": "बिलिंग",
      "reports": "रिपोर्ट्स",
      "analytics": "एनालिटिक्स",
      "promo_codes": "प्रोमो कोड",
      "settings": "सेटिंग्स",
      
      // Booking Form
      "reservation_details": "बुकिंग विवरण",
      "first_name": "पहला नाम",
      "last_name": "अंतिम नाम",
      "email": "ईमेल",
      "phone": "फ़ोन",
      "check_in": "चेक-इन",
      "check_out": "चेक-आउट",
      "guests_count": "अतिथि",
      "booking_summary": "बुकिंग सारांश",
      
      // Analytics Dashboard
      "analytics_title": "एनालिटिक्स डैशबोर्ड",
      "analytics_subtitle": "संचालन और आय का व्यापक दृश्य",
      "total_revenue": "कुल आय",
      "avg_daily_rate": "औसत दैनिक दर",
      "revenue_trends": "आय के रुझान",
      "occupancy_villas": "विला के अनुसार ऑक्यूपेंसी",
      "booking_sources": "बुकिंग के स्रोत"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app-language') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
