/**
 * Authentication Context
 * 
 * MODULE 1 - USER IDENTIFICATION & AUTHENTICATION
 * 
 * This context provides authentication state and functions to the entire application.
 * It manages user login, logout, session checking, and registration.
 * 
 * State Managed:
 * - user: Current logged-in user object (null if not logged in)
 * - loading: Whether authentication check is in progress
 * - isAuthenticated: Boolean flag for authentication status
 * 
 * Functions Provided:
 * - login(username, password, role): Log in a user
 * - logout(): Log out current user
 * - register(username, password, role): Register new user
 * - checkAuth(): Check if user has valid session
 * 
 * Usage:
 * Wrap your app with <AuthProvider> in App.jsx
 * Access auth state and functions using useAuth() hook in any component
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context for authentication
const AuthContext = createContext(null);

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8000/api';  // Backend API URL
axios.defaults.withCredentials = true;  // Send cookies with requests (for session)

export const AuthProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);  // Current user object
  const [loading, setLoading] = useState(true);  // Loading state during auth check
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Auth status flag

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user has a valid session
   * Called on app load and after login
   * 
   * @returns {Object} { success: boolean, user?: object, error?: object }
   */
  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/me');
      console.log("checkAuth response:", response.data);

      if (response.data.success && response.data.user) {
        // Valid session exists
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      } else {
        // No valid session
        setUser(null);
        setIsAuthenticated(false);
        return { success: false };
      }
    } catch (error) {
      console.error("checkAuth error:", error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * MODULE 1.1: Login Authentication
   * 
   * Log in a user with username, password, and role
   * 
   * @param {String} username - User's username
   * @param {String} password - User's password
   * @param {String} role - User's role (admin or coordinator)
   * @returns {Object} { success: boolean, user?: object, message?: string }
   */
  const login = async (username, password, role) => {
    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
        role
      });

      if (response.data.success) {
        // Login successful - fetch full user data from session
        // This ensures state is updated with complete user object
        const authResult = await checkAuth();
        return authResult;
      }

      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  /**
   * MODULE 1.3: Logout Functionality
   * 
   * Log out the current user and clear session
   */
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state regardless of API response
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Register a new user (coordinator or admin request)
   * 
   * @param {String} username - Desired username
   * @param {String} password - Desired password
   * @param {String} role - Role (coordinator or admin)
   * @returns {Object} { success: boolean, message: string }
   */
  const register = async (username, password, role) => {
    try {
      const endpoint =
        role === "admin"
          ? "/auth/admin/request"  // Admin requests go to special endpoint
          : "/auth/register";       // Coordinators registered by admin

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

  // Provide auth state and functions to all child components
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

/**
 * Custom hook to access authentication context
 * 
 * Usage in any component:
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
