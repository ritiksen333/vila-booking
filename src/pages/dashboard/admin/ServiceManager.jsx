import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  MoreVertical,
  Calendar,
  Users,
  MapPin,
  Car,
  Download,
  Plus,
  RefreshCw,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import { useHospitality } from "../../../context/HospitalityContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const ServiceManager = () => {
  const { services, serviceBookings, updateServiceBookingStatus } = useHospitality();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    const rolePrefix = user?.role?.toLowerCase() || 'admin';
    navigate(`/${rolePrefix}/dashboard`);
  };

  const handleOpenSidebar = () => {
    window.dispatchEvent(new CustomEvent('open-sidebar'));
  };

  const filteredBookings = serviceBookings.filter(b => {
    const matchesTab = b.status === activeTab;
    const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleExportToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysBookings = serviceBookings.filter(b => b.date === today);

    if (todaysBookings.length === 0) {
      alert('No bookings found for today to export.');
      return;
    }

    const headers = ['Booking ID', 'Guest Name', 'Service', 'Category', 'Time', 'Guests', 'Total', 'Status'];
    const csvContent = [
      headers.join(','),
      ...todaysBookings.map(b => [
        b.id,
        `"${b.guestName}"`,
        `"${b.serviceName}"`,
        b.category,
        b.time,
        b.guests,
        b.total,
        b.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `service_bookings_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col gap-4 lg:gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-primary transition-all mr-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Compass className="w-5 h-5 lg:w-6 lg:h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-black tracking-tight text-text-primary uppercase tracking-wider leading-none">Service <span className="text-primary">Manager</span></h2>
              <p className="text-text-secondary text-[10px] lg:text-sm font-bold mt-1">Coordinate transport and guest excursions</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 lg:min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-2.5 lg:py-3 bg-white border border-slate-100 rounded-xl lg:rounded-2xl outline-none shadow-sm text-xs font-bold focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
          <button 
            onClick={handleExportToday}
            className="btn-primary h-[42px] lg:h-[48px] px-4 lg:px-6 rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-3 font-black uppercase text-[9px] lg:text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all shrink-0"
          >
             <Download className="w-4 h-4" /> <span className="hidden xs:inline">Export Today</span><span className="xs:hidden">Export</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 shrink-0">
          {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 lg:px-8 py-2.5 lg:py-3 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap transition-all",
                activeTab === tab 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" 
                : "bg-white text-text-secondary border-transparent hover:bg-slate-50 shadow-sm"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide space-y-4">
           {filteredBookings.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4">
                   <Compass className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest">No bookings found in this category</p>
             </div>
           ) : (
             filteredBookings.map((booking) => (
               <div key={booking.id} className="card p-6 bg-white border-none shadow-xl shadow-slate-100/50 flex flex-col lg:flex-row lg:items-center gap-6 group hover:shadow-2xl hover:shadow-slate-200 transition-all">
                  <div className="flex items-center gap-4 shrink-0">
                     <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-primary/10 transition-all">
                        {services.find(s => s.id === booking.serviceId)?.icon || '📅'}
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-text-primary uppercase tracking-tight leading-none mb-1.5">{booking.serviceName}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.category} • Booking ID: {booking.id}</p>
                     </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-0 lg:px-6 py-4 lg:py-0 border-y lg:border-y-0 lg:border-x border-slate-50">
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Guest</p>
                        <p className="text-sm font-black text-text-primary uppercase">{booking.guestName}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Schedule</p>
                        <p className="text-sm font-bold text-text-primary">{booking.date} • {booking.time}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Guests</p>
                        <p className="text-sm font-bold text-text-primary">{booking.guests} Person(s)</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Charge</p>
                        <p className="text-sm font-black text-primary">₹{booking.total}</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-3 shrink-0">
                     {booking.status === 'Pending' ? (
                       <>
                         <button 
                           onClick={() => updateServiceBookingStatus(booking.id, 'Confirmed')}
                           className="flex-1 lg:flex-none h-11 px-6 bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                         >
                            <CheckCircle2 className="w-4 h-4" /> Approve
                         </button>
                         <button 
                           onClick={() => updateServiceBookingStatus(booking.id, 'Cancelled')}
                           className="flex-1 lg:flex-none h-11 px-6 bg-white border border-slate-100 text-rose-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                         >
                            <XCircle className="w-4 h-4" /> Reject
                         </button>
                       </>
                     ) : booking.status === 'Confirmed' ? (
                        <button 
                          onClick={() => updateServiceBookingStatus(booking.id, 'Completed')}
                          className="w-full lg:w-auto h-11 px-8 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                        >
                           Mark Completed
                        </button>
                     ) : (
                        <div className="w-full lg:w-auto px-8 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                           {booking.status}
                        </div>
                     )}
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;
