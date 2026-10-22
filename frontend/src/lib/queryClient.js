 import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,         
      cacheTime: 10 * 60 * 1000,       
      retry: (failureCount, error) => {
        if (error.response?.status >= 400) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Something went wrong!');
      },
    },
  },
});
