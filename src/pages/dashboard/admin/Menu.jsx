import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Filter,
  Image as ImageIcon,
  ChevronRight,
  Star,
  Settings2,
  X,
  Camera,
  Layers,
  Tag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CookingPot,
  ArrowUpRight
} from 'lucide-react';
import { cn } from "../../../utils/cn";

import { useMenu } from "../../../context/MenuContext";

const Menu = () => {
  const { items, addItem, updateItem, deleteItem } = useMenu();
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);

  const categories = [
    { name: 'All Items', icon: Layers },
    { name: 'Pizza', icon: Tag },
    { name: 'Burgers', icon: Tag },
    { name: 'Pasta', icon: Tag },
    { name: 'Main Course', icon: Tag },
    { name: 'Drinks', icon: Tag },
    { name: 'Desserts', icon: Tag },
  ];

  // Logic Helpers
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      updateItem(editingItem.id, itemData);
      showToast('Item updated successfully');
    } else {
      addItem(itemData);
      showToast('New item added to menu');
    }
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    deleteItem(id);
    setShowDeleteConfirm(null);
    showToast('Item removed from menu', 'error');
  };

  const toggleAvailability = (id) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateItem(id, { available: !item.available, status: !item.available ? 'In Stock' : 'Out of Stock' });
      showToast('Availability status updated');
    }
  };

  const processedItems = items
    .filter(item => activeCategory === 'All Items' || item.category === activeCategory)
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-5 flex flex-col h-full overflow-hidden relative">
      {/* Toast Feedback */}
      {toast && (
        <div 
          className={cn(
            "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border",
            toast.type === 'success' ? "bg-primary border-primary/20 text-white" : "bg-primary border-primary/20 text-white"
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-text-primary uppercase tracking-tight leading-none">Menu Catalog</h2>
          <p className="text-text-secondary mt-1 text-xs lg:text-sm font-medium">Manage dishes and availability.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setShowAddModal(true); }}
          className="btn-primary flex items-center justify-center gap-2 py-3 lg:py-2.5 px-6 shadow-xl shadow-primary/20 text-[10px] lg:text-sm uppercase tracking-widest font-black"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Item
        </button>
      </div>

      <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto pb-2 lg:pb-4 scrollbar-hide shrink-0 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={cn(
              "px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl text-[8px] lg:text-[9px] font-black uppercase tracking-widest flex items-center gap-2 lg:gap-2.5 border-2 whitespace-nowrap transition-all",
              activeCategory === cat.name 
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                : "bg-white text-slate-400 border-transparent hover:border-primary/20 hover:text-primary shadow-sm"
            )}
          >
            <cat.icon className={cn("w-3.5 h-3.5 lg:w-4 lg:h-4", activeCategory === cat.name ? "text-white" : "text-slate-300")} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Main Content - Full Width */}
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..." 
                className="w-full pl-10 lg:pl-11 pr-4 lg:pr-5 py-2.5 lg:py-3.5 bg-white border border-slate-100 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none shadow-sm text-[9px] lg:text-[11px] font-bold uppercase tracking-widest placeholder:text-slate-300"
              />
            </div>
            <button 
              onClick={() => showToast('Advanced filters coming soon', 'success')}
              className="p-2.5 lg:p-3.5 bg-white border border-slate-100 rounded-xl lg:rounded-2xl hover:bg-slate-50 shadow-sm group"
            >
              <Filter className="w-4 h-4 text-slate-400 group-hover:text-primary" />
            </button>
          </div>

          <div className="card p-0 overflow-hidden flex-1 flex flex-col shadow-2xl border-none bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem]">
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 lg:pb-0">
              {/* Desktop Table View */}
              <table className="w-full hidden md:table">
                <thead className="sticky top-0 z-10">
                  <tr className="text-left text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] border-b border-slate-50 bg-slate-50/50">
                    <th className="px-8 py-5">Product Intelligence</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Financials</th>
                    <th className="px-8 py-5">Stock State</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {processedItems.length > 0 ? (
                      processedItems.map((item) => (
                        <tr 
                          key={item.id} 
                          className={cn(
                            "text-xs hover:bg-slate-50/50 group cursor-pointer",
                            item.status === 'Out of Stock' && "opacity-60 bg-slate-50/30"
                          )}
                          onClick={() => setSelectedItem(item)}
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border border-slate-50">
                                {item.image.length > 2 ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-3xl">{item.image}</span>
                                )}
                              </div>
                              <div>
                                 <span className="font-black text-text-primary text-base tracking-tight leading-none">{item.name}</span>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest flex items-center gap-2">
                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {item.rating} • Popular
                                 </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                             <span className="badge bg-indigo-50 text-primary font-black border-none text-[8px] uppercase tracking-widest">{item.category}</span>
                          </td>
                          <td className="px-8 py-5 font-black text-text-primary text-lg tracking-tighter">₹{item.price}</td>
                          <td className="px-8 py-5">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleAvailability(item.id); }}
                              className={cn(
                                "badge font-black border-2 py-1 px-3 text-[8px] uppercase tracking-widest",
                                item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" :
                                item.status === 'Low Stock' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"
                              )}
                            >
                              {item.status}
                            </button>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setEditingItem(item); setShowAddModal(true); }}
                                className="p-2.5 bg-white text-slate-400 hover:text-primary hover:shadow-xl rounded-xl border border-slate-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(item); }}
                                className="p-2.5 bg-white text-slate-400 hover:text-rose-500 hover:shadow-xl rounded-xl border border-slate-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                              <Search className="w-8 h-8 text-slate-200" />
                            </div>
                            <h4 className="text-xl font-black text-text-primary uppercase tracking-tight">No menu items found</h4>
                            <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest mt-2">Adjust your search or filter to see more results</p>
                            <button 
                              onClick={() => { setActiveCategory('All Items'); setSearchQuery(''); }}
                              className="mt-6 text-primary font-black uppercase tracking-[0.2em] text-[8px] hover:underline"
                            >
                              Reset All Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {processedItems.length > 0 ? (
                  processedItems.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={cn(
                        "p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center gap-4 active:scale-95 transition-transform",
                        item.status === 'Out of Stock' && "opacity-60 bg-slate-50/50"
                      )}
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                        {item.image.length > 2 ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">{item.image}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-text-primary text-sm uppercase tracking-tight truncate">{item.name}</h4>
                          <p className="font-black text-primary text-sm ml-2">₹{item.price}</p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={cn(
                            "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                            item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                            {item.status}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingItem(item); setShowAddModal(true); }}
                              className="p-2 bg-slate-50 rounded-lg text-slate-400"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(item); }}
                              className="p-2 bg-slate-50 rounded-lg text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <h4 className="text-lg font-black text-text-primary uppercase">No items found</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        {showAddModal && (
          <AddItemModal 
            item={editingItem} 
            onClose={() => { setShowAddModal(false); setEditingItem(null); }}
            onSave={handleSaveItem}
            categories={categories.filter(c => c.name !== 'All Items')}
          />
        )}
        {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
           <div onClick={() => setShowDeleteConfirm(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
           <div 
             className="relative w-full max-w-sm bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl self-end sm:self-center animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-300"
           >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-center uppercase tracking-tight">Confirm Removal</h3>
              <p className="text-xs sm:text-sm text-center text-slate-400 mt-2 font-medium">Are you sure you want to remove <span className="text-slate-900 font-bold">{showDeleteConfirm.name}</span>?</p>
              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3.5 sm:py-4 border-2 border-slate-100 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-50">Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm.id)} className="flex-1 py-3.5 sm:py-4 bg-rose-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-rose-200">Delete</button>
              </div>
           </div>
        </div>,
        document.body
      )}

      {selectedItem && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4">
           <div onClick={() => setSelectedItem(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
           <div 
             className="relative w-full max-w-[95%] md:max-w-[520px] max-h-[95vh] sm:max-h-[90vh] bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col self-end sm:self-center animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-300"
           >
              <div className="h-48 md:h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden group shrink-0">
                {selectedItem.image && selectedItem.image.length > 2 ? (
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-7xl">{selectedItem.image || '🍽️'}</div>
                )}
                <div className="absolute top-6 right-6">
                  <button onClick={() => setSelectedItem(null)} className="p-2 bg-black/20 hover:bg-black/40 rounded-xl text-white transition-all"><X className="w-5 h-5" /></button>
                </div>
                <CookingPot className="absolute -bottom-10 -left-10 w-40 h-40 text-white/5 -rotate-12" />
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-text-primary tracking-tighter uppercase">{selectedItem.name}</h3>
                    <div className="flex items-center gap-3 mt-3">
                       <span className="badge bg-indigo-50 text-primary border-none text-[8px] font-black uppercase tracking-[0.2em]">{selectedItem.category}</span>
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg">
                         <Star className="w-3.5 h-3.5 fill-current" /> {selectedItem.rating}
                       </div>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl md:text-3xl font-black text-primary tracking-tighter uppercase">₹{selectedItem.price}</p>
                     <span className={cn(
                       "badge font-black border-2 py-1 px-3 text-[7px] uppercase tracking-widest mt-2 inline-block",
                       selectedItem.status === 'In Stock' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                     )}>
                       {selectedItem.status}
                     </span>
                  </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Intelligence</h4>
                   <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{selectedItem.description || 'No description available for this premium offering.'}"</p>
                </div>
              </div>
              <div className="p-6 md:p-8 border-t border-slate-50 flex gap-3 md:gap-4 shrink-0 bg-white relative z-20">
                <button 
                  onClick={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowAddModal(true); }}
                  className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:bg-slate-50 flex items-center justify-center gap-2 md:gap-3 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Edit Entry
                </button>
                <button 
                  onClick={() => { setSelectedItem(null); }}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[9px] shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const AddItemModal = ({ item, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState(item || { name: '', category: categories[0].name, price: '', description: '', status: 'In Stock', image: '' });
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(item?.image || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-[95%] md:max-w-[560px] bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 self-end sm:self-center animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-300 flex flex-col max-h-[95vh] sm:max-h-[90vh]"
      >
        <div className="px-5 py-5 md:px-8 md:py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/20 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
             <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-primary md:stroke-[3]" />
             </div>
             <div>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none">{item ? 'Edit' : 'Add'} Menu Item</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 md:mt-1 leading-none">{item ? 'Modify existing entry' : 'Define new experience'}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 md:p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 shadow-sm transition-all"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-hide">
           <div className="p-6 md:p-8 space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
                 <div className="w-24 h-24 sm:w-36 sm:h-36 bg-slate-50 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary shrink-0 overflow-hidden relative self-center transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-10" />
                    ) : (
                      <>
                        <Camera className="w-6 h-6 md:w-8 md:h-8 text-slate-300 group-hover:text-primary transition-colors" />
                        <span className="text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Upload Image</span>
                      </>
                    )}
                    {previewUrl && (
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-15 flex items-center justify-center">
                         <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                 </div>
                 <div className="flex-1 space-y-5 md:space-y-6">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         placeholder="e.g. Classic Margherita" 
                         className={cn(
                           "w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-xs md:text-sm transition-all",
                           errors.name ? "border-rose-300 bg-rose-50/20" : "border-slate-100"
                         )}
                       />
                       {errors.name && <p className="text-[9px] font-bold text-rose-500 ml-1 mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                          <input 
                            type="number" 
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="299" 
                            className={cn(
                              "w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-xs md:text-sm transition-all",
                              errors.price ? "border-rose-300 bg-rose-50/20" : "border-slate-100"
                            )}
                          />
                          {errors.price && <p className="text-[9px] font-bold text-rose-500 ml-1 mt-1">{errors.price}</p>}
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                          <div className="relative">
                            <select 
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-xs md:text-sm appearance-none transition-all"
                            >
                               {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Description</label>
                 <textarea 
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="Describe flavors and ingredients..." 
                   rows="3" 
                   className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-xs md:text-sm transition-all resize-none"
                 />
              </div>
           </div>

           <div className="px-6 py-6 md:px-8 md:py-8 border-t border-slate-50 flex flex-col sm:flex-row gap-3 md:gap-4 bg-white shrink-0 relative z-20">
              <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="flex-1 btn-primary py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-[9px] md:text-[10px] active:scale-95 transition-all">
                {item ? 'Update Entry' : 'Deploy Item'}
              </button>
           </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default Menu;
