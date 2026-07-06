import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useHospitality } from '../../../context/HospitalityContext';
import { cn } from '../../../utils/cn';

const PromoCodes = () => {
  const { promoCodes, addPromoCode, updatePromoCode, deletePromoCode } = useHospitality();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    percent: '',
    status: 'Active'
  });

  const filteredCodes = promoCodes.filter(promo => 
    promo.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (promo = null) => {
    if (promo) {
      setEditingCode(promo);
      setFormData({
        code: promo.code,
        percent: promo.percent,
        status: promo.status
      });
    } else {
      setEditingCode(null);
      setFormData({
        code: '',
        percent: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCode) {
      updatePromoCode(editingCode.id, {
        code: formData.code.toUpperCase(),
        percent: Number(formData.percent),
        status: formData.status
      });
    } else {
      addPromoCode({
        code: formData.code.toUpperCase(),
        percent: Number(formData.percent),
        status: formData.status
      });
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (promo) => {
    updatePromoCode(promo.id, {
      status: promo.status === 'Active' ? 'Inactive' : 'Active'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Promo Codes</h1>
            <p className="text-sm font-medium text-text-secondary mt-1">Manage discount codes and promotions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search codes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-primary transition-all w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> New Code
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCodes.map((promo) => (
          <motion.div 
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-3xl border-2 transition-all relative overflow-hidden group",
              promo.status === 'Active' ? "border-primary/20 bg-white shadow-xl shadow-primary/5 hover:border-primary" : "border-slate-200 bg-slate-50 opacity-80"
            )}
          >
            {promo.status === 'Active' && (
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
            )}
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Discount Code</p>
                <h3 className="text-2xl font-black text-text-primary tracking-tight">{promo.code}</h3>
              </div>
              <div className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                promo.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"
              )}>
                {promo.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {promo.status}
              </div>
            </div>

            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Discount Amount</p>
                <div className="text-4xl font-black text-primary tracking-tighter">
                  {promo.percent}<span className="text-2xl">%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleStatus(promo)}
                  className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                  title={promo.status === 'Active' ? 'Deactivate' : 'Activate'}
                >
                  {promo.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleOpenModal(promo)}
                  className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deletePromoCode(promo.id)}
                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredCodes.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
            <Gift className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm font-bold">No promo codes found</p>
            <p className="text-xs">Create a new code to offer discounts to your guests.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-text-primary tracking-tight">
                  {editingCode ? 'Edit Promo Code' : 'New Promo Code'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 block ml-1">Promo Code</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. SUMMER25"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white uppercase transition-all"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 block ml-1">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    max="100"
                    value={formData.percent}
                    onChange={(e) => setFormData({...formData, percent: e.target.value})}
                    placeholder="e.g. 20"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 block ml-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all"
                  >
                    {editingCode ? 'Save Changes' : 'Create Code'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromoCodes;
