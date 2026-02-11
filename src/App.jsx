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
import UserManagement from './pages/UserManagement';
import HallBookingApprovals from './pages/HallBookingApprovals';
import AuditLogs from './pages/AuditLogs';
import FacultyList from './pages/FacultyList';
import HallList from './pages/HallList';
import CoordinatorList from './pages/CoordinatorList';
import AdminManagement from './pages/AdminManagement';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-right" duration={2000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hall-booking-approvals"
            element={
              <ProtectedRoute requiredRole="admin">
                <HallBookingApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute requiredRole="admin">
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faculty-list"
            element={
              <ProtectedRoute requiredRole="admin">
                <FacultyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coordinator-list"
            element={
              <ProtectedRoute requiredRole="admin">
                <CoordinatorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hall-list"
            element={
              <ProtectedRoute requiredRole="admin">
                <HallList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admin-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminManagement />
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