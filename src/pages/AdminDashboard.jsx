import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Users, Settings, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  // ---------------- STATES ----------------
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [activeAdmins, setActiveAdmins] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const { user } = useAuth();
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');

  // ---------------- STATIC DATA ----------------
  const quickLinks = [
    { icon: Users, title: 'User Management', description: 'Manage all users' },
    { icon: Settings, title: 'System Settings', description: 'Configure portal settings' },
    { icon: BarChart3, title: 'Reports', description: 'View analytics & reports' },
    { icon: Shield, title: 'Access Control', description: 'Manage permissions' },
  ];

  const stats = [
    { label: 'Total Students', value: '32' },
    { label: 'Total Faculty', value: '100' },
    { label: 'Departments', value: '12' },
    { label: 'Classes/Halls', value: '200' }
  ];

  // ---------------- API CALLS ----------------
  const fetchPendingAdmins = async () => {
    const res = await axios.get('/auth/admin/pending');
    setPendingAdmins(res.data);
  };

  const fetchActiveAdmins = async () => {
    const res = await axios.get('/auth/admin/active');
    setActiveAdmins(res.data);
  };

  const fetchCoordinators = async () => {
    const res = await axios.get('/auth/coordinators');
    setCoordinators(res.data);
  };

  const approveAdmin = async (id) => {
    await axios.patch(`/auth/admin/${id}/approve`);
    fetchPendingAdmins();
    fetchActiveAdmins();
  };

  const removeAdmin = async (id) => {
    await axios.delete(`/auth/admin/${id}/remove`);
    fetchActiveAdmins();
  };

  const addCoordinator = async () => {
    if (!newStudentUsername || !newStudentPassword) return;

    await axios.post('/auth/register', {
      username: newStudentUsername,
      password: newStudentPassword,
      role: 'coordinator'
    });

    setNewStudentUsername('');
    setNewStudentPassword('');
    fetchCoordinators();
  };

  const deleteCoordinator = async (id) => {
    await axios.delete(`/auth/coordinator/${id}`);
    fetchCoordinators();
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchPendingAdmins();
    fetchActiveAdmins();
    fetchCoordinators();
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

        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-amrita">
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

        {/* USER MANAGEMENT */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>

          <CardContent>
            {/* ADMIN REQUESTS */}
            <h3 className="text-lg font-semibold mb-2">Admin Request Approvals</h3>

            {pendingAdmins.length === 0 && (
              <p className="text-muted-foreground text-sm mb-4">
                No pending admin requests
              </p>
            )}

            {pendingAdmins.map(admin => (
              <div key={admin._id} className="flex justify-between items-center p-3 border rounded mb-2">
                <span>{admin.username}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approveAdmin(admin._id)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => removeAdmin(admin._id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {/* ACTIVE ADMINS */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Active Admins</h3>

            {activeAdmins.length === 0 && (
              <p className="text-muted-foreground text-sm mb-4">
                No active admins
              </p>
            )}

        {activeAdmins.map(admin => (
          <div
            key={admin._id}
            className="flex justify-between items-center p-3 border rounded mb-2"
          >
            <span>{admin.username}</span>

            {admin._id !== user.userId && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeAdmin(admin._id)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}


            {/* COORDINATOR MANAGEMENT */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Student Coordinator Management</h3>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Username"
                value={newStudentUsername}
                onChange={(e) => setNewStudentUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={newStudentPassword}
                onChange={(e) => setNewStudentPassword(e.target.value)}
              />
              <Button onClick={addCoordinator}>Add</Button>
            </div>

            {coordinators.map(user => (
              <div key={user._id} className="flex justify-between items-center p-3 border rounded mb-2">
                <span>{user.username}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteCoordinator(user._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
