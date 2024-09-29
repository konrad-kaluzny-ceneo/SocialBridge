import { trpc } from "@/server/client";
import { Review } from "@prisma/client";
import ReviewBadge from "@/components/reviews/ReviewBadge";
import EventAddReviewButton from "./EventAddReviewButton";

type Props = {
  eventId: string;
  onReviewAdded: (addedReview: Review) => void;
};

export default function EventAddReviewButtonWrapper({
  eventId,
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
  if (!reviewDb)
    return (
      <EventAddReviewButton
        eventId={eventId}
        onReviewAdded={onReviewAdded}
      />
    );

  if (reviewDb) return <ReviewBadge Review={reviewDb} />;
}
