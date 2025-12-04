import {
  Home,
  Warehouse,
  Building,
  Map,
  LucideIcon,
} from "lucide-react";

export enum PropertyTypeEnum {
  vacantLand = "vacantLand",
  unsortedProperty = "unsortedProperty",
  floorsAndApartments = "floorsAndApartments",
  settlement = "settlement",
}

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon> = {
  vacantLand: Map,
  unsortedProperty: Warehouse,
  floorsAndApartments: Building,
  settlement: Home,
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
