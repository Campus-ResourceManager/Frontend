import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText } from "lucide-react";

const MyBookings = () => {
  const navigate = useNavigate();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/bookings/my");
      setMyBookings(res.data || []);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const statusBadgeClass = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700 border-green-300";
    if (status === "rejected") return "bg-red-100 text-red-700 border-red-300";
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const groupedBookings = {
    pending: myBookings.filter((b) => b.status === "pending"),
    approved: myBookings.filter((b) => b.status === "approved"),
    rejected: myBookings.filter((b) => b.status === "rejected")
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/coordinator-dashboard")}
            className="mb-4 bg-amrita flex items-center gap-1 hover:bg-amrita/95"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold text-foreground-90 mb-2">
            My Booking Requests
          </h2>
          <p className="text-muted-foreground">
            Track all your booking requests and their approval status
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : myBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No booking requests yet.
              </p>
              <Button
                onClick={() => navigate("/new-booking")}
                className="mt-4 bg-amrita"
              >
                Create New Booking Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Pending Bookings */}
            {groupedBookings.pending.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-800">
                  Pending ({groupedBookings.pending.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedBookings.pending.map((booking) => (
                    <Card key={booking._id} className="border-yellow-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {booking.eventTitle}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {booking.facultyName}
                              {booking.facultyDepartment
                                ? `, ${booking.facultyDepartment}`
                                : ""}
                            </CardDescription>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeClass(
                              booking.status
                            )}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Hall:</span>
                          <span>{booking.hall}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDate(booking.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formatTime(booking.startTime)} -{" "}
                            {formatTime(booking.endTime)}
                          </span>
                        </div>
                        {booking.eventDescription && (
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">
                              {booking.eventDescription}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Bookings */}
            {groupedBookings.approved.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-800">
                  Approved ({groupedBookings.approved.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedBookings.approved.map((booking) => (
                    <Card key={booking._id} className="border-green-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {booking.eventTitle}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {booking.facultyName}
                              {booking.facultyDepartment
                                ? `, ${booking.facultyDepartment}`
                                : ""}
                            </CardDescription>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeClass(
                              booking.status
                            )}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Hall:</span>
                          <span>{booking.hall}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDate(booking.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formatTime(booking.startTime)} -{" "}
                            {formatTime(booking.endTime)}
                          </span>
                        </div>
                        {booking.eventDescription && (
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">
                              {booking.eventDescription}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Bookings */}
            {groupedBookings.rejected.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-800">
                  Rejected ({groupedBookings.rejected.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedBookings.rejected.map((booking) => (
                    <Card key={booking._id} className="border-red-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {booking.eventTitle}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {booking.facultyName}
                              {booking.facultyDepartment
                                ? `, ${booking.facultyDepartment}`
                                : ""}
                            </CardDescription>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeClass(
                              booking.status
                            )}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Hall:</span>
                          <span>{booking.hall}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDate(booking.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formatTime(booking.startTime)} -{" "}
                            {formatTime(booking.endTime)}
                          </span>
                        </div>
                        {booking.rejectionReason && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm font-medium text-red-800 mb-1">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-red-700">
                              {booking.rejectionReason}
                            </p>
                          </div>
                        )}
                        {booking.eventDescription && (
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">
                              {booking.eventDescription}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
