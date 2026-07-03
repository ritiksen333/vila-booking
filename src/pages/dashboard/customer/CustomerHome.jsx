import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Bed, 
  Users, 
  Star, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CreditCard,
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import { useHospitality } from "../../../context/HospitalityContext";
import { useAuth } from "../../../context/AuthContext";

const CustomerHome = () => {
  const { rooms: villas, addReservation, reservations } = useHospitality();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVilla, setSelectedVilla] = useState(null);
  
  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showToast, setShowToast] = useState(null);

  // Calendar State for Availability
  const [currentDate, setCurrentDate] = useState(new Date());

  const displayToast = (msg, type = 'success') => {
    setShowToast({ msg, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const filteredVillas = villas.filter(villa => 
    villa.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    villa.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Default image since real images aren't stored
  const defaultImage = "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop";

  // --- Calendar Availability Logic ---
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const getBookedDates = (villaName) => {
    const booked = new Set();
    const villaReservations = reservations.filter(r => 
      r.targetId === villaName && 
      ['Pending', 'Confirmed', 'Checked In'].includes(r.status)
    );

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

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      displayToast('Please select check-in and check-out dates', 'error');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      displayToast('Check-out must be after Check-in', 'error');
      return;
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const total = (selectedVilla.price || 4500) * nights;

    addReservation({
      guestName: user?.name || 'Guest',
      targetId: selectedVilla.name,
      type: 'Room',
      date: checkIn,
      checkOut: checkOut,
      guests: parseInt(guests),
      status: 'Pending',
      total: total
    });

    displayToast('Booking request sent successfully!');
    setTimeout(() => {
      setSelectedVilla(null);
      navigate('/customer/reservations');
    }, 1500);
  };

  const renderCalendar = (villaName) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const bookedDates = getBookedDates(villaName);
    const today = new Date();
    today.setHours(0,0,0,0);

    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <button type="button" onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h4 className="font-black text-text-primary tracking-tight">{monthNames[month]} {year}</h4>
          <button type="button" onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map(d => <div key={d} className="text-center text-[10px] font-black uppercase text-slate-400">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysCount }).map((_, i) => {
            const cellDate = new Date(year, month, i + 1);
            const isBooked = bookedDates.has(cellDate.toDateString());
            const isPast = cellDate < today;
            return (
              <div 
                key={i} 
                className={cn(
                  "aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all",
                  isPast ? "text-slate-300 bg-slate-50 opacity-50" :
                  isBooked ? "bg-rose-50 text-rose-500 line-through" : 
                  "bg-white border border-slate-100 text-text-primary"
                )}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white border border-slate-200"></span> Available</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-200"></span> Booked</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-20 lg:pb-0 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={cn(
            "px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border",
            showToast.type === 'error' ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 text-emerald-600 border-emerald-100"
          )}>
            <Info className="w-5 h-5" />
            <span className="font-bold text-sm">{showToast.msg}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-text-primary tracking-tight leading-tight uppercase">
            Discover Your <br className="md:hidden" /><span className="text-primary">Perfect Escape</span>
          </h1>
          <p className="text-text-secondary mt-1 text-sm font-medium">Browse our exclusive collection of luxury villas.</p>
        </div>
        
        {/* Search */}
        <div className="relative group w-full md:w-96 shrink-0">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by villa name or type..." 
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-50 focus:border-primary rounded-2xl outline-none shadow-xl shadow-slate-100/50 text-sm font-bold transition-all"
          />
        </div>
      </div>

      {/* Villas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filteredVillas.map(villa => (
          <div key={villa.id} className="card bg-white border-none shadow-xl shadow-slate-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={defaultImage} 
                alt={villa.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-slate-800">4.9</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">{villa.type}</p>
                <h3 className="text-2xl font-black text-white tracking-tight">{villa.name}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg"><Users className="w-4 h-4" /> {villa.capacity} Max</span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg"><Bed className="w-4 h-4" /> {villa.type}</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between mt-6 pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price per night</p>
                  <p className="text-2xl font-black text-text-primary">₹{villa.price || 4500}</p>
                </div>
                <button 
                  onClick={() => setSelectedVilla(villa)}
                  className="btn-primary px-6 h-12 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Villa Details Modal */}
      {selectedVilla && createPortal(
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedVilla(null)} />
          <div className="relative w-full max-w-5xl h-[100dvh] md:h-[90vh] bg-white md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="h-16 md:h-20 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">{selectedVilla.name}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedVilla.type}</p>
              </div>
              <button onClick={() => setSelectedVilla(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col lg:flex-row bg-slate-50/50">
              
              {/* Left Column (Images & Calendar) */}
              <div className="flex-1 p-6 space-y-6">
                <div className="h-64 md:h-96 rounded-3xl overflow-hidden shadow-lg">
                  <img src={defaultImage} alt="Villa" className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Availability Calendar</h3>
                  {renderCalendar(selectedVilla.name)}
                </div>

                {selectedVilla.notes && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">About this Villa</h3>
                     <p className="text-sm font-medium text-slate-600">{selectedVilla.notes}</p>
                  </div>
                )}
              </div>

              {/* Right Column (Booking Form) */}
              <div className="w-full lg:w-[400px] bg-white border-l border-slate-100 p-6 md:p-8 shrink-0 flex flex-col">
                <h3 className="text-2xl font-black tracking-tight text-text-primary mb-2">₹{selectedVilla.price || 4500} <span className="text-sm text-slate-400 font-bold">/ night</span></h3>
                <p className="text-xs font-bold text-slate-500 mb-8 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Cancellation up to 48 hours</p>
                
                <form onSubmit={handleBookNow} className="flex-1 flex flex-col space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Check In</label>
                    <input 
                      type="date" 
                      required
                      value={checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Check Out</label>
                    <input 
                      type="date" 
                      required
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Guests</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold appearance-none cursor-pointer"
                    >
                      {Array.from({ length: selectedVilla.capacity }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-auto pt-8">
                    <button type="submit" className="w-full btn-primary h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                      Request Booking
                    </button>
                    <p className="text-center text-[10px] font-bold text-slate-400 mt-4">You won't be charged yet</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default CustomerHome;
