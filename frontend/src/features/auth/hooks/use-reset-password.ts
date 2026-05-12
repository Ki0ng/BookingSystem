'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { authService } from '../services/auth.service';
import { ApiErrorResponse } from '@/shared/types';

/**
 * Hook to handle password reset logic
 */
export const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or expired reset token.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await authService.resetPassword({ token, password });
      if (res.success) {
        setMessage('Password has been reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(res.message || 'Something went wrong');
      }
    } catch (err) {
      let msg = 'Something went wrong. Please try again.';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        msg = err.response?.data?.message || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    message,
    error,
    handleSubmit
  };
};
