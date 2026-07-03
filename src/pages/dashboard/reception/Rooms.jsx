import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  X, 
  ChevronRight, 
  Home, 
  Users, 
  Clock, 
  Sparkles,
  AlertCircle,
  Wrench,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import { useHospitality } from "../../../context/HospitalityContext";

const Villas = () => {
  const { rooms: villas, addRoom: addVilla, updateRoom: updateVilla, deleteRoom: deleteVilla } = useHospitality();
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [showAddVilla, setShowAddVilla] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const [formData, setFormData] = useState({ 
    name: '', 
    type: 'Deluxe', 
    capacity: 2, 
    status: 'Available',
    price: 4500,
    notes: '' 
  });

  const villaTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential'];
  const villaStatuses = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Available': return { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: Home };
      case 'Occupied': return { color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: Users };
      case 'Reserved': return { color: 'bg-primary', bg: 'bg-indigo-50', text: 'text-primary', border: 'border-indigo-100', icon: Clock };
      case 'Cleaning': return { color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Sparkles };
      case 'Maintenance': return { color: 'bg-slate-400', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: Wrench };
      default: return { color: 'bg-slate-300', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100', icon: AlertCircle };
    }
  };

  const filteredVillas = villas.filter(villa => {
    const matchesSearch = villa.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          villa.assignedGuest?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || villa.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isEditing && selectedVilla) {
      updateVilla(selectedVilla.id, {
        name: formData.name,
        type: formData.type,
        capacity: parseInt(formData.capacity),
        status: formData.status,
        price: parseInt(formData.price) || 0,
        notes: formData.notes
      });
      setIsEditing(false);
      setSelectedVilla({ ...selectedVilla, ...formData, capacity: parseInt(formData.capacity), price: parseInt(formData.price) });
    } else {
      addVilla({
        name: formData.name,
        type: formData.type,
        capacity: parseInt(formData.capacity),
        status: formData.status,
        price: parseInt(formData.price) || 0,
        assignedGuest: null,
        notes: formData.notes
      });
      setShowAddVilla(false);
    }
    setFormData({ name: '', type: 'Deluxe', capacity: 2, status: 'Available', price: 4500, notes: '' });
  };

  const handleDelete = () => {
    deleteVilla(selectedVilla.id);
    setShowDeleteConfirm(false);
    setSelectedVilla(null);
  };

  const openEdit = (villa) => {
    setFormData({
      name: villa.name,
      type: villa.type,
      capacity: villa.capacity,
      status: villa.status,
      price: villa.price || 0,
      notes: villa.notes || ''
    });
    setIsEditing(true);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <Home className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-text-primary uppercase tracking-wider">Villas Management</h2>
            <p className="text-text-secondary text-sm font-bold mt-1">Total {villas.length} Villas • {villas.filter(r => r.status === 'Available').length} Ready</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search villas or guests..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 bg-white border border-slate-100 rounded-2xl outline-none shadow-sm text-sm font-bold focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
          <button 
            onClick={() => {
              setFormData({ name: '', type: 'Deluxe', capacity: 2, status: 'Available', price: 4500, notes: '' });
              setIsEditing(false);
              setShowAddVilla(true);
            }}
            className="btn-primary h-[48px] px-6 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> New Villa
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 shrink-0">
        {['All', ...villaStatuses].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap transition-all",
              activeTab === tab 
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" 
              : "bg-white text-text-secondary border-transparent hover:bg-slate-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Villas Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide -mx-1 px-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-10">
          {filteredVillas.map((villa) => {
            const config = getStatusConfig(villa.status);
            const StatusIcon = config.icon;
            return (
              <div 
                key={villa.id}
                onClick={() => setSelectedVilla(villa)}
                className="group card bg-white border-none shadow-xl shadow-slate-100/50 p-5 rounded-[2.5rem] hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-10", config.color)} />
                
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", config.bg, config.text)}>
                    <Home className="w-6 h-6" />
                  </div>
                  <div className={cn("px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border", config.bg, config.text, config.border)}>
                    {villa.status}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-text-primary tracking-tight">{villa.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{villa.type}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cap: {villa.capacity}</span>
                    {villa.price && (
                      <>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">₹{villa.price}/night</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={cn("w-4 h-4", config.text)} />
                    <span className="text-[11px] font-bold text-text-primary">
                      {villa.assignedGuest || 'No Guest'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Villa Details Modal */}
      {selectedVilla && !isEditing && !showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div onClick={() => setSelectedVilla(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">{selectedVilla.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Villa #{selectedVilla.id}</p>
                </div>
                <button onClick={() => setSelectedVilla(null)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400"><X className="w-6 h-6" /></button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                  <p className={cn("text-sm font-black mt-1", getStatusConfig(selectedVilla.status).text)}>{selectedVilla.status}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price / Night</p>
                  <p className="text-sm font-black text-text-primary mt-1">₹{selectedVilla.price}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                  <p className="text-sm font-black text-text-primary mt-1">{selectedVilla.type}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</p>
                  <p className="text-sm font-black text-text-primary mt-1">{selectedVilla.capacity} Guests</p>
                </div>
              </div>
              {selectedVilla.notes && (
                <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-50">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Notes</p>
                  <p className="text-sm font-bold text-indigo-900 mt-1">{selectedVilla.notes}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 flex gap-4">
              <button 
                onClick={() => openEdit(selectedVilla)}
                className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all text-slate-600"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Delete Villa?</h3>
            <p className="text-sm font-bold text-text-secondary mt-2">Are you sure you want to delete {selectedVilla?.name}? This action cannot be undone.</p>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 h-12 bg-slate-100 rounded-xl font-black uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={handleDelete} className="flex-1 h-12 bg-rose-500 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 shadow-lg shadow-rose-500/20">Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add / Edit Form Modal */}
      {(showAddVilla || isEditing) && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4">
          <div onClick={() => { setShowAddVilla(false); setIsEditing(false); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-[95%] md:max-w-lg bg-white rounded-t-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] self-end sm:self-center animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-300">
            <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                     {isEditing ? <Edit2 className="w-5 h-5 text-primary stroke-[3]" /> : <Plus className="w-5 h-5 text-primary stroke-[3]" />}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none">{isEditing ? 'Edit Villa' : 'Add New Villa'}</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 md:mt-1 leading-none">{isEditing ? 'Update villa details and pricing' : 'Register and configure villa'}</p>
                  </div>
               </div>
              <button onClick={() => { setShowAddVilla(false); setIsEditing(false); }} className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 md:p-8 space-y-5 md:space-y-6 overflow-y-auto scrollbar-hide">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Villa Name / Number *</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. VILLA-101"
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold appearance-none"
                    >
                      {villaTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capacity</label>
                    <input 
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={e => setFormData({...formData, capacity: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold appearance-none"
                    >
                      {villaStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price per night</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Special Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder="e.g. Requires deep cleaning, private pool access..."
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold resize-none h-24"
                  />
                </div>
              </div>
              <div className="p-6 md:p-8 bg-slate-50 shrink-0">
                <button type="submit" className="w-full btn-primary h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20">
                  {isEditing ? 'Save Changes' : 'Create Villa'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Villas;
