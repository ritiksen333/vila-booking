import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useToast } from './ToastContext';

const HospitalityContext = createContext();

export const useHospitality = () => useContext(HospitalityContext);

export const HospitalityProvider = ({ children }) => {
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-rooms');
    return saved ? JSON.parse(saved) : [
      { id: 'RM-101', name: 'DELUXE SEAVIEW', type: 'Deluxe', price: 4500, capacity: 2, status: 'Available', assignedGuest: null, notes: 'Full balcony, king bed' },
      { id: 'RM-102', name: 'ROYAL SUITE', type: 'Suite', price: 12500, capacity: 4, status: 'Occupied', assignedGuest: 'Alexander Wright', notes: 'Private pool, jacuzzi' },
      { id: 'RM-103', name: 'GARDEN TERRACE', type: 'Standard', price: 2800, capacity: 2, status: 'Cleaning', assignedGuest: null, notes: 'Quiet corner' },
      { id: 'RM-104', name: 'EXECUTIVE CABANA', type: 'Suite', price: 8500, capacity: 3, status: 'Available', assignedGuest: null, notes: 'Direct beach access' },
      { id: 'RM-201', name: 'OCEAN BREEZE', type: 'Deluxe', price: 4800, capacity: 2, status: 'Reserved', assignedGuest: 'Michael Scott', notes: 'Top floor, best view' },
      { id: 'RM-202', name: 'PALM GARDEN', type: 'Standard', price: 3200, capacity: 2, status: 'Occupied', assignedGuest: 'Sarah Jenkins', notes: 'Near the pool' },
      { id: 'RM-301', name: 'PRESIDENTIAL', type: 'Presidential', price: 25000, capacity: 6, status: 'Available', assignedGuest: null, notes: 'Ultimate luxury' },
    ];
  });

  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-tables');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'T-01', status: 'available', capacity: 2, orders: [], floor: 'Poolside Deck' },
      { id: 2, name: 'T-02', status: 'occupied', capacity: 4, orders: [{ name: 'Mezze Platter', price: 850, status: 'kitchen' }, { name: 'Mint Tea', price: 400, status: 'kitchen' }], time: '20m ago', total: 1250, floor: 'Main Lounge' },
      { id: 3, name: 'T-03', status: 'reserved', capacity: 6, time: '19:30', reservedBy: 'Mrs. Thompson', floor: 'Sky Rooftop' },
      { id: 4, name: 'T-04', status: 'available', capacity: 4, orders: [], floor: 'Main Lounge' },
      { id: 5, name: 'T-05', status: 'occupied', capacity: 2, orders: [{ name: 'Seafood Grill', price: 3200, status: 'kitchen' }], time: '12m ago', total: 3200, floor: 'Beach Front' },
      { id: 6, name: 'T-06', status: 'available', capacity: 8, orders: [], floor: 'VIP Area' },
      { id: 7, name: 'T-07', status: 'occupied', capacity: 4, orders: [{ name: 'Greek Salad', price: 650, status: 'kitchen' }], time: '5m ago', total: 650, floor: 'Main Lounge' },
      { id: 8, name: 'T-08', status: 'reserved', capacity: 2, time: '20:00', reservedBy: 'John Doe', floor: 'Sky Rooftop' },
    ];
  });

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-reservations');
    return saved ? JSON.parse(saved) : [
      { id: 'RES-8821', guestName: 'Alexander Wright', type: 'Room', targetId: 'ROYAL SUITE', date: '2026-05-10', time: '14:00', guests: 2, status: 'Checked In', notes: 'VIP Treatment requested' },
      { id: 'RES-8822', guestName: 'Elena Gilbert', type: 'Table', targetId: 'T-03', date: '2026-05-08', time: '19:30', guests: 4, status: 'Pending', notes: 'Birthday celebration' },
      { id: 'RES-8823', guestName: 'James Miller', type: 'Room', targetId: 'DELUXE SEAVIEW', date: '2026-05-12', time: '12:00', guests: 1, status: 'Confirmed', notes: 'Business trip' },
      { id: 'RES-8824', guestName: 'Sarah Jenkins', type: 'Room', targetId: 'PALM GARDEN', date: '2026-05-09', time: '11:00', guests: 2, status: 'Checked In', notes: 'Honeymoon' },
      { id: 'RES-8825', guestName: 'Michael Scott', type: 'Room', targetId: 'OCEAN BREEZE', date: '2026-05-15', time: '14:00', guests: 1, status: 'Confirmed', notes: 'Paper business' }
    ];
  });

  const [folios, setFolios] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-folios');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-services');
    return saved ? JSON.parse(saved) : [
      { id: 'S1', name: 'Airport Shuttle', category: 'Transport', price: 1200, icon: '✈️', description: 'Comfortable transfer to/from airport' },
      { id: 'S2', name: 'Private City Tour', category: 'Transport', price: 3500, icon: '🚗', description: '4-hour private tour of city landmarks' },
      { id: 'S3', name: 'Scuba Diving', category: 'Excursion', price: 5500, icon: '🤿', description: 'Guided diving session with equipment' },
      { id: 'S4', name: 'Sunset Cruise', category: 'Excursion', price: 2800, icon: '⛵', description: 'Evening cruise with drinks and snacks' },
      { id: 'S5', name: 'Guided Hike', category: 'Excursion', price: 1500, icon: '🥾', description: 'Morning trail hike with local guide' },
      { id: 'S6', name: 'Spa Therapy', category: 'Wellness', price: 4500, icon: '💆', description: 'Full body relaxing spa treatment' },
      { id: 'S7', name: 'Gym Personal Trainer', category: 'Wellness', price: 2000, icon: '💪', description: '1-hour personalized fitness session' }
    ];
  });

  const [serviceBookings, setServiceBookings] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-service-bookings');
    return saved ? JSON.parse(saved) : [
      { id: 'SB-101', guestName: 'Sarah Jenkins', serviceId: 'S4', date: '2026-05-11', time: '17:30', guests: 2, status: 'Pending', total: 5600 },
      { id: 'SB-102', guestName: 'Alexander Wright', serviceId: 'S1', date: '2026-05-13', time: '09:00', guests: 1, status: 'Confirmed', total: 1200 }
    ];
  });

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-activity');
    return saved ? JSON.parse(saved) : [
      { id: 1, message: 'Sarah Jenkins reservation confirmed', time: '5m ago', type: 'success' },
      { id: 2, message: 'Room LENA status updated to Reserved', time: '10m ago', type: 'info' },
      { id: 3, message: 'New inventory order for Premium Coffee', time: '1h ago', type: 'warning' },
      { id: 4, message: 'Staff Vikram Das clocked in', time: '2h ago', type: 'success' }
    ];
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-staff');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Rahul Sharma', role: 'Waiter', shift: 'Morning', status: 'Active', email: 'rahul@example.com', phone: '+00 1234567890', joined: 'Mar 2024', rating: '4.8', avatar: 'RS' },
      { id: 2, name: 'Priya Singh', role: 'Chef', shift: 'Evening', status: 'Active', email: 'priya@example.com', phone: '+00 1234567891', joined: 'Jan 2024', rating: '4.9', avatar: 'PS' },
      { id: 3, name: 'Amit Kumar', role: 'Cashier', shift: 'Morning', status: 'Inactive', email: 'amit@example.com', phone: '+00 1234567892', joined: 'Feb 2024', rating: '4.5', avatar: 'AK' },
      { id: 4, name: 'Sneha Patel', role: 'Manager', shift: 'General', status: 'Active', email: 'sneha@example.com', phone: '+00 1234567893', joined: 'Oct 2023', rating: '5.0', avatar: 'SP' },
      { id: 5, name: 'Vikram Das', role: 'Waiter', shift: 'Evening', status: 'Active', email: 'vikram@example.com', phone: '+00 1234567894', joined: 'Apr 2024', rating: '4.7', avatar: 'VD' },
      { id: 6, name: 'Anjali Gupta', role: 'Chef', shift: 'Morning', status: 'Active', email: 'anjali@example.com', phone: '+00 1234567895', joined: 'May 2024', rating: '4.6', avatar: 'AG' },
      { id: 7, name: 'Karan Mehra', role: 'Housekeeping', shift: 'Morning', status: 'Active', email: 'karan@example.com', phone: '+00 1234567896', joined: 'Jun 2024', rating: '4.4', avatar: 'KM' },
      { id: 8, name: 'Nisha Verma', role: 'Receptionist', shift: 'General', status: 'Active', email: 'nisha@example.com', phone: '+00 1234567897', joined: 'Jul 2024', rating: '4.9', avatar: 'NV' },
    ];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Clean Room BAHARI', type: 'Cleaning', priority: 'High', status: 'Pending', assignee: 'Vikram Das', target: 'BAHARI', deadline: 'Today, 2 PM', timestamp: new Date().toISOString() },
      { id: 2, title: 'Check Table T-03', type: 'Service', priority: 'Medium', status: 'In Progress', assignee: 'Rahul Sharma', target: 'T-03', deadline: 'Soon', timestamp: new Date().toISOString() },
      { id: 3, title: 'Repair AC in LENA', type: 'Maintenance', priority: 'Urgent', status: 'Pending', assignee: 'Sneha Patel', target: 'LENA', deadline: 'Emergency', timestamp: new Date().toISOString() },
      { id: 4, title: 'Restock Mini-bar RM-102', type: 'Inventory', priority: 'Low', status: 'Pending', assignee: 'Karan Mehra', target: 'RM-102', deadline: 'Today', timestamp: new Date().toISOString() },
      { id: 5, title: 'Guest Airport Pickup', type: 'Transport', priority: 'High', status: 'Pending', assignee: 'Driver Joe', target: 'Airport', deadline: '4 PM', timestamp: new Date().toISOString() }
    ];
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('resto-hospitality-inventory');
    return saved ? JSON.parse(saved) : [
      { id: 'INV-001', name: 'Premium Coffee Beans', category: 'Kitchen', stock: 45, unit: 'kg', minStock: 10, price: 850, status: 'In Stock' },
      { id: 'INV-002', name: 'Fresh Milk', category: 'Kitchen', stock: 8, unit: 'Ltrs', minStock: 15, price: 65, status: 'Low Stock' },
      { id: 'INV-003', name: 'White Wine (Chardonnay)', category: 'Bar', stock: 24, unit: 'Bottles', minStock: 12, price: 1200, status: 'In Stock' },
      { id: 'INV-004', name: 'Cotton Towels (Large)', category: 'Rooms', stock: 120, unit: 'pcs', minStock: 50, price: 450, status: 'In Stock' },
      { id: 'INV-005', name: 'Eco Shampoo 50ml', category: 'Rooms', stock: 15, unit: 'pcs', minStock: 100, price: 35, status: 'Out of Stock' },
      { id: 'INV-006', name: 'LED Light Bulbs (9W)', category: 'Maintenance', stock: 32, unit: 'pcs', minStock: 20, price: 120, status: 'In Stock' },
      { id: 'INV-007', name: 'Table Linens (White)', category: 'Restaurant', stock: 60, unit: 'pcs', minStock: 20, price: 550, status: 'In Stock' },
      { id: 'INV-008', name: 'Napkins (Disposable)', category: 'Restaurant', stock: 1200, unit: 'pcs', minStock: 500, price: 2, status: 'In Stock' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('resto-hospitality-rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-folios', JSON.stringify(folios));
  }, [folios]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-service-bookings', JSON.stringify(serviceBookings));
  }, [serviceBookings]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('resto-hospitality-activity', JSON.stringify(activityLog));
  }, [activityLog]);

  const { addNotification } = useNotifications();
  const { showToast } = useToast();

  const addActivity = (message, type = 'info') => {
    setActivityLog(prev => [{ id: Date.now(), message, time: 'Just now', type }, ...prev].slice(0, 20));
  };



  const createFolio = (guestName, roomName) => {
    const room = rooms.find(r => r.name === roomName);
    const newFolio = {
      id: `FOL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Date.now().toString().slice(-4)}`,
      guestName,
      roomName,
      status: 'Open',
      items: [
        { id: 1, description: `Room Charge (${room?.type})`, amount: room?.price || 0, date: new Date().toLocaleDateString(), type: 'Room' }
      ],
      total: room?.price || 0
    };
    setFolios(prev => [...prev, newFolio]);
    return newFolio;
  };

  const addToFolio = (guestName, charge) => {
    setFolios(prev => prev.map(f => {
      if (f.guestName === guestName && f.status === 'Open') {
        const updatedItems = [...f.items, { ...charge, id: Date.now() }];
        const updatedTotal = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
        return { ...f, items: updatedItems, total: updatedTotal };
      }
      return f;
    }));
    addActivity(`Room service charge of ₹${charge.amount} added to ${guestName}'s folio`, 'info');
  };

  const settleFolio = (folioId) => {
    setFolios(prev => prev.map(f => f.id === folioId ? { ...f, status: 'Settled' } : f));
    addActivity(`Folio ${folioId} settled`, 'success');
  };

  const syncResourceStatus = (type, targetId, status, guestName = null) => {
    if (type === 'Room') {
      setRooms(prev => prev.map(r => {
        if (r.name === targetId || r.id === targetId) {
          if (status === 'Checked In') {
            createFolio(guestName, r.name);
          }
          return { 
            ...r, 
            status: status === 'Confirmed' ? 'Reserved' : 
                    status === 'Checked In' ? 'Occupied' : 
                    status === 'Completed' || status === 'Cancelled' ? 'Available' : r.status,
            assignedGuest: status === 'Checked In' ? guestName : (status === 'Completed' || status === 'Cancelled' ? null : r.assignedGuest)
          };
        }
        return r;
      }));
    } else if (type === 'Table') {
      setTables(prev => prev.map(t => {
        if (t.name === targetId || t.id.toString() === targetId) {
          return { 
            ...t, 
            status: status === 'Confirmed' ? 'reserved' : 
                    status === 'Checked In' ? 'occupied' : 
                    status === 'Completed' || status === 'Cancelled' ? 'available' : t.status,
            reservedBy: status === 'Confirmed' ? guestName : (status === 'Completed' || status === 'Cancelled' ? null : t.reservedBy)
          };
        }
        return t;
      }));
    }
  };

  const approveReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Confirmed' } : r));
    syncResourceStatus(res.type, res.targetId, 'Confirmed', res.guestName);
    addActivity(`${res.guestName}'s reservation confirmed`, 'success');
    addNotification({
      type: 'Reservation',
      title: 'Reservation Confirmed',
      message: `${res.guestName}'s booking for ${res.targetId} is now confirmed.`,
      targetRole: 'ADMIN'
    });
    showToast(`📧 Booking confirmation email sent to ${res.email || 'guest'}!`, 'success');
  };

  const rejectReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
    addActivity(`${res.guestName}'s reservation rejected`, 'error');
  };

  const checkInReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Checked In' } : r));
    syncResourceStatus(res.type, res.targetId, 'Checked In', res.guestName);
    addActivity(`${res.guestName} checked in to ${res.targetId}`, 'success');
    addNotification({
      type: 'Check-In',
      title: 'Guest Checked In',
      message: `${res.guestName} has arrived and is now in ${res.targetId}.`,
      targetRole: 'ADMIN'
    });
  };

  const completeReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Completed' } : r));
    syncResourceStatus(res.type, res.targetId, 'Completed');
    addActivity(`${res.guestName}'s stay completed`, 'info');
    addNotification({
      type: 'Check-Out',
      title: 'Guest Stay Completed',
      message: `${res.guestName} has checked out from ${res.targetId}.`,
      targetRole: 'ADMIN'
    });
  };

  const cancelReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
    syncResourceStatus(res.type, res.targetId, 'Cancelled');
    addActivity(`${res.guestName}'s reservation cancelled`, 'error');
  };

  const addRoom = (room) => {
    setRooms(prev => [...prev, { ...room, id: `RM-${Date.now().toString().slice(-4)}` }]);
  };

  const updateRoom = (id, data) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteRoom = (id) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const addReservation = (res) => {
    const newRes = { ...res, id: `RES-${Date.now().toString().slice(-4)}` };
    setReservations(prev => [...prev, newRes]);
    addActivity(`New reservation request from ${res.guestName}`, 'info');
    showToast(`📧 Booking request received! Email sent to ${res.email || 'guest'}.`, 'success');
  };

  const updateReservation = (id, data) => {
    setReservations(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...data };
        if (data.status === 'Confirmed' && r.status !== 'Confirmed') {
          showToast(`📧 Booking confirmation email sent to ${r.email || 'guest'}!`, 'success');
        }
        return updated;
      }
      return r;
    }));
  };

  const deleteReservation = (id) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const addServiceBooking = (booking) => {
    const newBooking = { ...booking, id: `SB-${Date.now().toString().slice(-4)}`, status: 'Pending' };
    setServiceBookings(prev => [newBooking, ...prev]);
    addActivity(`New ${booking.category} booking from ${booking.guestName}`, 'info');
    addNotification({
      type: 'Service',
      title: `New ${booking.category} Request`,
      message: `${booking.guestName} booked ${booking.serviceName} for ${booking.date}.`,
      targetRole: 'ADMIN'
    });
  };

  const updateServiceBookingStatus = (id, status) => {
    setServiceBookings(prev => prev.map(b => {
      if (b.id === id) {
        if (status === 'Confirmed') {
           // Auto-post to folio if checked in
           const guestFolio = folios.find(f => f.guestName === b.guestName && f.status === 'Open');
           if (guestFolio) {
             addToFolio(b.guestName, { description: `${b.category}: ${b.serviceName}`, amount: b.total, date: new Date().toLocaleDateString(), type: 'Service' });
           }
        }
        return { ...b, status };
      }
      return b;
    }));
    addActivity(`Service booking ${id} marked as ${status}`, 'info');
  };

  const addTask = (task) => {
    const newTask = { ...task, id: Date.now(), status: 'Pending', timestamp: new Date().toISOString() };
    setTasks(prev => [newTask, ...prev]);
    addActivity(`Task assigned: ${task.title} to ${task.assignee}`, 'info');
  };

  const updateTaskStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addActivity(`Task ${id} marked as ${status}`, 'info');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addStaff = (member) => {
    setStaff(prev => [{ ...member, id: Date.now(), rating: '5.0', joined: 'Just Now' }, ...prev]);
  };

  const updateStaff = (id, data) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteStaff = (id) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  const addInventoryItem = (item) => {
    const newItem = { 
      ...item, 
      id: `INV-${Date.now().toString().slice(-3)}`, 
      status: item.stock <= 0 ? 'Out of Stock' : (item.stock < item.minStock ? 'Low Stock' : 'In Stock')
    };
    setInventory(prev => [newItem, ...prev]);
    addActivity(`New inventory item added: ${item.name}`, 'success');
  };

  const updateStock = (id, amount) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + amount);
        const newStatus = newStock <= 0 ? 'Out of Stock' : (newStock < item.minStock ? 'Low Stock' : 'In Stock');
        
        if (newStatus === 'Low Stock' && item.status !== 'Low Stock') {
          addNotification({
            type: 'Inventory',
            title: 'Low Stock Alert',
            message: `${item.name} is running low (${newStock} ${item.unit} remaining).`,
            targetRole: 'ADMIN'
          });
        }
        
        return { ...item, stock: newStock, status: newStatus };
      }
      return item;
    }));
  };

  const deleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const addCustomer = (customerData) => {
    setCustomers(prev => [{ ...customerData, id: `CUST-${Date.now()}` }, ...prev]);
    addActivity(`New customer added manually: ${customerData.name}`, 'success');
  };

  return (
    <HospitalityContext.Provider value={{
      rooms, addRoom, updateRoom, deleteRoom,
      tables, setTables,
      reservations, addReservation, updateReservation, deleteReservation,
      approveReservation, rejectReservation, checkInReservation, completeReservation, cancelReservation,
      services, setServices, serviceBookings, addServiceBooking, updateServiceBookingStatus,
      folios, addToFolio, settleFolio,
      staff, addStaff, updateStaff, deleteStaff,
      tasks, addTask, updateTaskStatus, deleteTask,
      inventory, addInventoryItem, updateStock, deleteInventoryItem,
      activityLog, addNotification,
      customers, addCustomer
    }}>
      {children}
    </HospitalityContext.Provider>
  );
};
