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
import { ArrowLeft, Calendar, MapPin, CheckCircle2, XCircle } from "lucide-react";

const HallAvailability = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set today's date initially
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // 🔥 Fetch availability using backend bulk endpoint
  const fetchAvailability = async () => {
    if (!selectedDate || !startTime || !endTime) {
      alert("Please select date, start time and end time");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get("/resources/availability/bulk", {
        params: {
          date: selectedDate,
          startTime,
          endTime
        }
      });

      setResources(res.data || []);
    } catch (error) {
      console.error("Failed to load availability", error);
      alert("Failed to fetch availability");
    } finally {
      setLoading(false);
    }
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
            Hall / Class Availability
          </h2>

          <p className="text-muted-foreground">
            Select date and time to view availability
          </p>
        </div>

        {/* DATE + TIME SELECTOR */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <CardDescription>
              Choose date and time range to check availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={fetchAvailability}
                  className="w-full bg-amrita hover:bg-amrita/95"
                >
                  Show Availability
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* AVAILABILITY RESULTS */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading availability...</p>
          </div>
        ) : (
          <div className="space-y-6">

            {resources.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No resources found for selected time slot.
                  </p>
                </CardContent>
              </Card>
            ) : (
              resources.map((resource) => {
                const isAvailable = resource.available;

            return (
                    <Card
                      key={resource._id}
                      onClick={() =>
                        navigate("/new-booking", {
                          state: {
                            resourceId: resource._id,
                            resourceName: resource.name,
                            date: selectedDate
                          }
                        })
                      }
                      className={`cursor-pointer transition hover:shadow-lg ${
                        resource.available
                          ? "border-green-300 hover:border-green-500"
                          : "bg-gray-200 border-gray-400"
                      }`}
                    >
                    <CardHeader>
                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amrita" />
                          <CardTitle className="text-xl">
                            {resource.name}
                          </CardTitle>
                        </div>

                        {isAvailable ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Available</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-700">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Booked</span>
                          </div>
                        )}

                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground">
                        Capacity: {resource.capacity}
                      </p>
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