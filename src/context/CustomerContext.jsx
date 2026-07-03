import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

export const useCustomer = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('resto-customer-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('resto-customer-favorites');
    return saved ? JSON.parse(saved) : [1, 3]; // Mock initial favorites
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('resto-customer-profile');
    return saved ? JSON.parse(saved) : {
      name: 'Guest User',
      phone: '+00 12345 67890',
      email: 'guest@example.com',
      tableId: '05',
      diningType: 'Dine-in',
      language: 'English'
    };
  });

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem('resto-customer-payments');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
      { id: 2, type: 'Mastercard', last4: '8888', expiry: '08/24', isDefault: false }
    ];
  });

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('resto-customer-addresses');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'Home', address: '123 Luxury Avenue, Penthouse 4, Mumbai', isDefault: true },
      { id: 2, label: 'Office', address: 'Business Center Tower B, 15th Floor, BKC', isDefault: false }
    ];
  });

  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const saved = localStorage.getItem('resto-customer-notifs');
    return saved ? JSON.parse(saved) : {
      orders: true,
      reservations: true,
      roomService: true,
      offers: false
    };
  });

  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('resto-customer-settings');
    return saved ? JSON.parse(saved) : {
      language: 'English',
      theme: 'Indigo',
      currency: 'INR',
      timeFormat: '12h'
    };
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [supportRequests, setSupportRequests] = useState(() => {
    const saved = localStorage.getItem('resto-customer-support');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('resto-customer-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('resto-customer-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('resto-customer-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('resto-customer-support', JSON.stringify(supportRequests));
  }, [supportRequests]);

  useEffect(() => {
    localStorage.setItem('resto-customer-payments', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('resto-customer-addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('resto-customer-notifs', JSON.stringify(notificationPrefs));
  }, [notificationPrefs]);

  useEffect(() => {
    localStorage.setItem('resto-customer-settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  const addToCart = (item, size, quantity, notes) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.itemId === item.id && i.size === size.name && i.notes === notes);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        id: Date.now(),
        itemId: item.id,
        name: item.name,
        image: item.image,
        size: size.name,
        price: size.price,
        quantity,
        notes
      }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateCartQuantity = (id, delta) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const toggleFavorite = (itemId) => {
    setFavorites(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const updateProfile = (data) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const createSupportRequest = (details) => {
    const newReq = {
      id: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
      tableId: profile.tableId,
      ...details
    };
    setSupportRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  return (
    <CustomerContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart,
      favorites, toggleFavorite,
      profile, updateProfile,
      paymentMethods, setPaymentMethods,
      addresses, setAddresses,
      notificationPrefs, setNotificationPrefs,
      systemSettings, setSystemSettings,
      appliedCoupon, setAppliedCoupon,
      supportRequests, createSupportRequest
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
