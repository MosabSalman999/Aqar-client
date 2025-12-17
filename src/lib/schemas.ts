import * as z from "zod";
import { PropertyTypeEnum, FrequencyEnum, CountryEnum } from "@/lib/constants";

export const propertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  pricePerMonth: z.number().positive("Price must be greater than 0").int(),
  isParkingIncluded: z.boolean(),
  furnished: z.boolean(),
  frequency: z.nativeEnum(FrequencyEnum),
  photoUrls: z.array(z.instanceof(File)),
  beds: z.number().min(1, "At least 1 bed is required").max(10).int(),
  baths: z.number().min(1, "At least 1 bath is required").max(10),
  squareFeet: z.number().int().positive("Square feet must be greater than 0"),
  propertyType: z.nativeEnum(PropertyTypeEnum),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.nativeEnum(CountryEnum),
  postalCode: z.string().optional(),
  // Coordinates from Mapbox picker
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
