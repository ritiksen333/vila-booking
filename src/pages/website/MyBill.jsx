import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, CheckCircle2, XCircle, Bike, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBill = () => {
  const orders = [
    { id: 'ORD-20260507-E9VH', status: 'Paid — awaiting restaurant', price: 'Rp 120.000', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Clock, items: ['1× Bintang Beer', '1× Tropical Mojito'] },
    { id: 'ORD-20260506-NTM9', status: 'Cancelled', price: 'Rp 160.000', color: 'bg-red-50 text-red-500 border-red-100', icon: XCircle, items: ['1× Tropical Mojito', '1× Espresso Martini'] },
    { id: 'ORD-20260506-KXRK', status: 'Cancelled', price: 'Rp 160.000', color: 'bg-red-50 text-red-500 border-red-100', icon: XCircle, items: ['1× Tropical Mojito', '1× Espresso Martini'] },
    { id: 'ORD-20260506-00N1', status: 'Served', price: 'Rp 120.000', color: 'bg-gray-50 text-gray-500 border-gray-100', icon: Bike, items: ['1× Bintang Beer', '1× Tropical Mojito'] },
    { id: 'ORD-20260506-24XN', status: 'Cancelled', price: 'Rp 120.000', color: 'bg-red-50 text-red-500 border-red-100', icon: XCircle, items: ['1× Bintang Beer', '1× Tropical Mojito'] },
  ];

  return (
    <div className="min-h-screen bg-[#e0f7f3]/50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-gray-50">
        <div className="flex items-center gap-3">
          <Link to="/guest-app" className="text-slate-400 hover:text-slate-800 transition-colors">
            <ChevronLeft size={20} strokeWidth={3} />
          </Link>
          <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">Open Bills</h1>
        </div>
        <div className="text-teal-600/60">
           <Clock size={18} />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-teal-900/5 overflow-hidden border border-white"
        >
          {/* Bill Info Header */}
          <div className="p-6 border-b border-gray-50 flex items-start justify-between">
             <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Bill-20260506-LUGX</p>
                <p className="text-[11px] font-bold text-gray-400 mb-1">06 Mei 2026, 08.50</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Room ASMARA</p>
             </div>
             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">Open</span>
          </div>

          {/* Orders List */}
          <div className="p-6 space-y-8">
             {orders.map((order, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                   <div className="flex items-start justify-between">
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{order.id}</p>
                         <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${order.color}`}>
                            <order.icon size={10} />
                            <span className="text-[9px] font-black uppercase tracking-tight">{order.status}</span>
                         </div>
                      </div>
                      <span className="text-sm font-black text-slate-800">{order.price}</span>
                   </div>
                   <div className="pl-2 space-y-0.5">
                      {order.items.map((item, i) => (
                         <p key={i} className="text-[11px] font-bold text-gray-400">{item}</p>
                      ))}
                   </div>
                </div>
             ))}
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50/50 p-6 space-y-4 border-t border-gray-100">
             <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-400">Subtotal</span>
                <span className="text-[13px] font-black text-slate-800">Rp 680.000</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-emerald-500">Paid</span>
                <span className="text-[13px] font-black text-emerald-500">-Rp 680.000</span>
             </div>
             
             <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-base font-black text-slate-800">Balance Due</span>
                <span className="text-xl font-black text-emerald-500 tracking-tighter">Rp 0</span>
             </div>
          </div>
        </motion.div>

        {/* Action Link */}
        <div className="mt-8 text-center">
           <Link to="/guest-app" className="text-[11px] font-black text-teal-700/40 hover:text-teal-700 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Receipt size={14} /> View Previous Bills
           </Link>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-full py-3 px-8 shadow-2xl z-50 flex items-center gap-10">
         <Link to="/" className="text-gray-400"><Clock size={20} /></Link>
         <Link to="/guest-app" className="text-gray-400"><Receipt size={20} /></Link>
         <Link to="/my-bill" className="text-orange-500 font-black text-xs uppercase tracking-widest">Bill</Link>
      </div>
    </div>
  );
};

export default MyBill;
