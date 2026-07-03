import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Villas', href: '#villas' },
    { name: 'Availability', href: '#availability' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
    { name: 'Login', href: '/login' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className={`text-2xl font-bold font-display tracking-tight ${scrolled ? 'text-primary' : 'text-white'}`}>
              LUMIÈRE <span className="text-landing-primary font-normal">VILLAS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm uppercase tracking-widest font-medium transition-colors duration-300 ${scrolled ? 'text-text-primary hover:text-landing-primary' : 'text-white/90 hover:text-landing-primary'}`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm uppercase tracking-widest font-medium transition-colors duration-300 ${scrolled ? 'text-text-primary hover:text-landing-primary' : 'text-white/90 hover:text-landing-primary'}`}
                >
                  {link.name}
                </a>
              )
            ))}
            <a
              href="#booking"
              className="bg-primary text-white px-8 py-3 rounded-none font-semibold hover:bg-primary-dark transition-all duration-300 tracking-widest uppercase text-sm"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled ? 'text-primary' : 'text-white'} p-2`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-text-primary hover:bg-background rounded-lg uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-text-primary hover:bg-background rounded-lg uppercase tracking-wider"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <a
                href="#booking"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-primary text-white py-4 rounded-none font-bold mt-4 uppercase tracking-widest"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
