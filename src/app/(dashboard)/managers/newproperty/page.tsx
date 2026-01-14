"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery, useGetPricePredictionMutation } from "@/state/api";
import { PropertyTypeEnum, PropertyTypeLabels, FrequencyEnum, FrequencyLabels, CountryEnum, CountryLabels, UAECities } from "@/lib/constants";
import { PricingResult } from "@/state";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import CustomMapPicker from "@/components/CustomMapPicker";
import { toast } from "sonner";
import { useActivityLog } from "@/hooks/useActivityLog";
import { Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const { logPropertyCreated } = useActivityLog();
  const [getPricePrediction, { isLoading: isPredicting }] = useGetPricePredictionMutation();
  
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

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

  // Watch form values for AI pricing
  const watchedCountry = form.watch("country");
  const watchedPrice = form.watch("pricePerMonth");
  const watchedCity = form.watch("city");
  const isUAE = watchedCountry === CountryEnum.UAE;

  // Fetch AI pricing when UAE is selected
  const fetchPricePrediction = useCallback(async () => {
    if (!isUAE) {
      setPricingResult(null);
      setPricingError(null);
      return;
    }

    const formValues = form.getValues();
    const city = formValues.city || "Dubai";
    
    // Validate city is a valid UAE city
    if (!UAECities.includes(city as typeof UAECities[number])) {
      setPricingError(`Please select a valid UAE city: ${UAECities.join(", ")}`);
      setPricingResult(null);
      return;
    }

    if (!formValues.latitude || !formValues.longitude) {
      setPricingError("Please select a location on the map for AI pricing");
      setPricingResult(null);
      return;
    }

    try {
      setPricingError(null);
      const result = await getPricePrediction({
        beds: formValues.beds,
        baths: formValues.baths,
        squareFeet: formValues.squareFeet,
        propertyType: formValues.propertyType,
        furnished: formValues.furnished,
        location: city,
        city: city,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
        country: formValues.country,
        managerPrice: formValues.pricePerMonth,
      }).unwrap();
      setPricingResult(result);
    } catch (error) {
      setPricingError("Failed to get AI price prediction. Please try again.");
      setPricingResult(null);
    }
  }, [form, getPricePrediction, isUAE]);

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
      const result = await createProperty(formData).unwrap();
      logPropertyCreated(data.name, result?.id);
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

            {/* AI Pricing Section - Only for UAE */}
            {isUAE && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Price Prediction
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      AI pricing rules apply in UAE only
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchPricePrediction}
                    disabled={isPredicting}
                    className="flex items-center gap-2"
                  >
                    {isPredicting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isPredicting ? "Analyzing..." : "Get AI Prediction"}
                  </Button>
                </div>

                {pricingError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{pricingError}</p>
                  </div>
                )}

                {pricingResult && (
                  <div className={`rounded-lg p-4 border ${
                    pricingResult.manager_price_valid
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">AI Predicted Price (Monthly)</p>
                        <p className="text-lg font-bold text-purple-700">
                          {pricingResult.predicted_price_monthly?.toLocaleString()} AED
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Minimum Allowed</p>
                        <p className="text-lg font-bold text-orange-600">
                          {pricingResult.minimum_allowed_price?.toLocaleString()} AED
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Your Price</p>
                        <p className="text-lg font-bold">
                          {watchedPrice?.toLocaleString()} AED
                        </p>
                      </div>
                    </div>
                    {pricingResult.rent_category && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Rent Category:</span> {pricingResult.rent_category}
                        </p>
                        {pricingResult.category_description && (
                          <p className="text-sm text-gray-500 mt-1">{pricingResult.category_description}</p>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-2">
                      {pricingResult.manager_price_valid ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">
                            Price is valid - {pricingResult.price_label} price range
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-700 font-medium">
                            {pricingResult.message}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {!pricingResult && !pricingError && !isPredicting && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-700">
                      Click &quot;Get AI Prediction&quot; to validate your price against the market rate.
                      Prices below 80% of the predicted value will not be accepted.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isUAE && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  AI pricing rules apply in UAE only. Any price is accepted for {CountryLabels[watchedCountry as CountryEnum] || watchedCountry}.
                </p>
              </div>
            )}

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
              disabled={isUAE && pricingResult && !pricingResult.manager_price_valid}
            >
              Create Property
            </Button>
            {isUAE && pricingResult && !pricingResult.manager_price_valid && (
              <p className="text-sm text-red-600 text-center mt-2">
                Cannot create: Price is below the minimum allowed ({pricingResult.minimum_allowed_price?.toLocaleString()} AED/month)
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
