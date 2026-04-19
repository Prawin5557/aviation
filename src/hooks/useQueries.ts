import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { logger } from '@/src/utils/logger';

const handleMutationError = (error: Error, context: string) => {
  logger.error(`Mutation error in ${context}`, { error: error.message });
  toast.error(`Failed to ${context}. Please try again.`);
};

// Jobs Hooks
export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await apiService.getJobs();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useJobActions = () => {
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: (data: any) => apiService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job posted successfully');
    },
    onError: (error: Error) => {
      handleMutationError(error, 'create job');
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job updated successfully');
    },
    onError: (error: Error) => {
      handleMutationError(error, 'update job');
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error: Error) => {
      handleMutationError(error, 'delete job');
    },
  });

  return {
    createJob: createJobMutation.mutateAsync,
    updateJob: updateJobMutation.mutateAsync,
    deleteJob: deleteJobMutation.mutateAsync,
    isSubmitting: createJobMutation.isPending || updateJobMutation.isPending,
  };
};

// Applications Hooks
export const useApplications = (userId?: string) => {
  return useQuery({
    queryKey: ['applications', userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await apiService.getApplications(userId || '');
      return res.data;
    },
    initialData: [],
  });
};

export const useApplicationActions = () => {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: ({ jobId, userId }: { jobId: string; userId: string }) => 
      apiService.applyForJob(jobId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application submitted successfully');
    },
    onError: (error: Error) => handleMutationError(error, 'submit application'),
  });

  return {
    apply: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
  };
};

export const useApplicationManagement = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      apiService.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application status updated');
    },
    onError: (error: Error) => handleMutationError(error, 'update application status'),
  });

  return {
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
  };
};

// User Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiService.getAllUsers();
      return res.data;
    },
  });
};

export const useSavedJobs = (userId?: string) => {
  return useQuery({
    queryKey: ['saved-jobs', userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await apiService.getSavedJobs(userId || '');
      return res.data;
    },
    initialData: [],
  });
};

export const useUserActions = () => {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => handleMutationError(error, 'update user'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => handleMutationError(error, 'delete user'),
  });

  return {
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
  };
};

// Stats Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await apiService.getDashboardStats();
      return res.data;
    },
  });
};

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await apiService.getLeads();
      return res.data;
    },
  });
};
