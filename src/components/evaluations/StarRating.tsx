"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0-100 scale
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

/**
 * StarRating component
 * Displays rating as stars (converts 0-100 scale to 5 stars)
 */
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}) => {
  // Convert 0-100 to 0-5 scale
  const normalizedRating = (rating / 100) * maxStars;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onChange) {
      // Convert star index (1-5) to 0-100 scale
      const newRating = (starIndex / maxStars) * 100;
      onChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starIndex = index + 1;
        const isFilled = starIndex <= fullStars;
        const isHalf = starIndex === fullStars + 1 && hasHalfStar;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starIndex)}
            disabled={!interactive}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isHalf
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-300"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          ({(normalizedRating).toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
