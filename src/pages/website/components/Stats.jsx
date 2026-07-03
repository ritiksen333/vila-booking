import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useHospitality } from '../../../context/HospitalityContext';

const Stats = () => {
  const { rooms, reservations } = useHospitality();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoomId, setSelectedRoomId] = useState('');

  // Default room selection
  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysCount = daysInMonth(year, month);
  const startDay = startDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Identify booked dates for the selected room
  const getBookedDates = () => {
    const booked = new Set();
    const selectedRoom = rooms?.find(r => r.id === selectedRoomId);
    if (!selectedRoom) return booked;

    const roomReservations = reservations?.filter(r => 
      r.targetId === selectedRoom.name && 
      ['Pending', 'Confirmed', 'Checked In'].includes(r.status)
    ) || [];

    roomReservations.forEach(res => {
      if (res.date) {
        const start = new Date(res.date);
        // If checkOut exists, use it, otherwise assume 1 night stay
        const end = res.checkOut ? new Date(res.checkOut) : new Date(start.getTime() + 24*60*60*1000);
        
        // Populate all dates from start to end (excluding end date, as checkout day is usually available for check-in)
        let current = new Date(start);
        while (current < end) {
          booked.add(current.toDateString());
          current.setDate(current.getDate() + 1);
        }
      }
    });

    return booked;
  };

  const bookedDates = getBookedDates();

  const handleDateClick = (dateNum, isBooked, isPast) => {
    if (isBooked || isPast) return;
    
    // Scroll to booking section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      // Optionally we could prefill the form date here via a global state/event 
    }
  };

  const today = new Date();
  today.setHours(0,0,0,0);

  return (
    <section className="py-24 bg-surface border-t border-border" id="calendar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Plan Your Stay</span>
          <h2 className="text-4xl md:text-5xl font-display mt-4 text-text-primary">Availability Calendar</h2>
        </div>

        <div className="border border-border p-6 md:p-10 bg-background shadow-xl rounded-2xl">
          
          {/* Villa Selector */}
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <CalendarIcon className="text-landing-primary" size={24} />
                <span className="font-semibold text-text-primary">Check Availability For:</span>
             </div>
             <select 
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full md:w-auto border border-border py-2 px-4 rounded-lg bg-surface text-text-primary focus:outline-none focus:border-landing-primary shadow-sm"
             >
                {rooms?.map(room => (
                   <option key={room.id} value={room.id}>{room.name} (Max {room.capacity})</option>
                ))}
             </select>
          </div>

          <div className="flex justify-between items-center mb-8 border-t border-border pt-8">
            <button onClick={handlePrevMonth} className="p-2 border border-border rounded hover:bg-surface transition-colors">
              <ChevronLeft size={20} className="text-text-primary" />
            </button>
            <h3 className="text-xl md:text-2xl font-display font-semibold text-text-primary uppercase tracking-widest">
              {monthNames[month]} {year}
            </h3>
            <button onClick={handleNextMonth} className="p-2 border border-border rounded hover:bg-surface transition-colors">
              <ChevronRight size={20} className="text-text-primary" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 lg:gap-4 mb-4">
            {days.map(day => (
              <div key={day} className="text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-secondary">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 lg:gap-4">
            {/* Empty slots for starting day */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 md:h-16 lg:h-20"></div>
            ))}
            
            {Array.from({ length: daysCount }).map((_, i) => {
              const dateNum = i + 1;
              const cellDate = new Date(year, month, dateNum);
              const dateString = cellDate.toDateString();
              const isBooked = bookedDates.has(dateString);
              const isPast = cellDate < today;

              return (
                <div 
                  key={dateNum} 
                  onClick={() => handleDateClick(dateNum, isBooked, isPast)}
                  className={`h-12 md:h-16 lg:h-20 flex flex-col items-center justify-center border rounded-lg transition-all duration-300
                    ${isPast ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50' :
                      isBooked ? 'bg-red-50 border-red-100 text-red-400 cursor-not-allowed relative overflow-hidden' : 
                      'border-border hover:border-landing-primary cursor-pointer text-text-primary bg-surface hover:shadow-md'}`}
                >
                  <span className="font-semibold text-sm md:text-lg z-10">{dateNum}</span>
                  {isBooked && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-full border-t-2 border-red-500 -rotate-45 transform scale-150"></div>
                     </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-10 text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-surface border border-border rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-100 rounded relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-full border-t border-red-500 -rotate-45 transform scale-150"></div>
                 </div>
              </div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-4 h-4 bg-gray-50 border border-gray-100 rounded"></div>
              <span>Past</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
