import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import grievancesAPI from "../services/grievancesApi";

// Query keys
export const grievanceKeys = {
  all: ["grievances"],
  list: () => [...grievanceKeys.all, "list"],
  detail: (id) => [...grievanceKeys.all, "detail", id],
  myGrievances: () => [...grievanceKeys.all, "my-grievances"],
};

// Get all grievances (admin/authority only)
export const useGrievances = (options = {}) => {
  return useQuery({
    queryKey: grievanceKeys.list(),
    queryFn: () => grievancesAPI.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get single grievance
export const useGrievance = (id, options = {}) => {
  return useQuery({
    queryKey: grievanceKeys.detail(id),
    queryFn: () => grievancesAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get user's grievances
export const useMyGrievances = (options = {}) => {
  return useQuery({
    queryKey: grievanceKeys.myGrievances(),
    queryFn: () => grievancesAPI.getMyGrievances(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Create grievance
export const useCreateGrievance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (grievanceData) => grievancesAPI.create(grievanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.myGrievances() });
    },
  });
};

// Update grievance
export const useUpdateGrievance = (grievanceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (grievanceData) => grievancesAPI.update(grievanceId, grievanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.detail(grievanceId) });
      queryClient.invalidateQueries({ queryKey: grievanceKeys.list() });
    },
  });
};

// Delete grievance
export const useDeleteGrievance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (grievanceId) => grievancesAPI.delete(grievanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.myGrievances() });
    },
  });
};

// Update grievance status
export const useUpdateGrievanceStatus = (grievanceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status) => grievancesAPI.updateStatus(grievanceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grievanceKeys.detail(grievanceId) });
      queryClient.invalidateQueries({ queryKey: grievanceKeys.list() });
    },
  });
};
