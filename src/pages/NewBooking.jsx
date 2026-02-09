import React, { useState, useEffect } from "react";
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
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const NewBooking = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    facultyName: "",
    facultyDepartment: "",
    facultyDesignation: "", 
    facultyEmail: "",
    eventTitle: "",
    eventDescription: "",
    hall: "",
    date: "",
    startTime: "",
    endTime: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

const startTimeRef = useRef(null);
const endTimeRef = useRef(null);

  // Common departments
  const departments = [
    "CSE",
    "ECE",
    "EEE",
    "ME",
    "CE",
    "IT",
    "AIDS",
    "AIML",
    "CSBS",
    "Other"
  ];

  // Common halls (can be fetched from backend later)
  const commonHalls = [
    "A-191",
    "A-192",
    "A-193",
    "A-194",
    "A-195",
    "A-205",
    "A-206",
    "A-207",
    "A-208",
    "Seminar Hall",
    "Auditorium",
    "Conference Room 1",
    "Conference Room 2",
    "Other"
  ];

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!form.date) {
      setForm((prev) => ({ ...prev, date: today }));
    }
  }, []);

  useEffect(() => {
  if (message) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}, [message]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    if (!form.facultyName.trim()) {
      newErrors.facultyName = "Faculty name is required";
    }

    if (!form.eventTitle.trim()) {
      newErrors.eventTitle = "Event title is required";
    }

    if (!form.hall.trim()) {
      newErrors.hall = "Hall/Room is required";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Cannot select a past date";
      }
    }

    if (!form.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!form.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (form.startTime && form.endTime && form.date) {
      const startDateTime = new Date(`${form.date}T${form.startTime}`);
      const endDateTime = new Date(`${form.date}T${form.endTime}`);

      if (endDateTime <= startDateTime) {
        newErrors.endTime = "End time must be after start time";
      }

      if (startDateTime < now && endDateTime < now) {
        newErrors.startTime = "Cannot book a time slot that has already passed";
      }
    }

    if (form.facultyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.facultyEmail)) {
      newErrors.facultyEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        facultyName: form.facultyName.trim(),
        facultyDepartment: form.facultyDepartment.trim(),
        facultyDesignation: form.facultyDesignation.trim(),
        facultyEmail: form.facultyEmail.trim(),
        eventTitle: form.eventTitle.trim(),
        eventDescription: form.eventDescription.trim(),
        hall: form.hall.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime
      };

      const res = await axios.post("/bookings", payload);

      setMessage(res.data.message || "Booking request submitted successfully!");
      setMessageType("success");

      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          facultyName: "",
          facultyDepartment: "",
          facultyDesignation: "", 
          facultyEmail: "",
          eventTitle: "",
          eventDescription: "",
          hall: "",
          date: new Date().toISOString().split("T")[0],
          startTime: "",
          endTime: ""
        });
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to submit booking. Please try again.";
      setMessage(msg);
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/coordinator-dashboard")}
              className="mb-4 bg-amrita flex items-center gap-1 hover:bg-amrita/95"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-3xl font-bold text-foreground-90 mb-2">
              New Hall Booking Request
            </h2>
            <p className="text-muted-foreground">
              Fill in the details below to request a hall booking. All fields
              marked with * are required.
            </p>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amrita/10 to-amrita/5 border-b">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-amrita" />
                Booking Request Form
              </CardTitle>
              <CardDescription>
                Availability will be
                checked automatically.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {message && (
                <div
                  className={`mb-6 rounded-lg border px-4 py-3 flex items-start gap-3 ${
                    messageType === "success"
                      ? "border-green-300 bg-green-50 text-green-800"
                      : "border-red-300 bg-red-50 text-red-800"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="font-medium">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Faculty Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground-90 flex items-center gap-2 pb-2 border-b">
                    <User className="w-5 h-5 text-amrita" />
                    Faculty Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground-90">
                        <span className="flex items-center gap-1">
                          Faculty Name <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          name="facultyName"
                          value={form.facultyName}
                          onChange={handleChange}
                          placeholder="Dr. John Doe"
                          className={`pl-10 ${errors.facultyName ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      
                      {errors.facultyName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.facultyName}
                        </p>
                      )}
                    </div>

                   

                 
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground-90">
        Faculty Designation
      </label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          name="facultyDesignation"
          value={form.facultyDesignation}
          onChange={handleChange}
          placeholder="Prof / Assistant Prof"
          className={`pl-10 ${errors.facultyDesignation ? "border-red-500" : ""}`}
        />
      </div>
      {errors.facultyDesignation && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.facultyDesignation}
        </p>
      )}
    </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Faculty Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground-90">
          Faculty Email
           </label>
           <div className="relative">
            <div className="relative max-w-64"> 
              <Input 
              type="email"
              name="facultyEmail"
              value={form.facultyEmail}
              onChange={handleChange}
              placeholder="faculty@university.edu"
              className={`pl-3 ${errors.facultyEmail ? "border-red-500" : ""}`} />
             </div>
              
            </div>
              {errors.facultyEmail && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.facultyEmail}
                  </p>
                )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground-90">
                    Department
                    </label>
                    <Select
                    value={form.facultyDepartment}
                    onValueChange={(value) => handleSelectChange("facultyDepartment", value)

                    } >
                      
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                          </SelectItem>
                        ))}
                        </SelectContent>
                        </Select>
                  </div>
                </div>
              </div>
<br></br>

                {/* Event Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground-90 flex items-center gap-2 pb-2 border-b">
                    <FileText className="w-5 h-5 text-amrita" />
                    Event Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground-90">
                        <span className="flex items-center gap-1">
                          Event Title <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <Input
                        name="eventTitle"
                        value={form.eventTitle}
                        onChange={handleChange}
                        placeholder="Guest Lecture on AI"
                        className={errors.eventTitle ? "border-red-500" : ""}
                        required
                      />
                      {errors.eventTitle && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.eventTitle}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground-90">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Hall / Room <span className="text-red-500">*</span>
                        </span>
                      </label>
                      {form.hall && form.hall !== "Other" && commonHalls.includes(form.hall) ? (
                        <Select
                          value={form.hall}
                          onValueChange={(value) => {
                            if (value === "Other") {
                              setForm((prev) => ({ ...prev, hall: "" }));
                            } else {
                              handleSelectChange("hall", value);
                            }
                          }}
                        >
                          <SelectTrigger
                            className={`w-full ${errors.hall ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select hall" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonHalls.map((hall) => (
                              <SelectItem key={hall} value={hall}>
                                {hall}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          name="hall"
                          value={form.hall}
                          onChange={handleChange}
                          placeholder="Enter hall name (e.g., A-205, Seminar Hall)"
                          className={errors.hall ? "border-red-500" : ""}
                          required
                        />
                      )}
                      {form.hall && form.hall !== "Other" && commonHalls.includes(form.hall) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-muted-foreground"
                          onClick={() => setForm((prev) => ({ ...prev, hall: "" }))}
                        >
                          Or type custom hall name
                        </Button>
                      )}
                      {errors.hall && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.hall}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground-90">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Event Description
                      </span>
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        (Optional - Max 500 characters)
                      </span>
                    </label>
                    <textarea
                      name="eventDescription"
                      value={form.eventDescription}
                      onChange={handleChange}
                      rows={4}
                      maxLength={500}
                      className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amrita resize-none ${
                        errors.eventDescription ? "border-red-500" : ""
                      }`}
                      placeholder="Provide details about the event, expected attendees, special requirements, etc."
                    />
                    <div className="flex justify-between items-center">
                      {errors.eventDescription && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.eventDescription}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground ml-auto">
                        {form.eventDescription.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground-90 flex items-center gap-2 pb-2 border-b">
                    <Clock className="w-5 h-5 text-amrita" />
                    Date & Time
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground-90">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Date <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <Input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={errors.date ? "border-red-500" : ""}
                        required
                      />
                      {errors.date && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.date}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground-90">
                        <span className="flex items-center gap-1">
                          Start Time <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <Input
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className={`${errors.startTime ? "border-red-500" : ""} text-gray-900 dark:text-gray-100`}
                        required
                      />
                      {errors.startTime && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.startTime}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground-90">
                        <span className="flex items-center gap-1">
                          End Time <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <Input
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        className={`${errors.endTime ? "border-red-500" : ""} text-gray-900 dark:text-gray-100`}
                        required
                      />
                      {errors.endTime && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {form.date && form.startTime && form.endTime && (
                    <div className="p-3 bg-muted/50 rounded-lg border text-center">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Selected Slot:</span>{" "}
                        {new Date(form.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}{" "}
                        from {form.startTime} to {form.endTime}
                      </p>
                    </div>
                  )}
                </div>
<br></br>
                {/* Submit Button */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/coordinator-dashboard")}
                    className="flex-1 bg-amrita hover:bg-amrita/95"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-amrita hover:bg-amrita/95"
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewBooking;