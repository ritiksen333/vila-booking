import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle,
  CreditCard,
  X,
  MapPin,
  ChevronRight,
  Info,
  Lock
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import { useHospitality } from "../../../context/HospitalityContext";
import { useAuth } from "../../../context/AuthContext";
import { useCommunication } from "../../../context/CommunicationContext";

const CustomerReservations = () => {
  const { reservations, cancelReservation, updateReservation } = useHospitality();
  const { user } = useAuth();
  const { sendMessage } = useCommunication();
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success'

  const displayToast = (msg, type = 'success') => {
    setShowToast({ msg, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  // Only show bookings for this specific logged-in user
  const myBookings = reservations.filter(r => r.guestName === user?.name).sort((a, b) => new Date(b.date) - new Date(a.date));

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
      displayToast('Booking cancelled successfully');
      setSelectedBooking(null);
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
        
        // Simulate automated email via Inbox
        const emailContent = `Booking Confirmed! ✅\n\nHi ${user?.name.split(' ')[0]},\nWe have successfully received your payment of ₹${selectedBooking.total?.toLocaleString()}.\n\nBooking Details:\n- Villa: ${selectedBooking.targetId}\n- Check-in: ${selectedBooking.date}\n- Check-out: ${selectedBooking.checkOut || '-'}\n- Guests: ${selectedBooking.guests}\n\nWe look forward to hosting you at LUMIÈRE VILLAS!`;
        sendMessage('CUST-TEMP', user?.name, emailContent, 'System');

        displayToast('Payment processed successfully. Confirmation email sent!');
        
        setTimeout(() => {
          setShowPaymentModal(false);
          setSelectedBooking(null);
          setPaymentState('idle');
        }, 1500);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-20 lg:pb-0 h-full flex flex-col">
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

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-4xl font-black text-text-primary tracking-tight leading-tight uppercase">
          My <span className="text-primary">Bookings</span>
        </h1>
        <p className="text-text-secondary mt-1 text-sm font-medium">Manage your villa reservations and payments.</p>
      </div>

      {myBookings.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2rem] p-10 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-2">No Bookings Yet</h3>
          <p className="text-sm font-bold text-slate-400">You haven't made any villa reservations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myBookings.map(booking => {
            const config = getStatusConfig(booking.status);
            const StatusIcon = config.icon;
            const isPending = booking.status === 'Pending';
            
            return (
              <div 
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="card bg-white border-none shadow-xl shadow-slate-100/50 p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer group"
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
                    <p className="text-lg font-black text-primary">₹{booking.total?.toLocaleString() || 0}</p>
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
                  <p className="text-2xl font-black text-indigo-600">₹{selectedBooking.total?.toLocaleString() || 0}</p>
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
            
            {/* Header / Brand */}
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
                  <p className="text-lg font-black text-text-primary">₹{selectedBooking.total?.toLocaleString()}</p>
               </div>
            </div>

            {/* Payment Content */}
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
                        {/* Visa/Mastercard Mock Icons */}
                        <div className="w-8 h-5 bg-indigo-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                        <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[7px] text-white font-bold relative overflow-hidden">
                           <div className="absolute left-1 w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                           <div className="absolute right-1 w-3 h-3 bg-amber-500 rounded-full opacity-80"></div>
                        </div>
                      </div>
                    </h4>
                    
                    {/* Stripe-like Input Group */}
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
                      defaultValue={user?.name || ''}
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
                      `Pay ₹${selectedBooking.total?.toLocaleString()}`
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
    </div>
  );
};

export default CustomerReservations;
