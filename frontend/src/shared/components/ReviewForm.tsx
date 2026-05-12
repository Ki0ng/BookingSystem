'use client';

import React from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import StarRating from './ui/StarRating';
import { Button } from './ui/Button';
import { useReviewForm } from '@features/reviews';

interface ReviewFormProps {
  hotelId: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ hotelId, onSuccess }) => {
  const {
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    error,
    success,
    setSuccess,
    handleSubmit
  } = useReviewForm({ hotelId, onSuccess });

  if (success) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-green-200">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Thank You!</h3>
        <p className="text-green-700">Your review has been submitted and is currently pending moderation.</p>
        <Button
          variant="outline"
          className="mt-6 border-green-200 text-green-700 hover:bg-green-100"
          onClick={() => setSuccess(false)}
        >
          Submit another review
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Leave a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size={32}
            className="py-2"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400 resize-none"
            placeholder="Share your experience at this hotel..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${comment.length >= 450 ? 'text-red-500' : 'text-gray-400'}`}>
              {comment.length}/500
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <>
              <Send size={20} />
              <span>Post Review</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
