import React, { useEffect, useState } from "react";
import API from "../services/api";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", deadline: "" });

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchOpportunities(); }, []);

  const fetchOpportunities = async () => {
  try {
    const res = await API.get("/opportunities");

    setOpportunities(res.data.data || []);

  } catch (error) {
    console.log(error.response?.data);

    setOpportunities([]);
  }
};

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createOpportunity = async (e) => {
    e.preventDefault();
    await API.post("/opportunities", form);
    setForm({ title: "", description: "", deadline: "" });
    fetchOpportunities();
  };

  const apply = async (id) => {
    try {
      await API.post(`/opportunities/${id}/apply`);
      alert("Applied successfully!");
      fetchOpportunities();
    } catch (error) {
      alert("You have already applied");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Opportunities</h2>
        <p className="text-slate-500">Explore internships, projects and more</p>
      </div>

      {(role === "faculty" || role === "admin") && (
        <form onSubmit={createOpportunity} className="glass-card p-6 rounded-2xl mb-6">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Post New Opportunity</h3>
          <input name="title" placeholder="Opportunity Title" value={form.title}
            onChange={handleChange} className="input-field mb-3" required />
          <textarea name="description" placeholder="Description" value={form.description}
            onChange={handleChange} className="input-field mb-3 min-h-[80px]" required />
          <input type="date" name="deadline" value={form.deadline}
            onChange={handleChange} className="input-field mb-4" required />
          <button className="btn-primary">+ Post Opportunity</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {opportunities.map((opp) => {
          const alreadyApplied = opp.applications?.some((app) => app.student?._id === userId);
          if (role === "student" && alreadyApplied) return null;

          return (
            <div key={opp._id} className="glass-card p-6 rounded-2xl card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-2xl"></div>

              <div className="relative">
                <div className="text-3xl mb-2">💼</div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{opp.title}</h3>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{opp.description}</p>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-4">
                  ⏰ {new Date(opp.deadline).toLocaleDateString()}
                </div>

                {role === "student" && !alreadyApplied && (
                  <button onClick={() => apply(opp._id)} className="btn-primary w-full">
                    Apply Now
                  </button>
                )}

                {role === "faculty" && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="font-semibold text-sm text-slate-700 mb-2">
                      Applicants ({opp.applications.length})
                    </p>
                    {opp.applications.length === 0 ? (
                      <p className="text-xs text-slate-400">No applicants yet</p>
                    ) : (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {opp.applications.map((app, index) => (
                          <div key={index} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded">
                            <span className="font-medium">{app.student?.name || "Student"}</span>
                            <span className="text-indigo-600 font-semibold">{app.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Opportunities;
