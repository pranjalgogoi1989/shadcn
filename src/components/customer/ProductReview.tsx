import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// StarReviewForm.tsx
// Usage: <StarReviewForm productId={productId} onSuccess={()=>{}} />

type Props = {
  productId: string;
  userId?: string | null;
  onSuccess?: () => void;
};

export default function StarReviewForm({ productId, userId, onSuccess }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) return setError("Please choose a rating.");
    setLoading(true);

    try {
      const res = await fetch("/api/customer/products/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId, rating, comment }),
      });

      const data = await res.json();
      if (data.success === false) toast.error(data?.error || "Failed to submit review");

      setSuccess("Review submitted — thanks!");
      setComment("");
      setRating(0);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="mb-2">
        <Label className="mb-1">Your rating</Label>
        <div role="radiogroup" aria-label="Star rating" className="flex items-center gap-2">
          {stars.map((s) => (
            <button
              key={s}
              type="button"
              aria-checked={rating === s}
              role="radio"
              aria-label={`${s} star${s > 1 ? "s" : ""}`}
              onClick={() => setRating(s)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" && s < 5) setRating((r) => Math.min(5, r + 1));
                if (e.key === "ArrowLeft" && s > 1) setRating((r) => Math.max(1, r - 1));
              }}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-md transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                (hover || rating) >= s
                  ? "shadow-lg" // filled look when active
                  : "border"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={(hover || rating) >= s ? "currentColor" : "none"}
                stroke="currentColor"
                className={`w-5 h-5 ${ (hover || rating) >= s ? "text-yellow-500" : "text-gray-400" }`}
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.463 2.208c-.784.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.521 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Label className="mb-1">Write a review</Label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          rows={4}
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-2">{success}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit review"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => { setRating(0); setComment(""); }}>
          Reset
        </Button>
      </div>
    </form>
  );
}

