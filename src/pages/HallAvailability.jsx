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
import { Input } from "../components/ui/input";
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle2, XCircle } from "lucide-react";

const HallAvailability = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [halls, setHalls] = useState([]);

  // Get today's date in YYYY-MM-DD format
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const fetchHalls = async () => {
    try {
      const res = await axios.get("/halls");
      setHalls(res.data || []);
    } catch (error) {
      console.error("Failed to load halls", error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/bookings/availability");
      setAllBookings(res.data || []);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Filter bookings for selected date
  const getBookingsForDate = (date) => {
    if (!date) return [];
    const selectedDateObj = new Date(date);
    selectedDateObj.setHours(0, 0, 0, 0);
    const now = new Date();
    
    return allBookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime);
      bookingDate.setHours(0, 0, 0, 0);
      const bookingEnd = new Date(booking.endTime);
      
      // Only show bookings that match the date, are approved/pending, and haven't completely passed
      return (
        bookingDate.getTime() === selectedDateObj.getTime() &&
        (booking.status === "approved" || booking.status === "pending") &&
        bookingEnd >= now // Only show if end time hasn't passed
      );
    });
  };

  // Check if a hall is available for a specific time slot
  // Returns: true if available, false if not available, "past" if time slot is in the past
  const isHallAvailable = (hall, date, startTime, endTime) => {
    if (!date || !startTime || !endTime) return true;
    
    const requestedStart = new Date(`${date}T${startTime}`);
    const requestedEnd = new Date(`${date}T${endTime}`);
    const now = new Date();
    
    // Check if both start and end times are before the current time
    if (requestedStart < now && requestedEnd < now) {
      return "past"; // Time slot is completely in the past
    }
    
    const conflictingBookings = allBookings.filter((booking) => {
      if (booking.hall !== hall) return false;
      if (booking.status === "rejected") return false;
      
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      // Check for overlap
      return (
        bookingStart < requestedEnd && bookingEnd > requestedStart
      );
    });
    
    return conflictingBookings.length === 0;
  };

  const bookingsForDate = getBookingsForDate(selectedDate);

  // Group bookings by hall code (halls from DB have .code)
  const hallCodes = halls.map((h) => (typeof h === "object" && h.code ? h.code : h));
  const bookingsByHall = hallCodes.reduce((acc, code) => {
    acc[code] = bookingsForDate.filter((b) => b.hall === code);
    return acc;
  }, {});

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
            Hall / Class Availability
          </h2>
          <p className="text-muted-foreground">
            Check hall availability and view existing bookings
          </p>
        </div>

 {/* Quick Availability Check */}
            <Card className="bg-gradient-to-br from-amrita/5 to-amrita/10">
              <CardHeader>
                <CardTitle className="text-amrita">
                  Quick Availability Check
                </CardTitle>
                <CardDescription>
                  Check if a specific hall is available for your desired time
                  slot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hall
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., A-205"
                      id="check-hall"
                      className="mb-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      id="check-date"
                      defaultValue={selectedDate}
                      className="mb-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Time
                    </label>
                    <Input type="time" id="check-start" className="mb-2 text-gray-900 dark:text-gray-100 bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Time
                    </label>
                    <Input type="time" id="check-end" className="mb-2 text-gray-900 dark:text-gray-100 bg-background" />
                  </div>
                </div>
                <Button
                  className="mt-4 bg-amrita hover:bg-amrita/95"
                  onClick={() => {
                    const hall = document.getElementById("check-hall").value;
                    const date = document.getElementById("check-date").value;
                    const startTime = document.getElementById("check-start").value;
                    const endTime = document.getElementById("check-end").value;

                    if (!hall || !date || !startTime || !endTime) {
                      alert("Please fill all fields");
                      return;
                    }

                    const available = isHallAvailable(
                      hall,
                      date,
                      startTime,
                      endTime
                    );

                    if (available === "past") {
                      alert(
                        `The requested time slot (${date} from ${startTime} to ${endTime}) has already passed. Please select a future time slot.`
                      );
                    } else if (available) {
                      alert(
                        `${hall} is available for ${date} from ${startTime} to ${endTime}`
                      );
                    } else {
                      alert(
                        `${hall} is NOT available for ${date} from ${startTime} to ${endTime}. Please select a different time slot.`
                      );
                    }
                  }}
                >
                  Check Availability
                </Button>
              </CardContent>
            </Card>
            <br></br>
        {/* Date Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>
              Choose a date to view hall availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading availability...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {hallCodes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No halls found in the system. Run the hall seed script on the backend.
                  </p>
                </CardContent>
              </Card>
            ) : (
              hallCodes.map((code) => {
                const hallBookings = bookingsByHall[code] || [];
                const isAvailable = hallBookings.length === 0;
                const hallRecord = halls.find((h) => h && h.code === code);
                const capacity = hallRecord && hallRecord.capacity != null ? hallRecord.capacity : null;

                return (
                  <Card key={code} className={isAvailable ? "border-green-300" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amrita" />
                          <CardTitle className="text-xl">{code}{capacity != null ? ` (Capacity: ${capacity})` : ""}</CardTitle>
                        </div>
                        {isAvailable ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Available</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-700">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">
                              {hallBookings.length} Booking
                              {hallBookings.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isAvailable ? (
                        <p className="text-muted-foreground">
                          This hall is available for the selected date. You can
                          proceed to create a booking request.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {hallBookings.map((booking) => (
                            <div
                              key={booking._id}
                              className="p-3 bg-muted/50 rounded-lg border space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-medium">
                                  {booking.eventTitle}
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    booking.status === "approved"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {booking.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {formatTime(booking.startTime)} -{" "}
                                    {formatTime(booking.endTime)}
                                  </span>
                                </div>
                                {booking.facultyName && (
                                  <div className="flex items-center gap-1">
                                    <span>Faculty: {booking.facultyName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}

           
          </div>
        )}
      </main>
    </div>
  );
};

export default HallAvailability;
