import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Eleanor Vance',
    location: 'London, UK',
    text: 'An absolutely magical experience. The villa exceeded all expectations, and the staff made sure every detail of our stay was perfect. We will definitely be returning.',
    rating: 5
  },
  {
    name: 'James Harrison',
    location: 'Sydney, Australia',
    text: 'The view from the infinity pool at sunset is indescribable. The architecture blends seamlessly with nature. Pure luxury from check-in to check-out.',
    rating: 5
  },
  {
    name: 'Sophia Martinez',
    location: 'Madrid, Spain',
    text: 'A flawless honeymoon destination. Privacy, elegance, and five-star service. It was everything we dreamed of and more.',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-dark relative text-white" id="reviews">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-40"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')` }}
      />
      <div className="absolute inset-0 bg-primary-dark/80 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Guest Experiences</span>
          <h2 className="text-4xl md:text-5xl font-display mt-4 text-white">What Our Guests Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md p-8 border border-white/20 relative"
            >
              <Quote className="absolute top-6 right-6 text-white/10" size={60} />
              <div className="flex text-landing-primary mb-6">
                {[...Array(item.rating)].map((_, i) => <Star key={i} size={16} className="fill-landing-primary" />)}
              </div>
              <p className="text-gray-200 italic mb-8 leading-relaxed font-light text-sm">"{item.text}"</p>
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-semibold text-white font-display text-lg">{item.name}</h4>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
