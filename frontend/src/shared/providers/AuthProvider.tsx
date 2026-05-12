'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@features/auth';
import { User } from '@/shared/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 🚀 Sử dụng React Query để quản lý Profile
  const {
    data: userData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      try {
        const res = await authService.getProfile();
        return res.user || res.data || null;
      } catch (err: any) {
        console.error('❌ Failed to fetch user profile:', err.response?.data || err.message);
        return null;
      }
    },
    staleTime: 1000 * 60 * 15, // Coi profile là tươi trong 15 phút
    gcTime: 1000 * 60 * 30,    // Giữ trong bộ nhớ 30 phút
    retry: false, // Không thử lại nếu lỗi 401
  });

  const logout = async () => {
    try {
      await authService.logout();
      // Xóa sạch cache và storage sau khi logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(['auth', 'profile'], null);
      queryClient.clear();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
      router.push('/login');
    }
  };

  const refreshProfile = () => {
    refetch();
  };

  return (
    <AuthContext.Provider value={{
      user: userData || null,
      loading,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
