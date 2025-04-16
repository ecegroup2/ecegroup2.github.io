import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

interface StarRatingProps {
  max?: number;
  initial?: number;
  value?: number;
  onRate?: (value: number) => void;
}

const StarRating = ({
  max = 5,
  initial = 0,
  value,
  onRate,
}: StarRatingProps) => {
  const [rating, setRating] = useState(initial);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isRated, setIsRated] = useState(false); // prevent re-rating

  const handleClick = (val: number) => {
    if (isRated) return;
    setRating(val);
    setIsRated(true);
    onRate?.(val);
  };

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => {
        const starVal = i + 1;
        const isFilled = starVal <= (hovered ?? rating);
        return (
          <Star
            key={starVal}
            size={14}
            onClick={() => handleClick(starVal)}
            onMouseEnter={() => !isRated && setHovered(starVal)}
            onMouseLeave={() => !isRated && setHovered(null)}
            className={clsx(
              "cursor-pointer transition-all duration-300",
              isFilled
                ? isRated
                  ? "fill-yellow-400 text-yellow-400 opacity-50" // faded yellow
                  : "fill-yellow-400 text-yellow-400"
                : "text-gray-300",
              isRated && "cursor-default"
            )}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
