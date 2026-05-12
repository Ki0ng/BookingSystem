'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { hotelService } from '@/features/hotels/services/hotel.service';
import { ApiErrorResponse, HotelImage, HotelAmenity } from '@/shared/types';

/**
 * Hook to manage hotel editing logic
 */
export const useEditHotel = () => {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    location_lat: 0,
    location_lng: 0,
    images: [] as string[],
    amenities: [] as string[]
  });

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await hotelService.getHotelById(id as string);
      if (response.success && response.data) {
        const hotel = response.data;
        setFormData({
          name: hotel.name,
          description: hotel.description || '',
          address: hotel.address,
          location_lat: hotel.location_lat || 0,
          location_lng: hotel.location_lng || 0,
          images: hotel.images ? hotel.images.map((img: HotelImage) => img.url) : [],
          amenities: hotel.amenities ? hotel.amenities.map((a: HotelAmenity) => a.name) : []
        });
      }
    } catch (err) {
      setError('Could not load hotel details.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = (url: string) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }));
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
      const response = await hotelService.updateHotel(id as string, payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager', 'hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels', 'featured'] });
      router.refresh();
      router.push('/manager/hotels');
    },
    onError: (err: any) => {
      let msg = 'Something went wrong. Please try again.';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        msg = err.response?.data?.message || msg;
      }
      setError(msg);
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const filteredImages = formData.images.filter(url => url.trim() !== '');

    const payload = {
      ...formData,
      location_lat: parseFloat(formData.location_lat.toString()),
      location_lng: parseFloat(formData.location_lng.toString()),
      images: filteredImages
    };

    mutation.mutate(payload);
  };


  return {
    loading,
    saving: mutation.isPending,
    error,
    formData,
    updateFormData,
    addImage,
    removeImage,
    toggleAmenity,
    handleSubmit
  };
};
