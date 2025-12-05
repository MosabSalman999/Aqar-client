import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatEnumString } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import { HelpCircle } from "lucide-react";
import React from "react";

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  return (
    <div className="mb-6">
      {/* Amenities and Highlights removed */}

      {/* Tabs Section */}
      <div>
        <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 mb-5">
          Fees and Policies
        </h3>
        <p className="text-sm text-primary-600 dark:text-primary-300 mt-2">
          The fees below are based on community-supplied data and may exclude
          additional fees and utilities.
        </p>
        <Tabs defaultValue="required-fees" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="required-fees">Required Fees</TabsTrigger>
            <TabsTrigger value="parking">Parking</TabsTrigger>
          </TabsList>
          <TabsContent value="required-fees" className="w-1/3">
            <p className="font-semibold mt-5 mb-2">One time move in fees</p>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Application Fee
              </span>
              <span className="text-primary-700">
                ${property.applicationFee}
              </span>
            </div>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Security Deposit
              </span>
              <span className="text-primary-700">
                ${property.securityDeposit}
              </span>
            </div>
            <hr />
          </TabsContent>
          {/* Pets info removed */}
          <TabsContent value="parking">
            <p className="font-semibold mt-5 mb-2">
              Parking is{" "}
              {property.isParkingIncluded ? "included" : "not included"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetails;
