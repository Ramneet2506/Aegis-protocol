import API from "./api";

export const opportunitiesAPI = {
  // Get all opportunities
  getAll: async (params = {}) => {
    const response = await API.get("/opportunities", { params });
    return response.data;
  },

  // Get single opportunity
  getById: async (id) => {
    const response = await API.get(`/opportunities/${id}`);
    return response.data;
  },

  // Create opportunity
  create: async (opportunityData) => {
    const response = await API.post("/opportunities", opportunityData);
    return response.data;
  },

  // Update opportunity
  update: async (id, opportunityData) => {
    const response = await API.put(`/opportunities/${id}`, opportunityData);
    return response.data;
  },

  // Delete opportunity
  delete: async (id) => {
    const response = await API.delete(`/opportunities/${id}`);
    return response.data;
  },

  // Apply for opportunity
  apply: async (opportunityId) => {
    const response = await API.post(`/opportunities/${opportunityId}/apply`);
    return response.data;
  },

  // Get user applications
  getMyApplications: async () => {
    const response = await API.get("/opportunities/my/applications");
    return response.data;
  },
};

export default opportunitiesAPI;
