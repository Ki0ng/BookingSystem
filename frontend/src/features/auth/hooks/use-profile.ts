'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/features/auth/services/auth.service';
import { User } from '@/shared/types';
import { validators, validationMessages } from '@/shared/utils/validation';

/**
 * Hook to handle user profile data and updates
 */
export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        // @ts-ignore - Sẽ fix kiểu data sau khi audit Types
        if (data.user) {
          // @ts-ignore
          setUser(data.user);
          // @ts-ignore
          setName(data.user.name || '');
          // @ts-ignore
          setPhone(data.user.phone || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!validators.isValidName(name)) {
      setMessage({ type: 'error', text: validationMessages.invalidName });
      return;
    }

    if (phone && !validators.isValidPhone(phone)) {
      setMessage({ type: 'error', text: validationMessages.invalidPhone });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await authService.updateProfile({ name, phone });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (user) setUser({ ...user, name, phone });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    saving,
    name,
    setName,
    phone,
    setPhone,
    message,
    setMessage,
    handleSave,
    logout
  };
};
