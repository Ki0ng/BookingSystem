'use client';

import { useState } from 'react';
import axios from 'axios';
import { reviewService } from '../services/review.service';
import { ApiErrorResponse } from '@/shared/types';

interface UseReviewFormProps {
  hotelId: string;
  onSuccess?: () => void;
}

/**
 * Hook to handle review submission logic
 */
export const useReviewForm = ({ hotelId, onSuccess }: UseReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a star rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await reviewService.createReview({
        hotelId,
        rating,
        comment: comment.trim() || undefined,
      });

      setSuccess(true);
      setRating(0);
      setComment('');

      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }
    } catch (err) {
      let message = 'Failed to submit review. Please try again.';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        message = err.response?.data?.message || message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    error,
    success,
    setSuccess,
    handleSubmit
  };
};
