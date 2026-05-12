'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { hotelService } from '@/features/hotels/services/hotel.service';
import { Hotel } from '@/shared/types';

/**
 * Hook to fetch and manage hotels owned by the current manager
 */
export const useManagerHotels = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: hotels = [], isLoading: loading } = useQuery<Hotel[]>({
    queryKey: ['manager', 'hotels'],
    queryFn: async () => {
      const res = await hotelService.getMyHotels();
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hotelService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager', 'hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels', 'featured'] });
      
      router.refresh();
      alert('Hotel deleted successfully');
    },
    onError: () => {
      alert('Failed to delete hotel');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    hotels,
    loading,
    handleDelete
  };
};
