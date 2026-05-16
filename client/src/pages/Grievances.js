import React, { useEffect, useState } from "react";
import API from "../services/api";

function Grievances() {

  const [grievances, setGrievances] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [commentText, setCommentText] =
    useState({});

  const role = localStorage.getItem("role");



  // ==============================
  // FETCH GRIEVANCES
  // ==============================

  useEffect(() => {
    fetchGrievances();
  }, [categoryFilter, departmentFilter]);



  const fetchGrievances = async () => {

    try {

      const res = await API.get(
        `/grievances?category=${categoryFilter}&department=${departmentFilter}`
      );

      setGrievances(res.data.data);

    } catch (error) {

      console.log(error);

    }

  };



  // ==============================
  // FORM HANDLER
  // ==============================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };



  // ==============================
  // CREATE GRIEVANCE
  // ==============================

  const createGrievance = async (e) => {

    e.preventDefault();

    try {

      await API.post("/grievances", form);

      setForm({
        title: "",
        description: "",
        category: "",
      });

      fetchGrievances();

    } catch (error) {

      console.log(error.response?.data);

    }

  };



  // ==============================
  // UPDATE STATUS
  // ==============================

  const updateStatus = async (id, status) => {

    try {

      await API.put(
        `/grievances/${id}`,
        { status }
      );

      fetchGrievances();

    } catch (error) {

      console.log(error.response?.data);

    }

  };



  // ==============================
  // ADD COMMENT
  // ==============================

  const addComment = async (id) => {

    try {

      await API.post(
        `/grievances/${id}/comment`,
        {
          message: commentText[id],
        }
      );

      setCommentText({
        ...commentText,
        [id]: "",
      });

      fetchGrievances();

    } catch (error) {

      console.log(error.response?.data);

    }

  };



  // ==============================
  // ASSIGN DEPARTMENT
  // ==============================

  const assignDepartment = async (
    id,
    department
  ) => {

    try {

      await API.put(
        `/grievances/${id}/department`,
        {
          department,
        }
      );

      fetchGrievances();

    } catch (error) {

      console.log(error.response?.data);

    }

  };



  // ==============================
  // STATUS COLORS
  // ==============================

  const statusColor = (status) => {

    if (status === "Resolved") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";

  };



  return (

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">

        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Grievances
        </h2>

        <p className="text-slate-500">
          Track and manage grievances
        </p>

      </div>



      {/* STUDENT CREATE FORM */}
      {role === "student" && (

        <form
          onSubmit={createGrievance}
          className="glass-card p-6 rounded-2xl mb-6 fade-in"
        >

          <h3 className="font-bold text-lg mb-4 text-slate-800">
            Submit a New Grievance
          </h3>

          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="input-field mb-3"
            required
          />

          <textarea
            name="description"
            placeholder="Describe your grievance..."
            value={form.description}
            onChange={handleChange}
            className="input-field mb-3 min-h-[100px]"
            required
          />

          <input
            name="category"
            placeholder="Category (Academic, Hostel, Technical)"
            value={form.category}
            onChange={handleChange}
            className="input-field mb-4"
            required
          />

          <button className="btn-primary">
            Submit Grievance
          </button>

        </form>

      )}



      {/* FILTER SECTION */}
      {(role === "authority" ||
        role === "admin") && (

        <div className="glass-card p-5 rounded-2xl mb-6">

          <h3 className="font-bold text-lg mb-4">
            Filters
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            {/* CATEGORY FILTER */}
            <select
              className="input-field"
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >

              <option value="">
                All Categories
              </option>

              <option value="Academic">
                Academic
              </option>

              <option value="Hostel">
                Hostel
              </option>

              <option value="Technical">
                Technical
              </option>

            </select>



            {/* DEPARTMENT FILTER */}
            <select
              className="input-field"
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
            >

              <option value="">
                All Departments
              </option>

              <option value="Academic">
                Academic
              </option>

              <option value="Hostel">
                Hostel
              </option>

              <option value="Technical">
                Technical
              </option>

              <option value="Library">
                Library
              </option>

            </select>

          </div>

        </div>

      )}



      {/* GRIEVANCE LIST */}
      <div className="grid gap-5">

        {grievances.length === 0 && (

          <div className="text-center py-16 text-slate-400">

            <div className="text-6xl mb-3">
              📭
            </div>

            <p>No grievances found</p>

          </div>

        )}



        {grievances.map((g) => (

          <div
            key={g._id}
            className="glass-card p-6 rounded-2xl card-hover"
          >

            {/* HEADER */}
            <div className="flex justify-between items-start gap-4 mb-3">

              <div>

                <h3 className="font-bold text-xl text-slate-800">
                  {g.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-2">

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {g.category}
                  </span>

                  {g.department && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {g.department}
                    </span>
                  )}

                </div>

              </div>



              {/* STATUS */}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor(g.status)}`}
              >
                {g.status}
              </span>

            </div>



            {/* DESCRIPTION */}
            <p className="text-slate-600 mb-4">
              {g.description}
            </p>



            {/* COMMENT THREAD */}
            {g.comments?.length > 0 && (

              <div className="mt-4 border-t pt-4">

                <h4 className="font-semibold mb-3 text-slate-700">
                  Discussion
                </h4>

                <div className="space-y-3">

                  {g.comments.map((c, index) => (

                    <div
                      key={index}
                      className="bg-slate-50 p-3 rounded-xl"
                    >

                      <div className="flex justify-between mb-1">

                        <span className="font-semibold text-sm text-slate-700">
                          {c.commentedBy?.name}
                        </span>

                        <span className="text-xs text-slate-500">
                          {new Date(
                            c.createdAt
                          ).toLocaleString()}
                        </span>

                      </div>

                      <p className="text-sm text-slate-700">
                        {c.message}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            )}



            {/* AUTHORITY CONTROLS */}
            {(role === "authority" ||
              role === "admin") && (

              <div className="mt-5 border-t pt-5">

                {/* STATUS BUTTONS */}
                <div className="flex flex-wrap gap-3 mb-4">

                  <button
                    onClick={() =>
                      updateStatus(
                        g._id,
                        "In Progress"
                      )
                    }
                    className="btn-warning text-sm"
                  >
                    Mark In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        g._id,
                        "Resolved"
                      )
                    }
                    className="btn-success text-sm"
                  >
                    Resolve
                  </button>

                </div>



                {/* ASSIGN DEPARTMENT */}
                <select
                  className="input-field mb-4"
                  onChange={(e) =>
                    assignDepartment(
                      g._id,
                      e.target.value
                    )
                  }
                  value={g.department || ""}
                >

                  <option value="">
                    Assign Department
                  </option>

                  <option value="Academic">
                    Academic
                  </option>

                  <option value="Hostel">
                    Hostel
                  </option>

                  <option value="Technical">
                    Technical
                  </option>

                  <option value="Library">
                    Library
                  </option>

                </select>



                {/* COMMENT BOX */}
                <textarea
                  placeholder="Write comment..."
                  className="input-field mb-3"
                  value={commentText[g._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [g._id]:
                        e.target.value,
                    })
                  }
                />

                <button
                  onClick={() =>
                    addComment(g._id)
                  }
                  className="btn-primary"
                >
                  Add Comment
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default Grievances;