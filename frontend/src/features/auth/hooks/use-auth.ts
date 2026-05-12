'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { authService } from '../services/auth.service';
import { useAuthContext } from '@/shared/providers/AuthProvider';
import { ApiErrorResponse } from '@/shared/types';

/**
 * Hook to handle authentication logic (OTP, Verification, Logout)
 */
export const useAuth = () => {
  const {
    user,
    loading,
    refreshProfile,
    logout
  } = useAuthContext();

  const [localError, setLocalError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const sendOTP = async (email: string) => {
    setLocalError('');
    setLocalLoading(true);
    try {
      await authService.sendOTP(email);
      return true;
    } catch (err) {
      let message = 'Failed to send verification code';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        message = err.response?.data?.message || message;
      }
      setLocalError(message);
      return false;
    } finally {
      setLocalLoading(false);
    }
  };

  const verifyOTP = async (email: string, code: string) => {
    setLocalError('');
    setLocalLoading(true);
    try {
      const res = await authService.verifyOTP(email, code);
      const userData = res.user;
      
      if (userData) {
        // 🚀 Store tokens in localStorage for the API interceptor
        if (res.accessToken) localStorage.setItem('accessToken', res.accessToken);
        if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);

        // 🚀 Update React Query cache
        queryClient.setQueryData(['auth', 'profile'], userData);
        
        // Direct redirect based on role
        if (userData.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (userData.role === 'MANAGER') {
          router.push('/manager/dashboard');
        } else {
          router.push('/');
        }
      }
      return true;
    } catch (err) {
      let message = 'Invalid verification code';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        message = err.response?.data?.message || message;
      }
      setLocalError(message);
      return false;
    } finally {
      setLocalLoading(false);
    }
  };

  return {
    user,
    sendOTP,
    verifyOTP,
    logout,
    refreshProfile,
    error: localError,
    loading: loading || localLoading
  };
};
