'use client';

import { useState } from 'react';
import axios from 'axios';
import { authService } from '../services/auth.service';
import { ApiErrorResponse } from '@/shared/types';

/**
 * Hook to handle forgot password requests
 */
export const useForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await authService.forgotPassword(emailOrPhone);
      if (res.success) {
        setMessage('If an account exists, a reset link has been sent to your email or phone.');
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
    emailOrPhone,
    setEmailOrPhone,
    loading,
    message,
    error,
    handleSubmit
  };
};
