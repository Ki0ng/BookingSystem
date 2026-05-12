'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ShieldCheck, User as UserIcon } from 'lucide-react';
import StarRating from './StarRating';
import { Review } from '@/shared/types';

interface ReviewCardProps {
  review: Review;
  isManager?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, isManager = false }) => {
  const { user, rating, comment, createdAt, replies, status, isHidden } = review;

  return (
    <div className={`
      group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-100
      ${isHidden ? 'opacity-60 grayscale' : ''}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-blue-50 ring-offset-2">
            {user.avatar ? (
              <Image 
                src={user.avatar} 
                alt={user.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                <UserIcon size={24} />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight">{user.name || 'Anonymous User'}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{format(new Date(createdAt), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <StarRating rating={rating} readOnly size={16} />
          {(isManager || status === 'PENDING') && (
            <span className={`
              text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
              ${status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                status === 'PENDING' ? 'bg-amber-100 text-amber-600 animate-pulse' : 
                'bg-red-100 text-red-600'}
            `}>
              {status === 'PENDING' ? 'Pending Moderation' : status}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <p className="text-gray-600 leading-relaxed text-sm mb-4 italic">
          "{comment || 'No comment provided.'}"
        </p>
      </div>

      {/* Replies */}
      {replies && replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 ml-6 relative">
              {/* Connector line */}
              <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
              
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-gray-900">Manager Reply</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  • {format(new Date(reply.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {reply.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
