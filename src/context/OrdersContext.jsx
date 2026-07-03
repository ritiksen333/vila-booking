import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('resto-orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      { id: '#1024', type: 'Dine-in', table: 'T-05', status: 'Ready', amount: '₹450', time: '12:45 PM', items: 3, date: 'Today', customer: 'Rahul K.', payment: 'UPI', itemsList: [{ name: 'Margherita Pizza', quantity: 2, price: 399 }, { name: 'Coke', quantity: 1, price: 49 }], timestamp: new Date(Date.now() - 3600000).toISOString(), priority: 'medium', completedItems: [] },
      { id: '#1025', type: 'Takeaway', table: '-', status: 'Cooking', amount: '₹120', time: '1:10 PM', items: 1, date: 'Today', customer: 'Guest', payment: 'Cash', itemsList: [{ name: 'Cheese Burger', quantity: 1, price: 120 }], timestamp: new Date(Date.now() - 1800000).toISOString(), priority: 'low', completedItems: [] },
      { id: '#1026', type: 'Dine-in', table: 'T-02', status: 'Pending', amount: '₹890', time: '1:15 PM', items: 5, date: 'Today', customer: 'Priya S.', payment: 'Card', itemsList: [{ name: 'Pasta', quantity: 2, price: 445 }], timestamp: new Date(Date.now() - 900000).toISOString(), priority: 'high', completedItems: [] },
      { id: '#1027', type: 'Room Service', table: 'RM-102', status: 'Cooking', amount: '₹1540', time: '1:30 PM', items: 4, date: 'Today', customer: 'Alexander Wright', payment: 'Room Folio', itemsList: [{ name: 'Club Sandwich', quantity: 2, price: 350 }, { name: 'Fresh Lime', quantity: 2, price: 80 }], timestamp: new Date(Date.now() - 600000).toISOString(), priority: 'high', completedItems: [] },
      { id: '#1028', type: 'Dine-in', table: 'T-07', status: 'Completed', amount: '₹650', time: '12:15 PM', items: 2, date: 'Today', customer: 'Michael S.', payment: 'UPI', itemsList: [{ name: 'Greek Salad', quantity: 1, price: 650 }], timestamp: new Date(Date.now() - 7200000).toISOString(), priority: 'medium', completedItems: [] },
    ];
  });

  const lastOrderIdRef = useRef(orders[0]?.id);

  useEffect(() => {
    localStorage.setItem('resto-orders', JSON.stringify(orders));
    
    // Chef Voice Alert Logic
    if (user?.role === 'CHEF' && orders.length > 0) {
      const latestOrder = orders[0];
      if (latestOrder.id !== lastOrderIdRef.current) {
        // Trigger alert only if it's not the initial mount
        if (lastOrderIdRef.current !== undefined) {
          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance("New order is coming");
            window.speechSynthesis.speak(utterance);
          }
          
          addNotification({
            type: 'Kitchen',
            title: 'New Customer Order',
            message: `Order ${latestOrder.id} received for ${latestOrder.table || 'Takeaway'}.`,
            targetRole: 'CHEF'
          });
        }
        lastOrderIdRef.current = latestOrder.id;
      }
    }
  }, [orders, user, addNotification]);

  const addOrder = (order) => {
    const orderWithId = {
      ...order,
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      priority: order.priority || 'medium',
      completedItems: []
    };
    setOrders(prev => [orderWithId, ...prev]);

    if (order.type === 'Room Service') {
      addNotification({
        type: 'Room Service',
        title: 'New Room Service Order',
        message: `Guest in ${order.table} ordered ${order.items} items.`,
        targetRole: 'WAITER'
      });
    }

    return orderWithId;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId || order.id === `#${orderId}` || order.id === orderId.toString()) {
        if (status === 'Ready' && order.status !== 'Ready') {
           addNotification({
             type: 'Kitchen',
             title: 'Order Ready for Delivery',
             message: `Order ${order.id} for ${order.table} is ready.`,
             targetRole: 'WAITER'
           });
        }
        return { ...order, status };
      }
      return order;
    }));
  };

  const updateOrderPriority = (orderId, priority) => {
    setOrders(prev => prev.map(order => 
      (order.id === orderId || order.id === `#${orderId}` || order.id === orderId.toString()) ? { ...order, priority } : order
    ));
  };

  const toggleItemComplete = (orderId, itemIndex) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId || order.id === `#${orderId}` || order.id === orderId.toString()) {
        const completed = [...(order.completedItems || [])];
        if (completed.includes(itemIndex)) {
          return { ...order, completedItems: completed.filter(i => i !== itemIndex) };
        } else {
          return { ...order, completedItems: [...completed, itemIndex] };
        }
      }
      return order;
    }));
  };

  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders(prev => prev.map(order => 
      (order.id === orderId || order.id === `#${orderId}` || order.id === orderId.toString()) ? { ...order, paymentStatus } : order
    ));
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      (order.id === orderId || order.id === `#${orderId}` || order.id === orderId.toString()) ? { ...order, status: 'Cancelled' } : order
    ));
  };

  const resetOrders = (newOrders) => {
    if (newOrders) {
      setOrders(newOrders);
    } else {
      localStorage.removeItem('resto-orders');
      window.location.reload();
    }
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus, 
      updateOrderPriority,
      toggleItemComplete,
      updatePaymentStatus, 
      cancelOrder,
      resetOrders 
    }}>
      {children}
    </OrdersContext.Provider>
  );
};
