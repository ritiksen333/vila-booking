import React, { createContext, useContext, useState } from 'react';
import { useStorageSync } from '../hooks/useStorageSync';

const AuthContext = createContext();

export const roles = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('resto-user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Admin User',
      role: roles.ADMIN,
    };
  });

  useStorageSync('resto-user', setUser);

  const logout = () => {
    localStorage.removeItem('resto-user');
    setUser(null);
  };

  const login = (role) => {
    const newUser = { name: `${role} User`, role };
    localStorage.setItem('resto-user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
