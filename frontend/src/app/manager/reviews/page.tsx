'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Reply,
  Search,
  MoreVertical,
  ChevronRight,
  Trash2,
  ChevronDown,
  Star
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { reviewService } from '@/features/reviews';
import StarRating from '@/shared/components/ui/StarRating';
import { format } from 'date-fns';
import { useSocket } from '@/shared/providers/SocketProvider';

const Dropdown = ({ label, value, options, onChange, activeColor = 'text-slate-900' }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer flex items-center gap-4 min-w-[140px] transition-all relative"
      >
        <div className="flex flex-col items-start text-left shrink-0">
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 leading-tight">{label}</span>
          <span className={`${activeColor} truncate max-w-[90px] leading-tight`}>{value}</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-500 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1.5">
            {options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-left transition-all ${(opt.value === '' && value.includes('All')) || (opt.label === value) || (value.includes(opt.label))
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ManagerReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    page: 1,
    status: '',
    rating: '',
    search: '',
    sortBy: 'newest'
  });

  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewService.getHotelReviews('all', {
        ...filters,
        rating: filters.rating ? parseInt(filters.rating) : undefined
      });
      setReviews(res.data || []);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews.');
      console.error('Failed to fetch manager reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await reviewService.getStats('all');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    const handleNewReview = (review: any) => {
      if (filters.page === 1 && (!filters.status || filters.status === 'PENDING')) {
        setReviews(prev => {
          if (prev.find(r => r.id === review.id)) return prev;
          return [{ ...review, isNew: true }, ...prev];
        });
        fetchStats();
      } else {
        fetchReviews();
        fetchStats();
      }
    };
    socket.on('new_review', handleNewReview);
    return () => { socket.off('new_review', handleNewReview); };
  }, [socket, filters]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await reviewService.updateStatus(id, status);
      fetchStats();
      fetchReviews();
    } catch (err) {
      fetchReviews();
    }
  };

  const handleToggleVisibility = async (id: string, isHidden: boolean) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isHidden } : r));
    try {
      await reviewService.toggleVisibility(id, isHidden);
      fetchStats();
      fetchReviews();
    } catch (err) {
      fetchReviews();
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setIsSubmittingReply(true);
    try {
      await reviewService.replyToReview(replyingTo.id, replyMessage);
      setReplyingTo(null);
      setReplyMessage('');
      fetchReviews();
    } catch (err) {
      alert('Failed to post reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this experience?')) return;
    const previousReviews = [...reviews];
    setReviews(prev => prev.filter(r => r.id !== id));
    try {
      await reviewService.deleteReview(id);
      fetchStats();
      fetchReviews();
    } catch (err) {
      setReviews(previousReviews);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-110" />
          <div className="relative z-10">
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-3">Sentiment Overview</p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Guest Experiences</h2>
            <p className="text-slate-500 text-[13px] font-medium max-w-xs leading-relaxed">
              Monitoring guest feedback across your hospitality portfolio.
            </p>
          </div>
          <div className="mt-6 flex items-end gap-2 relative z-10">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none">{stats?.total || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Reviews</span>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-amber-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-3">Requires Action</p>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Verification</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-amber-500 tracking-tight leading-none">{stats?.pending || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reviews</span>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-3">Verified Impact</p>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Approved Publicly</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-emerald-500 tracking-tight leading-none">{stats?.approved || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reviews</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3 rounded-[1.5rem] border border-slate-200/50 shadow-xl shadow-slate-200/10 sticky top-4 z-30">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full h-11 pl-11 pr-6 bg-slate-50/50 border border-transparent focus:border-blue-100 focus:bg-white rounded-xl text-[13px] font-medium outline-none transition-all placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-50/80 rounded-xl border border-slate-100">
          <Dropdown
            label="Status"
            value={filters.status || 'All'}
            options={[
              { label: 'All', value: '' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' }
            ]}
            onChange={(val: string) => setFilters({ ...filters, status: val, page: 1 })}
          />
          <div className="w-px h-5 bg-slate-200" />
          <Dropdown
            label="Rating"
            value={filters.rating ? `${filters.rating} Stars` : 'All'}
            options={[
              { label: 'All', value: '' },
              { label: '5 Stars', value: '5' },
              { label: '4 Stars', value: '4' },
              { label: '3 Stars', value: '3' },
              { label: '2 Stars', value: '2' },
              { label: '1 Star', value: '1' }
            ]}
            onChange={(val: string) => setFilters({ ...filters, rating: val, page: 1 })}
          />
          <div className="w-px h-5 bg-slate-200" />
          <Dropdown
            label="Order"
            activeColor="text-blue-600"
            value={
              filters.sortBy === 'newest' ? 'Newest' :
                filters.sortBy === 'oldest' ? 'Oldest' :
                  filters.sortBy === 'rating_desc' ? 'High Rated' : 'Low Rated'
            }
            options={[
              { label: 'Newest', value: 'newest' },
              { label: 'Oldest', value: 'oldest' },
              { label: 'High Rated', value: 'rating_desc' },
              { label: 'Low Rated', value: 'rating_asc' }
            ]}
            onChange={(val: string) => setFilters({ ...filters, sortBy: val, page: 1 })}
          />
        </div>
      </div>

      {/* Error & Loading */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center justify-between text-rose-600">
          <div className="flex items-center gap-3">
            <XCircle size={16} />
            <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
          </div>
          <button onClick={() => { fetchReviews(); fetchStats(); }} className="text-[9px] font-bold uppercase underline">Retry</button>
        </div>
      )}

      {/* Reviews Grid */}
      <div className="min-h-[400px]">
        {(loading && reviews.length === 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-48 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white p-7 rounded-[2rem] border transition-all duration-500 hover:shadow-2xl relative group flex flex-col justify-between ${review.isHidden ? 'border-amber-100 bg-amber-50/10' : 'border-slate-100'
                  } ${review.isNew ? 'ring-2 ring-blue-100 animate-pulse-subtle' : ''}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-inner">
                      {review.user.avatar ? (
                        <img src={review.user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-lg font-extrabold uppercase">
                          {review.user.name?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">{review.user.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StarRating rating={review.rating} readOnly size={12} />
                    <span className={`
                      px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest
                      ${review.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                        review.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                          'bg-rose-50 text-rose-600 border border-rose-100/50'}
                    `}>
                      {review.status}
                    </span>
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  <p className="text-slate-600 italic font-medium leading-relaxed text-[13px]">
                    "{review.comment}"
                  </p>
                </div>

                {review.replies && review.replies.length > 0 && (
                  <div className="mb-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-4">
                    {review.replies.map((reply: any) => (
                      <div key={reply.id} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Management Response</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">
                            {format(new Date(reply.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium leading-relaxed">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {review.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(review.id, 'APPROVED')}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                        >
                          <CheckCircle2 size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(review.id, 'REJECTED')}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all"
                        >
                          <XCircle size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Reject</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setReplyingTo(review)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                    >
                      <Reply size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Reply</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisibility(review.id, !review.isHidden)}
                      className={`p-2.5 rounded-xl transition-all ${review.isHidden ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      {review.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {review.isHidden && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                    <EyeOff size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Hidden from Public</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <MessageSquare className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">No Reviews Identified</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto text-[13px] mt-2 leading-relaxed">
              Waiting for guest experiences to materialize or adjust your search parameters.
            </p>
          </div>
        )}
      </div>

      {/* Elite Pagination Control */}
      {pagination && pagination.pages > 1 && (
        <div className="pt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
            disabled={filters.page === 1}
            className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm hover:shadow-xl group"
          >
            <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/10">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`w-10 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filters.page === i + 1 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/20' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFilters({ ...filters, page: Math.min(pagination.pages, filters.page + 1) })}
            disabled={filters.page === pagination.pages}
            className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm hover:shadow-xl group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Reply to Review</h3>
              <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-900">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-900">{replyingTo.user.name}</span>
                  <StarRating rating={replyingTo.rating} readOnly size={10} />
                </div>
                <p className="text-[13px] text-slate-500 italic leading-relaxed">"{replyingTo.comment}"</p>
              </div>

              <form onSubmit={handleReplySubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Your Professional Message</label>
                  <textarea
                    className="w-full h-28 p-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-medium outline-none focus:border-blue-500 transition-all resize-none"
                    placeholder="Write your response..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    maxLength={1000}
                  />
                </div>
                <Button
                  type="submit"
                  variant="premium"
                  className="w-full h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest"
                  disabled={isSubmittingReply || !replyMessage.trim()}
                >
                  {isSubmittingReply ? 'Posting...' : 'Post Response'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
