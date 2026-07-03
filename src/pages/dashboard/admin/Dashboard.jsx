import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  BedDouble,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import { useAuth, roles } from "../../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [revenueViewMode, setRevenueViewMode] = useState('Weekly');

  const weeklyData = [
    { label: 'Mon', value: 4500 },
    { label: 'Tue', value: 6500 },
    { label: 'Wed', value: 3500 },
    { label: 'Thu', value: 8500 },
    { label: 'Fri', value: 4500 },
    { label: 'Sat', value: 9500 },
    { label: 'Sun', value: 7500 },
  ];

  const monthlyData = [
    { label: 'Week 1', value: 32000 },
    { label: 'Week 2', value: 45000 },
    { label: 'Week 3', value: 28000 },
    { label: 'Week 4', value: 54000 },
  ];

  const currentRevenueData = revenueViewMode === 'Weekly' ? weeklyData : monthlyData;
  const maxRevenue = Math.max(...currentRevenueData.map(d => d.value), 1);

  const stats = [
    { id: 'revenue', name: 'Total Revenue', value: `$24,500`, icon: TrendingUp, change: '+12.5%', isUp: true, color: 'bg-indigo-50 text-primary' },
    { id: 'occupancy', name: 'Occupancy Rate', value: `85%`, icon: BedDouble, change: `8/10 Villas`, isUp: true, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'bookings', name: 'Total Bookings', value: '142', icon: Calendar, change: '+5 Today', isUp: true, color: 'bg-orange-50 text-orange-600' },
    { id: 'guests', name: 'Active Guests', value: '24', icon: Users, change: 'Stable', isUp: true, color: 'bg-blue-50 text-blue-600' },
  ];

  const recentBookings = [
    { id: 'BKG-1029', name: 'Eleanor Vance', villa: 'Signature Villa', dates: 'Aug 12 - Aug 15', amount: '$1,350', status: 'Confirmed' },
    { id: 'BKG-1030', name: 'James Harrison', villa: 'Oceanfront Estate', dates: 'Aug 14 - Aug 20', amount: '$4,200', status: 'Pending' },
    { id: 'BKG-1031', name: 'Sophia Martinez', villa: 'Garden Retreat', dates: 'Aug 15 - Aug 18', amount: '$950', status: 'Confirmed' },
    { id: 'BKG-1032', name: 'William Chen', villa: 'Signature Villa', dates: 'Aug 20 - Aug 25', amount: '$2,250', status: 'Confirmed' },
    { id: 'BKG-1033', name: 'Olivia Rossi', villa: 'Hilltop Mansion', dates: 'Aug 22 - Aug 29', amount: '$6,500', status: 'Pending' },
  ];

  const villasStatus = [
    { name: 'V-01', status: 'Occupied' },
    { name: 'V-02', status: 'Available' },
    { name: 'V-03', status: 'Occupied' },
    { name: 'V-04', status: 'Maintenance' },
    { name: 'V-05', status: 'Available' },
    { name: 'V-06', status: 'Occupied' },
    { name: 'V-07', status: 'Occupied' },
    { name: 'V-08', status: 'Available' },
    { name: 'V-09', status: 'Occupied' },
    { name: 'V-10', status: 'Occupied' },
  ];

  return (
    <div className="space-y-6 relative pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Live • Admin Portal</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-text-primary tracking-tight uppercase">
            Lumière <span className="text-primary">Admin</span>
          </h1>
          <p className="text-text-secondary text-xs lg:text-sm font-medium mt-1">
            Executive overview of villa operations and revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-3 bg-white rounded-xl border border-border text-text-secondary hover:text-primary transition-all shadow-sm"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="card p-5 bg-surface border border-border shadow-sm group hover:shadow-md transition-all cursor-pointer overflow-hidden relative">
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-all duration-700" />
             <div className="flex justify-between items-start mb-6">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", stat.color)}>
                   <stat.icon className={cn("w-6 h-6 stroke-[2]")} />
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                  stat.isUp ? "text-emerald-500 bg-emerald-50" : "text-rose-500 bg-rose-50"
                )}>
                   {stat.change}
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-2xl font-black text-text-primary tracking-tighter mt-1">{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Live Status Section */}
        <div className="xl:col-span-2 space-y-6">
           <div className="card p-6 bg-surface border border-border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-text-primary">
                    <BedDouble className="w-4 h-4 text-primary" /> Villa Status
                 </h3>
                 <button className="text-[10px] font-black text-primary uppercase tracking-widest">Manage Villas</button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 lg:gap-4">
                 {villasStatus.map(villa => (
                   <div 
                     key={villa.name}
                     title={`${villa.name}: ${villa.status}`}
                     className={cn(
                       "aspect-square rounded-xl flex items-center justify-center text-[11px] font-bold transition-all border",
                       villa.status === 'Available' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                       villa.status === 'Occupied' ? "bg-primary text-white border-primary shadow-md shadow-primary/20" :
                       "bg-amber-50 text-amber-700 border-amber-200"
                     )}
                   >
                      {villa.name}
                   </div>
                 ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-border">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300" />
                    <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Available</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Occupied</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
                    <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Maintenance</span>
                 </div>
              </div>
           </div>

           {/* Live Revenue Chart */}
           <div className="card p-6 lg:p-8 bg-surface border border-border shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-text-primary">Revenue Trends</h3>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1">Booking Income Breakdown</p>
                 </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setRevenueViewMode('Weekly')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        revenueViewMode === 'Weekly' ? "bg-primary text-white shadow-md" : "bg-background text-text-secondary border border-border"
                      )}
                    >
                      Weekly
                    </button>
                    <button 
                      onClick={() => setRevenueViewMode('Monthly')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        revenueViewMode === 'Monthly' ? "bg-primary text-white shadow-md" : "bg-background text-text-secondary border border-border"
                      )}
                    >
                      Monthly
                    </button>
                  </div>
              </div>
              <div className="h-48 flex items-end gap-3 lg:gap-6 px-2 lg:px-4 overflow-x-auto scrollbar-hide">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={revenueViewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-end gap-3 lg:gap-6 h-full"
                  >
                    {currentRevenueData.map((data, i) => (
                      <div key={i} className="min-w-[32px] flex-1 flex flex-col items-center gap-3 group h-full">
                          <div className="w-full relative h-full flex items-end">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${(data.value / maxRevenue) * 100}%` }}
                              className="w-full bg-primary rounded-xl relative min-h-[4px]"
                            >
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-primary text-[8px] font-black whitespace-nowrap">
                                  ${data.value.toLocaleString()}
                                </div>
                            </motion.div>
                          </div>
                          <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.05) }}
                            className="text-[9px] font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap"
                          >
                            {data.label}
                          </motion.span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Right Column: Operational Stats & Alerts */}
        <div className="space-y-6">
           {/* Recent Bookings List */}
           <div className="card p-6 bg-surface border border-border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Recent Bookings</h3>
                 <button className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                    View All <ArrowRight size={12} />
                 </button>
              </div>
              <div className="space-y-4">
                 {recentBookings.map(booking => (
                   <div key={booking.id} className="p-4 bg-background border border-border rounded-2xl hover:border-primary/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            <p className="text-xs font-bold text-text-primary">{booking.name}</p>
                            <p className="text-[10px] text-text-secondary mt-0.5 font-medium">{booking.villa}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[11px] font-bold text-primary">{booking.amount}</p>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full mt-1 inline-block",
                              booking.status === 'Confirmed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            )}>
                               {booking.status}
                            </span>
                         </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-text-secondary font-medium bg-surface py-1.5 px-2 rounded-lg border border-border inline-flex">
                         <Calendar size={12} className="text-primary" />
                         {booking.dates}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
