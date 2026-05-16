import React from "react";
import { useAuthStore } from "../context/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">My Profile</h1>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 text-white text-2xl font-bold mx-auto mb-4">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-sm text-slate-600 font-semibold">Name</label>
                  <p className="text-lg text-slate-900 mt-1">{user.name}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-sm text-slate-600 font-semibold">Email</label>
                  <p className="text-lg text-slate-900 mt-1">{user.email}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-sm text-slate-600 font-semibold">Role</label>
                  <p className="text-lg text-slate-900 mt-1 capitalize">{user.role}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="text-sm text-slate-600 font-semibold">User ID</label>
                  <p className="text-sm text-slate-900 mt-1 break-all font-mono">{user.id}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition font-semibold"
                >
                  Back to Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-600">Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
