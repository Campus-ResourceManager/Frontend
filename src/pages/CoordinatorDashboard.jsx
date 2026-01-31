import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BookOpen, Calendar, PlusCircle, Clock } from "lucide-react";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();

 const quickLinks = [
  {
    icon: BookOpen,
    title: "Class / Hall Availability",
    description: "Check and request halls for events",
    path: "/hall-availability"
  },
  {
    icon: PlusCircle,
    title: "New Hall Booking Request",
    description: "Create a new booking request for halls",
    path: "/new-booking"
  },
  {
    icon: Calendar,
    title: "My Booking Requests",
    description: "Track approval and allocation status",
    path: "/my-bookings"
  }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground-90 mb-2">
            Student Coordinator Dashboard
          </h2>
          <p className="text-muted-foreground">
            Request halls and track booking approvals
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              onClick={() => navigate(link.path)}
              className={`hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-amrita ${link.color || ""}`}
            >
              <CardHeader className={`flex flex-row items-center gap-4 ${link.textColor || ""}`}>
                <div className={`p-3 rounded-lg ${link.color ? "bg-white/20" : "bg-amrita/10"}`}>
                  <link.icon className={`w-6 h-6 ${link.textColor ? "text-white" : "text-amrita"}`} />
                </div>
                
                <div className="flex-1">
                  <CardTitle className={`text-lg ${link.textColor || ""}`}>
                    {link.title}
                  </CardTitle>
                  <CardDescription className={link.textColor ? "text-white/80" : ""}>
                    {link.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Stats / Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Clock className="w-5 h-5" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Check hall availability before submitting a request</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Provide complete faculty and event details for faster approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Track your booking status in "My Booking Requests"</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Calendar className="w-5 h-5" />
                Booking Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-green-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span>Fill out the booking request form</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span>System checks availability automatically</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span>Admin reviews and approves/rejects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span>Receive confirmation notification</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorDashboard;

