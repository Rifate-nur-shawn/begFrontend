import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import api from "@/lib/api/axios";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user?: {
      name?: string;
      email?: string;
  };
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { isAuthenticated } = useAuthStore();
  const { openLogin } = useUIStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      setReviews(data || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
        fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
        openLogin();
        return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, {
        rating,
        comment
      });
      setComment("");
      setRating(5);
      fetchReviews(); // Refresh list
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-neutral-200 pt-12 mt-12">
        <h2 className="font-display text-2xl mb-8">Reviews ({reviews.length})</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Reviews List */}
            <div className="space-y-8">
                {isLoading ? (
                    <div className="text-xs text-neutral-400 uppercase tracking-widest">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-sm text-neutral-500 italic">No reviews yet. Be the first to review!</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-yellow-500 text-xs">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                                    ))}
                                </div>
                                <span className="font-utility text-[10px] text-neutral-400 uppercase tracking-wider">
                                    {review.user?.name || "Anonymous"} • {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-700 leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Write Review Form */}
            <div className="bg-neutral-50 p-8">
                <h3 className="font-display text-lg mb-6">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-utility text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Rating</label>
                        <div className="flex gap-1 text-lg cursor-pointer text-yellow-500">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none hover:scale-110 transition-transform"
                                >
                                    {star <= rating ? "★" : "☆"}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                         <label className="block font-utility text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Review</label>
                         <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={4}
                            className="w-full bg-white border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black resize-none"
                            placeholder="Share your thoughts..."
                         />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-black text-white px-8 py-3 font-utility text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                    
                    {!isAuthenticated && (
                         <p className="text-[10px] text-neutral-400 text-center mt-2">
                             You must be logged in to post a review.
                         </p>
                    )}
                </form>
            </div>
        </div>
    </div>
  );
}
