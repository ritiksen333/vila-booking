import React from 'react';
import { motion } from 'framer-motion';

const Reservation = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="booking">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 border border-border bg-surface shadow-xl">
          
          <div className="lg:col-span-3 p-8 md:p-12">
            <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Reserve Your Stay</span>
            <h2 className="text-3xl md:text-4xl font-display mt-2 mb-8 text-text-primary">Booking Details</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">First Name</label>
                  <input type="text" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Last Name</label>
                  <input type="text" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Email Address</label>
                  <input type="email" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Phone Number</label>
                  <input type="tel" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Check-in Date</label>
                  <input type="date" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Check-out Date</label>
                  <input type="date" className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary block mb-2">Special Requests (Optional)</label>
                <textarea rows="3" className="w-full border border-border py-2 px-3 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium"></textarea>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-primary p-8 md:p-12 text-white flex flex-col">
            <h3 className="text-2xl font-display mb-8">Summary</h3>
            
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center pb-4 border-b border-white/20">
                <span className="text-sm font-medium opacity-80">Villa</span>
                <span className="text-sm font-semibold">The Signature Villa</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/20">
                <span className="text-sm font-medium opacity-80">Guests</span>
                <span className="text-sm font-semibold">2 Adults</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/20">
                <span className="text-sm font-medium opacity-80">Duration</span>
                <span className="text-sm font-semibold">3 Nights</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/20">
                <span className="text-sm font-medium opacity-80">Price per night</span>
                <span className="text-sm font-semibold">$450</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/40">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-display">Total Estimate</span>
                <span className="text-2xl font-display font-semibold text-landing-primary">$1,350</span>
              </div>
              <button type="button" className="w-full bg-landing-primary hover:bg-landing-secondary text-white py-4 uppercase tracking-[0.2em] font-bold text-sm transition-all duration-300">
                Confirm Booking
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Reservation;
