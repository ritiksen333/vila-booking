import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Maximize } from 'lucide-react';

const villas = [
  { id: 1, name: 'Villa Serenity', location: 'Ubud, Bali', price: '$450', rating: 4.9, guests: 4, size: '250 sqm', img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Ocean View Retreat', location: 'Santorini, Greece', price: '$850', rating: 5.0, guests: 6, size: '320 sqm', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Jungle Oasis', location: 'Tulum, Mexico', price: '$350', rating: 4.8, guests: 2, size: '150 sqm', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'The Royal Estate', location: 'Amalfi Coast, Italy', price: '$1200', rating: 5.0, guests: 10, size: '600 sqm', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Desert Mirage', location: 'Dubai, UAE', price: '$900', rating: 4.7, guests: 8, size: '450 sqm', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Alpine Chalet', location: 'Zermatt, Switzerland', price: '$1100', rating: 4.9, guests: 8, size: '400 sqm', img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const FeaturedVillas = () => {
  return (
    <section className="py-24 bg-background overflow-hidden" id="villas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Our Collection</span>
          <h2 className="text-4xl md:text-5xl font-display mt-4 text-text-primary">Featured Villas</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {villas.map((villa, index) => (
            <motion.div
              key={villa.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group border border-border bg-surface hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={villa.img} 
                  alt={villa.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 bg-surface text-text-primary text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-md">
                  {villa.price} <span className="text-text-secondary font-normal lowercase">/night</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-text-secondary text-sm">
                    <MapPin size={14} className="mr-1 text-landing-primary" />
                    <span>{villa.location}</span>
                  </div>
                  <div className="flex items-center text-landing-primary text-sm">
                    <Star size={14} className="fill-landing-primary mr-1" />
                    <span className="font-semibold text-text-primary">{villa.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-display mb-4 text-text-primary">{villa.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{villa.guests} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize size={16} />
                    <span>{villa.size}</span>
                  </div>
                </div>

                <a href="#booking" className="block text-center bg-transparent border border-primary text-primary hover:bg-primary hover:text-white py-3 uppercase tracking-widest text-xs font-bold transition-all duration-300">
                  Book Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVillas;
