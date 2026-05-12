'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/core/api/api-client';
import { useAuth } from '@features/auth';
import { useHotelDetails } from './use-hotel-details';
import { useHotelReviews } from '@features/reviews';
import { Room, ApiErrorResponse } from '@/shared/types';
import { PaymentData } from '@/features/bookings/types';

/**
 * Hook to handle hotel detail page logic (booking, room selection)
 */
export const useHotelPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const { data: hotel, isLoading: hotelLoading } = useHotelDetails(id || '');
  const {
    reviews,
    isLoading: reviewsLoading,
    sort: reviewSort,
    setSort: setReviewSort,
    pagination: reviewPagination,
    refetch: refreshReviews
  } = useHotelReviews(id || '');

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCheckOut, setSelectedCheckOut] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [flexibilityParam, setFlexibilityParam] = useState(parseInt(searchParams.get('flexibility') || '0'));

  const guestsParam = parseInt(searchParams.get('guests') || '2');

  useEffect(() => {
    if (hotel?.rooms && hotel.rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(hotel.rooms[0]);
    }
  }, [hotel, selectedRoom]);

  const handleBookingClick = () => {
    if (!user) {
      router.push(`/login?redirect=/hotels/${id}`);
      return;
    }
    if (!selectedRoom) {
      alert('Please select a room first');
      return;
    }
    setShowPaymentModal(true);
  };

  const confirmPayment = async (paymentData: PaymentData) => {
    if (!id || !selectedRoom) return;

    setBookingLoading(true);
    try {
      await apiClient.post('/bookings', {
        hotelId: id,
        roomId: selectedRoom.id,
        checkIn: new Date(selectedCheckIn).toISOString(),
        checkOut: new Date(selectedCheckOut).toISOString(),
        totalPrice: selectedRoom.base_price,
        guests: guestsParam
      });
      alert('Booking confirmed! Payment successful.');
      router.push('/bookings');
    } catch (err) {
      let message = 'Failed to complete booking';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        message = err.response?.data?.message || message;
      }
      alert(message);
    } finally {
      setBookingLoading(false);
      setShowPaymentModal(false);
    }
  };

  return {
    id,
    user,
    hotel,
    hotelLoading,
    reviews,
    reviewsLoading,
    reviewSort,
    setReviewSort,
    reviewPagination,
    refreshReviews,
    selectedRoom,
    setSelectedRoom,
    bookingLoading,
    showPaymentModal,
    setShowPaymentModal,
    selectedCheckIn,
    setSelectedCheckIn,
    selectedCheckOut,
    setSelectedCheckOut,
    flexibilityParam,
    setFlexibilityParam,
    guestsParam,
    handleBookingClick,
    confirmPayment
  };
};
