import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Coffee, Car, Waves, Bath, BedDouble } from 'lucide-react';

const amenities = [
  { icon: BedDouble, name: '4 Bedrooms' },
  { icon: Bath, name: '4 Bathrooms' },
  { icon: Waves, name: 'Private Pool' },
  { icon: Wifi, name: 'Fast WiFi' },
  { icon: Coffee, name: 'Breakfast' },
  { icon: Car, name: 'Free Parking' },
];

const HospitalityService = () => {
  return (
    <section className="py-24 bg-dark-lighter relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2">
              <img src="https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Villa Interior" className="w-full h-80 object-cover" />
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Villa Details" className="w-full h-48 object-cover" />
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Villa Bedroom" className="w-full h-48 object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">The Signature Villa</span>
            <h2 className="text-4xl md:text-5xl font-display mt-4 mb-6">Experience Ultimate Luxury</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Step into a world of elegance. Our signature villa features spacious living areas, a private infinity pool overlooking the ocean, and bespoke interior design that blends modern luxury with local charm. Perfect for families or groups seeking a private sanctuary.
            </p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
              {amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-landing-primary">
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium tracking-wide">{item.name}</span>
                </div>
              ))}
            </div>

            <a href="#villas" className="inline-block bg-landing-primary text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-landing-secondary transition-all duration-300">
              View Full Gallery
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HospitalityService;
