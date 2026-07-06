import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStorageSync } from '../hooks/useStorageSync';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('resto-notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: 'Reservation',
        title: 'VIP Reservation',
        message: 'Alexander Wright requested ROYAL SUITE for May 10.',
        targetRole: 'Admin',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: 2,
        type: 'Message',
        title: 'Priority Request',
        message: 'Elena Gilbert: "Need late checkout for Room 102."',
        targetRole: 'Manager',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true
      },
      {
        id: 3,
        type: 'Inventory',
        title: 'Stock Alert',
        message: 'Seafood Grill is running low in stock (Kitchen).',
        targetRole: 'Chef',
        timestamp: new Date(Date.now() - 10000000).toISOString(),
        read: false
      },
      {
        id: 4,
        type: 'System',
        title: 'Payroll Processed',
        message: 'Monthly payroll for staff has been finalized.',
        targetRole: 'Admin',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true
      },
      {
        id: 5,
        type: 'Service',
        title: 'New Service Booking',
        message: 'Sarah Jenkins booked a "Sunset Cruise" for tomorrow.',
        targetRole: 'Waiter',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false
      }
    ];
  });

  useStorageSync('resto-notifications', setNotifications);

  useEffect(() => {
    localStorage.setItem('resto-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    
    // Play sound or show toast here if needed
    if (window.Notification && Notification.permission === 'granted') {
       // Browser notification
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = (role) => {
    setNotifications(prev => prev.map(n => n.targetRole === role ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getUnreadCount = (role) => {
    return notifications.filter(n => !n.read && (n.targetRole === role || n.targetRole === 'ALL')).length;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      getUnreadCount,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
