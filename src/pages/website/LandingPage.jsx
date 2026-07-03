import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EcosystemGrid from './components/EcosystemGrid';
import Stats from './components/Stats';
import FeaturedFood from './components/FeaturedFood';
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
        <FeaturedFood /> {/* This will be Featured Villas */}
        <HospitalityService /> {/* This will be Villa Details Preview */}
        <Stats /> {/* This will be Availability Calendar */}
        <Reservation /> {/* This will be Booking Form */}
        <Services /> {/* This will be Why Choose Us */}
        <Testimonials />
        <About /> {/* This will be Gallery */}
        <Contact /> {/* This will include Map and Contact Form */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
