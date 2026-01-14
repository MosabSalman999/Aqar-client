"use client";

import React from "react";
import { Loader2, TrendingDown, TrendingUp, Minus } from "lucide-react";

type PriceLabel = "Low" | "Medium" | "High" | "Not Classified" | null;

interface PriceLabelBadgeProps {
  priceLabel: PriceLabel;
  isLoading?: boolean;
  country?: string;
  showNotAvailable?: boolean;
}

const PriceLabelBadge: React.FC<PriceLabelBadgeProps> = ({
  priceLabel,
  isLoading = false,
  country,
  showNotAvailable = true,
}) => {
  // Only show for UAE properties
  if (country && country !== "UAE") {
    if (!showNotAvailable) return null;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
        Market label not available
      </span>
    );
  }

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
        <Loader2 className="w-3 h-3 animate-spin" />
        Checking price...
      </span>
    );
  }

  if (!priceLabel || priceLabel === "Not Classified") {
    if (!showNotAvailable) return null;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
        Not Classified
      </span>
    );
  }

  const labelConfig = {
    Low: {
      icon: TrendingDown,
      className: "text-green-700 bg-green-100 border-green-200",
      text: "Low Price",
    },
    Medium: {
      icon: Minus,
      className: "text-yellow-700 bg-yellow-100 border-yellow-200",
      text: "Market Price",
    },
    High: {
      icon: TrendingUp,
      className: "text-red-700 bg-red-100 border-red-200",
      text: "High Price",
    },
  };

  const config = labelConfig[priceLabel];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

export default PriceLabelBadge;
