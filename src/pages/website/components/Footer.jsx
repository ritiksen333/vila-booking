import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <span className="text-2xl font-bold font-display tracking-tight text-white">
                LUMIÈRE <span className="text-landing-primary font-normal">VILLAS</span>
              </span>
            </Link>
            <p className="text-white/70 leading-relaxed text-sm">
              Experience the pinnacle of luxury and tranquility. Our exclusive villas offer a private sanctuary for those seeking the ultimate escape.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-landing-primary hover:border-landing-primary transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-display font-semibold mb-8 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><a href="/" className="hover:text-landing-primary transition-colors">Home</a></li>
              <li><a href="#villas" className="hover:text-landing-primary transition-colors">Villas</a></li>
              <li><a href="#availability" className="hover:text-landing-primary transition-colors">Availability</a></li>
              <li><a href="#gallery" className="hover:text-landing-primary transition-colors">Gallery</a></li>
              <li><a href="#contact" className="hover:text-landing-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-display font-semibold mb-8 uppercase tracking-widest">Contact Info</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>Jalan Raya Seminyak No. 14</li>
              <li>Bali, Indonesia 80361</li>
              <li>+62 361 1234 567</li>
              <li>concierge@lumierevillas.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-display font-semibold mb-8 uppercase tracking-widest">Newsletter</h4>
            <p className="text-white/70 mb-6 text-sm">Subscribe to receive exclusive offers and updates.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-landing-primary transition-colors pr-10 text-sm"
              />
              <button className="absolute right-0 top-0 bottom-0 text-white/70 hover:text-landing-primary transition-colors">
                <ArrowUp size={16} className="rotate-90" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center text-white/50 text-xs tracking-wider">
          <p>© 2026 Lumière Villas. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-surface text-text-primary border border-border shadow-md flex items-center justify-center hover:bg-landing-primary hover:text-white hover:border-landing-primary transition-all duration-300 z-50 group"
      >
        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
};

export default Footer;
