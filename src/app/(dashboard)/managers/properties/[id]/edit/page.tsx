"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import {
  useGetAuthUserQuery,
  useGetPropertyQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useTogglePropertyVisibilityMutation,
  useGetPricePredictionMutation,
} from "@/state/api";
import {
  PropertyTypeEnum,
  PropertyTypeLabels,
  FrequencyEnum,
  FrequencyLabels,
  CountryEnum,
  CountryLabels,
  UAECities,
} from "@/lib/constants";
import { PricingResult } from "@/state";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import CustomMapPicker from "@/components/CustomMapPicker";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Link from "next/link";
import { ArrowLeft, Trash2, Eye, EyeOff, Save, Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useActivityLog } from "@/hooks/useActivityLog";
import * as z from "zod";

// Create a modified schema for editing (photos are optional when editing)
const editPropertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  pricePerMonth: z.number().positive("Price must be greater than 0").int(),
  isParkingIncluded: z.boolean(),
  furnished: z.boolean(),
  frequency: z.nativeEnum(FrequencyEnum),
  photoUrls: z.array(z.instanceof(File)).optional(),
  beds: z.number().min(1, "At least 1 bed is required").max(10).int(),
  baths: z.number().min(1, "At least 1 bath is required").max(10),
  squareFeet: z.number().int().positive("Square feet must be greater than 0"),
  propertyType: z.nativeEnum(PropertyTypeEnum),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.nativeEnum(CountryEnum),
  postalCode: z.string().optional(),
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
});

type EditPropertyFormData = z.infer<typeof editPropertySchema>;

const EditProperty = () => {
  const { id } = useParams();
  const router = useRouter();
  const propertyId = Number(id);

  const { data: authUser } = useGetAuthUserQuery();
  const { data: property, isLoading: propertyLoading } = useGetPropertyQuery(propertyId);
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();
  const [toggleVisibility, { isLoading: isToggling }] = useTogglePropertyVisibilityMutation();
  const [getPricePrediction, { isLoading: isPredicting }] = useGetPricePredictionMutation();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const { logPropertyUpdated, logPropertyDeleted, logPropertyVisibilityChanged } = useActivityLog();

  const form = useForm<EditPropertyFormData>({
    resolver: zodResolver(editPropertySchema),
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

  // Populate form with existing property data
  useEffect(() => {
    if (property) {
      form.reset({
        name: property.name,
        description: property.description,
        pricePerMonth: property.pricePerMonth,
        isParkingIncluded: property.isParkingIncluded,
        furnished: property.Furnished,
        frequency: property.Frequency as FrequencyEnum,
        photoUrls: [],
        beds: property.beds,
        baths: property.baths,
        squareFeet: property.squareFeet,
        propertyType: property.propertyType as PropertyTypeEnum,
        address: property.location?.address || "",
        city: property.location?.city || "",
        state: property.location?.state || "",
        country: (property.location?.country as CountryEnum) || CountryEnum.Jordan,
        postalCode: property.location?.postalCode || "",
        longitude: property.location?.coordinates?.longitude,
        latitude: property.location?.coordinates?.latitude,
      });
    }
  }, [property, form]);

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
      if (location.country) {
        const countryKey = Object.keys(CountryEnum).find(
          (key) =>
            key.toLowerCase() === location.country?.toLowerCase() ||
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

  const onSubmit = async (data: EditPropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      toast.error("Not authorized");
      return;
    }

    try {
      await updateProperty({
        id: propertyId,
        data: {
          name: data.name,
          description: data.description,
          pricePerMonth: data.pricePerMonth,
          isParkingIncluded: data.isParkingIncluded,
          furnished: data.furnished,
          frequency: data.frequency,
          beds: data.beds,
          baths: data.baths,
          squareFeet: data.squareFeet,
          propertyType: data.propertyType,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          longitude: data.longitude,
          latitude: data.latitude,
        },
      }).unwrap();

      logPropertyUpdated(data.name, propertyId);
      toast.success("Property updated successfully!", {
        description: "Your changes have been saved.",
      });
    } catch {
      toast.error("Failed to update property", {
        description: "Please try again later.",
      });
    }
  };

  const handleDelete = async () => {
    if (!authUser?.cognitoInfo?.userId || !property) return;

    try {
      await deleteProperty({
        id: propertyId,
        cognitoId: authUser.cognitoInfo.userId,
      }).unwrap();

      logPropertyDeleted(property.name, propertyId);
      toast.success("Property deleted successfully!");
      router.push("/managers/properties");
    } catch (error) {
      toast.error("Failed to delete property");
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

      logPropertyVisibilityChanged(property.name, !property.isHidden, propertyId);
    } catch (error) {
      toast.error("Failed to toggle visibility");
    }
  };

  if (propertyLoading) return <Loading />;
  if (!property) return <div>Property not found</div>;

  // Check if current user owns this property
  if (property.managerCognitoId !== authUser?.cognitoInfo?.userId) {
    return (
      <div className="dashboard-container">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-600">Not Authorized</h2>
          <p className="text-gray-600 mt-2">You do not have permission to edit this property.</p>
          <Link href="/managers/properties" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Back Link */}
      <Link
        href={`/managers/properties/${propertyId}`}
        className="flex items-center mb-4 hover:text-primary-500"
        scroll={false}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Back to Property Details</span>
      </Link>

      <div className="flex justify-between items-start mb-6">
        <Header title="Edit Property" subtitle={`Editing: ${property.name}`} />

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

          {/* Delete Button */}
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-300 text-red-700 rounded-md hover:bg-red-100 transition-colors"
            title="Delete property"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Status badges */}
      {property?.isHidden && (
        <div className="mb-6">
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
            Hidden from Search
          </span>
        </div>
      )}

      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-10">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Property Name" />
                <CustomFormField name="description" label="Description" type="textarea" />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField name="pricePerMonth" label="Price per Month" type="number" />
                <CustomFormField name="squareFeet" label="Square Feet" type="number" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField name="beds" label="Number of Beds" type="number" />
                <CustomFormField name="baths" label="Number of Baths" type="number" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField name="isParkingIncluded" label="Parking Included" type="switch" />
                <CustomFormField name="furnished" label="Furnished" type="switch" />
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
                        <p className="text-sm text-gray-600">AI Predicted Price</p>
                        <p className="text-lg font-bold text-purple-700">
                          {pricingResult.predicted_price?.toLocaleString()} AED
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

            {/* Current Photos */}
            {property.photoUrls && property.photoUrls.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Current Photos</h2>
                <div className="flex gap-4 flex-wrap">
                  {property.photoUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Property photo ${index + 1}`}
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Note: Photo editing is not available yet. Photos remain unchanged.
                </p>
              </div>
            )}

            <hr className="my-6 border-gray-200" />

            {/* Property Location */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Property Location</h2>

              {/* Mapbox Location Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Location on Map
                </label>
                <CustomMapPicker
                  onLocationChange={handleLocationChange}
                  initialLongitude={property.location?.coordinates?.longitude}
                  initialLatitude={property.location?.coordinates?.latitude}
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
                <CustomFormField name="state" label="State (Optional)" />
                <CustomFormField name="postalCode" label="Postal Code (Optional)" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-primary-700 text-white flex-1"
                disabled={isUpdating || (isUAE && pricingResult && !pricingResult.manager_price_valid)}
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/managers/properties/${propertyId}`)}
              >
                Cancel
              </Button>
            </div>
            {isUAE && pricingResult && !pricingResult.manager_price_valid && (
              <p className="text-sm text-red-600 text-center">
                Cannot save: Price is below the minimum allowed ({pricingResult.minimum_allowed_price?.toLocaleString()} AED)
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProperty;
