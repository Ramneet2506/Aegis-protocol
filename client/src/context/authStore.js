import { create } from "zustand";
import authAPI from "../services/authApi";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Initialize auth from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { token, role, userId, name } = response;

      const userData = { id: userId, email, name, role };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      set({
        token,
        user: userData,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Register action
  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        role,
      });

      set({ isLoading: false });
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Logout action
  logout: () => {
    authAPI.logout();
    set({ user: null, token: null, error: null });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
