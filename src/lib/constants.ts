import {
  Home,
  Building,
  Building2,
  Hotel,
  Castle,
  Trees,
  Layers,
  LayoutList,
  MapPin,
  LucideIcon,
} from "lucide-react";

export enum PropertyTypeEnum {
  Apartment = "Apartment",
  Villa = "Villa",
  Townhouse = "Townhouse",
  HotelApartment = "HotelApartment",
  Penthouse = "Penthouse",
  VillaCompound = "VillaCompound",
  ResidentialBuilding = "ResidentialBuilding",
  ResidentialFloor = "ResidentialFloor",
  ResidentialPlot = "ResidentialPlot",
}

export const PropertyTypeLabels: Record<PropertyTypeEnum, string> = {
  Apartment: "Apartment",
  Villa: "Villa",
  Townhouse: "Townhouse",
  HotelApartment: "Hotel Apartment",
  Penthouse: "Penthouse",
  VillaCompound: "Villa Compound",
  ResidentialBuilding: "Residential Building",
  ResidentialFloor: "Residential Floor",
  ResidentialPlot: "Residential Plot",
};

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon> = {
  Apartment: Building,
  Villa: Home,
  Townhouse: Building2,
  HotelApartment: Hotel,
  Penthouse: Castle,
  VillaCompound: Trees,
  ResidentialBuilding: Layers,
  ResidentialFloor: LayoutList,
  ResidentialPlot: MapPin,
};

export enum FrequencyEnum {
  Yearly = "Yearly",
  Monthly = "Monthly",
}

export const FrequencyLabels: Record<FrequencyEnum, string> = {
  Yearly: "Yearly",
  Monthly: "Monthly",
};

export enum CountryEnum {
  Jordan = "Jordan",
  UAE = "UAE",
}

export const CountryLabels: Record<CountryEnum, string> = {
  Jordan: "Jordan",
  UAE: "United Arab Emirates",
};

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 55; // in pixels

export const PUBLIC_ROUTES = ["/", "/landing"] as const;

// Test users for development
export const testUsers = {
  tenant: {
    username: "Carol White",
    userId: "us-east-2:76543210-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "carol.white@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  tenantRole: "tenant",
  manager: {
    username: "John Smith",
    userId: "us-east-2:12345678-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "john.smith@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  managerRole: "manager",
};
