'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import { AdminStats } from '@/shared/types';

export const useAdminDashboard = () => {
  const { data: stats = {
    totalUsers: 0,
    totalHotels: 0,
    pendingApps: 0,
    systemHealth: 'Stable'
  }, isLoading: loading } = useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await dashboardService.getAdminStats();
      return res.data || {
        totalUsers: 0,
        totalHotels: 0,
        pendingApps: 0,
        systemHealth: 'Stable'
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  return {
    stats,
    loading
  };
};
