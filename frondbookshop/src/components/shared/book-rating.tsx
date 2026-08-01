"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ReviewDto, reviewsApi } from "@/lib/api";

export function BookRating({ bookId }: { bookId: number }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
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

  async function rate(rating: number) {
    if (!session?.accessToken) {
      setError("Sign in to rate this book.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const saved = ownReview
        ? await reviewsApi.update(session.accessToken, ownReview.id, rating)
        : await reviewsApi.create(session.accessToken, bookId, rating);
      setReviews((current) => {
        const withoutOwn = current.filter((review) => review.id !== saved.id);
        return [...withoutOwn, saved];
      });
    } catch {
      setError("Could not save your rating. Please sign in again and retry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border-t border-zinc-800 pt-6" aria-labelledby="rating-title">
      <h2 id="rating-title" className="text-lg font-semibold">Rate this book</h2>
      <p className="mt-1 text-sm text-zinc-400">
        {reviews.length ? `${average.toFixed(1)} / 5 from ${reviews.length} ratings` : "No ratings yet"}
      </p>
      <div className="mt-3 flex gap-1" aria-label="Choose a rating from 1 to 5">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            disabled={saving}
            onClick={() => rate(rating)}
            className="rounded p-1 disabled:cursor-wait"
            aria-label={`Rate ${rating} out of 5`}
          >
            <Star
              className={rating <= (ownReview?.rating ?? 0) ? "h-7 w-7 fill-yellow-400 text-yellow-400" : "h-7 w-7 text-zinc-500 hover:text-yellow-400"}
            />
          </button>
        ))}
      </div>
      {!session && <p className="mt-2 text-sm text-zinc-400"><Link className="text-white underline" href="/auth/signin">Sign in</Link> to leave a rating.</p>}
      {error && <p className="mt-2 text-sm text-amber-300">{error}</p>}
    </section>
  );
}
