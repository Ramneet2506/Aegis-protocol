import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { checkAssignmentNotifications } from "../utils/checkAssignmentNotifications";
function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [resourceForm, setResourceForm] = useState({ title: "", link: "" });
  const [announcementForm, setAnnouncementForm] = useState({ title: "", message: "" });
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [assignmentForm, setAssignmentForm] = useState({
  title: "",
  description: "",
  dueDate: "",
});
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchCourse(); fetchAssignments();}, []);
  useEffect(() => {

  if (assignments.length > 0) {
    checkAssignmentNotifications(assignments);
  }

}, [assignments]);
  const fetchCourse = async () => {
  try {
    const res = await API.get(`/courses/${id}`);

    setCourse(res.data.data);

  } catch (error) {
    console.log(error.response?.data);
  }
};
const fetchAssignments = async () => {
  try {
    const res = await API.get(
      `/assignments/course/${id}`
    );

    setAssignments(res.data.data || []);

  } catch (error) {
    console.log(error.response?.data);
  }
};

  const handleResourceChange = (e) => setResourceForm({ ...resourceForm, [e.target.name]: e.target.value });
  const handleAnnouncementChange = (e) => setAnnouncementForm({ ...announcementForm, [e.target.name]: e.target.value });

  const addAnnouncement = async (e) => {
    e.preventDefault();
    await API.post(`/courses/${id}/announcement`, announcementForm);
    setAnnouncementForm({ title: "", message: "" });
    fetchCourse();
  };

  const addResource = async (e) => {
    e.preventDefault();
    await API.post(`/courses/${id}/resource`, resourceForm);
    setResourceForm({ title: "", link: "" });
    fetchCourse();
  };
  const createAssignment = async () => {
  try {

    await API.post(
      `/assignments/${id}`,
      assignmentForm
    );

    setAssignmentForm({
      title: "",
      description: "",
      dueDate: "",
    });

    fetchAssignments();

  } catch (error) {
    console.log(error.response?.data);
  }
};
const submitAssignment = async (assignmentId, file) => {
  if (!file) {
  return alert("Please select a file first");
}
  try {

    const formData = new FormData();

    formData.append("file", file);

    await API.post(
      `/assignments/submit/${assignmentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    fetchAssignments();

  } catch (error) {
    console.log(error.response?.data);
  }
};

const removeSubmission = async (assignmentId) => {

  try {

    await API.delete(
      `/assignments/remove/${assignmentId}`
    );

    fetchAssignments();

  } catch (error) {

    console.log(error.response?.data);

  }

};

  if (!course) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>
  );

  const isEnrolled = course.enrolledStudents?.some((s) => s._id === userId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{course.title}</h1>
          <p className="text-white/80 text-lg">{course.description}</p>
        </div>
      </div>

      {/* Add Resource */}
      {(role === "faculty" || role === "admin") && (
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
            <span>📎</span> Add Resource
          </h2>
          <form onSubmit={addResource} className="space-y-3">
            <input type="text" name="title" value={resourceForm.title} onChange={handleResourceChange}
              placeholder="Resource Title" className="input-field" required />
            <input type="url" name="link" value={resourceForm.link} onChange={handleResourceChange}
              placeholder="https://..." className="input-field" required />
            <button type="submit" className="btn-primary">+ Add Resource</button>
          </form>
        </div>
      )}

      {/* Resources */}
      {(role !== "student" || isEnrolled) && (
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
            <span>📂</span> Resources
          </h2>
          {course.resources.length === 0 ? (
            <p className="text-slate-400 text-center py-6">No resources added yet</p>
          ) : (
            <ul className="space-y-2">
              {course.resources.map((res, index) => (
                <li key={index}>
                  <a href={res.link} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                    <span className="text-xl">🔗</span>
                    <span className="font-medium">{res.title}</span>
                    <span className="ml-auto text-sm opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Announcements */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          <span>📢</span> Course Announcements
        </h2>

        {(role === "faculty" || role === "admin") && (
          <form onSubmit={addAnnouncement} className="space-y-3 mb-6 pb-6 border-b border-slate-100">
            <input type="text" name="title" value={announcementForm.title}
              onChange={handleAnnouncementChange} placeholder="Title" className="input-field" required />
            <textarea name="message" value={announcementForm.message}
              onChange={handleAnnouncementChange} placeholder="Write announcement..."
              className="input-field min-h-[80px]" required />
            <button className="btn-success">Post Announcement</button>
          </form>
        )}

        {course.announcements.length === 0 ? (
          <p className="text-slate-400 text-center py-6">No announcements yet</p>
        ) : (
          <div className="space-y-3">
            {course.announcements.map((ann, index) => (
              <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500">
                <p className="font-bold text-slate-800">{ann.title}</p>
                <p className="text-slate-600 mt-1">{ann.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Assignments */}
{(role !== "student" || isEnrolled) && (
  <div className="glass-card p-6 rounded-2xl">

    <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
      <span>📝</span> Assignments
    </h2>

    {/* Faculty Create Assignment */}
    {(role === "faculty" || role === "admin") && (
      <div className="mb-6 pb-6 border-b border-slate-100">

        <input
          type="text"
          placeholder="Assignment Title"
          className="input-field mb-3"
          value={assignmentForm.title}
          onChange={(e) =>
            setAssignmentForm({
              ...assignmentForm,
              title: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Assignment Description"
          className="input-field mb-3"
          value={assignmentForm.description}
          onChange={(e) =>
            setAssignmentForm({
              ...assignmentForm,
              description: e.target.value,
            })
          }
        />

        <input
          type="datetime-local"
          className="input-field mb-4"
          value={assignmentForm.dueDate}
          onChange={(e) =>
            setAssignmentForm({
              ...assignmentForm,
              dueDate: e.target.value,
            })
          }
        />

        <button
          onClick={createAssignment}
          className="btn-primary"
        >
          + Create Assignment
        </button>

      </div>
    )}

    {/* Assignment List */}
    {assignments.length === 0 ? (

      <p className="text-slate-400 text-center py-6">
        No assignments yet
      </p>

    ) : (

      <div className="space-y-4">

        {assignments.map((assignment) => (

          <div
            key={assignment._id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {assignment.title}
                </h3>

                <p className="text-slate-600 mt-1">
                  {assignment.description}
                </p>

                <p className="text-sm text-indigo-600 mt-3">
                  Due:
                  {" "}
                  {new Date(
                    assignment.dueDate
                  ).toLocaleString()}
                </p>
              </div>

            </div>

{/* Student Upload */}
{role === "student" && (() => {

  const hasSubmitted =
    assignment.submissions?.some(
      (sub) => sub.student?._id === userId
    );

  return (

    <div className="mt-4 space-y-3">

      {/* Already Submitted */}
      {hasSubmitted ? (

        <div className="space-y-3">

          <div className="text-green-600 font-semibold">
            ✅ Assignment Submitted
          </div>

          <button
            onClick={() =>
              removeSubmission(assignment._id)
            }
            className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
          >
            Remove Submission
          </button>

        </div>

      ) : (

        <>

          <input
            type="file"
            accept=".pdf,.zip"
            onChange={(e) =>
              setSelectedFiles({
                ...selectedFiles,
                [assignment._id]:
                  e.target.files[0],
              })
            }
            className="block w-full text-sm text-slate-600"
          />

          <button
            onClick={() =>
              submitAssignment(
                assignment._id,
                selectedFiles[
                  assignment._id
                ]
              )
            }
            disabled={
              !selectedFiles[
                assignment._id
              ]
            }
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
              selectedFiles[
                assignment._id
              ]
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Submit Assignment
          </button>

        </>

      )}

    </div>

  );

})()}

            {/* Faculty Submission View */}
            {(role === "faculty" || role === "admin") && (

              <div className="mt-5">

                <h4 className="font-semibold text-slate-700 mb-2">
                  Submissions
                </h4>

                {assignment.submissions?.length === 0 ? (

                  <p className="text-slate-400 text-sm">
                    No submissions yet
                  </p>

                ) : (

                  <div className="space-y-2">

                    {assignment.submissions.map((sub) => (

                      <div
                        key={sub._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border"
                      >

                        <div>
                          <p className="font-medium text-slate-700">
                            {sub.student?.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            Submitted:
                            {" "}
                            {new Date(
                              sub.submittedAt
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">

                          {sub.isLate && (
                            <span className="text-red-500 text-xs font-bold">
                              Late
                            </span>
                          )}

                          <a
                            href={`http://localhost:5000/${sub.file}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 font-medium hover:underline"
                          >
                            View File
                          </a>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            )}

          </div>

        ))}

      </div>

    )}

  </div>
)}

      {/* Students */}
      {(role === "faculty" || role === "admin") && (
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
            <span>👥</span> Enrolled Students ({course.enrolledStudents.length})
          </h2>
          {course.enrolledStudents.length === 0 ? (
            <p className="text-slate-400 text-center py-6">No students enrolled</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {course.enrolledStudents.map((student) => (
                <div key={student._id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {student.name?.[0]}
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{student.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
