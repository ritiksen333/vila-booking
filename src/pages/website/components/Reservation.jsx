import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHospitality } from '../../../context/HospitalityContext';
import { CheckCircle2 } from 'lucide-react';

const Reservation = () => {
  const { rooms, addReservation } = useHospitality();
  
  // States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    specialRequests: ''
  });
  
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [nights, setNights] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Default room selection
  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms]);

  // Calculate nights
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (end <= start) {
        setNights(0);
      } else {
        setNights(diffDays);
      }
    } else {
      setNights(0);
    }
  }, [formData.checkIn, formData.checkOut]);

  const selectedRoom = rooms?.find(r => r.id === selectedRoomId) || rooms?.[0];
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) {
      setError('Please fill in all required fields.');
      return;
    }

    if (nights <= 0) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    if (formData.guests > selectedRoom.capacity) {
      setError(`The selected villa has a maximum capacity of ${selectedRoom.capacity} guests.`);
      return;
    }

    // Submit reservation
    const guestName = `${formData.firstName} ${formData.lastName}`;
    const reservation = {
      guestName,
      type: 'Room',
      targetId: selectedRoom.name,
      date: formData.checkIn,
      checkOut: formData.checkOut,
      time: '14:00', // standard check-in time
      guests: Number(formData.guests),
      status: 'Pending',
      notes: formData.specialRequests,
      email: formData.email,
      phone: formData.phone,
      totalEstimate: totalPrice
    };

    addReservation(reservation);
    setIsSuccess(true);
    
    // Reset form
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 2,
        specialRequests: ''
      });
      setNights(0);
    }, 4000);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="booking">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-border bg-surface shadow-2xl rounded-2xl overflow-hidden">
          
          <div className="lg:col-span-3 p-6 sm:p-8 md:p-12 relative">
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-surface/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8"
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-2xl font-display text-text-primary mb-2">Booking Confirmed!</h3>
                  <p className="text-text-secondary text-sm max-w-sm">Thank you, {formData.firstName}. Your reservation request has been submitted successfully. We will contact you shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="text-landing-primary font-semibold uppercase tracking-[0.2em] text-xs">Reserve Your Stay</span>
            <h2 className="text-3xl md:text-4xl font-display mt-2 mb-8 text-text-primary">Booking Details</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium rounded-lg">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Check-in Date *</label>
                  <input type="date" name="checkIn" value={formData.checkIn} onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium [&::-webkit-calendar-picker-indicator]:opacity-50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Check-out Date *</label>
                  <input type="date" name="checkOut" value={formData.checkOut} onChange={handleInputChange} required min={formData.checkIn || new Date().toISOString().split('T')[0]} className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium [&::-webkit-calendar-picker-indicator]:opacity-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Select Villa *</label>
                   <select 
                      value={selectedRoomId} 
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium appearance-none"
                   >
                     {rooms?.map(room => (
                        <option key={room.id} value={room.id} className="text-black">
                           {room.name} (Max {room.capacity})
                        </option>
                     ))}
                   </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Guests *</label>
                  <input type="number" name="guests" min="1" max={selectedRoom?.capacity || 10} value={formData.guests} onChange={handleInputChange} required className="w-full border-b border-border py-2 text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-2">Special Requests (Optional)</label>
                <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows="3" className="w-full border border-border py-2 px-3 rounded-lg text-text-primary focus:outline-none focus:border-landing-primary bg-transparent font-medium resize-none"></textarea>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#1e8a75] p-6 sm:p-8 md:p-12 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-display mb-8">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-[11px] uppercase tracking-widest font-bold opacity-80">Villa</span>
                  <span className="text-sm font-semibold">{selectedRoom?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-[11px] uppercase tracking-widest font-bold opacity-80">Guests</span>
                  <span className="text-sm font-semibold">{formData.guests} Guests</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-[11px] uppercase tracking-widest font-bold opacity-80">Dates</span>
                  <span className="text-sm font-semibold text-right max-w-[60%]">
                    {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'} 
                    {formData.checkIn && formData.checkOut ? ' to ' : ''} 
                    {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-[11px] uppercase tracking-widest font-bold opacity-80">Duration</span>
                  <span className="text-sm font-semibold">{nights} Nights</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-[11px] uppercase tracking-widest font-bold opacity-80">Price per night</span>
                  <span className="text-sm font-semibold">${selectedRoom?.price || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/40">
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-display">Total Estimate</span>
                <span className="text-3xl font-display font-black text-white">${totalPrice.toLocaleString()}</span>
              </div>
              <button 
                type="submit" 
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 uppercase tracking-[0.2em] font-black text-xs md:text-sm transition-all duration-300 rounded shadow-lg shadow-orange-500/30 active:scale-[0.98]"
              >
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
