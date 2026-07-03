import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

const CommunicationContext = createContext();

export const useCommunication = () => useContext(CommunicationContext);

export const CommunicationProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('resto-communication-messages');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        guestName: 'Sarah Jenkins', 
        guestId: 'CUST-001', 
        content: 'Hi, can I get extra towels in room LENA?', 
        sender: 'Guest', 
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read'
      },
      { 
        id: 2, 
        guestName: 'Sarah Jenkins', 
        guestId: 'CUST-001', 
        content: 'Sure, our staff will deliver them shortly.', 
        sender: 'Staff', 
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: 'delivered'
      },
      { 
        id: 3, 
        guestName: 'John Doe', 
        guestId: 'CUST-002', 
        content: 'What are the gym timings today?', 
        sender: 'Guest', 
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'read'
      },
      { 
        id: 4, 
        guestName: 'Michael Scott', 
        guestId: 'CUST-003', 
        content: 'I need a wake up call at 6:00 AM.', 
        sender: 'Guest', 
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'sent'
      }
    ];
  });

  const [activeChats, setActiveChats] = useState(() => {
    const saved = localStorage.getItem('resto-communication-chats');
    return saved ? JSON.parse(saved) : [
      { guestId: 'CUST-001', guestName: 'Sarah Jenkins', lastMessage: 'Sure, our staff will deliver them shortly.', lastTimestamp: new Date(Date.now() - 3500000).toISOString(), unreadCount: 0 },
      { guestId: 'CUST-002', guestName: 'John Doe', lastMessage: 'What are the gym timings today?', lastTimestamp: new Date(Date.now() - 7200000).toISOString(), unreadCount: 0 },
      { guestId: 'CUST-003', guestName: 'Michael Scott', lastMessage: 'I need a wake up call at 6:00 AM.', lastTimestamp: new Date(Date.now() - 1800000).toISOString(), unreadCount: 1 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('resto-communication-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('resto-communication-chats', JSON.stringify(activeChats));
  }, [activeChats]);

  const sendMessage = (guestId, guestName, content, sender = 'Guest') => {
    const newMessage = {
      id: Date.now(),
      guestId,
      guestName,
      content,
      sender,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);

    if (sender === 'Guest') {
      addNotification({
        type: 'Message',
        title: 'New Guest Message',
        message: `${guestName}: "${content.slice(0, 30)}${content.length > 30 ? '...' : ''}"`,
        targetRole: 'WAITER'
      });
    }

    // Update active chats summary
    setActiveChats(prev => {
      const existingChatIndex = prev.findIndex(c => c.guestId === guestId);
      if (existingChatIndex > -1) {
        const updatedChats = [...prev];
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          lastMessage: content,
          lastTimestamp: newMessage.timestamp,
          unreadCount: sender === 'Guest' ? updatedChats[existingChatIndex].unreadCount + 1 : 0
        };
        // Move to top
        const chat = updatedChats.splice(existingChatIndex, 1)[0];
        return [chat, ...updatedChats];
      } else {
        return [{
          guestId,
          guestName,
          lastMessage: content,
          lastTimestamp: newMessage.timestamp,
          unreadCount: sender === 'Guest' ? 1 : 0
        }, ...prev];
      }
    });
  };

  const markAsRead = (guestId) => {
    setActiveChats(prev => prev.map(c => 
      c.guestId === guestId ? { ...c, unreadCount: 0 } : c
    ));
  };

  return (
    <CommunicationContext.Provider value={{
      messages,
      activeChats,
      sendMessage,
      markAsRead
    }}>
      {children}
    </CommunicationContext.Provider>
  );
};
