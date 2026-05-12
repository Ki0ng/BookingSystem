import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import StarRating from '@/shared/components/ui/StarRating';
import { PlatformReview, User } from '@/shared/types';

interface TestimonialsProps {
  reviews: PlatformReview[];
  loading: boolean;
  user: User | null;
  onOpenFeedback: () => void;
}

export const Testimonials = ({ reviews, loading, user, onOpenFeedback }: TestimonialsProps) => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl text-left">
            <span className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">Voices of Luxury</h2>
          </div>
          {user && (
            <Button
              onClick={onOpenFeedback}
              variant="outline"
              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 h-12 px-8 font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Write a Testimonial
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white p-8 rounded-[2rem] h-64 animate-pulse border border-gray-100" />
            ))
          ) : reviews.length > 0 ? (
            reviews.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
                <div>
                  <div className="flex gap-1 mb-5">
                    <StarRating rating={t.rating} readOnly size={14} />
                  </div>
                  <p className="text-gray-600 text-base italic font-medium leading-relaxed mb-6 group-hover:text-slate-900 transition-colors">"{t.comment}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                    {t.user.avatar ? (
                      <img src={t.user.avatar} alt={t.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-50 uppercase text-xs">
                        {t.user.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 truncate text-[13px] tracking-tight">{t.user.name}</p>
                    <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Verified Elite Member</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-center">
              <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-6" />
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">No Testimonials Yet</h4>
              {user && (
                <Button onClick={onOpenFeedback} variant="premium" className="px-8 h-12 rounded-xl mt-4 text-xs font-bold uppercase tracking-widest">
                  Share Your Feedback
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
