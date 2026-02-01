import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Settings, BarChart3, Shield } from 'lucide-react';
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
      icon: Settings, 
      title: 'System Settings', 
      description: 'Configure portal settings',
      onClick: () => console.log('System Settings clicked') // Add onClick
    },
    { 
      icon: BarChart3, 
      title: 'Reports', 
      description: 'View analytics & reports',
      onClick: () => console.log('Reports clicked') // Add onClick
    },
    { 
      icon: Shield, 
      title: 'Access Control', 
      description: 'Manage permissions',
      onClick: () => console.log('Access Control clicked') // Add onClick
    },
  ];

  const stats = [
    { label: 'Total Students', value: '32' },
    { label: 'Total Faculty', value: '100' },
    { label: 'Departments', value: '12' },
    { label: 'Classes/Halls', value: '200' }
  ];

  // ---------------- API CALLS ----------------

  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get('/bookings/pending');
      setPendingBookings(res.data || []);
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    }
  };

  const approveBooking = async (id) => {
    setProcessingBookingId(id);
    setMessage('');
    try {
      const res = await axios.patch(`/bookings/${id}/approve`);
      setMessage(res.data.message || 'Booking approved successfully');
      setMessageType('success');
      fetchPendingBookings();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to approve booking';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setProcessingBookingId(null);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const rejectBooking = async (id, reason = '') => {
    setProcessingBookingId(id);
    setMessage('');
    try {
      const res = await axios.patch(`/bookings/${id}/reject`, { reason });
      setMessage(res.data.message || 'Booking rejected');
      setMessageType('success');
      setShowRejectModal(null);
      setRejectReason('');
      fetchPendingBookings();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to reject booking';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setProcessingBookingId(null);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const handleRejectClick = (id) => {
    setShowRejectModal(id);
    setRejectReason('');
  };

  const handleRejectConfirm = () => {
    if (showRejectModal) {
      rejectBooking(showRejectModal, rejectReason);
    }
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchPendingBookings();
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-amrita text-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/80">{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* QUICK LINKS - ADD onClick TO THE CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-amrita"
              onClick={link.onClick} // Add onClick here
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

        
        {/* BOOKING APPROVALS */}
        <Card>
          <CardHeader>
            <CardTitle>Hall Booking Approvals</CardTitle>
            <CardDescription>
              Review and approve or reject booking requests from student coordinators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div
                className={`mb-4 rounded-md border px-3 py-2 text-sm ${
                  messageType === "success"
                    ? "border-green-300 bg-green-50 text-green-800"
                    : "border-red-300 bg-red-50 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            {pendingBookings.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No pending booking requests.
              </p>
            )}

            {pendingBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded mb-3 gap-3 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="font-semibold text-base">
                    {booking.eventTitle} - {booking.hall}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Date & Time:</span>{" "}
                    {new Date(booking.startTime).toLocaleDateString()}{" "}
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}{" "}
                    -{" "}
                    {new Date(booking.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Faculty:</span> {booking.facultyName}
                    {booking.facultyDepartment
                      ? `, ${booking.facultyDepartment}`
                      : ""}{" "}
                    {booking.facultyEmail ? `(${booking.facultyEmail})` : ""}
                  </div>
                  {booking.eventDescription && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Description:</span>{" "}
                      {booking.eventDescription}
                    </div>
                  )}
                  {booking.coordinator?.username && (
                    <div className="text-xs text-muted-foreground italic">
                      Requested by: {booking.coordinator.username}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <Button
                    size="sm"
                    onClick={() => approveBooking(booking._id)}
                    disabled={processingBookingId === booking._id}
                    className="w-full"
                  >
                    {processingBookingId === booking._id ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejectClick(booking._id)}
                    disabled={processingBookingId === booking._id}
                    className="w-full"
                  >
                    Reject
                  </Button>
                </div>

                {/* Reject Modal */}
                {showRejectModal === booking._id && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Reject Booking Request
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Are you sure you want to reject this booking request?
                        Optionally provide a reason for rejection.
                      </p>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Rejection Reason (Optional)
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={3}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amrita"
                          placeholder="e.g., Hall already booked, insufficient capacity, etc."
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowRejectModal(null);
                            setRejectReason("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleRejectConfirm}
                        >
                          Confirm Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;