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
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const NewBooking = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    facultyName: "",
    facultyDesignation: "",
    facultyDepartment: "",
    facultyEmail: "",
    eventTitle: "",
    eventDescription: "",
    hall: "",
    capacity: "",
    date: "",
    startTime: "",
    endTime: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [halls, setHalls] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!form.date) {
      setForm((prev) => ({ ...prev, date: today }));
    }
  }, []);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await axios.get("/halls");
        setHalls(res.data || []);
      } catch (e) {
        console.error("Failed to load halls", e);
      }
    };
    fetchHalls();
  }, []);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get("/faculty");
        setFacultyList(res.data || []);
      } catch (e) {
        console.error("Failed to load faculty", e);
      }
    };
    fetchFaculty();
  }, []);

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
    if (!form.facultyDesignation?.trim()) {
      newErrors.facultyDesignation = "Faculty designation is required";
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
        facultyDesignation: form.facultyDesignation.trim(),
        facultyDepartment: form.facultyDepartment.trim(),
        facultyEmail: form.facultyEmail.trim(),
        eventTitle: form.eventTitle.trim(),
        eventDescription: form.eventDescription.trim(),
        hall: form.hall.trim(),
        capacity: form.capacity ? Number(form.capacity) : undefined,
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
          facultyDesignation: "",
          facultyDepartment: "",
          facultyEmail: "",
          eventTitle: "",
          eventDescription: "",
          hall: "",
          capacity: "",
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

  const Field = ({ label, required, error, children, className = "" }) => (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/coordinator-dashboard")}
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to dashboard
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              New Hall Booking
            </h1>
            <p className="text-muted-foreground text-sm">
              Request a hall for your event. Required fields are marked with *
            </p>
          </div>

          {/* Form */}
          <Card className="shadow-sm border border-border/80 overflow-hidden">
            <CardHeader className="bg-muted/40 border-b px-6 py-5">
              <CardTitle className="text-xl flex items-center gap-2 font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amrita/10 text-amrita">
                  <Calendar className="w-4 h-4" />
                </span>
                Booking request
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-0.5">
                Availability is checked when you submit
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              {message && (
                <div
                  className={`mb-6 rounded-xl px-4 py-3.5 flex items-start gap-3 text-sm ${
                    messageType === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                      : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
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

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Faculty */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amrita/10 text-xs font-semibold text-amrita">1</span>
                    <h2 className="text-base font-semibold text-foreground">Faculty information</h2>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 md:p-5 space-y-4">
                    {facultyList.length > 0 && (
                      <Field label="Quick fill from list (optional)">
                        <Select
                          value={facultyList.some((f) => f.facultyEmail === form.facultyEmail) ? form.facultyEmail : ""}
                          onValueChange={(email) => {
                            const f = facultyList.find((x) => x.facultyEmail === email);
                            if (f) {
                              setForm((prev) => ({
                                ...prev,
                                facultyName: f.facultyName,
                                facultyDesignation: f.facultyDesignation || "",
                                facultyDepartment: f.department || "",
                                facultyEmail: f.facultyEmail || ""
                              }));
                            }
                          }}
                        >
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Choose faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            {facultyList.map((f) => (
                              <SelectItem key={f._id} value={f.facultyEmail}>
                                {f.facultyName} – {f.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Faculty name" required error={errors.facultyName}>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          <Input
                            name="facultyName"
                            value={form.facultyName}
                            onChange={handleChange}
                            placeholder="e.g. Dr. John Doe"
                            className={`pl-9 h-10 ${errors.facultyName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            required
                          />
                        </div>
                      </Field>
                      <Field label="Designation" required error={errors.facultyDesignation}>
                        <Input
                          name="facultyDesignation"
                          value={form.facultyDesignation}
                          onChange={handleChange}
                          placeholder="e.g. Professor"
                          className={`h-10 ${errors.facultyDesignation ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          required
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Department" error={errors.facultyDepartment}>
                        <Select
                          value={form.facultyDepartment}
                          onValueChange={(v) => handleSelectChange("facultyDepartment", v)}
                        >
                          <SelectTrigger className="w-full h-10 bg-background">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Email" error={errors.facultyEmail}>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          <Input
                            type="email"
                            name="facultyEmail"
                            value={form.facultyEmail}
                            onChange={handleChange}
                            placeholder="faculty@university.edu"
                            className={`pl-9 h-10 ${errors.facultyEmail ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                        </div>
                      </Field>
                    </div>
                  </div>
                </section>

                {/* 2. Event */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amrita/10 text-xs font-semibold text-amrita">2</span>
                    <h2 className="text-base font-semibold text-foreground">Event details</h2>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 md:p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Event title" required error={errors.eventTitle}>
                        <Input
                          name="eventTitle"
                          value={form.eventTitle}
                          onChange={handleChange}
                          placeholder="e.g. Guest Lecture on AI"
                          className={`h-10 ${errors.eventTitle ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          required
                        />
                      </Field>
                      <Field label="Hall / Room" required error={errors.hall}>
                        {halls.length > 0 ? (
                          <Select value={form.hall} onValueChange={(v) => handleSelectChange("hall", v)}>
                            <SelectTrigger className={`h-10 bg-background ${errors.hall ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select hall" />
                            </SelectTrigger>
                            <SelectContent>
                              {halls.map((hall) => (
                                <SelectItem key={hall._id} value={hall.code}>
                                  {hall.code} · Capacity {hall.capacity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            name="hall"
                            value={form.hall}
                            onChange={handleChange}
                            placeholder="e.g. A-205"
                            className={`h-10 ${errors.hall ? "border-red-500" : ""}`}
                            required
                          />
                        )}
                      </Field>
                    </div>
                    <Field
                      label="Expected capacity (optional)"
                      error={errors.capacity}
                    >
                      <Input
                        type="number"
                        min={1}
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        placeholder="e.g. 40"
                        className="h-10 max-w-[140px]"
                      />
                      {form.hall && halls.find((h) => h.code === form.hall) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Room capacity: {halls.find((h) => h.code === form.hall).capacity}
                        </p>
                      )}
                    </Field>
                    <Field label="Description (optional, max 500 characters)" error={errors.eventDescription}>
                      <textarea
                        name="eventDescription"
                        value={form.eventDescription}
                        onChange={handleChange}
                        rows={3}
                        maxLength={500}
                        className={`w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amrita focus-visible:ring-offset-0 resize-none ${
                          errors.eventDescription ? "border-red-500" : ""
                        }`}
                        placeholder="Attendees, special requirements, etc."
                      />
                      <p className="text-xs text-muted-foreground mt-1">{form.eventDescription.length}/500</p>
                    </Field>
                  </div>
                </section>

                {/* 3. Date & time */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amrita/10 text-xs font-semibold text-amrita">3</span>
                    <h2 className="text-base font-semibold text-foreground">Date & time</h2>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 md:p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Date" required error={errors.date}>
                        <Input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          className={`h-10 ${errors.date ? "border-red-500" : ""}`}
                          required
                        />
                      </Field>
                      <Field label="Start time" required error={errors.startTime}>
                        <Input
                          type="time"
                          name="startTime"
                          value={form.startTime}
                          onChange={handleChange}
                          className={`h-10 [color-scheme:light] ${errors.startTime ? "border-red-500" : ""}`}
                          required
                        />
                      </Field>
                      <Field label="End time" required error={errors.endTime}>
                        <Input
                          type="time"
                          name="endTime"
                          value={form.endTime}
                          onChange={handleChange}
                          className={`h-10 [color-scheme:light] ${errors.endTime ? "border-red-500" : ""}`}
                          required
                        />
                      </Field>
                    </div>
                    {form.date && form.startTime && form.endTime && (
                      <div className="rounded-lg bg-amrita/5 border border-amrita/20 px-4 py-3">
                        <p className="text-sm text-foreground">
                          <span className="font-medium text-amrita">Selected slot:</span>{" "}
                          {new Date(form.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}{" "}
                          · {form.startTime} – {form.endTime}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/coordinator-dashboard")}
                    className="flex-1 sm:flex-none sm:min-w-[120px] h-10"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none sm:min-w-[160px] h-10 bg-amrita hover:bg-amrita/90 text-white"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit request"
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
