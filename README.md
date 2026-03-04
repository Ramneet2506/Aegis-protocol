# AEGIS Protocol – Unified Campus Digital Ecosystem

## Overview

AEGIS Protocol is a **web-based campus ecosystem platform** designed to unify multiple fragmented campus systems into one integrated application.
The platform combines **academic resources, grievance management, internship opportunities, announcements, and course collaboration** into a single role-based system.

The goal of the project is to eliminate the problem of **disconnected campus platforms** by providing a centralized dashboard for **students, faculty, and administrators**.


---

# Features Implemented

## 1. Role-Based Authentication

Users log in with different roles, each having specific permissions.

Roles supported:

* **Student**
* **Faculty**
* **Authority**

Capabilities:

* Secure login using authentication tokens
* Role-based access to different modules
* Protected backend routes

---

# Course Management System

The platform includes a **Learning Management System (LMS)-style course module**.

## Faculty Capabilities

Faculty members can:

* Create new courses
* Add learning resources
* Post course announcements
* View enrolled students
* Monitor course participation

## Student Capabilities

Students can:

* View available courses
* Enroll in courses
* Unenroll from courses
* Access resources after enrollment
* View course announcements
* Track enrolled courses in **My Courses**

---

## Course Workflow

### Courses Page

Students see:

Course Name + Enroll button

Once enrolled:

* Course disappears from **Courses**
* Course appears in **My Courses**

---

### My Courses

Shows all courses the student is enrolled in.

Students can:

* Click the course name to open the **Course Details Page**
* Unenroll from the course
---

### Course Details Page

Displays full information about the course in a structured layout.

Sections include:

* Course title
* Course description
* Resources
* Course announcements
* Enrolled students (faculty view)

---

## Course Resources

Faculty can upload resources for the course.

Resource format:
* Title
* Link (Drive, GitHub, documentation etc.)

Students can only view resources if they are **enrolled in the course**.


---

## Course Announcements

Faculty can post announcements related to the course.

Students can view announcements but **cannot create them**.
---

# Internship & Opportunity Portal

The platform includes a **centralized opportunity board**.

Faculty/Admin can:
* Post internship or research opportunities
* Set deadlines
* View applicants

Students can:
* Browse opportunities
* Apply for opportunities
* Track applied opportunities in **My Opportunities**

Each opportunity can be applied **only once per student**.
---

# Grievance Management System

Students can submit grievances through the system.

Features include:

* Complaint submission
* Status tracking
* Administrative review
* Transparent resolution workflow

Authorities can update grievance status and manage reports.

---

# Announcement Board

Campus-wide announcements can be posted by faculty or administrators.
Students can view announcements through their dashboard.

---

# Analytics Dashboard

Faculty and administrators can view analytics such as:

* Total number of courses
* Total student enrollments
* Most popular course
* Average course enrollment

This provides insight into **academic engagement across the campus**.

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JWT-based authentication
* Role-based access control

---

# Project Structure

```
AEGIS-Protocol
│
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Courses.js
│   │   │   ├── MyCourses.js
│   │   │   ├── CourseDetails.js
│   │   │   ├── Opportunities.js
│   │   │   ├── MyOpportunities.js
│   │   │   └── Dashboard.js
│   │   │
│   │   ├── components/
│   │   │   └── Sidebar.js
│   │   │
│   │   └── services/
│   │       └── api.js
│
├── server/               # Node.js backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Grievance.js
│   │   └── Opportunity.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── grievanceRoutes.js
│   │   └── opportunityRoutes.js
│   │
│   └── index.js
```

---

# How to Run the Project

## 1. Clone the Repository

```
git clone https://github.com/yourusername/aegis-protocol.git
cd aegis-protocol
```

---

## 2. Install Backend Dependencies

```
cd server
npm install
```

Create a `.env` file in the server folder:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```
npm run dev
```

---

## 3. Install Frontend Dependencies

Open a new terminal:

```
cd client
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

Backend runs on:

```
http://localhost:5000
```

---

# System Architecture

The system follows a **MERN architecture**:

React Frontend
↓
Express API
↓
MongoDB Database

All protected routes use **JWT authentication** and role-based middleware.

---

# Future Improvements

The following features are planned for future versions:

* Real-time notifications
* Discussion forums for courses
* Ride-sharing module
* Lost & found system
* Club management tools
* AI-based grievance categorization
* Real-time analytics dashboard
* Notification system for course announcements

---

# Conclusion

AEGIS Protocol demonstrates how a **unified digital ecosystem** can simplify campus operations by bringing together:

* Academics
* Opportunities
* Governance
* Communication

The platform aims to improve **student engagement, transparency, and accessibility** across campus systems.

---
