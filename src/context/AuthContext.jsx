  import React, { createContext, useContext, useState, useEffect } from 'react';
  import axios from 'axios';

  const AuthContext = createContext(null);

  axios.defaults.baseURL = 'http://localhost:8000/api';
  axios.defaults.withCredentials = true;

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
      checkAuth();
    }, []);

    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/me');
        console.log("checkAuth response:", response.data);

        if (response.data && response.data.role) {
          setUser(response.data);
          setIsAuthenticated(true); 
        } else {
          setUser(null);
          setIsAuthenticated(false); 
        }
      } catch (error) {
        console.error("checkAuth error:", error);
        setUser(null);
        setIsAuthenticated(false); 
      } finally {
        setLoading(false);
      }
    };

    const login = async (username, password, role) => {
    try {
      console.log("Login attempt:", { username, role });
      console.log("LOGIN API PAYLOAD:", { username, password, role });

    const response = await axios.post('/auth/login', {
      username,
      password,
      role
    });

      console.log("Login response:", response.data);

      if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          return { success: true, user: response.data.user };
      }


      return { 
        success: false, 
        message: response.data.message 
      };
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

    const logout = async () => {
      try {
        await axios.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setUser(null);
        setIsAuthenticated(false); 
      }
    };

    const register = async (username, password, role) => {
      try {
        const endpoint =
          role === "admin"
            ? "/auth/admin/request"   // public admin request
            : "/auth/register";       // admin-only (coordinator)

        const response = await axios.post(endpoint, {
          username,
          password,
          role
        });

        return {
          success: true,
          message: response.data.message
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || "Registration failed"
        };
      }
    };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated, 
        login,
        logout,
        register,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };