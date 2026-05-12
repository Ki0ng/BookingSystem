import React from 'react';
import Link from 'next/link';
import { MessageSquare, Star, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import ReviewCard from '@/shared/components/ui/ReviewCard';
import ReviewForm from '@/shared/components/ReviewForm';
import ReviewSkeleton from '@/shared/components/ui/ReviewSkeleton';
import { User, Review, Pagination, Hotel } from '@/shared/types';

interface HotelReviewsProps {
  hotel: Hotel;
  user: User | null;
  reviews: Review[];
  isLoading: boolean;
  sort: string;
  setSort: (v: string) => void;
  pagination: Pagination | null;
  onRefresh: () => void;
}

export const HotelReviews = ({
  hotel,
  user,
  reviews,
  isLoading,
  sort,
  setSort,
  pagination,
  onRefresh
}: HotelReviewsProps) => {
  return (
    <section id="reviews" className="pt-8 border-t border-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            Guest Experiences
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
              {hotel.review_count || 0}
            </span>
          </h3>
          <p className="text-slate-500 font-medium mt-1">What our guests have to say about their stay.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-2xl h-12 pl-10 pr-10 text-sm font-black text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="rating_asc">Lowest Rated</option>
            </select>
            <Filter className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {user ? (
          user.id !== hotel.ownerId ? (
            <ReviewForm hotelId={hotel.id} onSuccess={onRefresh} />
          ) : (
            <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 text-center">
              <p className="text-blue-600 font-black text-xs uppercase tracking-widest">Property Ownership</p>
              <p className="text-slate-500 font-medium mt-1">You are the manager of this elite property.</p>
            </div>
          )
        ) : (
          <div className="p-12 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Share Your Elite Experience</h4>
            <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">Sign in to your account to leave a premium review and help other travelers.</p>
            <Link href="/login">
              <Button variant="premium" className="px-10 h-14 rounded-2xl shadow-xl shadow-blue-200">
                Sign In to Review
              </Button>
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {isLoading ? (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : reviews.length > 0 ? (
            <>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center pt-8">
                  <Button variant="outline" className="rounded-2xl h-14 px-10 font-black text-slate-600 border-slate-200 hover:bg-slate-50">
                    Show More Reviews
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-16 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MessageSquare className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">No reviews yet</h4>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">Be the first to share your experience.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
