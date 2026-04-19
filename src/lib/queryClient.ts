import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ENV } from '@/src/config/env';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show error toast for queries that have already loaded data
      // This prevents double-toasts on initial load failures
      if (query.state.data !== undefined) {
        toast.error(`Something went wrong: ${error.message}`);
      }

      if (!ENV.FRONTEND_ONLY) {
        console.error('Query error:', error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (!ENV.FRONTEND_ONLY) {
        console.error('Mutation error:', error);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});
