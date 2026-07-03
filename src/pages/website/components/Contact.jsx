import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-24 bg-surface" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Reach Out</span>
            <h2 className="text-4xl md:text-5xl font-display mt-4 mb-8 text-text-primary">Contact Us</h2>
            <p className="text-text-secondary mb-12 text-lg">
              Have inquiries about availability, special events, or bespoke requests? Our concierge team is at your disposal.
            </p>

            <div className="space-y-8">
              {[
                { icon: MapPin, title: 'Our Location', text: 'Jalan Raya Seminyak No. 14, Bali, Indonesia' },
                { icon: Phone, title: 'Call Us', text: '+62 361 1234 567' },
                { icon: Mail, title: 'Email Us', text: 'concierge@lumierevillas.com' }
              ].map((item) => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div className="w-12 h-12 border border-border flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-landing-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-text-primary">{item.title}</h4>
                    <p className="text-text-secondary text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Map placeholder" 
                className="w-full h-48 object-cover grayscale opacity-80"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 border border-border bg-background"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Full Name</label>
                  <input type="text" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Email Address</label>
                  <input type="email" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Subject</label>
                <input type="text" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Message</label>
                <textarea rows="4" className="w-full border border-border p-3 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium mt-2"></textarea>
              </div>
              <button className="w-full bg-primary hover:bg-primary-dark text-white py-4 uppercase tracking-[0.2em] font-semibold text-sm transition-all duration-300">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
