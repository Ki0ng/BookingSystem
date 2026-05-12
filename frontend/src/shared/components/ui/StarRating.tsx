'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  onRatingChange,
  readOnly = false,
  size = 20,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        const isActive = hoverRating ? starValue <= hoverRating : starValue <= rating;

        return (
          <Star
            key={index}
            size={size}
            className={`
              transition-all duration-200 
              ${!readOnly ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
              ${isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 fill-gray-100'}
            `}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
