import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Grievances from "./Grievances";
import Courses from "./Courses";
import Opportunities from "./Opportunities";
import Announcements from "./Announcements";
import MyCourses from "./MyCourses";
import MyOpportunities from "./MyOpportunities";
import CourseAnalytics from "./CourseAnalytics";
import CourseDetails from "./CourseDetails";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Space Grotesk' }}>
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
              Logged in as <span className="font-semibold text-indigo-600">{role}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 shadow-sm"
          >
            Logout →
          </button>
        </header>

        <main className="p-8 fade-in">
          <Routes>
            <Route path="grievances" element={<Grievances />} />
            <Route path="courses" element={<Courses />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-opportunities" element={<MyOpportunities />} />
            <Route path="course-analytics" element={<CourseAnalytics />} />
            <Route path="course/:id" element={<CourseDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
