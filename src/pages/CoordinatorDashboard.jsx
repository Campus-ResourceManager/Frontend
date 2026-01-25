import React from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Calendar, ClipboardList, GraduationCap } from 'lucide-react';

const StudentDashboard = () => {
  const quickLinks = [
    { icon: BookOpen, title: 'Class Availability', description: 'View available classes' },
    { icon: Calendar, title: 'Timetable', description: 'Check class schedule' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Dashboard */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground-90 mb-2">Student Dashboard</h2>
          <p className="text-muted-foreground">Welcome to your student portal</p>
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

         {/* Announcements */}
        <Card className="bg-gradient-to-br from-amrita/5 to-amrita/10">
          <CardHeader>
            <CardTitle className="text-amrita">Announcements</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-semibold text-foreground-90">Class Alloted</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Class A-205 is alloted as per your request. Please check it.
                </p>
              </div>
    
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
