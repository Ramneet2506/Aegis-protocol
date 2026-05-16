import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch (error) {
      console.log(error.response);

alert(
  error.response?.data?.message || 
  error.message || 
  "Registration failed"
);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)'
    }}>
      <div className="absolute top-10 right-10 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            AEGIS
          </h1>
          <p className="text-white/80">Create your account</p>
        </div>

        <form onSubmit={handleRegister} className="glass-card p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Register</h2>

          <input name="name" placeholder="Full Name" className="input-field mb-3"
            onChange={handleChange} required />

          <input name="email" type="email" placeholder="Email Address"
            className="input-field mb-3" onChange={handleChange} required />

          <input name="password" type="password" placeholder="Password"
            className="input-field mb-3" onChange={handleChange} required />

          <select name="role" className="input-field mb-6" onChange={handleChange}>
            <option value="student">🎓 Student</option>
            <option value="faculty">👨‍🏫 Faculty</option>
            <option value="authority">⚖️ Authority</option>
          </select>

          <button className="btn-primary w-full text-base">
            Create Account →
          </button>

          <p className="text-sm mt-6 text-center text-slate-600">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
