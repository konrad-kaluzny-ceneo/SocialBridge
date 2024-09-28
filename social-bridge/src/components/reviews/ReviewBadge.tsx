import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Review } from "@prisma/client";
import { StarIcon } from "lucide-react";

type Props = {
  Review: Review;
};

export default function ReviewBadge({ Review }: Props) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-1 text-sm text-white",
        Review.value === 1
          ? "bg-danger"
          : Review.value < 4
            ? "bg-warning"
            : "bg-success",
      )}
    >
      <StarIcon className="h-4 w-4" />
      <strong className="font-bold">{Review.value}</strong>
    </div>
  );
}
