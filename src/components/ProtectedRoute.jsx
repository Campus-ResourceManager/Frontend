/**
 * Protected Route Component
 * 
 * MODULE 1.2 - ROLE VERIFICATION
 * 
 * This component protects routes from unauthorized access.
 * It ensures that:
 * 1. User is logged in (authenticated)
 * 2. User has the required role (authorized)
 * 
 * How it works:
 * - Wraps protected pages in the routing configuration
 * - Checks authentication status and user role
 * - Redirects to login if not authenticated
 * - Redirects to access-denied if wrong role
 * - Renders the protected page if all checks pass
 * 
 * Usage in App.jsx:
 * <Route path="/admin-dashboard" element={
 *   <ProtectedRoute allowedRoles={["admin"]}>
 *     <AdminDashboard />
 *   </ProtectedRoute>
 * } />
 */

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get authentication state from context
  const { user, loading, isAuthenticated } = useAuth();
  const [pendingAdmins, setPendingAdmins] = useState([]);

  // Log current state for debugging
  console.log("State:", {
    user: JSON.stringify(user),
    isAuthenticated,
    loading,
    allowedRoles
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log("Loading...");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amrita border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  // If not, redirect to login page
  if (!isAuthenticated || !user) {
    console.log("Invalid Credentials");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated:", user.role);

  // Check if user has required role
  // If allowedRoles is specified and user's role is not in the list,
  // redirect to access-denied page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("invalid credentials - Wrong role:", user.role);
    return <Navigate to="/access-denied" replace />;
  }

  // All checks passed - render the protected page
  console.log("Access granted!");
  return children;
};

export default ProtectedRoute;