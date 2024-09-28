import { trpc } from "@/server/client";
import { Review } from "@prisma/client";
import ReviewBadge from "@/components/reviews/ReviewBadge";
import EventAddReviewButton from "./EventAddReviewButton";

type Props = {
  eventId: string;
  reviewedUserId: string;
  onReviewAdded: (addedReview: Review) => void;
};

export default function EventAddReviewButtonWrapper({
  eventId,
  reviewedUserId,
  onReviewAdded,
}: Props) {
  const {
    data: reviewDb,
    isLoading,
    isError,
  } = trpc.reviews.getUserReview.useQuery({
    eventId,
  });

  if (isLoading) return null;
  if (isError) return null;

  if (reviewDb) return <ReviewBadge Review={reviewDb} />;

  return (
    <EventAddReviewButton
      eventId={eventId}
      reviewedUserId={reviewedUserId}
      onReviewAdded={onReviewAdded}
    />
  );
}
