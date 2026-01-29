import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import NewBooking from './pages/NewBooking';
import MyBookings from './pages/MyBookings';
import HallAvailability from './pages/HallAvailability';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/coordinator-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <CoordinatorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-booking" 
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <NewBooking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hall-availability" 
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <HallAvailability />
              </ProtectedRoute>
            } 
          />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
