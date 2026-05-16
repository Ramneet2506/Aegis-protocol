import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    const res = await API.get("/courses");
    setCourses(res.data.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createCourse = async (e) => {
    e.preventDefault();
    await API.post("/courses", form);
    setForm({ title: "", description: "" });
    fetchCourses();
  };

  const enroll = async (id) => {
  try {
    await API.post(`/courses/${id}/enroll`);

    alert("Enrolled successfully");

    fetchCourses();

  } catch (error) {
    console.log(error.response?.data);

    alert(
      error.response?.data?.message ||
      "Enrollment failed"
    );
  }
};

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Courses</h2>
        <p className="text-slate-500">Discover and enroll in courses</p>
      </div>

      {(role === "faculty" || role === "admin") && (
        <form onSubmit={createCourse} className="glass-card p-6 rounded-2xl mb-6">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Create New Course</h3>
          <input name="title" placeholder="Course Title" value={form.title}
            onChange={handleChange} className="input-field mb-3" required />
          <textarea name="description" placeholder="Course Description" value={form.description}
            onChange={handleChange} className="input-field mb-4 min-h-[80px]" required />
          <button className="btn-success">+ Create Course</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const isEnrolled = course.enrolledStudents?.some((s) => s._id === userId);
          if (role === "student" && isEnrolled) return null;

          return (
            <div key={course._id} className="glass-card p-6 rounded-2xl card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/40 to-pink-200/40 rounded-full blur-2xl"></div>

              <div className="relative">
                <div className="text-3xl mb-3">📘</div>

                {role === "student" ? (
                  <>
                    <h3 className="font-bold text-xl text-slate-800 mb-3">{course.title}</h3>
                    <button onClick={() => enroll(course._id)} className="btn-primary w-full">
                      Enroll Now
                    </button>
                  </>
                ) : (
                  <Link to={`/dashboard/course/${course._id}`}
                    className="font-bold text-xl text-slate-800 hover:text-indigo-600 transition-colors">
                    {course.title} →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;
