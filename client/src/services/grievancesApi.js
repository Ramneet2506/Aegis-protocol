import API from "./api";

export const grievancesAPI = {
  // Get all grievances
  getAll: async (params = {}) => {
    const response = await API.get("/grievances", { params });
    return response.data;
  },

  // Get single grievance
  getById: async (id) => {
    const response = await API.get(`/grievances/${id}`);
    return response.data;
  },

  // Create grievance
  create: async (grievanceData) => {
    const response = await API.post("/grievances", grievanceData);
    return response.data;
  },

  // Update grievance
  update: async (id, grievanceData) => {
    const response = await API.put(`/grievances/${id}`, grievanceData);
    return response.data;
  },

  // Delete grievance
  delete: async (id) => {
    const response = await API.delete(`/grievances/${id}`);
    return response.data;
  },

  // Get my grievances
  getMyGrievances: async () => {
    const response = await API.get("/grievances/my/list");
    return response.data;
  },

  // Update grievance status
  updateStatus: async (id, status) => {
    const response = await API.put(`/grievances/${id}/status`, { status });
    return response.data;
  },
};

export default grievancesAPI;
