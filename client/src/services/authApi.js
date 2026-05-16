import API from "./api";

export const authAPI = {
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      return JSON.parse(user);
    }
    return null;
  },
};

export default authAPI;
