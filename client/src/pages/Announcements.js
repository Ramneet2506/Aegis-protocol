import React, { useEffect, useState } from "react";
import API from "../services/api";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchAnnouncements();
    localStorage.setItem("seenAnnouncements", new Date().toISOString());
  }, []);

  const fetchAnnouncements = async () => {
    const res = await API.get("/announcements");
    setAnnouncements(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createAnnouncement = async (e) => {
    e.preventDefault();
    await API.post("/announcements", form);
    setForm({ title: "", message: "" });
    fetchAnnouncements();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Announcements</h2>
        <p className="text-slate-500">Stay updated with the latest news</p>
      </div>

      {(role === "faculty" || role === "admin") && (
        <form onSubmit={createAnnouncement} className="glass-card p-6 rounded-2xl mb-6">
          <h3 className="font-bold text-lg mb-4 text-slate-800">📢 Post Announcement</h3>
          <input name="title" placeholder="Title" value={form.title}
            onChange={handleChange} className="input-field mb-3" required />
          <textarea name="message" placeholder="Your message..." value={form.message}
            onChange={handleChange} className="input-field mb-4 min-h-[100px]" required />
          <button className="btn-success">Post Announcement</button>
        </form>
      )}

      <div className="space-y-4">
        {announcements.length === 0 && (
          <div className="text-center py-16 text-slate-400 glass-card rounded-2xl">
            <div className="text-6xl mb-3">📭</div>
            <p>No announcements yet</p>
          </div>
        )}

        {announcements.map((a) => (
          <div key={a._id} className="glass-card p-6 rounded-2xl card-hover border-l-4 border-indigo-500">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📢</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{a.title}</h3>
                <p className="text-slate-600 mb-3">{a.message}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-[10px]">
                    {a.postedBy?.name?.[0] || "?"}
                  </div>
                  <span>Posted by <span className="font-semibold">{a.postedBy?.name}</span></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements;
