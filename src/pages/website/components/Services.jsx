import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, Award, Gem, CheckCircle } from 'lucide-react';

const reasons = [
  {
    icon: Gem,
    title: 'Best Price Guarantee',
    desc: 'Book directly with us to ensure you receive the best rates available anywhere.'
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    desc: 'Your payment and personal details are protected by enterprise-grade security.'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    desc: 'Our concierge team is available around the clock to assist with any requests.'
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    desc: 'Our villas are situated in the most exclusive and breathtaking locations globally.'
  },
  {
    icon: Award,
    title: 'Luxury Amenities',
    desc: 'Experience world-class facilities, from private chefs to infinity pools.'
  },
  {
    icon: CheckCircle,
    title: 'Instant Confirmation',
    desc: 'Receive your booking confirmation and itinerary instantly upon reservation.'
  }
];

const Services = () => {
  return (
    <section className="py-24 bg-surface" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Excellence Guaranteed</span>
        <h2 className="text-4xl md:text-5xl font-display mt-4 mb-16 text-text-primary">Why Choose Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-border bg-background hover:shadow-lg transition-shadow text-left"
            >
              <div className="w-14 h-14 bg-landing-primary/10 rounded-full flex items-center justify-center text-landing-primary mb-6">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-text-primary">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
