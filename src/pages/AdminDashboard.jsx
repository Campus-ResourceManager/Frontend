import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Settings, BarChart3, Shield, CalendarCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  // ---------------- STATES ----------------
  const [pendingBookings, setPendingBookings] = useState([]);
  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 100,
    totalAdmins: 0,
    pendingAdmins: 0,
    pendingBookings: 0,
    totalHalls: 200,
    departments: 12
  });
  const { user } = useAuth();

  const navigate = useNavigate();

  // ---------------- STATIC DATA ----------------
  const quickLinks = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage all users',
      onClick: () => navigate('/admin/user-management')
    },
    {
      icon: CalendarCheck,
      title: 'Hall Booking Approvals',
      description: 'Review booking requests',
      onClick: () => navigate('/admin/hall-booking-approvals')
    },
    {
      icon: BarChart3,
      title: 'Reports',
      description: 'View analytics & reports',
      onClick: () => console.log('Reports clicked')
    },
    {
      icon: Shield,
      title: 'Audit Logs',
      description: 'View system history',
      onClick: () => navigate('/admin/audit-logs')
    },
  ];

  const statsData = [
    { label: 'Total Coordinators', value: stats.totalStudents, path: '/admin/coordinator-list' },
    { label: 'Admin Requests', value: stats.pendingAdmins, path: '/admin/admin-management' },
    { label: 'Total Faculty', value: stats.totalFaculty, path: '/admin/faculty-list' },
    { label: 'Pending Bookings', value: stats.pendingBookings, path: '/admin/hall-booking-approvals' },
    { label: 'Classes/Halls', value: stats.totalHalls, path: '/admin/hall-list' }
  ];

  // ---------------- API CALLS ----------------

  const fetchStats = async () => {
    try {
      const res = await axios.get('/auth/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get('/bookings/pending');
      setPendingBookings(res.data || []);
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    }
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchPendingBookings();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* TITLE */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground-90 mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the administration portal</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="bg-amrita text-white cursor-pointer hover:shadow-lg transition-transform hover:scale-105"
              onClick={() => navigate(stat.path)}
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-white/80">{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow hover:border-amrita"
              onClick={link.onClick}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-amrita/10 rounded-lg">
                  <link.icon className="w-6 h-6 text-amrita" />
                </div>
                <div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;