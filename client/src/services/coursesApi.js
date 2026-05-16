import API from "./api";

export const coursesAPI = {
  // Get all courses
  getAll: async (params = {}) => {
    const response = await API.get("/courses", { params });
    return response.data;
  },

  // Get single course
  getById: async (id) => {
    const response = await API.get(`/courses/${id}`);
    return response.data;
  },

  // Create course
  create: async (courseData) => {
    const response = await API.post("/courses", courseData);
    return response.data;
  },

  // Update course
  update: async (id, courseData) => {
    const response = await API.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Delete course
  delete: async (id) => {
    const response = await API.delete(`/courses/${id}`);
    return response.data;
  },

  // Enroll in course
  enroll: async (courseId) => {
    const response = await API.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Unenroll from course
  unenroll: async (courseId) => {
    const response = await API.post(`/courses/${courseId}/unenroll`);
    return response.data;
  },

  // Add resource
  addResource: async (courseId, resourceData) => {
    const response = await API.post(`/courses/${courseId}/resource`, resourceData);
    return response.data;
  },

  // Add announcement
  addAnnouncement: async (courseId, announcementData) => {
    const response = await API.post(`/courses/${courseId}/announcement`, announcementData);
    return response.data;
  },

  // Get analytics
  getAnalytics: async () => {
    const response = await API.get("/courses/analytics/stats");
    return response.data;
  },
};

export default coursesAPI;
