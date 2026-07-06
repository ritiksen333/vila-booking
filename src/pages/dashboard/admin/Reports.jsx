import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  PieChart, 
  ArrowRight, 
  DollarSign, 
  Users, 
  Home, 
  Target, 
  ChevronRight,
  RefreshCw,
  Printer,
  X,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import printContent from "../../../utils/printUtil";
import { useHospitality } from "../../../context/HospitalityContext";

const Reports = () => {
  const [timeRange, setTimeRange] = useState('This Month');
  const [activeChartTab, setActiveChartTab] = useState('Revenue');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [showDateModal, setShowDateModal] = useState(false);

  const [toast, setToast] = useState(null);

  const { rooms: villas, reservations, folios } = useHospitality();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      showToast('Report data refreshed');
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Date,Revenue,Bookings,Guests\n2024-05-01,45000,12,34\n2024-05-02,52000,14,41";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `villa-report-${timeRange.toLowerCase().replace(' ', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    showToast('CSV Report Downloaded');
  };

  const handlePrint = () => {
    printContent('printable-area');
    showToast('Print command sent');
  };

  // Real-time calculations with Time Range filtering
  const isDateInRange = (dateString) => {
    if (!dateString) return true;
    const itemDate = new Date(dateString);
    const now = new Date();
    
    // Normalize time to compare just dates
    itemDate.setHours(0,0,0,0);
    const today = new Date(now);
    today.setHours(0,0,0,0);
    
    if (timeRange === 'Today') {
      return itemDate.getTime() === today.getTime();
    }
    if (timeRange === 'This Week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start
      return itemDate >= startOfWeek && itemDate <= today;
    }
    if (timeRange === 'This Month') {
      return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
    }
    return true; // For 'Custom' show all for now
  };

  // Calculate filtered revenue by checking each item's date inside folios
  const filteredRevenue = folios.reduce((total, folio) => {
    const folioRangeTotal = folio.items?.reduce((sum, item) => {
      return isDateInRange(item.date) ? sum + (item.amount || 0) : sum;
    }, 0) || 0;
    return total + folioRangeTotal;
  }, 0);

  // Filter reservations based on their date
  const filteredReservations = reservations.filter(r => isDateInRange(r.date));
  const filteredGuests = filteredReservations.reduce((acc, r) => acc + (parseInt(r.guests) || 0), 0);
  
  // Current Occupancy doesn't depend on time range, it's live status. But we can show it as is.
  const occupiedVillas = villas.filter(v => v.status === 'Occupied' || v.status === 'Checked In').length;
  const occupancyRate = villas.length > 0 ? Math.round((occupiedVillas / villas.length) * 100) : 0;
  const netProfit = filteredRevenue * 0.75; // Mock profit margin of 75%

  const stats = [
    { id: 'revenue', label: 'Total Revenue', value: `₹${filteredRevenue.toLocaleString()}`, trend: '+14.2%', up: true, icon: DollarSign, color: 'primary', description: 'Total gross income from bookings.' },
    { id: 'occupancy', label: 'Occupancy Rate', value: `${occupancyRate}%`, trend: '+5.5%', up: true, icon: Home, color: 'orange', description: 'Current percentage of villas booked.' },
    { id: 'guests', label: 'Total Guests', value: filteredGuests.toLocaleString(), trend: '+2.4%', up: true, icon: Users, color: 'purple', description: 'Total number of guests hosted.' },
    { id: 'profit', label: 'Net Profit', value: `₹${netProfit.toLocaleString()}`, trend: '+12.1%', up: true, icon: Target, color: 'success', description: 'Earnings after operating costs.' },
  ];

  const performanceData = villas.map(villa => {
    const villaReservations = filteredReservations.filter(r => r.targetId === villa.name);
    
    const villaFolios = folios.filter(f => f.roomName === villa.name);
    const villaRevenue = villaFolios.reduce((total, folio) => {
      const folioRangeTotal = folio.items?.reduce((sum, item) => {
        return isDateInRange(item.date) ? sum + (item.amount || 0) : sum;
      }, 0) || 0;
      return total + folioRangeTotal;
    }, 0);
    
    return {
      name: villa.name,
      type: villa.type,
      bookings: villaReservations.length,
      revenueValue: villaRevenue,
      revenue: `₹${villaRevenue.toLocaleString()}`
    };
  }).sort((a, b) => b.revenueValue - a.revenueValue);

  const filteredPerformance = performanceData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden relative">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-4 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={cn(
            "px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border",
            toast.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-800 text-white border-slate-700"
          )}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 px-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <BarChart3 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-text-primary uppercase tracking-wider">Business Analytics</h2>
            <p className="text-text-secondary text-sm font-bold mt-1 flex items-center gap-2">
              Updated: {lastUpdated} 
              <button onClick={handleRefresh} className={cn("text-primary hover:text-primary-dark transition-all", isRefreshing && "animate-spin")}><RefreshCw className="w-3.5 h-3.5" /></button>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-100 rounded-2xl p-1 flex items-center shadow-sm">
            {['Today', 'This Week', 'This Month', 'Custom'].map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  if (range === 'Custom') setShowDateModal(true);
                }}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  timeRange === range ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:text-primary hover:bg-slate-50"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={handleExport} className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div id="printable-area" className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-10 space-y-6">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div key={stat.id} className="card bg-white border-none shadow-xl shadow-slate-100/50 p-6 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                  stat.color === 'primary' ? 'bg-indigo-50 text-indigo-600' :
                  stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                  stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  'bg-emerald-50 text-emerald-600'
                )}>
                  <stat.icon className="w-7 h-7 stroke-[2.5]" />
                </div>
                <span className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                  stat.up ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>

              <div className="mt-8 relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-text-primary tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <div className="xl:col-span-2 card bg-white border-none shadow-xl shadow-slate-100/50 p-6 rounded-[2.5rem] flex flex-col h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Analytics Overview</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Revenue vs Occupancy</p>
              </div>
              
              <div className="flex gap-2">
                {['Revenue', 'Occupancy'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveChartTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activeChartTab === tab ? "bg-slate-100 text-text-primary" : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-center relative overflow-hidden group">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-slate-200 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
                <p className="text-sm font-bold text-slate-400">Interactive charts will render here.</p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">Requires Chart.js or Recharts</p>
              </div>
            </div>
          </div>

          {/* Performance Table */}
          <div className="card bg-white border-none shadow-xl shadow-slate-100/50 p-0 rounded-[2.5rem] flex flex-col h-[500px] overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Top Performers</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Villas & Guests</p>
              
              <div className="relative mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-bold transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
              {filteredPerformance.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-text-primary tracking-tight">{item.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary tracking-tighter">{item.revenue}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.bookings} Bookings</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-50 bg-white">
              <button className="w-full py-3 text-xs font-black uppercase tracking-widest text-primary hover:bg-indigo-50 rounded-xl transition-all flex items-center justify-center gap-2">
                View Full Leaderboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Reports;
