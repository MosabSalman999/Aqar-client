"use client";

import React from "react";
import { useGetPropertyEvaluationsQuery } from "@/state/api";
import StarRating from "./StarRating";
import PropertyReviewCard from "./PropertyReviewCard";
import { MessageSquareText, Star } from "lucide-react";
import Loading from "@/components/Loading";

interface PropertyReviewsSectionProps {
  propertyId: number;
}

/**
 * PropertyReviewsSection
 * Displays all reviews for a property (public view)
 */
const PropertyReviewsSection: React.FC<PropertyReviewsSectionProps> = ({
  propertyId,
}) => {
  const {
    data: evaluationsData,
    isLoading,
    isError,
  } = useGetPropertyEvaluationsQuery(propertyId);

  if (isLoading) {
    return (
      <div className="py-8">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-gray-500">
        Failed to load reviews
      </div>
    );
  }

  const { totalEvaluations, averageRating, evaluations } = evaluationsData || {
    totalEvaluations: 0,
    averageRating: null,
    evaluations: [],
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquareText className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-semibold">Reviews</h2>
        </div>

        {totalEvaluations > 0 && (
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">
                {averageRating ? (averageRating / 20).toFixed(1) : "N/A"}
              </span>
            </div>
            <span className="text-gray-500">
              ({totalEvaluations} {totalEvaluations === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {totalEvaluations === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquareText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet for this property</p>
          <p className="text-sm text-gray-400 mt-1">
            Reviews will appear here after tenants complete their leases
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <PropertyReviewCard key={evaluation.id} evaluation={evaluation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyReviewsSection;
