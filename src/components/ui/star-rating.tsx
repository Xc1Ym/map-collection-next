"use client";

import { Star, StarHalf } from "lucide-react";

function StarIcon({
  fillLevel,
  size = 16,
}: {
  fillLevel: "empty" | "half" | "full";
  size?: number;
}) {
  const className = "text-gray-300";

  if (fillLevel === "full") {
    return <Star size={size} className="fill-yellow-400 text-yellow-400" />;
  }
  if (fillLevel === "half") {
    return <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />;
  }
  return <Star size={size} className={className} />;
}

export function StarRatingDisplay({
  rating,
  size = 16,
}: {
  rating: number | null;
  size?: number;
}) {
  if (rating == null) return null;

  const stars: ("empty" | "half" | "full")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push("full");
    } else if (rating >= i - 0.5) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars.map((level, i) => (
        <StarIcon key={i} fillLevel={level} size={size} />
      ))}
      <span className="ml-1 text-sm text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const currentRating = value ?? 0;

  function handleClick(position: number, isLeft: boolean) {
    const newRating = isLeft ? position - 0.5 : position;
    // Click same value again to clear
    if (newRating === currentRating) {
      onChange(null);
    } else {
      onChange(newRating);
    }
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((position) => {
        const isFull = currentRating >= position;
        const isHalf = currentRating >= position - 0.5 && currentRating < position;

        return (
          <span key={position} className="relative inline-block">
            {/* Left half (half star) */}
            <span
              className="absolute inset-0 w-1/2 cursor-pointer z-10"
              onClick={() => handleClick(position, true)}
            />
            {/* Right half (full star) */}
            <span
              className="absolute inset-0 left-1/2 w-1/2 cursor-pointer z-10"
              onClick={() => handleClick(position, false)}
            />
            <StarIcon
              fillLevel={isFull ? "full" : isHalf ? "half" : "empty"}
              size={28}
            />
          </span>
        );
      })}
      {currentRating > 0 && (
        <span className="ml-1 text-sm text-gray-500">{currentRating.toFixed(1)}</span>
      )}
    </span>
  );
}
