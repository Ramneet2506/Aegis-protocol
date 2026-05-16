import React, { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Overview</h2>
        <p className="text-slate-500">Platform statistics at a glance</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="glass-card p-6 rounded-2xl card-hover">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-2">{key}</p>
            <h3 className="text-3xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
              {value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
