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
import { useCreateTenantEvaluationMutation } from "@/state/api";
import { Loader2 } from "lucide-react";

interface TenantEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaseId: number;
  tenantName: string;
  propertyName: string;
}

/**
 * TenantEvaluationModal
 * Modal for managers to submit tenant evaluations after lease termination
 */
const TenantEvaluationModal: React.FC<TenantEvaluationModalProps> = ({
  isOpen,
  onClose,
  leaseId,
  tenantName,
  propertyName,
}) => {
  const [rating, setRating] = useState<number>(80); // Default to 80 (4 stars)
  const [comment, setComment] = useState<string>("");
  const [createEvaluation, { isLoading }] = useCreateTenantEvaluationMutation();

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
          <DialogTitle>Evaluate Tenant</DialogTitle>
          <DialogDescription>
            Provide your evaluation for <strong>{tenantName}</strong> who rented{" "}
            <strong>{propertyName}</strong>. This evaluation is permanent and
            visible only to other managers.
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
              Rate the tenant&apos;s overall experience (1-5 stars)
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Evaluation Comment *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience with this tenant. Include details about payment punctuality, property care, communication, etc."
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              This comment will be visible to other property managers when the
              tenant applies for properties.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Evaluations are immutable and cannot be
              edited or deleted after submission. The integrity score is
              calculated automatically based on payment history.
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
            Submit Evaluation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TenantEvaluationModal;
