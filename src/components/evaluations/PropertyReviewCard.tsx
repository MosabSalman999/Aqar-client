"use client";

import React from "react";
import { format } from "date-fns";
import StarRating from "./StarRating";
import { MessageSquare, Calendar, User } from "lucide-react";

interface PropertyReviewCardProps {
  evaluation: PropertyEvaluation;
}

/**
 * PropertyReviewCard
 * Displays a single property review/evaluation
 */
const PropertyReviewCard: React.FC<PropertyReviewCardProps> = ({
  evaluation,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {evaluation.tenant?.name || "Anonymous"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(evaluation.createdAt)}</span>
            </div>
          </div>
        </div>
        <StarRating rating={evaluation.rating} size="sm" />
      </div>

      <div className="flex items-start gap-2 mt-3">
        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-gray-700 text-sm leading-relaxed">
          {evaluation.comment}
        </p>
      </div>

      {evaluation.lease && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          Stayed from {formatDate(evaluation.lease.startDate)} to{" "}
          {formatDate(evaluation.lease.endDate)}
        </div>
      )}
    </div>
  );
};

export default PropertyReviewCard;
