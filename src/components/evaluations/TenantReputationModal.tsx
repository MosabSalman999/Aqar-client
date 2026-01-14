"use client";

import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTenantReputationQuery } from "@/state/api";
import IntegrityBadge from "./IntegrityBadge";
import StarRating from "./StarRating";
import Loading from "@/components/Loading";
import {
  User,
  Mail,
  Clock,
  AlertTriangle,
  FileWarning,
  Home,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

interface TenantReputationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantCognitoId: string;
}

/**
 * TenantReputationModal
 * Displays complete tenant reputation including:
 * - Current integrity score
 * - History of evaluations
 * - Payment and report statistics
 * Manager-only access
 */
const TenantReputationModal: React.FC<TenantReputationModalProps> = ({
  isOpen,
  onClose,
  tenantCognitoId,
}) => {
  const {
    data: reputation,
    isLoading,
    isError,
  } = useGetTenantReputationQuery(tenantCognitoId, {
    skip: !isOpen || !tenantCognitoId,
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Tenant Reputation
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="py-8">
            <Loading />
          </div>
        )}

        {isError && (
          <div className="py-8 text-center text-red-500">
            Failed to load tenant reputation
          </div>
        )}

        {reputation && (
          <div className="space-y-6">
            {/* Tenant Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {reputation.tenant.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  {reputation.tenant.email}
                </div>
              </div>
              <IntegrityBadge
                score={reputation.currentIntegrity.integrityScore}
                size="lg"
              />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Home className="w-5 h-5" />}
                label="Completed Leases"
                value={reputation.currentIntegrity.totalLeasesCompleted}
                color="blue"
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Late Payments"
                value={reputation.currentIntegrity.latePaymentCount}
                color={reputation.currentIntegrity.latePaymentCount > 0 ? "red" : "green"}
              />
              <StatCard
                icon={<FileWarning className="w-5 h-5" />}
                label="Reports"
                value={reputation.currentIntegrity.reportsCount}
                color={reputation.currentIntegrity.reportsCount > 0 ? "red" : "green"}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Avg. Rating"
                value={
                  reputation.currentIntegrity.averageManagerRating
                    ? `${(reputation.currentIntegrity.averageManagerRating / 20).toFixed(1)}/5`
                    : "N/A"
                }
                color="yellow"
              />
            </div>

            {/* Score Breakdown */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Integrity Score Breakdown</h4>
              <div className="space-y-2 text-sm">
                <BreakdownRow
                  label="Base Score"
                  value={`+${reputation.currentIntegrity.breakdown.baseScore}`}
                />
                <BreakdownRow
                  label="Late Payment Penalty"
                  value={`-${reputation.currentIntegrity.breakdown.latePaymentPenalty}`}
                  negative
                />
                <BreakdownRow
                  label="Report Penalty"
                  value={`-${reputation.currentIntegrity.breakdown.reportPenalty}`}
                  negative
                />
                <BreakdownRow
                  label="Lease Completion Bonus"
                  value={`+${reputation.currentIntegrity.breakdown.leaseBonus}`}
                />
                <BreakdownRow
                  label="Rating Adjustment"
                  value={
                    reputation.currentIntegrity.breakdown.ratingAdjustment >= 0
                      ? `+${reputation.currentIntegrity.breakdown.ratingAdjustment}`
                      : `${reputation.currentIntegrity.breakdown.ratingAdjustment}`
                  }
                  negative={reputation.currentIntegrity.breakdown.ratingAdjustment < 0}
                />
                <div className="border-t pt-2 mt-2 font-semibold">
                  <BreakdownRow
                    label="Final Score"
                    value={reputation.currentIntegrity.integrityScore.toString()}
                  />
                </div>
              </div>
            </div>

            {/* Evaluations History */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Evaluation History ({reputation.evaluations.length})
              </h4>
              
              {reputation.evaluations.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  No evaluations yet
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {reputation.evaluations.map((evaluation) => (
                    <div
                      key={evaluation.id}
                      className="p-4 bg-white border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">
                            {evaluation.lease?.property?.name || "Property"}
                          </p>
                          <p className="text-sm text-gray-500">
                            By {evaluation.manager?.name} •{" "}
                            {formatDate(evaluation.createdAt)}
                          </p>
                        </div>
                        <StarRating rating={evaluation.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        {evaluation.comment}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {evaluation.latePaymentCount} late payments
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {evaluation.reportsCount} reports
                        </span>
                        <IntegrityBadge
                          score={evaluation.integrityScore}
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper components
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: "blue" | "green" | "red" | "yellow";
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
};

interface BreakdownRowProps {
  label: string;
  value: string;
  negative?: boolean;
}

const BreakdownRow: React.FC<BreakdownRowProps> = ({
  label,
  value,
  negative,
}) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className={negative ? "text-red-600" : "text-green-600"}>
      {value}
    </span>
  </div>
);

export default TenantReputationModal;
