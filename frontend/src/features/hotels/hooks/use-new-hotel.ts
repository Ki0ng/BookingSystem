'use client';

import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { hotelService } from '@/features/hotels/services/hotel.service';
import { authService } from '@features/auth';
import { ApiErrorResponse } from '@/shared/types';
import axios from 'axios';

/**
 * Hook to handle new hotel application logic
 */
export const useNewHotel = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    images: [] as string[],
    amenities: [] as string[],
    location_lat: 0,
    location_lng: 0,
  });

  const updateFormData = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      if (exists) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await hotelService.createHotel(payload);
      return res;
    },
    onSuccess: async () => {
      // Refresh profile to update role if needed
      await authService.getProfile();
      // Invalidate all hotel-related queries
      queryClient.invalidateQueries({ queryKey: ['manager', 'hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels', 'featured'] });
      
      router.refresh();
      router.push('/manager/hotels');
    },
    onError: (err: any) => {
      let message = 'Failed to create hotel application';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        message = err.response?.data?.message || message;
      }
      setError(message);
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const filteredImages = formData.images.filter(url => url.trim() !== '');
    const payload = {
      ...formData,
      images: filteredImages
    };

    mutation.mutate(payload);
  };


  return {
    formData,
    loading: mutation.isPending,
    error,
    updateFormData,
    addImage,
    removeImage,
    toggleAmenity,
    handleSubmit
  };
};
