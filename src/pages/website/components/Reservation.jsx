import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useHospitality } from '../../../context/HospitalityContext';
import { CheckCircle2, Clock, XCircle, CreditCard, X, Calendar as CalendarIcon, ChevronRight, Lock, Search, Info } from 'lucide-react';
import { cn } from '../../../utils/cn';

const Reservation = () => {
  const { rooms, reservations, addReservation, updateReservation, cancelReservation } = useHospitality();
  
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'track'
  
  // Booking Form State
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
  const [error, setError] = useState('');

  // Tracking State
  const [trackEmail, setTrackEmail] = useState('');
  const [trackedBookings, setTrackedBookings] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Modal / Payment State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success'

  // Promo Codes State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: '...', percent: 10 }
  const [promoError, setPromoError] = useState('');

  const promoCodes = {
    'LUMIERE10': 10,
    'WELCOME20': 20,
    'BALILIFE': 15
  };

  const handleApplyPromo = (e) => {
    if (e) e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (promoCodes[code]) {
      setAppliedPromo({ code, percent: promoCodes[code] });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

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
  
  const discountAmount = appliedPromo ? Math.round((totalPrice * appliedPromo.percent) / 100) : 0;
  const finalPrice = totalPrice - discountAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = (e) => {
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

    const guestName = `${formData.firstName} ${formData.lastName}`;
    const reservation = {
      guestName,
      type: 'Room',
      targetId: selectedRoom.name,
      date: formData.checkIn,
      checkOut: formData.checkOut,
      time: '14:00',
      guests: Number(formData.guests),
      status: 'Pending',
      notes: formData.specialRequests,
      email: formData.email,
      phone: formData.phone,
      totalEstimate: finalPrice,
      total: finalPrice,
      promoApplied: appliedPromo ? appliedPromo.code : null,
      discountAmount: discountAmount
    };

    addReservation(reservation);
    
    // Reset form & promo
    setFormData({
      firstName: '', lastName: '', email: formData.email, phone: '',
      checkIn: '', checkOut: '', guests: 2, specialRequests: ''
    });
    setAppliedPromo(null);
    
    // Switch to track tab and show this booking
    setTrackEmail(formData.email);
    handleTrackBooking(null, formData.email);
    setActiveTab('track');
  };

  const handleTrackBooking = (e, emailToSearch) => {
    if (e) e.preventDefault();
    setTrackError('');
    const email = emailToSearch || trackEmail;
    
    if (!email.trim()) {
      setTrackError('Please enter your email address.');
      return;
    }

    const found = reservations.filter(r => r.email?.toLowerCase() === email.toLowerCase());
    
    if (found.length > 0) {
      setTrackedBookings(found.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setTrackError('No bookings found for this email address.');
      setTrackedBookings(null);
    }
  };

  // Re-fetch tracked bookings if reservations change (e.g., after payment or cancellation)
  useEffect(() => {
    if (trackedBookings && trackEmail) {
       const found = reservations.filter(r => r.email?.toLowerCase() === trackEmail.toLowerCase());
       setTrackedBookings(found.length > 0 ? found.sort((a, b) => new Date(b.date) - new Date(a.date)) : null);
       
       // Update selected booking if it's currently open
       if (selectedBooking) {
         const updated = found.find(r => r.id === selectedBooking.id);
         if (updated) setSelectedBooking(updated);
         else setSelectedBooking(null);
       }
    }
  }, [reservations]);


  const getStatusConfig = (status) => {
    switch(status) {
      case 'Confirmed': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 };
      case 'Pending': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
      case 'Cancelled': return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: XCircle };
      case 'Checked In': return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: CheckCircle2 };
      default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: Clock };
    }
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      cancelReservation(selectedBooking.id);
    }
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (selectedBooking) {
      setPaymentState('processing');
      // Simulate Payment Process Delay
      setTimeout(() => {
        setPaymentState('success');
        updateReservation(selectedBooking.id, { status: 'Confirmed', paymentStatus: 'Paid' });
        
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentState('idle');
        }, 1500);
      }, 2000);
    }
  };


  return (
    <section id="booking" className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black font-display tracking-tight text-text-primary uppercase mb-4"
          >
            Your <span className="text-primary">Stay</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto font-medium"
          >
            Book your dream villa or manage your existing reservations.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-2 w-full max-w-md shadow-inner">
              <button
                onClick={() => setActiveTab('book')}
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                  activeTab === 'book' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Book Villa
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                  activeTab === 'track' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                My Bookings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 border border-slate-100">
            
            {activeTab === 'book' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-8">Reservation Details</h3>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                      <Info className="w-5 h-5 text-rose-500 shrink-0" />
                      <p className="text-sm font-bold text-rose-600">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmitBooking} className="space-y-6">
                    {/* Form fields here (kept same structure) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" placeholder="Doe" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" placeholder="+1 234 567 8900" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Villa</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rooms?.map(room => (
                          <div 
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={cn(
                              "p-4 rounded-2xl border-2 cursor-pointer transition-all",
                              selectedRoomId === room.id 
                                ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                                : "border-slate-100 bg-white hover:border-slate-200"
                            )}
                          >
                            <h4 className="text-sm font-black text-text-primary uppercase tracking-tight">{room.name}</h4>
                            <div className="flex justify-between items-end mt-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Up to {room.capacity} Guests</span>
                              <span className="text-primary font-black">₹{room.price.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Check-in</label>
                        <input type="date" name="checkIn" value={formData.checkIn} onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Check-out</label>
                        <input type="date" name="checkOut" value={formData.checkOut} onChange={handleInputChange} required min={formData.checkIn || new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guests</label>
                        <input type="number" name="guests" value={formData.guests} onChange={handleInputChange} min="1" max="10" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" />
                      </div>
                    </div>

                    <button type="submit" className="w-full h-14 btn-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all">
                      Confirm Reservation
                    </button>
                  </form>
                </div>

                {/* Summary Sidebar */}
                <div className="bg-slate-50 rounded-3xl p-8 h-fit lg:sticky lg:top-24 border border-slate-100">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-6">Booking Summary</h3>
                  
                  {selectedRoom && (
                    <div className="space-y-6">
                      <div className="aspect-video rounded-2xl overflow-hidden shadow-md">
                        <img src="/luxury-villa-hero.png" alt="Villa" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-text-primary uppercase">{selectedRoom.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Luxury Accommodation</p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-200/60">
                        <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
                          <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                          <span>₹{(selectedRoom.price * nights).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
                          <span>Taxes & Fees</span>
                          <span>Included</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/60 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Estimate</span>
                        <span className="text-2xl font-black text-primary">₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'track' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[400px]">
                
                <div className="max-w-md mx-auto mb-10 text-center">
                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-4">Track Your Booking</h3>
                  <form onSubmit={(e) => handleTrackBooking(e, null)} className="relative">
                    <input 
                      type="email" 
                      value={trackEmail}
                      onChange={(e) => setTrackEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-6 pr-32 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary text-sm font-bold shadow-inner transition-all"
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-text-primary hover:bg-black text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                       <Search className="w-3 h-3"/> Find
                    </button>
                  </form>
                  {trackError && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-4">{trackError}</p>}
                </div>

                {trackedBookings && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {trackedBookings.map(booking => {
                      const config = getStatusConfig(booking.status);
                      const StatusIcon = config.icon;
                      
                      return (
                        <div 
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className="card bg-white border border-slate-100 shadow-xl shadow-slate-100/50 p-6 rounded-[2rem] hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">
                              <CalendarIcon className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5", config.bg, config.color, config.border)}>
                              <StatusIcon className="w-3 h-3" />
                              {booking.status}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-black text-text-primary tracking-tight uppercase">{booking.targetId}</h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Booking ID: {booking.id}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check-in</p>
                                <p className="text-xs font-bold text-slate-700">{booking.date}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check-out</p>
                                <p className="text-xs font-bold text-slate-700">{booking.checkOut || '-'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                              <p className="text-lg font-black text-primary">₹{(booking.total || booking.totalEstimate)?.toLocaleString() || 0}</p>
                            </div>
                            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && !showPaymentModal && createPortal(
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">{selectedBooking.targetId}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedBooking.id}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-white rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check In</p>
                  <p className="text-sm font-bold text-text-primary">{selectedBooking.date}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check Out</p>
                  <p className="text-sm font-bold text-text-primary">{selectedBooking.checkOut || '-'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Guests</p>
                  <p className="text-sm font-bold text-text-primary">{selectedBooking.guests} People</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={cn("text-sm font-bold", getStatusConfig(selectedBooking.status).color)}>{selectedBooking.status}</p>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-indigo-600">₹{(selectedBooking.total || selectedBooking.totalEstimate)?.toLocaleString() || 0}</p>
                </div>
                {selectedBooking.paymentStatus === 'Paid' && (
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Paid</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-slate-50 flex gap-4">
              {['Pending', 'Confirmed'].includes(selectedBooking.status) && (
                <button 
                  onClick={handleCancelBooking}
                  className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Cancel Booking
                </button>
              )}
              
              {selectedBooking.status === 'Pending' && selectedBooking.paymentStatus !== 'Paid' && (
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="flex-1 h-14 btn-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Pay Now
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Stripe-like Payment Modal */}
      {showPaymentModal && selectedBooking && createPortal(
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => paymentState === 'idle' && setShowPaymentModal(false)} />
          <div className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-1.5">
                   <img src="/villa-logo.png" alt="Logo" className="w-full h-full object-contain" />
                 </div>
                 <div>
                   <h3 className="text-sm font-black text-text-primary tracking-tight">LUMIÈRE VILLAS</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedBooking.targetId}</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Amount Due</p>
                  <p className="text-lg font-black text-text-primary">₹{(selectedBooking.total || selectedBooking.totalEstimate)?.toLocaleString()}</p>
               </div>
            </div>

            <div className="p-8">
              {paymentState === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">Payment Successful</h3>
                  <p className="text-sm font-bold text-slate-500 mt-2 text-center">Your booking is now fully confirmed.</p>
                </div>
              ) : (
                <form onSubmit={handleProcessPayment} className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-text-primary mb-4 flex items-center justify-between">
                      Pay with card
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-indigo-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                        <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[7px] text-white font-bold relative overflow-hidden">
                           <div className="absolute left-1 w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                           <div className="absolute right-1 w-3 h-3 bg-amber-500 rounded-full opacity-80"></div>
                        </div>
                      </div>
                    </h4>
                    
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                      <div className="border-b border-slate-200 px-4 py-3 relative">
                        <CreditCard className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          required 
                          type="text" 
                          placeholder="Card number" 
                          className="w-full pl-8 outline-none text-sm font-medium placeholder-slate-400"
                          maxLength="19"
                        />
                      </div>
                      <div className="flex">
                        <div className="flex-1 px-4 py-3 border-r border-slate-200 relative">
                           <input 
                            required 
                            type="text" 
                            placeholder="MM / YY" 
                            className="w-full outline-none text-sm font-medium placeholder-slate-400"
                            maxLength="5"
                          />
                        </div>
                        <div className="flex-1 px-4 py-3 relative">
                           <input 
                            required 
                            type="text" 
                            placeholder="CVC" 
                            className="w-full outline-none text-sm font-medium placeholder-slate-400"
                            maxLength="4"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-black text-text-primary mb-2 block">Name on card</label>
                    <input 
                      required 
                      type="text" 
                      defaultValue={selectedBooking.guestName || ''}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={paymentState === 'processing'}
                    className={cn(
                      "w-full h-14 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl flex items-center justify-center transition-all",
                      paymentState === 'processing' ? "bg-slate-100 text-slate-400 shadow-none" : "bg-[#635BFF] text-white shadow-[#635BFF]/30 hover:bg-[#5249ea] hover:-translate-y-0.5"
                    )}
                  >
                    {paymentState === 'processing' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay ₹${(selectedBooking.total || selectedBooking.totalEstimate)?.toLocaleString()}`
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 opacity-50">
                    <Lock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secured by MockStripe</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </section>
  );
};

export default Reservation;
