import React, { useEffect, useState } from "react";
import API from "../services/api";

function MyOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchOpportunities(); }, []);

const fetchOpportunities = async () => {
  try {
    const res = await API.get("/opportunities");

    const opportunities = res.data.data || [];

    const applied = opportunities.filter((opp) =>
      opp.applications?.some(
        (app) => app.student?._id === userId
      )
    );

    setOpportunities(applied);

  } catch (error) {
    console.log(error.response?.data);

    setOpportunities([]);
  }
};

  const statusColor = (s) => {
    if (s === "Accepted") return "bg-emerald-100 text-emerald-700";
    if (s === "Rejected") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">My Applications</h2>
        <p className="text-slate-500">Track your opportunity applications</p>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-16 text-slate-400 glass-card rounded-2xl">
          <div className="text-6xl mb-3">💼</div>
          <p>You haven't applied to any opportunities yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((opp) => {
            const application = opp.applications.find((app) => app.student?._id === userId);
            return (
              <div key={opp._id} className="glass-card p-6 rounded-2xl card-hover">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{opp.title}</h3>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{opp.description}</p>
                <p className="text-xs text-slate-500 mb-3">
                  Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </p>
                <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${statusColor(application?.status)}`}>
                  {application?.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOpportunities;
