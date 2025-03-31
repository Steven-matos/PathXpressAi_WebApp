import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { 
  fetchApiData, 
  selectApiData, 
  selectApiLoading, 
  selectApiError,
  selectApiLastFetched,
  clearApiData
} from '@/store/apiDataSlice';
import type { ApiData } from '@/store/apiDataSlice';

interface UseApiDataOptions {
  autoFetch?: boolean;
  refreshInterval?: number | null;
  skipIfAlreadyLoaded?: boolean;
}

export function useApiData<T = any>(
  endpoint: keyof ApiData, 
  params?: Record<string, any>,
  options: UseApiDataOptions = {}
) {
  const { 
    autoFetch = true, 
    refreshInterval = null, 
    skipIfAlreadyLoaded = false 
  } = options;
  
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectApiData(endpoint)) as T | undefined;
  const isLoading = useAppSelector(selectApiLoading(endpoint));
  const error = useAppSelector(selectApiError(endpoint));
  const lastFetched = useAppSelector(selectApiLastFetched(endpoint));

  // Function to fetch data
  const fetchData = useCallback(() => {
    return dispatch(fetchApiData({ endpoint, params }));
  }, [dispatch, endpoint, params]);

  // Function to clear the data
  const clearData = useCallback(() => {
    dispatch(clearApiData(endpoint));
  }, [dispatch, endpoint]);

  // Auto-fetch data when component mounts
  useEffect(() => {
    if (autoFetch) {
      // Skip fetching if data is already loaded and skipIfAlreadyLoaded is true
      if (skipIfAlreadyLoaded && data !== undefined) {
        return;
      }
      
      fetchData();
    }
  }, [autoFetch, data, fetchData, skipIfAlreadyLoaded]);

  // Set up refresh interval if specified
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData();
      }, refreshInterval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    lastFetched,
    refresh: fetchData,
    clear: clearData
  };
} 