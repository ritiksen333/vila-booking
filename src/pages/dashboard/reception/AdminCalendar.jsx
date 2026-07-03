import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bed } from 'lucide-react';
import { useHospitality } from '../../../context/HospitalityContext';
import { cn } from '../../../utils/cn';

const AdminCalendar = () => {
  const { rooms: villas, reservations } = useHospitality();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedVillaId, setSelectedVillaId] = useState('');

  // Default villa selection
  useEffect(() => {
    if (villas && villas.length > 0 && !selectedVillaId) {
      setSelectedVillaId(villas[0].id);
    }
  }, [villas]);

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

  // Identify booked dates for the selected villa
  const getBookedDates = () => {
    const booked = new Set();
    const selectedVilla = villas?.find(v => v.id === selectedVillaId);
    if (!selectedVilla) return booked;

    const villaReservations = reservations?.filter(r => 
      r.targetId === selectedVilla.name && 
      ['Pending', 'Confirmed', 'Checked In'].includes(r.status)
    ) || [];

    villaReservations.forEach(res => {
      if (res.date) {
        const start = new Date(res.date);
        const end = res.checkOut ? new Date(res.checkOut) : new Date(start.getTime() + 24*60*60*1000);
        
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
  const today = new Date();
  today.setHours(0,0,0,0);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <CalendarIcon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-text-primary uppercase tracking-wider">Availability Calendar</h2>
            <p className="text-text-secondary text-sm font-bold mt-1">Manage dates and check availability</p>
          </div>
        </div>
        
        {/* Villa Selector */}
        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
            <Bed className="w-5 h-5" />
          </div>
          <select 
            value={selectedVillaId}
            onChange={(e) => setSelectedVillaId(e.target.value)}
            className="w-full min-w-[200px] bg-transparent outline-none font-bold text-sm text-text-primary appearance-none cursor-pointer pr-4"
          >
            {villas?.map(villa => (
               <option key={villa.id} value={villa.id}>{villa.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="flex-1 overflow-hidden lg:card bg-transparent lg:bg-white border-none lg:shadow-xl lg:shadow-slate-100/50 lg:rounded-[2.5rem] flex flex-col">
        <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 shrink-0">
          <button onClick={handlePrevMonth} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">
            {monthNames[month]} {year}
          </h3>
          <button onClick={handleNextMonth} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {days.map(day => (
              <div key={day} className="text-center text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {/* Empty slots for starting day */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 md:h-24 lg:h-32"></div>
            ))}
            
            {/* Days */}
            {Array.from({ length: daysCount }).map((_, i) => {
              const dateNum = i + 1;
              const cellDate = new Date(year, month, dateNum);
              const dateString = cellDate.toDateString();
              const isBooked = bookedDates.has(dateString);
              const isPast = cellDate < today;

              return (
                <div 
                  key={dateNum} 
                  className={cn(
                    "h-16 md:h-24 lg:h-32 flex flex-col items-center justify-center border-2 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 relative overflow-hidden",
                    isPast 
                      ? "bg-slate-50 border-slate-100 text-slate-300 opacity-50" 
                      : isBooked 
                        ? "bg-rose-50 border-rose-100 text-rose-500 shadow-sm" 
                        : "border-slate-100 text-text-primary bg-white shadow-sm hover:border-primary hover:shadow-md"
                  )}
                >
                  <span className="font-black text-lg md:text-2xl z-10">{dateNum}</span>
                  {isBooked && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <div className="w-full border-t-4 border-rose-500 -rotate-45 transform scale-150"></div>
                     </div>
                  )}
                  {isBooked && !isPast && (
                    <span className="absolute bottom-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-rose-500 text-white px-2 py-0.5 rounded-md">Booked</span>
                  )}
                  {!isBooked && !isPast && (
                    <span className="absolute bottom-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-500">Available</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-6 md:p-8 bg-slate-50 shrink-0 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-white border-2 border-slate-200 rounded-md"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-rose-50 border-2 border-rose-200 rounded-md relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-full border-t-[3px] border-rose-500 -rotate-45 transform scale-150"></div>
               </div>
            </div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-5 h-5 bg-slate-100 border-2 border-slate-200 rounded-md"></div>
            <span>Past</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
