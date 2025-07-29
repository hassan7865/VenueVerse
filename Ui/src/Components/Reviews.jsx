import React, { useState } from "react";
import { Star, StarHalf, Calendar, MessageCircle } from "lucide-react";
import UserProfile from "../../UserProfile";
import { useForm } from "react-hook-form";
import api from "../lib/Url";

const ReviewComponent = ({
  sourceId,
  type = "product",
  existingReviews,
  maxRating = 5,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState(existingReviews);
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const ratingValue = watch("rating");
  const commentValue = watch("comment");

  const submitReview = async (data) => {
    if (!UserProfile.GetUserData()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const newReview = {
        sourceId,
        type,
        rating: data.rating,
        comment: data.comment.trim(),
      };

      const res = await api.post(`/review`, newReview);

      setReviews([res.data.review, ...reviews]);
      reset();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue, interactive = false, size = "default") => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const sizeClasses = {
      small: "w-4 h-4",
      default: "w-5 h-5",
      large: "w-7 h-7",
    };

    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${sizeClasses[size]} fill-amber-400 text-amber-400 ${
            interactive ? "transition-colors duration-150" : ""
          }`}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className={`${sizeClasses[size]} fill-amber-400 text-amber-400 ${
            interactive ? "transition-colors duration-150" : ""
          }`}
        />
      );
    }

    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-300 ${
            interactive ? "transition-colors duration-150" : ""
          }`}
        />
      );
    }

    return stars;
  };

  const averageRating =
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const getRatingDistribution = () => {
    const distribution = {};
    for (let i = 1; i <= maxRating; i++) {
      distribution[i] = reviews?.filter((r) => r.rating === i).length;
    }
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Customer Reviews
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {renderStars(averageRating)}
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="text-gray-600">
                      ({reviews.length}{" "}
                      {reviews?.length === 1 ? "review" : "reviews"})
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-10">
                        {stars} star
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all duration-500 ease-out"
                          style={{
                            width:
                              reviews?.length > 0
                                ? `${(ratingDistribution[stars] / reviews?.length) * 100}%`
                                : "0%",
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">
                        {ratingDistribution[stars]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:ml-8 flex-shrink-0">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full xl:w-auto px-8 py-3 bg-brand-blue  text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5" />
                {showForm ? "Cancel" : "Write a Review"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Review Form */}
          {showForm && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Write Your Review
                </h3>

                <form
                  onSubmit={handleSubmit(submitReview)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[...Array(maxRating)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setValue("rating", ratingValue)}
                            onMouseEnter={() => setHoverRating(ratingValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded p-1"
                          >
                            {(hoverRating || ratingValue) >= ratingValue ? (
                              <Star className="w-7 h-7 fill-amber-400 text-amber-400 transition-colors duration-150" />
                            ) : (
                              <Star className="w-7 h-7 text-gray-300 hover:text-amber-300 transition-colors duration-150" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="hidden"
                      {...register("rating", {
                        required: "Please select a rating",
                      })}
                    />
                    {(hoverRating || ratingValue) > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        {hoverRating || ratingValue} out of {maxRating} stars
                      </p>
                    )}
                    {errors.rating && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.rating.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-3"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      rows={6}
                      {...register("comment", {
                        required: "Review text is required",
                        maxLength: {
                          value: 500,
                          message: "Review cannot exceed 500 characters",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                      placeholder="Share your experience with this product..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.comment && (
                        <p className="text-sm text-red-600">
                          {errors.comment.message}
                        </p>
                      )}
                      <span
                        className={`text-xs ml-auto ${
                          commentValue?.length > 500
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {commentValue?.length || 0}/500
                      </span>
                    </div>
                  </div>

                  {!UserProfile.GetUserData() && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        Please login to submit a review
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-brand-blue  text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
            <div className="space-y-6">
              {reviews?.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-500">
                    Be the first to share your experience!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {reviews?.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <img
                            className="h-8 w-8 rounded-full object-cover border border-gray-200"
                            src={review.user.avatar || "/default-avatar.png"}
                            alt="Profile"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-avatar.png";
                            }}
                          />

                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {review.user.username}
                              </h4>
                              <div className="flex items-center">
                                {renderStars(review?.rating, false, "small")}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <time>
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed pl-14">
                        {review?.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;
