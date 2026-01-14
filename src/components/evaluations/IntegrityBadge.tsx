"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Shield, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface IntegrityBadgeProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showTrend?: boolean;
  previousScore?: number;
}

/**
 * IntegrityBadge component
 * Displays tenant integrity score with color coding
 */
const IntegrityBadge: React.FC<IntegrityBadgeProps> = ({
  score,
  size = "md",
  showLabel = true,
  showTrend = false,
  previousScore,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-300";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const getTrend = () => {
    if (!showTrend || previousScore === undefined) return null;
    const diff = score - previousScore;
    if (diff > 0) {
      return (
        <span className="flex items-center text-green-600 text-xs">
          <TrendingUp className="w-3 h-3 mr-0.5" />
          +{diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="flex items-center text-red-600 text-xs">
          <TrendingDown className="w-3 h-3 mr-0.5" />
          {diff}
        </span>
      );
    }
    return (
      <span className="flex items-center text-gray-500 text-xs">
        <Minus className="w-3 h-3 mr-0.5" />
        0
      </span>
    );
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-full border font-medium",
          getScoreColor(score),
          sizeClasses[size]
        )}
      >
        <Shield className={iconSizes[size]} />
        <span>{score}</span>
        {showLabel && (
          <span className="ml-1 font-normal">({getScoreLabel(score)})</span>
        )}
      </div>
      {getTrend()}
    </div>
  );
};

export default IntegrityBadge;
