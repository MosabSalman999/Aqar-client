"use client";

import ApplicationCard from "@/components/ApplicationCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";
import { PropertyEvaluationModal } from "@/components/evaluations";
import { CircleCheckBig, Clock, Download, XCircle, Star } from "lucide-react";
import React, { useState } from "react";

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const [evaluationModalData, setEvaluationModalData] = useState<{
    isOpen: boolean;
    leaseId: number;
    propertyName: string;
  } | null>(null);

  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery({
    userId: authUser?.cognitoInfo?.userId,
    userType: "tenant",
  });

  const handleOpenEvaluationModal = (leaseId: number, propertyName: string) => {
    setEvaluationModalData({
      isOpen: true,
      leaseId,
      propertyName,
    });
  };

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Applications"
        subtitle="Track and manage your property rental applications"
      />
      <div className="w-full">
        {applications?.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            userType="renter"
          >
            <div className="flex justify-between gap-5 w-full pb-4 px-4">
              {application.status === "Approved" ? (
                <div className="bg-green-100 p-4 text-green-700 grow flex items-center">
                  <CircleCheckBig className="w-5 h-5 mr-2" />
                  {application.lease?.status === "Terminated" ? (
                    <span>
                      Your lease has been terminated. You can now leave a review.
                    </span>
                  ) : (
                    <span>
                      The property is being rented by you until{" "}
                      {new Date(application.lease?.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : application.status === "Pending" ? (
                <div className="bg-yellow-100 p-4 text-yellow-700 grow flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Your application is pending approval
                </div>
              ) : (
                <div className="bg-red-100 p-4 text-red-700 grow flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Your application has been denied
                </div>
              )}

              <div className="flex gap-2">
                <button
                  className={`bg-white border border-gray-300 text-gray-700 py-2 px-4
                            rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Agreement
                </button>
                
                {/* Review Property Button - Only for terminated leases */}
                {application.status === "Approved" && 
                 application.lease?.status === "Terminated" && (
                  <button
                    className="px-4 py-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-500 flex items-center"
                    onClick={() =>
                      handleOpenEvaluationModal(
                        application.lease!.id,
                        application.property.name
                      )
                    }
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Review Property
                  </button>
                )}
              </div>
            </div>
          </ApplicationCard>
        ))}
      </div>

      {/* Property Evaluation Modal */}
      {evaluationModalData && (
        <PropertyEvaluationModal
          isOpen={evaluationModalData.isOpen}
          onClose={() => setEvaluationModalData(null)}
          leaseId={evaluationModalData.leaseId}
          propertyName={evaluationModalData.propertyName}
        />
      )}
    </div>
  );
};

export default Applications;
