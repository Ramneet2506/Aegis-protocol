import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import opportunitiesAPI from "../services/opportunitiesApi";

// Query keys
export const opportunityKeys = {
  all: ["opportunities"],
  list: () => [...opportunityKeys.all, "list"],
  detail: (id) => [...opportunityKeys.all, "detail", id],
  myApplications: () => [...opportunityKeys.all, "my-applications"],
};

// Get all opportunities
export const useOpportunities = (options = {}) => {
  return useQuery({
    queryKey: opportunityKeys.list(),
    queryFn: () => opportunitiesAPI.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get single opportunity
export const useOpportunity = (id, options = {}) => {
  return useQuery({
    queryKey: opportunityKeys.detail(id),
    queryFn: () => opportunitiesAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get user's applications
export const useMyApplications = (options = {}) => {
  return useQuery({
    queryKey: opportunityKeys.myApplications(),
    queryFn: () => opportunitiesAPI.getMyApplications(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Create opportunity
export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityData) => opportunitiesAPI.create(opportunityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
    },
  });
};

// Update opportunity
export const useUpdateOpportunity = (opportunityId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityData) => opportunitiesAPI.update(opportunityId, opportunityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.detail(opportunityId) });
      queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
    },
  });
};

// Delete opportunity
export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityId) => opportunitiesAPI.delete(opportunityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
    },
  });
};

// Apply for opportunity
export const useApplyOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityId) => opportunitiesAPI.apply(opportunityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.myApplications() });
    },
  });
};
