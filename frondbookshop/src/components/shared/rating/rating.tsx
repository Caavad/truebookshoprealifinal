"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export function Rating({ 
  initialRating = 0, 
  onRatingChange,
  size = "md",
  interactive = true 
}: RatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const handleStarClick = (starRating: number) => {
    if (!interactive) return;
    
    const newRating = starRating === rating ? 0 : starRating;
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleStarHover = (starRating: number) => {
    if (!interactive) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
      {[...Array(5)].map((_, i) => {
        const starRating = i + 1;
        const isFilled = starRating <= displayRating;
        
        return (
          <button
            key={i}
            type="button"
            className={cn(
              "transition-colors duration-150",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => handleStarHover(starRating)}
            disabled={!interactive}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "text-yellow-400"
                  : "text-gray-400",
                interactive && "hover:text-yellow-300"
              )}
              fill={isFilled ? "currentColor" : "none"}
            />
          </button>
        );
      })}
      {interactive && (
        <span className="ml-2 text-sm text-zinc-400">
          {rating > 0 ? '${rating}/5' : "Rate this book"}
        </span>
      )}
    </div>
  );
}