import React from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Settings, BarChart3, Shield } from 'lucide-react';

const AdminDashboard = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground-90 mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the administration portal</p>
        </div>

        {/* Stats */}
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

        <Card className="bg-gradient-to-br from-amrita/5 to-amrita/10">
          <CardHeader>
            <CardTitle className="text-amrita">Recent Activity</CardTitle>
          </CardHeader>

          <CardContent>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                <div>
                  <h4 className="font-semibold text-foreground-90">New Faculty Registration</h4>
                  <p className="text-muted-foreground text-sm">Dr.T.Kumar joined CSE Department</p>
                </div>
                <span className="text-muted-foreground text-sm">2 hours ago</span>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
