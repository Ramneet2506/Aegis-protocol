import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/protectedroute";
import { useAuthStore } from "./context/authStore";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth from localStorage on app mount
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
