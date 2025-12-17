"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { PropertyTypeEnum, PropertyTypeLabels, FrequencyEnum, FrequencyLabels, CountryEnum, CountryLabels } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import CustomMapPicker from "@/components/CustomMapPicker";
import { toast } from "sonner";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      isParkingIncluded: true,
      furnished: false,
      frequency: FrequencyEnum.Monthly,
      photoUrls: [],
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      propertyType: PropertyTypeEnum.Apartment,
      address: "",
      city: "",
      state: "",
      country: CountryEnum.Jordan,
      postalCode: "",
      longitude: undefined,
      latitude: undefined,
    },
  });

  // Handle location change from map picker
  const handleLocationChange = useCallback(
    (location: {
      longitude: number;
      latitude: number;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    }) => {
      form.setValue("longitude", location.longitude);
      form.setValue("latitude", location.latitude);
      if (location.address) form.setValue("address", location.address);
      if (location.city) form.setValue("city", location.city);
      if (location.state) form.setValue("state", location.state);
      // Map country string to CountryEnum if it matches
      if (location.country) {
        const countryKey = Object.keys(CountryEnum).find(
          (key) => key.toLowerCase() === location.country?.toLowerCase() ||
                   CountryLabels[key as CountryEnum].toLowerCase() === location.country?.toLowerCase()
        );
        if (countryKey) {
          form.setValue("country", countryKey as CountryEnum);
        }
      }
      if (location.postalCode) form.setValue("postalCode", location.postalCode);
    },
    [form]
  );

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      throw new Error("No manager ID found");
    } 

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    formData.append("managerCognitoId", authUser.cognitoInfo.userId);

    try {
      await createProperty(formData).unwrap();
      toast.success("Property created successfully!", {
        description: "Your property listing has been added.",
      });
      form.reset();
    } catch {
      toast.error("Failed to create property", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Property Name" />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="pricePerMonth"
                  label="Price per Month"
                  type="number"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Feet"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="beds"
                  label="Number of Beds"
                  type="number"
                />
                <CustomFormField
                  name="baths"
                  label="Number of Baths"
                  type="number"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Feet"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField
                  name="isParkingIncluded"
                  label="Parking Included"
                  type="switch"
                />
                <CustomFormField
                  name="furnished"
                  label="Furnished"
                  type="switch"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: PropertyTypeLabels[type as PropertyTypeEnum],
                  }))}
                />
                <CustomFormField
                  name="frequency"
                  label="Payment Frequency"
                  type="select"
                  options={Object.keys(FrequencyEnum).map((freq) => ({
                    value: freq,
                    label: FrequencyLabels[freq as FrequencyEnum],
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <CustomFormField
                name="photoUrls"
                label="Property Photos"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                Property Location
              </h2>

              {/* Mapbox Location Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Location on Map
                </label>
                <CustomMapPicker
                  onLocationChange={handleLocationChange}
                />
              </div>

              <CustomFormField name="address" label="Address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="country"
                  label="Country"
                  type="select"
                  options={Object.keys(CountryEnum).map((c) => ({
                    value: c,
                    label: CountryLabels[c as CountryEnum],
                  }))}
                />
                <CustomFormField name="city" label="City (Optional)" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="state"
                  label="State (Optional)"
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code (Optional)"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
            >
              Create Property
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
