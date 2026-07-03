import React from 'react';

const EcosystemGrid = () => {
  return (
    <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-4" id="availability">
      <div className="bg-surface shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-sm">
        
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Check In</label>
          <input 
            type="date" 
            className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Check Out</label>
          <input 
            type="date" 
            className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Guests</label>
          <select className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium">
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4+ Guests</option>
          </select>
        </div>

        <div className="w-full md:w-1/4 mt-4 md:mt-0">
          <button className="w-full bg-primary hover:bg-primary-dark text-white py-4 uppercase tracking-[0.2em] font-semibold text-sm transition-all duration-300">
            Check Availability
          </button>
        </div>

      </div>
    </section>
  );
};

export default EcosystemGrid;
