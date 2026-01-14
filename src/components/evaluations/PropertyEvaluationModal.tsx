"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "./StarRating";
import { useCreatePropertyEvaluationMutation } from "@/state/api";
import { Loader2 } from "lucide-react";

interface PropertyEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaseId: number;
  propertyName: string;
}

/**
 * PropertyEvaluationModal
 * Modal for tenants to submit property evaluations after lease termination
 */
const PropertyEvaluationModal: React.FC<PropertyEvaluationModalProps> = ({
  isOpen,
  onClose,
  leaseId,
  propertyName,
}) => {
  const [rating, setRating] = useState<number>(80); // Default to 80 (4 stars)
  const [comment, setComment] = useState<string>("");
  const [createEvaluation, { isLoading }] = useCreatePropertyEvaluationMutation();

  const handleSubmit = async () => {
    if (!comment.trim()) {
      return;
    }

    try {
      await createEvaluation({
        leaseId,
        rating,
        comment: comment.trim(),
      }).unwrap();
      
      onClose();
      setRating(80);
      setComment("");
    } catch (error) {
      console.error("Failed to create evaluation:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Property</DialogTitle>
          <DialogDescription>
            Share your experience at <strong>{propertyName}</strong>. This
            review will be publicly visible and helps other tenants make
            informed decisions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                interactive
                onChange={setRating}
                size="lg"
                showValue
              />
            </div>
            <p className="text-xs text-gray-500">
              Rate your overall experience at this property (1-5 stars)
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience living at this property. Describe the amenities, neighborhood, landlord responsiveness, and overall living conditions."
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Your review helps other tenants find great places to live.
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Reviews are permanent and cannot be edited
              or deleted after submission. Please be honest and constructive in
              your feedback.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !comment.trim()}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyEvaluationModal;
