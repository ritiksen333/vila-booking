import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

// Simple WhatsApp SVG icon
const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.858.002-2.637-1.023-5.116-2.885-6.98C16.579 1.83 14.1 1.814 12.01 1.814c-5.437 0-9.863 4.42-9.866 9.863-.001 1.765.463 3.49 1.344 5.011l-.986 3.605 3.693-.969zm11.378-5.421c-.302-.15-1.787-.882-2.062-.983-.275-.099-.475-.15-.675.15-.199.299-.775.98-.95 1.18-.175.199-.349.224-.651.075-.302-.15-1.276-.47-2.43-1.499-.898-.8-1.504-1.79-1.68-2.09-.175-.302-.019-.465.131-.614.136-.134.302-.349.453-.524.15-.175.2-.299.3-.499.099-.2.05-.375-.025-.524-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.519-.175-.009-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-.1.9-.1 2.2 0 1.3.95 2.55 1.075 2.725.125.175 1.86 2.84 4.505 3.986.63.272 1.12.435 1.503.556.633.201 1.21.173 1.666.105.508-.076 1.787-.73 2.037-1.436.25-.706.25-1.31.175-1.436-.075-.125-.275-.2-.575-.35z"/>
  </svg>
);

const Contact = () => {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in the required fields.", "error");
      return;
    }
    showToast("Message Sent! Our concierge team will reach out soon.", "success");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleWhatsAppSend = () => {
    if (!formData.name || !formData.message) {
      showToast("Please enter your name and message to chat.", "error");
      return;
    }
    
    const phoneNumber = "623611234567"; // Concierge phone number
    const text = `Hi Lumière Villas, my name is ${formData.name}.${formData.email ? ` (Email: ${formData.email})` : ''}

Subject: ${formData.subject || 'Inquiry'}
Message: ${formData.message}`;
    
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

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
                loading="lazy"
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
            <form onSubmit={handleSendEmail} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-border p-3 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium mt-2"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 uppercase tracking-[0.2em] font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Email
                </button>
                
                <button 
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 uppercase tracking-[0.2em] font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" /> WhatsApp Us
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
