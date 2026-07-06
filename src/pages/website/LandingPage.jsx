import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EcosystemGrid from './components/EcosystemGrid';
import Stats from './components/Stats';
import FeaturedVillas from './components/FeaturedVillas';
import HospitalityService from './components/HospitalityService';
import About from './components/About';
import Services from './components/Services';
import Reservation from './components/Reservation';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';

const LandingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-background text-text-primary selection:bg-landing-primary/30 min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        {/* <EcosystemGrid /> replaced by AvailabilitySearch */}
        <EcosystemGrid />
        <FeaturedVillas /> {/* This will be Featured Villas */}
        <HospitalityService /> {/* This will be Villa Details Preview */}
        <Stats /> {/* This will be Availability Calendar */}
        <Reservation /> {/* This will be Booking Form */}
        <Services /> {/* This will be Why Choose Us */}
        <Testimonials />
        <About /> {/* This will be Gallery */}
        <Contact /> {/* This will include Map and Contact Form */}
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/623611234567?text=Hi%20Lumi%C3%A8re%20Villas!%20I%20have%20an%20inquiry%20about%20booking%20a%20stay."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-[490] w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.858.002-2.637-1.023-5.116-2.885-6.98C16.579 1.83 14.1 1.814 12.01 1.814c-5.437 0-9.863 4.42-9.866 9.863-.001 1.765.463 3.49 1.344 5.011l-.986 3.605 3.693-.969zm11.378-5.421c-.302-.15-1.787-.882-2.062-.983-.275-.099-.475-.15-.675.15-.199.299-.775.98-.95 1.18-.175.199-.349.224-.651.075-.302-.15-1.276-.47-2.43-1.499-.898-.8-1.504-1.79-1.68-2.09-.175-.302-.019-.465.131-.614.136-.134.302-.349.453-.524.15-.175.2-.299.3-.499.099-.2.05-.375-.025-.524-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.519-.175-.009-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-.1.9-.1 2.2 0 1.3.95 2.55 1.075 2.725.125.175 1.86 2.84 4.505 3.986.63.272 1.12.435 1.503.556.633.201 1.21.173 1.666.105.508-.076 1.787-.73 2.037-1.436.25-.706.25-1.31.175-1.436-.075-.125-.275-.2-.575-.35z"/>
        </svg>
      </a>
    </div>
  );
};

export default LandingPage;
