import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'; 
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Users, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [activeAdmins, setActiveAdmins] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [pendingRes, activeRes, coordinatorsRes] = await Promise.all([
        axios.get('/auth/admin/pending'),
        axios.get('/auth/admin/active'),
        axios.get('/auth/coordinators')
      ]);
      
      setPendingAdmins(pendingRes.data);
      setActiveAdmins(activeRes.data);
      setCoordinators(coordinatorsRes.data);
    } catch (error) {
      setMessage('Failed to fetch user data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const approveAdmin = async (id) => {
    try {
      await axios.patch(`/auth/admin/${id}/approve`);
      fetchAllData();
      setMessage('Admin approved successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to approve admin');
      setMessageType('error');
    }
  };

  const removeAdmin = async (id) => {
    try {
      await axios.delete(`/auth/admin/${id}/remove`);
      fetchAllData();
      setMessage('Admin removed successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to remove admin');
      setMessageType('error');
    }
  };

  const addCoordinator = async () => {
    if (!newStudentUsername || !newStudentPassword) {
      setMessage('Please enter both username and password');
      setMessageType('error');
      return;
    }

    try {
      await axios.post('/auth/register', {
        username: newStudentUsername,
        password: newStudentPassword,
        role: 'coordinator'
      });

      setNewStudentUsername('');
      setNewStudentPassword('');
      fetchAllData();
      setMessage('Coordinator added successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add coordinator');
      setMessageType('error');
    }
  };

  const deleteCoordinator = async (id) => {
    try {
      await axios.delete(`/auth/coordinator/${id}`);
      fetchAllData();
      setMessage('Coordinator deleted successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete coordinator');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin-dashboard")}
            className="mb-4 bg-amrita text-white flex items-center gap-1 hover:bg-amrita/95"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground-90">User Management</h1>
            <p className="text-muted-foreground">Manage administrators and coordinators</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 rounded-md border px-4 py-3 ${
              messageType === "success"
                ? "border-green-300 bg-green-50 text-green-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Admin Management */}
          <div className="space-y-8">
            {/* Pending Admin Requests */}
            <Card>
              <CardHeader className="bg-amrita/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Admin Request Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {pendingAdmins.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No pending admin requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingAdmins.map(admin => (
                      <div key={admin._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{admin.username}</div>
                          <div className="text-sm text-muted-foreground">Pending approval</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => approveAdmin(admin._id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeAdmin(admin._id)}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Admins */}
            <Card>
              <CardHeader className="bg-amrita/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Active Administrators
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {activeAdmins.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No active administrators</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeAdmins.map(admin => (
                      <div key={admin._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{admin.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {admin._id === user.userId ? "(Current User)" : "Administrator"}
                          </div>
                        </div>
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Coordinator Management */}
          <div>
            <Card>
              <CardHeader className="bg-amrita/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Student Coordinators
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {coordinators.length} coordinator{coordinators.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Add Coordinator Form */}
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-3">Add New Coordinator</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Username"
                        value={newStudentUsername}
                        onChange={(e) => setNewStudentUsername(e.target.value)}
                        className="w-full"
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={newStudentPassword}
                        onChange={(e) => setNewStudentPassword(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button 
                      onClick={addCoordinator} 
                      className="w-full bg-amrita hover:bg-amrita/90"
                    >
                      Add Coordinator
                    </Button>
                  </div>
                </div>

                {/* Coordinators List */}
                {coordinators.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No coordinators added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {coordinators.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">Student Coordinator</div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCoordinator(user._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;