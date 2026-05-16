import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    const res = await API.get("/courses");
    const enrolledCourses = res.data.data.filter((course) =>
      course.enrolledStudents?.some((student) => student._id === userId)
    );
    setCourses(enrolledCourses);
  };

  const unenroll = async (courseId) => {
    await API.post(`/courses/${courseId}/unenroll`);
    alert("Unenrolled successfully");
    fetchCourses();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">My Courses</h2>
        <p className="text-slate-500">Courses you're currently enrolled in</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 text-slate-400 glass-card rounded-2xl">
          <div className="text-6xl mb-3">🎓</div>
          <p>You haven't enrolled in any courses yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course._id} className="glass-card p-6 rounded-2xl card-hover flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-xl">
                  📘
                </div>
                <Link to={`/dashboard/course/${course._id}`}
                  className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors">
                  {course.title}
                </Link>
              </div>
              <button onClick={() => unenroll(course._id)} className="btn-danger text-sm">
                Unenroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
