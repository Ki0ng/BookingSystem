'use client';

import { useState } from 'react';
import axios from 'axios';
import { reviewService } from '../services/review.service';
import { ApiErrorResponse } from '@/shared/types';

interface UsePlatformFeedbackProps {
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Hook to handle platform-wide feedback submission
 */
export const usePlatformFeedback = ({ onClose, onSuccess }: UsePlatformFeedbackProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        rating,
        comment: comment.trim() || undefined,
      });
      
      setIsSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setRating(0);
        setComment('');
      }, 3000);
    } catch (err) {
      let message = 'Failed to submit feedback';
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        message = err.response?.data?.message || message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setRating(0);
    setComment('');
    setError(null);
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    isSuccess,
    error,
    handleSubmit,
    reset
  };
};
