"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAuthUserQuery,
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery,
  useGetPropertyQuery,
  useDeletePropertyMutation,
  useTogglePropertyVisibilityMutation,
} from "@/state/api";
import { ArrowDownToLine, ArrowLeft, Check, Download, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const PropertyTenants = () => {
  const { id } = useParams();
  const router = useRouter();
  const propertyId = Number(id);

  const { data: authUser } = useGetAuthUserQuery();
  const { data: property, isLoading: propertyLoading } =
    useGetPropertyQuery(propertyId);
  const { data: leases, isLoading: leasesLoading } =
    useGetPropertyLeasesQuery(propertyId);
  const { data: payments, isLoading: paymentsLoading } =
    useGetPaymentsQuery(propertyId);

  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();
  const [toggleVisibility, { isLoading: isToggling }] = useTogglePropertyVisibilityMutation();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;

  const hasActiveLeases = leases && leases.some(lease => new Date(lease.endDate) >= new Date());

  const handleDelete = async () => {
    if (!authUser?.cognitoInfo?.userId) return;
    
    try {
      await deleteProperty({
        id: propertyId,
        cognitoId: authUser.cognitoInfo.userId,
      }).unwrap();
      router.push("/managers/properties");
    } catch (error) {
      console.error("Failed to delete property:", error);
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!authUser?.cognitoInfo?.userId || !property) return;
    
    try {
      await toggleVisibility({
        id: propertyId,
        cognitoId: authUser.cognitoInfo.userId,
        isHidden: !property.isHidden,
      }).unwrap();
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  const getCurrentMonthPaymentStatus = (leaseId: number) => {
    const currentDate = new Date();
    const currentMonthPayment = payments?.find(
      (payment) =>
        payment.leaseId === leaseId &&
        new Date(payment.dueDate).getMonth() === currentDate.getMonth() &&
        new Date(payment.dueDate).getFullYear() === currentDate.getFullYear()
    );
    return currentMonthPayment?.paymentStatus || "Not Paid";
  };

  return (
    <div className="dashboard-container">
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-2">Delete Property?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete &quot;{property?.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to properties page */}
      <Link
        href="/managers/properties"
        className="flex items-center mb-4 hover:text-primary-500"
        scroll={false}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Back to Properties</span>
      </Link>

      <div className="flex justify-between items-start mb-6">
        <Header
          title={property?.name || "My Property"}
          subtitle="Manage tenants and leases for this property"
        />
        
        {/* Property Actions */}
        <div className="flex gap-3">
          {/* Visibility Toggle */}
          <button
            onClick={handleToggleVisibility}
            disabled={isToggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
              property?.isHidden
                ? "bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
            } disabled:opacity-50`}
            title={property?.isHidden ? "Show on map" : "Hide from map"}
          >
            {property?.isHidden ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">Hidden</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visible</span>
              </>
            )}
          </button>

          {/* Delete Button - only show if no active leases */}
          {!hasActiveLeases && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-300 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              title="Delete property"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 mb-6">
        {property?.isHidden && (
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
            Hidden from Search
          </span>
        )}
        {hasActiveLeases && (
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            Currently Rented
          </span>
        )}
      </div>

      <div className="w-full space-y-6">
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Tenants Overview</h2>
              <p className="text-sm text-gray-500">
                Manage and view all tenants for this property.
              </p>
            </div>
            <div>
              <button
                className={`bg-white border border-gray-300 text-gray-700 py-2
              px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50`}
              >
                <Download className="w-5 h-5 mr-2" />
                <span>Download All</span>
              </button>
            </div>
          </div>
          <hr className="mt-4 mb-1" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Current Month Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases?.map((lease) => (
                  <TableRow key={lease.id} className="h-24">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/landing-i1.png"
                          alt={lease.tenant.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-semibold">
                            {lease.tenant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lease.tenant.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {new Date(lease.startDate).toLocaleDateString()} -
                      </div>
                      <div>{new Date(lease.endDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>${lease.rent.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          getCurrentMonthPaymentStatus(lease.id) === "Paid"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }`}
                      >
                        {getCurrentMonthPaymentStatus(lease.id) === "Paid" && (
                          <Check className="w-4 h-4 inline-block mr-1" />
                        )}
                        {getCurrentMonthPaymentStatus(lease.id)}
                      </span>
                    </TableCell>
                    <TableCell>{lease.tenant.phoneNumber}</TableCell>
                    <TableCell>
                      <button
                        className={`border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex 
                      items-center justify-center font-semibold hover:bg-primary-700 hover:text-primary-50`}
                      >
                        <ArrowDownToLine className="w-4 h-4 mr-1" />
                        Download Agreement
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTenants;
