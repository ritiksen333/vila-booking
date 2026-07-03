import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  X, 
  ChevronRight, 
  CalendarCheck, 
  Receipt,
  Phone,
  Mail,
  MapPin,
  Bed
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import { useHospitality } from "../../../context/HospitalityContext";

const Guests = () => {
  const { reservations, folios } = useHospitality();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');

  // Derive unique guests and their data
  const guestsList = useMemo(() => {
    const guestMap = new Map();

    // Process Reservations
    reservations.forEach(res => {
      if (!res.guestName) return;
      if (!guestMap.has(res.guestName)) {
        guestMap.set(res.guestName, {
          name: res.guestName,
          reservations: [],
          folios: [],
          totalSpent: 0
        });
      }
      guestMap.get(res.guestName).reservations.push(res);
    });

    // Process Folios
    folios.forEach(folio => {
      if (!folio.guestName) return;
      if (!guestMap.has(folio.guestName)) {
        guestMap.set(folio.guestName, {
          name: folio.guestName,
          reservations: [],
          folios: [],
          totalSpent: 0
        });
      }
      guestMap.get(folio.guestName).folios.push(folio);
      if (folio.status === 'Settled' || folio.status === 'Open') {
        guestMap.get(folio.guestName).totalSpent += folio.total || 0;
      }
    });

    return Array.from(guestMap.values()).filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reservations, folios, searchQuery]);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <Users className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-text-primary uppercase tracking-wider">Guest Directory</h2>
            <p className="text-text-secondary text-sm font-bold mt-1">Manage guest profiles, bookings, and billing</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search guest by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 bg-white border border-slate-100 rounded-2xl outline-none shadow-sm text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden lg:card bg-transparent lg:bg-white border-none lg:shadow-xl lg:shadow-slate-100/50 lg:rounded-[2.5rem]">
        <div className="h-full overflow-y-auto scrollbar-hide">
          {/* Desktop Table View */}
          <table className="w-full border-collapse hidden lg:table">
            <thead>
              <tr className="text-left bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Guest Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Bookings</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Spent</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {guestsList.map((guest, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedGuest(guest)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-black">
                        {guest.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-black text-text-primary uppercase tracking-tight">{guest.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-text-secondary">
                    {guest.reservations.length} Bookings
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-lg font-black text-primary tracking-tighter">₹{guest.totalSpent.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-primary hover:border-primary transition-all shadow-sm">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {guestsList.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-slate-400 font-bold">No guests found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4 pb-20">
            {guestsList.map((guest, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedGuest(guest)}
                className="card bg-white p-5 rounded-[2rem] shadow-lg shadow-slate-200/40 border-none space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-black text-lg">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-text-primary uppercase tracking-tight">{guest.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{guest.reservations.length} Bookings</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Total Spent: <span className="text-primary font-black text-sm">₹{guest.totalSpent.toLocaleString()}</span></span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div onClick={() => setSelectedGuest(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="p-6 lg:p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100/50 font-black text-2xl">
                  {selectedGuest.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-black text-text-primary uppercase tracking-tight">{selectedGuest.name}</h3>
                  <div className="flex gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest"><Mail className="w-3 h-3"/> Unknown Email</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest"><Phone className="w-3 h-3"/> Unknown Phone</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="p-2 lg:p-3 hover:bg-white rounded-2xl transition-all text-slate-400"><X className="w-6 h-6" /></button>
            </div>
            
            {/* Tabs */}
            <div className="flex px-6 lg:px-8 border-b border-slate-50 shrink-0 gap-6">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={cn("py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'bookings' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600")}
              >
                <span className="flex items-center gap-2"><CalendarCheck className="w-4 h-4"/> Bookings ({selectedGuest.reservations.length})</span>
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className={cn("py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'billing' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600")}
              >
                <span className="flex items-center gap-2"><Receipt className="w-4 h-4"/> Billing History</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 lg:p-8 flex-1 overflow-y-auto scrollbar-hide space-y-4 bg-slate-50/10">
              
              {activeTab === 'bookings' && (
                <>
                  {selectedGuest.reservations.length === 0 ? (
                    <p className="text-center text-slate-400 font-bold py-10">No bookings found for this guest.</p>
                  ) : (
                    selectedGuest.reservations.map(res => (
                      <div key={res.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center">
                            <Bed className="w-5 h-5"/>
                          </div>
                          <div>
                            <p className="text-sm font-black text-text-primary uppercase">{res.targetId}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Check-in: {res.date} • {res.guests} Guests</p>
                          </div>
                        </div>
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          res.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          res.status === 'Checked In' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          res.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        )}>
                          {res.status}
                        </span>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'billing' && (
                <>
                  {selectedGuest.folios.length === 0 ? (
                    <p className="text-center text-slate-400 font-bold py-10">No billing history found.</p>
                  ) : (
                    selectedGuest.folios.map(folio => (
                      <div key={folio.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                          <div>
                            <p className="text-xs font-black text-text-primary uppercase tracking-tight">Invoice #{folio.id}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Room {folio.roomName}</p>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                            folio.status === 'Open' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          )}>
                            {folio.status} Account
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{folio.items.length} Line Items</span>
                          <span className="text-sm font-black text-primary tracking-tighter">₹{folio.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests;
