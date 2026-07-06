import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';

const Analytics = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('monthly'); // 'weekly', 'monthly', 'yearly'

  // --- Mock Data ---
  const revenueData = [
    { name: 'Jan', revenue: 45000, expenses: 28000 },
    { name: 'Feb', revenue: 52000, expenses: 30000 },
    { name: 'Mar', revenue: 48000, expenses: 29000 },
    { name: 'Apr', revenue: 61000, expenses: 32000 },
    { name: 'May', revenue: 59000, expenses: 31000 },
    { name: 'Jun', revenue: 75000, expenses: 35000 },
    { name: 'Jul', revenue: 82000, expenses: 38000 },
  ];

  const occupancyData = [
    { name: 'Signature', occupancy: 88, fill: '#6366f1' },
    { name: 'Oceanfront', occupancy: 92, fill: '#14b8a6' },
    { name: 'Garden', occupancy: 75, fill: '#f59e0b' },
    { name: 'Hilltop', occupancy: 85, fill: '#8b5cf6' },
  ];

  const bookingSourcesData = [
    { name: 'Direct Website', value: 55, color: '#6366f1' },
    { name: 'Booking.com', value: 25, color: '#f43f5e' },
    { name: 'Airbnb', value: 15, color: '#ec4899' },
    { name: 'Walk-in/Referral', value: 5, color: '#8b5cf6' },
  ];

  const stats = [
    { id: 'revenue', name: t('total_revenue') || 'Total Revenue', value: '$422,000', icon: DollarSign, change: '+18.2%', isUp: true },
    { id: 'adr', name: t('avg_daily_rate') || 'Avg. Daily Rate', value: '$1,250', icon: TrendingUp, change: '+5.4%', isUp: true },
    { id: 'occupancy', name: 'Avg. Occupancy', value: '85%', icon: Calendar, change: '-2.1%', isUp: false },
    { id: 'guests', name: 'Total Guests (YTD)', value: '1,842', icon: Users, change: '+12.5%', isUp: true },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">{t('analytics_title') || 'Analytics Dashboard'}</h1>
          <p className="text-sm font-medium text-text-secondary mt-1">{t('analytics_subtitle') || 'Comprehensive view of operations and revenue'}</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-primary transition-all uppercase tracking-widest cursor-pointer"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                <stat.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                stat.isUp ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
              )}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trends */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-black text-text-primary uppercase tracking-tight">{t('revenue_trends') || 'Revenue Trends'}</h3>
            <p className="text-xs text-text-secondary mt-1 font-medium">Income vs Expenses (Monthly)</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Sources (Pie) */}
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-black text-text-primary uppercase tracking-tight">{t('booking_sources') || 'Booking Sources'}</h3>
            <p className="text-xs text-text-secondary mt-1 font-medium">Distribution by channel</p>
          </div>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {bookingSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800 tracking-tighter">142</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Bookings</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {bookingSourcesData.map((source, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                <div>
                  <p className="text-[10px] font-bold text-slate-600 line-clamp-1">{source.name}</p>
                  <p className="text-[10px] font-black text-slate-900">{source.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Occupancy Bar Chart */}
        <div className="lg:col-span-3 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-black text-text-primary uppercase tracking-tight">{t('occupancy_villas') || 'Occupancy by Villa Type'}</h3>
            <p className="text-xs text-text-secondary mt-1 font-medium">Average occupancy rates across categories</p>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(val) => `${val}%`} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}%`, 'Occupancy']}
                />
                <Bar dataKey="occupancy" radius={[6, 6, 0, 0]}>
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
