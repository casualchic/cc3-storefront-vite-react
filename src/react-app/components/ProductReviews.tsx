import { useState } from 'react';
import { Star, ThumbsUp, ChevronDown, ChevronUp } from '@/lib/icons';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

// Mock reviews data - in production, this would come from an API
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Sarah M.',
    rating: 5,
    date: '2026-01-15',
    title: 'Absolutely love it!',
    comment: 'The quality is amazing and fits perfectly. The material feels premium and the color is exactly as shown in the pictures.',
    verified: true,
    helpful: 12,
  },
  {
    id: '2',
    author: 'Jennifer K.',
    rating: 4,
    date: '2026-01-10',
    title: 'Great purchase',
    comment: 'Very satisfied with this product. It runs a bit small so I recommend sizing up. Otherwise, excellent quality and fast shipping.',
    verified: true,
    helpful: 8,
  },
  {
    id: '3',
    author: 'Emily R.',
    rating: 5,
    date: '2026-01-05',
    title: 'Perfect for everyday wear',
    comment: 'This has become my go-to piece. So comfortable and versatile. Highly recommend!',
    verified: true,
    helpful: 5,
  },
  {
    id: '4',
    author: 'Michael T.',
    rating: 4,
    date: '2026-01-02',
    title: 'Good quality',
    comment: 'Nice product overall. The fit is good and the material quality meets expectations.',
    verified: false,
    helpful: 3,
  },
];

export function ProductReviews({ averageRating, totalReviews }: ProductReviewsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');

  // In production, this would filter/sort actual reviews from API
  const sortedReviews = [...mockReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const displayedReviews = isExpanded ? sortedReviews : sortedReviews.slice(0, 3);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="border-t dark:border-gray-800">
      {/* Header */}
      <div className="py-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Customer Reviews
        </h3>

        {/* Rating Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </div>
            <div>
              {renderStars(averageRating, 'lg')}
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Based on {totalReviews} reviews
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWriteReview(!showWriteReview)}
            className="sm:ml-auto px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            Write a Review
          </button>
        </div>

        {/* Write Review Form */}
        {showWriteReview && (
          <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Share Your Experience
            </h4>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className="w-8 h-8 fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700 hover:fill-amber-400 hover:text-amber-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
                  placeholder="Give your review a title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
                  placeholder="Tell us what you think about this product"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowWriteReview(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful' | 'highest' | 'lowest')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-t dark:border-gray-800 pt-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(review.rating, 'sm')}
                  {review.verified && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {review.title}
                </h4>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {review.author} • {formatDate(review.date)}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {review.comment}
            </p>

            <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ThumbsUp className="w-4 h-4" />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {sortedReviews.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <>
              Show Less Reviews
              <ChevronUp className="w-5 h-5" />
            </>
          ) : (
            <>
              Show All {sortedReviews.length} Reviews
              <ChevronDown className="w-5 h-5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
