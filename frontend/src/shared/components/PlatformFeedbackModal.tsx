'use client';

import React from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from './ui/Button';
import StarRating from './ui/StarRating';
import { usePlatformFeedback } from '@features/reviews';

interface PlatformFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PlatformFeedbackModal: React.FC<PlatformFeedbackModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    isSuccess,
    error,
    handleSubmit
  } = usePlatformFeedback({ onClose, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-200 animate-in zoom-in duration-500">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Thank You!</h3>
              <p className="text-slate-500 mt-2 font-medium">Your feedback helps us build a more elite experience for everyone.</p>
            </div>
          </div>
        ) : (
          <div className="p-10 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">App Feedback</h3>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-0.5">Voice of the guest</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rate your experience</label>
                <StarRating 
                  rating={rating} 
                  onRatingChange={setRating} 
                  size={40} 
                  className="justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your thoughts</label>
                <textarea 
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                  placeholder="Tell us what you love about Elite Booking, or how we can improve..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                variant="premium" 
                className="w-full h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
