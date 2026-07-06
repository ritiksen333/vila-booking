import { useEffect } from 'react';

/**
 * A custom hook to synchronize React state with localStorage across multiple browser tabs.
 * 
 * @param {string} key - The localStorage key to listen to.
 * @param {function} setState - The React state setter function to update the local state.
 */
export const useStorageSync = (key, setState) => {
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (err) {
          console.error(`Failed to parse storage value for key: ${key}`, err);
        }
      } else if (e.key === key && !e.newValue) {
        // Handle deletion if necessary
        // setState(null); 
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, setState]);
};
