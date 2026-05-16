# 🛡️ AEGIS Protocol

> A Unified Digital Ecosystem for Campus Life

AEGIS Protocol is a full-stack MERN-based campus management platform designed to centralize academic systems, grievance handling, opportunities, announcements, and student interaction into a single integrated ecosystem.

Built for hackathons, scalability, and real-world campus workflows.

---

# Features

## Authentication & Authorization

* JWT-based authentication
* Role-based access control (RBAC)
* Roles:

  * Student
  * Faculty
  * Authority
  * Admin
* Protected backend routes
* Ownership-based authorization

---

# Course Management System

## Faculty Features

* Create courses
* Add resources
* Add course announcements
* Create assignments
* View enrolled students
* Manage own courses only

## Student Features

* Enroll in courses
* View enrolled courses
* Unenroll from courses
* Access resources only for enrolled courses
* View assignments
* Submit assignments

---

# Assignment Management System

* Assignment creation with due date & time
* PDF/ZIP submission support
* Late submission detection
* Assignment tracking
* Submission management
* Automatic due reminders

---

# Grievance Management System

## Students

* Submit grievances
* Track grievance status

## Authority/Admin

* View grievances
* Update grievance status
* Mark as:

  * Pending
  * In Progress
  * Resolved

---

# Internship & Opportunity Portal

## Faculty/Admin

* Post opportunities
* View applicants
* Manage application status

## Students

* Apply for opportunities
* Track applications
* Prevent duplicate applications

---

# Announcement System

* Global announcements
* Course-specific announcements
* Notification badge system
* Faculty/Admin posting system

---

# Analytics Dashboard

* Total users
* Total courses
* Total grievances
* Total opportunities
* Enrollment analytics
* Most popular course

---

# Frontend Highlights

* Modern glassmorphism UI
* Responsive design
* Dashboard layout
* Gradient UI system
* Card animations
* Toast notifications
* Dynamic role-based navigation

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* bcryptjs

---

# Project Structure

```bash
AEGIS-PROTOCOL/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── controllers/
│   ├── utils/
│   └── index.js
│
└── README.md
```


---

# Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/aegis-protocol.git
```

---

# 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

# 3️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 4️⃣ Configure Environment Variables

Create `.env` inside `server/`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

# 5️⃣ Start Backend

```bash
cd server
npm run dev
```

---

# 6️⃣ Start Frontend

```bash
cd client
npm start
```

---

# 🌐 API Base URL

```bash
http://localhost:5000/api/v1
```

---

# Major Backend Concepts Implemented

* JWT Authentication
* Middleware-based authorization
* Ownership validation
* File uploads using Multer
* REST API architecture
* MongoDB schema relationships
* Population & referencing
* Request validation
* Protected routes
* Role-based route protection
* Assignment file handling

---

# Major Frontend Concepts Implemented

* Dynamic dashboard routing
* Protected frontend routes
* Role-aware rendering
* Responsive UI design
* API integration using Axios
* State management using hooks
* Toast notifications
* Modern dashboard UI

---

# Real-World Engineering Concepts Used

* RBAC (Role-Based Access Control)
* Ownership Authorization
* Multi-tenant Architecture
* Secure Authentication
* RESTful API Design
* LMS-style Academic Management
* Campus Governance Workflow

