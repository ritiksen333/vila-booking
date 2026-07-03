import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  ChefHat,
  CreditCard,
  History,
  Tag,
  Clock,
  MoreVertical,
  X,
  ChevronRight,
  Receipt,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Printer,
  Bed
} from 'lucide-react';
import { cn } from "../../../utils/cn";
import { useAuth } from "../../../context/AuthContext";
import { useMenu } from "../../../context/MenuContext";
import { useHospitality } from "../../../context/HospitalityContext";
import { useOrders } from "../../../context/OrdersContext";
import printContent from '../../../utils/printUtil';

const POS = () => {
  const { user } = useAuth();
  const { items, categoriesList } = useMenu();
  const { rooms, reservations, addToFolio } = useHospitality();
  const { addOrder } = useOrders();
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [selectedItemForSize, setSelectedItemForSize] = useState(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState('');
  const [orderForReceipt, setOrderForReceipt] = useState(null);



  // Listen for header cart click
  React.useEffect(() => {
    const handleToggle = () => setIsMobileCartOpen(true);
    window.addEventListener('toggle-pos-cart', handleToggle);
    return () => window.removeEventListener('toggle-pos-cart', handleToggle);
  }, []);

  const orderHistory = [
    { id: '#ORD-9901', time: '10:15 AM', items: 3, total: 1240, status: 'Completed' },
    { id: '#ORD-9902', time: '10:45 AM', items: 1, total: 299, status: 'Completed' },
    { id: '#ORD-9903', time: '11:20 AM', items: 5, total: 2150, status: 'Cancelled' },
  ];

  const addToCart = (item, selectedSize = null) => {
    // If item has sizes and none is selected, open size selection modal
    if (item.sizes && !selectedSize) {
      setSelectedItemForSize(item);
      return;
    }

    const itemPrice = selectedSize ? selectedSize.price : item.price;
    const itemName = selectedSize ? `${item.name} (${selectedSize.name})` : item.name;
    const cartId = selectedSize ? `${item.id}-${selectedSize.name}` : `${item.id}`;

    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) {
        return prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, cartId, name: itemName, price: itemPrice, qty: 1, note: '' }];
    });
    
    if (selectedItemForSize) setSelectedItemForSize(null);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateQty = (cartId, delta) => {
    setCart(prev => prev.map(i => {
      if (i.cartId === cartId) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const updateNote = (cartId, note) => {
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, note } : i));
    setEditingNote(null);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const gst = Math.round((subtotal - discountAmount) * 0.05);
  const total = subtotal - discountAmount + gst;

  // Sync cart info with MainLayout header
  React.useEffect(() => {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    window.dispatchEvent(new CustomEvent('pos-cart-updated', { 
      detail: { count, total } 
    }));
  }, [cart, total]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleKDS = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToastMessage('Order sent to Kitchen successfully!');
    }, 1000);
  };

  const handleFinalPayment = () => {
    if (paymentMethod === 'Room Service' && !selectedGuest) {
      showToastMessage('Please select a guest for Room Service', 'error');
      return;
    }

    setIsProcessing(true);
    
    const newOrder = {
      customer: paymentMethod === 'Room Service' ? selectedGuest : 'Walk-in',
      type: paymentMethod === 'Room Service' ? 'Room Service' : 'Dine-in',
      table: paymentMethod === 'Room Service' ? selectedGuest : '-',
      amount: `₹${total}`,
      items: cart.reduce((acc, i) => acc + i.qty, 0),
      itemsList: cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price })),
      payment: paymentMethod,
      status: 'Pending'
    };

    setTimeout(() => {
      addOrder(newOrder);
      
      if (paymentMethod === 'Room Service') {
        addToFolio(selectedGuest, {
          description: `Room Service Order`,
          amount: total,
          date: new Date().toLocaleDateString(),
          type: 'Food'
        });
      }

      setIsProcessing(false);
      setShowPaymentModal(false);
      setOrderForReceipt(newOrder);
      setCart([]);
      setDiscount(0);
      setSelectedGuest('');
      showToastMessage(paymentMethod === 'Room Service' ? 'Charge added to guest folio!' : 'Payment Successful!');
    }, 2000);
  };

  const handlePrintOnly = () => {
    const currentOrder = {
      customer: paymentMethod === 'Room Service' ? selectedGuest : 'Walk-in',
      type: paymentMethod === 'Room Service' ? 'Room Service' : 'Dine-in',
      table: paymentMethod === 'Room Service' ? selectedGuest : '-',
      amount: `₹${total}`,
      items: cart.reduce((acc, i) => acc + i.qty, 0),
      itemsList: cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price })),
      payment: paymentMethod,
      status: 'Pro-forma'
    };
    setOrderForReceipt(currentOrder);
    setTimeout(() => {
      printContent('printable-area');
    }, 500);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 h-full overflow-hidden relative">
      {/* Toast Feedback */}
      {toast && (
        <div 
          className={cn(
            "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border text-white",
            toast.type === 'success' ? "bg-emerald-500 border-emerald-500/20" : "bg-rose-500 border-rose-500/20"
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white" />}
          {toast.message}
        </div>
      )}
      {/* Menu Area */}
      <div className="flex-1 flex flex-col gap-4 lg:gap-6 overflow-hidden">
        {/* Search & Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between shrink-0 gap-3 md:gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-text-secondary group-focus-within:text-primary" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..." 
              className="w-full pl-10 lg:pl-12 pr-4 lg:pr-5 py-3 lg:py-3.5 bg-white border border-slate-100 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none shadow-sm font-bold text-[10px] lg:text-[11px] uppercase tracking-widest placeholder:text-slate-300"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowHistory(true)}
                className="flex-1 md:flex-none p-3 lg:p-4 bg-white border border-slate-100 rounded-xl lg:rounded-2xl hover:border-primary/20 hover:bg-slate-50 shadow-sm group flex items-center justify-center gap-2 lg:gap-3 transition-all active:scale-95"
              >
                 <History className="w-4 h-4 lg:w-5 lg:h-5 text-text-secondary group-hover:text-primary" />
                 <span className="md:hidden text-[9px] font-black uppercase tracking-widest text-text-secondary group-hover:text-primary">Order History</span>
              </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-3 scrollbar-hide shrink-0 px-1 -mx-4 md:mx-0 px-4 md:px-0">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap border-2 transition-all active:scale-95",
                activeCategory === cat 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white text-text-secondary border-slate-50 hover:border-primary/20 hover:bg-indigo-50/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Menu Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-6 items-start pr-1 pb-32 lg:pb-12 scrollbar-hide">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="card group cursor-pointer border-2 border-transparent hover:border-primary/20 p-3 lg:p-5 flex flex-col relative overflow-hidden bg-gradient-to-br from-white to-slate-50/30 aspect-[1/1.3] lg:aspect-[3/4] transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <div className="flex justify-between items-start mb-2 lg:mb-4 relative z-10">
                 <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-lg lg:rounded-2xl flex items-center justify-center overflow-hidden text-xl lg:text-3xl shadow-xl shadow-slate-200 shrink-0">
                    {item.image && item.image.length > 2 ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.image
                    )}
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <span className="badge bg-emerald-50 text-emerald-600 border border-emerald-100 text-[7px] lg:text-[9px] py-0.5 px-1.5 lg:px-2 font-black uppercase tracking-widest">
                       READY
                    </span>
                    <p className="hidden lg:block text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.category}</p>
                 </div>
              </div>

              <div className="relative z-10 mb-2 flex-1 flex flex-col min-h-0">
                <h4 className="font-black text-text-primary text-[11px] lg:text-base leading-tight group-hover:text-primary uppercase tracking-tight line-clamp-2 mb-1">
                  {item.name}
                </h4>
                <p className="line-clamp-2 text-text-secondary text-[9px] lg:text-[11px] font-medium opacity-60 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-auto pt-2 lg:pt-3 border-t border-slate-50 flex items-center justify-between relative z-10 shrink-0">
                <div className="flex flex-col">
                   <span className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Price</span>
                   <p className="text-sm lg:text-xl font-black text-text-primary tracking-tighter leading-none">₹{item.price}</p>
                </div>
                <div 
                  className="w-7 h-7 lg:w-10 lg:h-10 bg-primary text-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4 lg:w-5 lg:h-5 lg:stroke-[3]" />
                </div>
              </div>
              
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobileCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[300] lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileCartOpen(false)}
        />
      )}

      {/* Cart & Billing Section */}
      <div className={cn(
        "fixed inset-x-0 bottom-0 lg:relative lg:inset-auto z-[400] transition-transform duration-300 lg:translate-y-0 shadow-2xl lg:shadow-none",
        "w-full lg:w-[320px] xl:w-[380px] flex flex-col shrink-0 h-[85vh] lg:h-full",
        isMobileCartOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0",
        cart.length === 0 ? "opacity-95" : "opacity-100"
      )}>
        <div className="card flex-1 flex flex-col p-0 overflow-hidden border border-primary/10 bg-white rounded-t-[2.5rem] lg:rounded-[2rem]">
          {/* Mobile Close Handle */}
          <div className="lg:hidden flex justify-center py-2 shrink-0" onClick={() => setIsMobileCartOpen(false)}>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </div>
          {/* Cart Header */}
          <div className="pl-5 pr-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white shrink-0 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                 <div 
                   className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-2xl relative shrink-0"
                 >
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && (
                      <div 
                        className="absolute -top-1 -right-1 w-5 h-5 bg-primary border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black shadow-lg"
                      >
                        {cart.reduce((acc, item) => acc + item.qty, 0)}
                      </div>
                    )}
                 </div>
                 <div className="min-w-0">
                    <h3 className="font-black text-xl tracking-tighter uppercase leading-none whitespace-nowrap">Active Cart</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                       <span className="w-1 h-1 rounded-full bg-primary" />
                       <p className="text-text-secondary text-[8px] font-black uppercase tracking-[0.2em] opacity-60 truncate">#ORD-202605</p>
                    </div>
                 </div>
              </div>
              
              <button 
                onClick={() => {
                  if(cart.length > 0 && confirm('Clear all items from cart?')) setCart([]);
                }}
                className={cn(
                  "p-2.5 rounded-xl border border-transparent group/trash shrink-0",
                  cart.length > 0 ? "text-slate-400 hover:text-danger" : "text-slate-200 cursor-not-allowed"
                )}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Scroll */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4 scrollbar-hide">
            {cart.length > 0 ? (
              cart.map(item => (
                  <div 
                    key={item.cartId} 
                    className="flex flex-col gap-3 group bg-slate-50/30 p-2.5 rounded-2xl hover:bg-slate-50"
                  >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden text-2xl shrink-0 shadow-sm">
                        {item.image && item.image.length > 2 ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          item.image
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-text-primary text-sm truncate leading-tight">{item.name}</h5>
                        <p className="text-xs text-primary font-black mt-0.5 tracking-tight">₹{item.price}</p>
                     </div>
                     <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                        <button onClick={() => updateQty(item.cartId, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg text-text-secondary hover:text-primary">
                           <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-text-primary">{item.qty}</span>
                        <button onClick={() => updateQty(item.cartId, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg text-text-secondary hover:text-primary">
                           <Plus className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <button 
                       onClick={() => setEditingNote(item.cartId)}
                       className={cn(
                         "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest",
                         item.note ? "bg-indigo-50 text-primary border border-primary/20" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-100"
                       )}
                     >
                        <MessageSquare className="w-3 h-3" />
                        {item.note || 'Add Special Instruction'}
                     </button>
                     <button onClick={() => removeFromCart(item.cartId)} className="p-2 text-slate-300 hover:text-danger hover:bg-red-50 rounded-lg">
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  {editingNote === item.cartId && (
                    <div className="overflow-hidden">
                      <div className="pt-2 flex flex-col gap-2">
                         <textarea 
                           autoFocus
                           onBlur={(e) => updateNote(item.cartId, e.target.value)}
                           defaultValue={item.note}
                           placeholder="e.g. Extra spicy, No onions..."
                           className="w-full p-4 bg-white border-2 border-primary/20 rounded-2xl outline-none text-xs font-bold text-text-primary placeholder:text-slate-300 min-h-[80px] shadow-inner"
                         />
                         <button onClick={() => setEditingNote(null)} className="btn-primary py-2 text-[8px] uppercase tracking-widest">Save Note</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 opacity-40">
                <ShoppingCart className="w-10 h-10 text-slate-300 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Cart is empty</p>
              </div>
            )}
          </div>

          {/* Billing Summary Panel */}
          <div className="p-5 lg:p-6 bg-primary text-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(255,77,28,0.1)]">
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal}</span>
              </div>
              
              <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span>Tax (GST 5%)</span>
                <span className="text-white">₹{gst}</span>
              </div>

              {/* Discount Selector */}
              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-3 h-3 text-white/40" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Apply Discount</span>
                </div>
                <div className="flex gap-2">
                  {[0, 5, 10, 15, 20].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDiscount(d)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all border",
                        discount === d 
                          ? "bg-white text-primary border-white" 
                          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      )}
                    >
                      {d}%
                    </button>
                  ))}
                </div>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span>Discount ({discount}%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-1.5">Grand Total</span>
                  <div className="flex items-baseline gap-2">
                     <h4 className="text-3xl lg:text-4xl font-black text-white tracking-tighter">₹{total}</h4>
                     <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">INR</span>
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                   <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                disabled={cart.length === 0 || isProcessing}
                onClick={handleKDS}
                className="flex flex-col items-center justify-center gap-2 py-4 bg-white/10 border-2 border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/20 hover:border-white/20 disabled:opacity-50 transition-all group active:scale-95"
              >
                <ChefHat className={cn("w-5 h-5 text-white")} /> 
                {isProcessing ? 'Sending...' : 'Send to KDS'}
              </button>
              <button 
                onClick={() => setShowPaymentModal(true)}
                disabled={cart.length === 0 || isProcessing}
                className="flex flex-col items-center justify-center gap-2 py-4 bg-white text-primary rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-slate-50 disabled:opacity-50 transition-all group active:scale-95"
              >
                <CreditCard className="w-5 h-5" /> 
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Toggle */}
      {/* Floating cart bar removed - now in Header */}

      {/* History Modal */}
      {showHistory && (
         <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div onClick={() => setShowHistory(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-[95%] md:max-w-[560px] max-h-[90vh] bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col self-center">
             <div className="px-5 py-4 md:px-6 md:py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 shrink-0">
                <div>
                  <h3 className="text-lg md:text-2xl font-black tracking-tight uppercase">Order History</h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Today's Transactions</p>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 md:p-3 hover:bg-white rounded-xl md:rounded-2xl transition-all shadow-sm"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
             </div>
             <div className="px-5 md:px-6 py-6 space-y-4 overflow-y-auto scrollbar-hide">
                {orderHistory.map(order => (
                  <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white transition-all cursor-pointer group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Receipt className="w-5 h-5 text-primary" /></div>
                        <div>
                           <h5 className="font-bold text-sm text-text-primary">{order.id}</h5>
                           <p className="text-[10px] font-bold text-slate-400">{order.time} • {order.items} Items</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-black text-sm text-text-primary">₹{order.total}</p>
                        <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full", order.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>{order.status}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Compact & Interactive Payment Modal */}
      {showPaymentModal && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
          <div 
            onClick={() => !isProcessing && setShowPaymentModal(false)} 
            className="absolute inset-0 bg-slate-900/60" 
          />
           <div 
            className="relative w-full max-w-[95%] md:max-w-[560px] bg-white rounded-[2rem] md:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-white/20 self-center"
          >
            {/* Header */}
            <div className="px-5 py-5 sm:px-6 sm:py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 shrink-0">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                  <Receipt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-black text-text-primary tracking-tight uppercase leading-none">Final Settlement</h3>
                  <p className="text-[8px] sm:text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">Invoice #POS-2026-X49</p>
                </div>
              </div>
              <button 
                onClick={() => !isProcessing && setShowPaymentModal(false)} 
                className="p-2 sm:p-3 hover:bg-white rounded-xl sm:rounded-2xl border border-transparent hover:border-slate-100 shadow-sm"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-5 sm:p-6 bg-primary rounded-[1.25rem] sm:rounded-[1.5rem] flex flex-col items-center text-center shadow-xl border border-white/20">
                    <p className="text-[8px] sm:text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1 sm:mb-2">Amount Due</p>
                    <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">₹{total}</h4>
                    <div className="mt-2 sm:mt-3 px-2 py-0.5 bg-white/20 text-white rounded-full text-[6px] sm:text-[7px] font-black uppercase tracking-widest">Tax Included</div>
                 </div>
                 <div className="p-5 sm:p-6 bg-slate-50 rounded-[1.25rem] sm:rounded-[1.5rem] border-2 border-slate-100 flex flex-col items-center text-center">
                    <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 sm:mb-2">Cart Summary</p>
                    <h4 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tighter">{cart.reduce((a, b) => a + b.qty, 0)}</h4>
                    <p className="mt-1 text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest">Items Count</p>
                 </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em] px-1">Payment Method</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                  {[
                    { name: 'Cash', icon: Receipt, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { name: 'Card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { name: 'UPI', icon: ChevronRight, color: 'text-primary', bg: 'bg-indigo-50' },
                    { name: 'Room Service', icon: Bed, color: 'text-orange-600', bg: 'bg-orange-50' },
                  ].map((method) => (
                    <button 
                      onClick={() => setPaymentMethod(method.name)}
                      key={method.name} 
                      className={cn(
                        "relative p-3 lg:p-5 rounded-xl lg:rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-2 lg:gap-3 transition-all overflow-hidden active:scale-95", 
                        paymentMethod === method.name 
                          ? "border-primary bg-indigo-50/30 shadow-md" 
                          : "border-slate-50 bg-slate-50/50 hover:border-primary/20 hover:bg-white"
                      )}
                    >
                      <div className={cn("w-9 h-9 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-sm shrink-0", method.bg)}>
                        <method.icon className={cn("w-4 h-4 lg:w-6 lg:h-6 stroke-[2.5]", method.color)} />
                      </div>
                      <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] text-center">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Room Service' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em] px-1">Select Active Guest</h4>
                  <div className="space-y-2">
                    <select 
                      value={selectedGuest}
                      onChange={(e) => setSelectedGuest(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm appearance-none focus:border-primary/20"
                    >
                      <option value="">Select Guest (In-House Only)</option>
                      {reservations
                        .filter(r => r.status === 'Checked In')
                        .map(res => (
                          <option key={res.id} value={res.guestName}>
                            {res.guestName} • {res.targetId}
                          </option>
                        ))}
                    </select>
                    {reservations.filter(r => r.status === 'Checked In').length === 0 && (
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-1">
                        No checked-in guests found
                      </p>
                    )}
                  </div>
                </div>
              )}

              <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] pt-4">
                 Secure 256-bit Encrypted Transaction
              </p>
            </div>

            {/* Bottom Actions Area */}
            <div className="px-5 py-5 lg:px-6 lg:py-6 border-t border-slate-50 bg-white shrink-0">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  disabled={isProcessing}
                  onClick={handlePrintOnly}
                  className="w-full py-4 bg-slate-50 text-slate-400 hover:text-primary border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                   <Printer className="w-4 h-4" /> Print Invoice
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={handleFinalPayment}
                  className={cn(
                    "w-full py-4 shadow-xl rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95",
                    isProcessing 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "btn-primary shadow-primary/20"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Pay & Settle'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Size Selection Modal */}
      {selectedItemForSize && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedItemForSize(null)} 
            className="absolute inset-0 bg-slate-900/60" 
          />
          <div 
            className="relative w-full max-w-[95%] md:max-w-[440px] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 self-center"
          >
            <div className="px-8 py-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-inner">
                {selectedItemForSize.image}
              </div>
              <h3 className="text-2xl font-black text-text-primary tracking-tight uppercase leading-tight">
                {selectedItemForSize.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 mb-8">Select Item Size</p>
              
              <div className="w-full space-y-3">
                {selectedItemForSize.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => addToCart(selectedItemForSize, size)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-primary/30 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-black text-text-primary uppercase tracking-wider">{size.name}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Custom Portion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-primary">₹{size.price}</span>
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setSelectedItemForSize(null)}
                className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] hover:text-danger"
              >
                Cancel Selection
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hidden Printable Receipt - 80mm Thermal Style */}
      {orderForReceipt && (
        <div id="printable-area" className="hidden print:block printable-area receipt-print active-print">
          <div className="text-center space-y-1 mb-4">
            <h1 className="text-2xl font-black uppercase tracking-tight">LUMIÈRE VILLAS</h1>
            <p className="text-[10px] font-bold">Main Branch</p>
            <p className="text-[10px] font-bold">GST: 22AAAAA0000A1Z5</p>
            <p className="text-[10px] font-bold">Ph: +91 12345 67890</p>
          </div>
          
          <div className="border-b-2 border-dashed border-slate-900 my-4"></div>
          
          <div className="space-y-1.5 text-[11px] font-bold uppercase">
            <div className="flex justify-between">
              <span>Bill No:</span>
              <span className="font-black">{orderForReceipt.id?.split('-').pop() || `INV${Math.floor(Math.random()*1000)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>{user?.name || 'Admin'}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{orderForReceipt.customer || 'Walk-in'}</span>
            </div>
          </div>

          <div className="border-b-2 border-dashed border-slate-900 my-4"></div>

          <table className="w-full text-[11px] font-bold uppercase mb-4">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="text-left py-2">Item Description</th>
                <th className="text-center py-2 px-2">Qty</th>
                <th className="text-right py-2">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-slate-200">
              {orderForReceipt.itemsList?.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 pr-2 leading-tight">{item.name}</td>
                  <td className="py-3 text-center px-2">{item.quantity}</td>
                  <td className="py-3 text-right">{item.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-dashed border-slate-900 pt-4 space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase">
              <span>Subtotal:</span>
              <span>{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
                <span>Discount ({discount}%):</span>
                <span>-{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[11px] font-bold uppercase">
              <span>Tax (GST 5%):</span>
              <span>{gst.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-slate-900">
              <span className="text-lg font-black uppercase tracking-tighter">Grand Total:</span>
              <span className="text-xl font-black tracking-tighter">Rs.{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 space-y-1.5 text-[11px] font-bold uppercase">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span>{orderForReceipt.payment || 'CASH'}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Items:</span>
              <span>{orderForReceipt.itemsList?.length || 0}</span>
            </div>
          </div>

          <div className="text-center pt-12 space-y-2">
            <p className="text-sm font-black uppercase tracking-[0.2em]">*** THANK YOU ***</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">Visit Again!</p>
            <p className="text-[8px] font-black text-slate-400 mt-8 uppercase tracking-tighter">Powered by LUMIÈRE VILLAS POS</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
