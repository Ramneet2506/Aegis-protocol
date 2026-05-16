import React, { useEffect, useState } from "react";
import API from "../services/api";

function CourseAnalytics() {
  const [stats, setStats] = useState({});

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    const res = await API.get("/courses/analytics/stats");
    setStats(res.data.data);
  };

  const cards = [
    { label: "Total Courses", value: stats.totalCourses, icon: "📚", gradient: "from-indigo-500 to-purple-500" },
    { label: "Total Students", value: stats.totalStudents, icon: "👥", gradient: "from-emerald-500 to-teal-500" },
    { label: "Most Popular", value: stats.mostPopularCourse, icon: "🏆", gradient: "from-amber-500 to-orange-500", isText: true },
    { label: "Avg Enrollment", value: stats.averageEnrollment, icon: "📊", gradient: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Course Analytics</h2>
        <p className="text-slate-500">Insights at a glance</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl card-hover relative overflow-hidden">
            <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${c.gradient} opacity-10 rounded-full blur-2xl`}></div>
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-2xl mb-4`}>
                {c.icon}
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">{c.label}</p>
              <h3 className={`font-bold text-slate-800 ${c.isText ? 'text-lg' : 'text-3xl'}`} style={{ fontFamily: 'Space Grotesk' }}>
                {c.value ?? '—'}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseAnalytics;
