import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[100vh] flex items-center pt-24 lg:pt-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-landing-primary uppercase tracking-[0.3em] text-sm font-semibold mb-4">{t('welcome') || 'Welcome To Paradise'}</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display mb-6 text-white leading-tight">
            {t('hero_title') || 'Luxury Villa'} <br />
            <span className="italic font-light">Experience</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed font-light mx-auto">
            {t('hero_subtitle') || 'Discover a world of unparalleled luxury and serenity. Our exclusive villas offer breathtaking views, premium amenities, and a truly unforgettable getaway.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <a href="#booking" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 md:px-10 py-4 uppercase tracking-[0.2em] font-semibold text-sm transition-all duration-300">
              {t('book_now') || 'Book Now'}
            </a>
            <a
              href="#villas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-white text-white px-8 py-4 uppercase tracking-[0.2em] font-semibold text-sm hover:bg-white hover:text-text-primary transition-all duration-300"
            >
              {t('discover_villas') || 'Explore Villas'}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
