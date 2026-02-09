# Campus Resource Manager - Frontend

## 📌 Overview
The **Campus Resource Manager** is a comprehensive solution designed to streamline the management and booking of campus resources such as halls, classrooms, and event spaces. This frontend application provides an intuitive and responsive user interface for students, faculty, and administrators to view availability, request bookings, and manage resources efficiently.

---

## 🚀 Key Features

### 🔐 Authentication & Role-Based Access
- **Secure Login:** User authentication with role-based redirection.
- **Protected Routes:** Unauthorised access prevention based on user roles (Admin, Coordinator).

### 📅 Resource Management
- **Hall Availability:** Real-time view of campus halls and their booking status.
- **New Booking:** Streamlined multi-step form for requesting hall bookings.
- **My Bookings:** Integrated dashboard for users to track their pending and approved requests.

---

## 🔄 System Flow

### 1. Authentication & Initialization
- **EntryPoint:** The user arrives at the site and is redirected to the `/login` page by default.
- **Login:** Users enter credentials which are validated against the backend. Upon success, a JWT token is stored, and the user's role is identified.
- **Redirection:** 
  - Admins are sent to `Admin Dashboard`.
  - Coordinators are sent to `Coordinator Dashboard`.

### 2. Administrator Workflow
- **Overview:** Access via `AdminDashboard` to view system stats.
- **User Management:** Admin navigates to `User Management` to create or modify faculty/coordinator accounts.
- **Approval Chain:** Admin reviews incoming booking requests in `Booking Approvals`. They can mark requests as 'Approved' or 'Rejected', which updates the status in real-time.

### 3. Coordinator/User Workflow
- **Planning:** Coordinator visits `Hall Availability` to find an open slot using the calendar/date picker.
- **Booking:** Coordinator fills out the `New Booking` form, providing event details, date, and time.
- **Tracking:** The request enters a 'Pending' state. The Coordinator monitors progress via the `My Bookings` page until the Admin takes action.

---
### 🛠️ Administrator Controls
- **Admin Dashboard:** High-level overview of system activity.
- **User Management:** Create, update, and manage user accounts and roles.
- **Booking Approvals:** Interface for administrators to review, approve, or reject booking requests.

---

## 💻 Tech Stack

### Core Frameworks
- **React 18:** Modern UI library for building component-based interfaces.
- **Vite:** Next-generation frontend tooling for fast development and builds.

### UI & Styling
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Framer Motion:** Powerful animation library for smooth transitions and interactive elements.
- **Radix UI:** Accessible and unstyled primitives for high-quality UI components.
- **Lucide React:** Beautifully simple icons.

### State & Data Management
- **TanStack Query (React Query):** For efficient server-state management and data fetching.
- **Axios:** Promise-based HTTP client for API communication.
- **React Hook Form:** Performant and flexible forms with validation.
- **Zod:** TypeScript-first schema declaration and validation.

---

## 📂 Project Structure

```text
Frontend/
├── public/              # Static assets (images, icons)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Atomic components (Button, Input, etc.)
│   │   ├── Header.jsx   # Main navigation header
│   │   └── ProtectedRoute.jsx
│   ├── context/         # Auth and Global State contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and library wrappers
│   ├── pages/           # Main application pages
│   │   ├── AdminDashboard.jsx
│   │   ├── HallAvailability.jsx
│   │   ├── NewBooking.jsx
│   │   └── UserManagement.jsx
│   ├── App.jsx          # Route definitions and layout
│   └── main.jsx         # Application entry point
├── package.json         # Project dependencies and scripts
└── tailwind.config.js   # Tailwind CSS configuration
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Frontend/Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5173/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.

---

## 👥 Roles & Access

| Role | Permissions |
| :--- | :--- |
| **Admin** | Full access to User Management, All Bookings, and Approvals. |
| **Student Coordinator** | Can check availability, create new bookings, and manage their own bookings. |

---

## 👤 Author

-Aravind R K
-Kanishka D
-Sandheep G S
-Radha Krishna
-Sujith

