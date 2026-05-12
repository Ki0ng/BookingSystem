'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { hotelService } from '@/features/hotels/services/hotel.service';
import type { Hotel } from '@/shared/types';

/**
 * Hook to manage manager room inventory logic
 */
export const useManagerRooms = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const hotelId = searchParams.get('hotelId');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    room_type: '',
    base_price: '',
    quantity: '1',
    capacity: '2',
    images: [] as string[],
  });

  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Queries
  const { data: myHotels = [], isLoading: hotelsLoading } = useQuery<Hotel[]>({
    queryKey: ['manager', 'hotels'],
    queryFn: async () => {
      const res = await hotelService.getMyHotels();
      return res.data || [];
    },
    enabled: !hotelId
  });

  const { data: roomData, isLoading: roomsLoading } = useQuery({
    queryKey: ['manager', 'rooms', hotelId],
    queryFn: async () => {
      if (!hotelId) return { rooms: [], hotel: null };
      const [roomsRes, hotelRes] = await Promise.all([
        hotelService.getRoomsByHotelId(hotelId),
        hotelService.getHotelById(hotelId)
      ]);
      return {
        rooms: roomsRes.data || [],
        hotel: hotelRes.data || null
      };
    },
    enabled: !!hotelId
  });

  const rooms = roomData?.rooms || [];
  const hotel = roomData?.hotel || null;
  const loading = hotelId ? roomsLoading : hotelsLoading;

  useEffect(() => {
    if (searchParams.get('setup') === 'true') {
      setShowSetupGuide(true);
      setShowAddForm(true);
    }
  }, [searchParams]);

  // Mutations
  const createRoomMutation = useMutation({
    mutationFn: (data: any) => hotelService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager', 'rooms', hotelId] });
      resetForm();
    },
    onError: () => alert('Failed to add room')
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => hotelService.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager', 'rooms', hotelId] });
      resetForm();
    },
    onError: () => alert('Failed to update room')
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => hotelService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager', 'rooms', hotelId] });
    },
    onError: () => alert('Failed to delete room')
  });

  const resetForm = () => {
    setShowAddForm(false);
    setEditingRoomId(null);
    setFormData({ room_type: '', base_price: '', quantity: '1', capacity: '2', images: [] });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hotelId) return;

    const payload = {
      ...formData,
      hotelId,
      base_price: parseFloat(formData.base_price),
      quantity: parseInt(formData.quantity),
      capacity: parseInt(formData.capacity),
      images: formData.images.filter(url => url.trim() !== '')
    };

    if (editingRoomId) {
      updateRoomMutation.mutate({ id: editingRoomId, data: payload });
    } else {
      createRoomMutation.mutate(payload);
    }
  };

  const handleEdit = (room: any) => {
    setEditingRoomId(room.id);
    setFormData({
      room_type: room.room_type,
      base_price: room.base_price.toString(),
      quantity: room.quantity.toString(),
      capacity: room.capacity.toString(),
      images: room.images?.map((img: any) => img.url) || []
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this room type?')) return;
    deleteRoomMutation.mutate(id);
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    rooms,
    hotel,
    loading,
    showAddForm,
    setShowAddForm,
    editingRoomId,
    submitting: createRoomMutation.isPending || updateRoomMutation.isPending,
    myHotels,
    formData,
    updateFormData,
    showSetupGuide,
    setShowSetupGuide,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    hotelId,
    router
  };
};

