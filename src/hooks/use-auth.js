
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  useEffect(() => {
    console.log('useAuth: Checking authentication...');
    
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      console.log('useAuth: Found in localStorage:', storedUser);
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('useAuth: Setting user:', parsedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('useAuth: Error parsing user:', e);
          setUser(null);
        }
      } else {
        console.log('useAuth: No user in localStorage');
        setUser(null);
      }
      setIsLoading(false);
    };
    
    const timer = setTimeout(checkAuth, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log('useAuth: Storage changed, checking auth...');
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials) => {
    console.log('useAuth: Login called with:', credentials);
    setIsLoggingIn(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@amrita.edu`,
        name: credentials.username.toUpperCase(),
        role: 'student'
      };
      
      console.log('useAuth: Setting user to localStorage:', mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      console.log('useAuth: Updating state with user:', mockUser);
      setUser(mockUser);
      
      return mockUser;
    } catch (error) {
      console.error('useAuth: Login error:', error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    console.log('useAuth: Logout called');
    setIsLoggingOut(true);
    
    try {

      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('useAuth: Removing user from localStorage');
      localStorage.removeItem('user');
      
      console.log('useAuth: Setting user to null');
      setUser(null);
    } catch (error) {
      console.error('useAuth: Logout error:', error);
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    user,
    isLoading,
    login,
    isLoggingIn,
    logout,
    isLoggingOut,
  };
}