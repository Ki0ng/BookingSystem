'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { authService } from '../services/auth.service';
import { useAuth } from './use-auth';
import { ApiErrorResponse } from '@/shared/types';

interface LocationItem {
  name: string;
  code: number;
}

/**
 * Hook to handle manager application logic
 */
export const useApplyManager = () => {
  const router = useRouter();
  const { user, refreshProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    hotelName: '',
    hotelAddress: '',
    hotelDescription: '',
    phone: '',
    businessLicense: '',
  });

  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<LocationItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LocationItem | null>(null);

  const [showProvincePicker, setShowProvincePicker] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);

  // Authentication and Role check
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'MANAGER' || user.role === 'ADMIN') {
        router.push('/manager/dashboard');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error('Failed to fetch provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
          const data = await res.json();
          setDistricts(data.districts);
          setSelectedDistrict(null);
        } catch (err) {
          console.error('Failed to fetch districts:', err);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    const parts = [
      selectedDistrict?.name,
      selectedProvince?.name
    ].filter(Boolean);
    setFormData(prev => ({ ...prev, hotelAddress: parts.join(', ') }));
  }, [selectedProvince, selectedDistrict]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvince || !selectedDistrict) {
      setError('Please select full address (Province and District)');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await authService.applyManager(formData);
      refreshProfile();
      setSuccess(true);
    } catch (err) {
      let msg = 'Failed to submit application';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        msg = err.response?.data?.message || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    user,
    authLoading,
    loading,
    success,
    error,
    formData,
    updateFormData,
    provinces,
    districts,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    showProvincePicker,
    setShowProvincePicker,
    showDistrictPicker,
    setShowDistrictPicker,
    handleSubmit
  };
};
