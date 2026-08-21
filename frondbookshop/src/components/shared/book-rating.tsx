"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ReviewDto, reviewsApi } from "@/lib/api";

export function BookRating({ bookId }: { bookId: number }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewsApi.getByBook(bookId).then(setReviews).catch(() => setError("Could not load ratings."));
  }, [bookId]);

  const userId = Number(session?.user?.id);
  const ownReview = reviews.find((review) => review.userId === userId);
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    if (ownReview) {
      setSelectedRating(ownReview.rating);
      setComment(ownReview.comment ?? "");
    } else {
      setSelectedRating(0);
      setComment("");
    }
  }, [ownReview?.id, ownReview?.rating, ownReview?.comment]);

  async function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.accessToken) {
      setError("Sign in to leave a review.");
      return;
    }
    if (selectedRating === 0) {
      setError("Choose a rating from 1 to 5.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const saved = ownReview
        ? await reviewsApi.update(session.accessToken, ownReview.id, selectedRating, comment.trim() || undefined)
        : await reviewsApi.create(session.accessToken, bookId, selectedRating, comment.trim() || undefined);
      setReviews((current) => {
        const withoutOwn = current.filter((review) => review.id !== saved.id);
        return [saved, ...withoutOwn];
      });
    } catch {
      setError("Could not save your review. Please sign in again and retry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border-t border-zinc-800 pt-6" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-lg font-semibold">Reviews</h2>
      <p className="mt-1 text-sm text-zinc-400">
        {reviews.length ? `${average.toFixed(1)} / 5 from ${reviews.length} ratings` : "No ratings yet"}
      </p>

      {session ? (
        <form className="mt-5 rounded-lg bg-zinc-900 p-4" onSubmit={saveReview}>
          <p className="text-sm font-medium">{ownReview ? "Edit your review" : "Leave a review"}</p>
          <div className="mt-2 flex gap-1" aria-label="Choose a rating from 1 to 5">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                disabled={saving}
                onClick={() => setSelectedRating(rating)}
                className="rounded p-1 disabled:cursor-wait"
                aria-label={`Rate ${rating} out of 5`}
              >
                <Star className={rating <= selectedRating ? "h-6 w-6 fill-yellow-400 text-yellow-400" : "h-6 w-6 text-zinc-500 hover:text-yellow-400"} />
              </button>
            ))}
          </div>
          <label className="mt-3 block text-sm text-zinc-300" htmlFor={`review-comment-${bookId}`}>Your review</label>
          <textarea
            id={`review-comment-${bookId}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="What did you think about this book?"
            className="mt-1 w-full rounded-md border border-zinc-700 bg-black p-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">{comment.length}/1000</span>
            <button type="submit" disabled={saving} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60">
              {saving ? "Saving..." : ownReview ? "Update review" : "Publish review"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-zinc-400"><Link className="text-white underline" href="/auth/signin">Sign in</Link> to leave a review.</p>
      )}

      {error && <p className="mt-3 text-sm text-amber-300">{error}</p>}

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-lg border border-zinc-800 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-white">{review.username}</span>
              <span className="flex items-center gap-1 text-sm text-yellow-400" aria-label={`${review.rating} out of 5 stars`}>
                <Star className="h-4 w-4 fill-current" /> {review.rating}/5
              </span>
            </div>
            {review.comment && <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-300">{review.comment}</p>}
            <time className="mt-3 block text-xs text-zinc-500" dateTime={review.createdAt}>
              {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(review.createdAt))}
            </time>
          </article>
        ))}
        {reviews.length === 0 && <p className="text-sm text-zinc-500">Be the first to share your thoughts.</p>}
      </div>
    </section>
  );
}
