/**
 * Header Component
 * 
 * MODULE 1.3 - LOGOUT FUNCTIONALITY
 * 
 * This component displays the application header with:
 * - Application title/branding
 * - Welcome message with current user's name
 * - Logout button
 * 
 * The header is shown on all authenticated pages (dashboards, booking pages, etc.)
 * It provides a consistent way for users to log out from any page.
 * 
 * Features:
 * - Displays current user's username
 * - Logout button with icon
 * - Toast notification on successful logout
 * - Redirects to login page after logout
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  // Get user data and logout function from auth context
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout button click
   * 
   * Process:
   * 1. Call logout() to destroy session
   * 2. Show success toast notification
   * 3. Redirect to login page
   */
  const handleLogout = async () => {
    await logout();  // Destroy session on backend
    toast.success("Logged out successfully");  // Show notification
    navigate('/login');  // Redirect to login page
  };

  return (
    <header className="bg-amrita text-amrita-foreground shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Application branding */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-wide">AMRITA PORTAL</h1>
        </div>

        {/* User info and logout button */}
        <div className="flex items-center gap-6">
          {/* Welcome message with username */}
          <span className="text-lg">
            Welcome, <span className="font-semibold">{user?.username || 'User'}!</span>
          </span>

          {/* Logout button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
