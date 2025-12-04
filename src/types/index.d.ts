import { LucideIcon } from "lucide-react";
import { AuthUser } from "aws-amplify/auth";
import { Manager, Tenant, Property, Application } from "./prismaTypes";
import { MotionProps as OriginalMotionProps } from "framer-motion";

declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {
  enum PropertyTypeEnum {
    vacantLand = "vacantLand",
    unsortedProperty = "unsortedProperty",
    floorsAndApartments = "floorsAndApartments",
    settlement = "settlement",
  }

  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
  }

  interface ContactWidgetProps {
    onOpenModal: () => void;
  }

  interface ImagePreviewsProps {
    images: string[];
  }

  interface PropertyDetailsProps {
    propertyId: number;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface PropertyLocationProps {
    propertyId: number;
  }

  interface ApplicationCardProps {
    application: Application;
    userType: "manager" | "renter";
    children: React.ReactNode;
  }

  interface CardProps {
    property: Property;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface CardCompactProps {
    property: Property;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface HeaderProps {
    title: string;
    subtitle: string;
  }

  interface NavbarProps {
    isDashboard: boolean;
  }

  interface AppSidebarProps {
    userType: "manager" | "tenant";
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: "manager" | "tenant";
  }

  interface User {
    cognitoInfo: AuthUser;
    userInfo: Tenant | Manager;
    userRole: JsonObject | JsonPrimitive | JsonArray;
  }
}

export {};
