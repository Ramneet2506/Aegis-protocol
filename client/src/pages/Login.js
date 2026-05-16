import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      alert("Login successful");

      navigate("/dashboard");

    } catch (error) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
        "Invalid credentials"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "Space Grotesk" }}
          >
            AEGIS
          </h1>

          <p className="text-white/80">
            Welcome back, please sign in
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="glass-card p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-800">
            Sign In
          </h2>

          {/* EMAIL */}
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            className="input-field mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="input-field mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* BUTTON */}
          <button className="btn-primary w-full text-base">
            Sign In →
          </button>

          {/* REGISTER LINK */}
          <p className="text-sm mt-6 text-center text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;