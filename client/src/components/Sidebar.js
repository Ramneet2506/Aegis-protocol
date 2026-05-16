import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../services/api";

function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const [grievanceCount, setGrievanceCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);

  useEffect(() => {
    fetchGrievances();
    fetchAnnouncements();

    const interval = setInterval(() => {
      fetchGrievances();
      fetchAnnouncements();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await API.get("/grievances");
      setGrievanceCount(res.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get("/announcements");
      const lastSeen = localStorage.getItem("seenAnnouncements");

      if (!lastSeen) {
        setAnnouncementCount(res.data.length);
        return;
      }

      const unseen = res.data.filter(
        (a) => new Date(a.createdAt) > new Date(lastSeen)
      );
      setAnnouncementCount(unseen.length);
    } catch (error) {
      console.error(error);
    }
  };

  const NavItem = ({ to, icon, label, badge }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1.5 transition-all duration-200 group ${
          active
            ? "bg-white/15 text-white shadow-lg"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-sm">{label}</span>
        </span>
        {badge > 0 && (
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center badge-pulse">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-72 min-h-screen text-white flex flex-col" style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)'
    }}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold tracking-tight" style={{
          background: 'linear-gradient(135deg, #818cf8 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          AEGIS
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
          {role} Portal
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {role === "student" && (
          <>
            <NavItem to="/dashboard/grievances" icon="📋" label="My Grievances" badge={grievanceCount} />
            <NavItem to="/dashboard/courses" icon="📚" label="Courses" />
            <NavItem to="/dashboard/my-courses" icon="🎓" label="My Courses" />
            <NavItem to="/dashboard/opportunities" icon="💼" label="Opportunities" />
            <NavItem to="/dashboard/my-opportunities" icon="⭐" label="My Opportunities" />
            <NavItem to="/dashboard/announcements" icon="📢" label="Announcements" badge={announcementCount} />
          </>
        )}

        {role === "faculty" && (
          <>
            <NavItem to="/dashboard/courses" icon="📚" label="Manage Courses" />
            <NavItem to="/dashboard/opportunities" icon="💼" label="Post Opportunities" />
            <NavItem to="/dashboard/announcements" icon="📢" label="Announcements" badge={announcementCount} />
            <NavItem to="/dashboard/course-analytics" icon="📊" label="Course Analytics" />
          </>
        )}

        {(role === "admin" || role === "authority") && (
          <>
            <NavItem to="/dashboard/grievances" icon="📋" label="All Grievances" badge={grievanceCount} />
            <NavItem to="/dashboard/announcements" icon="📢" label="Announcements" badge={announcementCount} />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-slate-500 text-center">
          © 2025 AEGIS Platform
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
