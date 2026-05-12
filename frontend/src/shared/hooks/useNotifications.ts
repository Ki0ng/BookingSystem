import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import apiClient from '@/core/api/api-client';
import { useSocket } from '@/shared/providers/SocketProvider';
import { Notification } from '@/shared/types';

export const useNotifications = (userId?: string) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data: notifications = [], refetch } = useQuery<Notification[]>({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiClient.get('/notifications/my');
      return res.data.data || [];
    },
    enabled: !!userId,
    refetchInterval: 60000, // Fallback polling every 60s
  });

  // 🔔 Listen for real-time notification triggers
  useEffect(() => {
    if (!socket || !userId) return;

    const handleUpdate = () => {
      console.log('🔔 Real-time notification trigger received!');
      refetch();
    };

    socket.on('new_review', handleUpdate);
    socket.on('new_booking', handleUpdate);
    socket.on('new_application', handleUpdate);
    socket.on('booking_updated', handleUpdate);
    socket.on('review_replied', handleUpdate);

    return () => {
      socket.off('new_review', handleUpdate);
      socket.off('new_booking', handleUpdate);
      socket.off('new_application', handleUpdate);
      socket.off('booking_updated', handleUpdate);
      socket.off('review_replied', handleUpdate);
    };
  }, [socket, userId, refetch]);

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => apiClient.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead: markReadMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
    refetch
  };
};
