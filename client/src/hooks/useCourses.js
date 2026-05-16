import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import coursesAPI from "../services/coursesApi";

// Query keys
export const courseKeys = {
  all: ["courses"],
  list: () => [...courseKeys.all, "list"],
  detail: (id) => [...courseKeys.all, "detail", id],
  analytics: () => [...courseKeys.all, "analytics"],
};

// Get all courses
export const useCourses = (options = {}) => {
  return useQuery({
    queryKey: courseKeys.list(),
    queryFn: () => coursesAPI.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Get single course
export const useCourse = (id, options = {}) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get course analytics
export const useCourseAnalytics = (options = {}) => {
  return useQuery({
    queryKey: courseKeys.analytics(),
    queryFn: () => coursesAPI.getAnalytics(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// Create course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData) => coursesAPI.create(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
    },
  });
};

// Update course
export const useUpdateCourse = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData) => coursesAPI.update(courseId, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
    },
  });
};

// Delete course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId) => coursesAPI.delete(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
    },
  });
};

// Enroll in course
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId) => coursesAPI.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
    },
  });
};

// Unenroll from course
export const useUnenrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId) => coursesAPI.unenroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
    },
  });
};
