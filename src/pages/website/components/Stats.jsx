import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Stats = () => {
  // Calendar mock UI
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <section className="py-24 bg-surface border-t border-border" id="calendar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Plan Your Stay</span>
          <h2 className="text-4xl md:text-5xl font-display mt-4 text-text-primary">Availability Calendar</h2>
        </div>

        <div className="border border-border p-6 md:p-10 bg-background">
          <div className="flex justify-between items-center mb-8">
            <button className="p-2 border border-border hover:bg-surface transition-colors">
              <ChevronLeft size={20} className="text-text-primary" />
            </button>
            <h3 className="text-xl font-display font-semibold text-text-primary uppercase tracking-widest">August 2026</h3>
            <button className="p-2 border border-border hover:bg-surface transition-colors">
              <ChevronRight size={20} className="text-text-primary" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {days.map(day => (
              <div key={day} className="text-center text-xs font-semibold uppercase tracking-widest text-text-secondary">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {/* Empty slots for starting day */}
            <div className="h-12 md:h-16"></div>
            <div className="h-12 md:h-16"></div>
            
            {dates.map(date => {
              // Mock logic for booked vs available
              const isBooked = date >= 12 && date <= 16;
              const isSelected = date === 20 || date === 21;

              return (
                <div 
                  key={date} 
                  className={`h-12 md:h-16 flex items-center justify-center border transition-all duration-300
                    ${isBooked ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed line-through' : 
                      isSelected ? 'bg-primary border-primary text-white cursor-pointer' : 
                      'border-border hover:border-landing-primary cursor-pointer text-text-primary bg-surface'}`}
                >
                  <span className="font-medium text-sm md:text-base">{date}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-8 mt-10 text-xs font-semibold uppercase tracking-widest text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-surface border border-border"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
