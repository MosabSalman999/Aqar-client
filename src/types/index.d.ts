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
    propertyId: number;
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

  // ─────────────────────────────────────────────────────────────
  // EVALUATION & REPUTATION TYPES
  // ─────────────────────────────────────────────────────────────

  interface TenantEvaluation {
    id: number;
    createdAt: string;
    leaseId: number;
    tenantCognitoId: string;
    managerCognitoId: string;
    rating: number;
    comment: string;
    integrityScore: number;
    latePaymentCount: number;
    reportsCount: number;
    lease?: {
      property?: {
        id: number;
        name: string;
      };
    };
    manager?: {
      name: string;
    };
  }

  interface PropertyEvaluation {
    id: number;
    createdAt: string;
    leaseId: number;
    propertyId: number;
    tenantCognitoId: string;
    rating: number;
    comment: string;
    tenant?: {
      name: string;
    };
    lease?: {
      startDate: string;
      endDate: string;
    };
  }

  interface IntegritySnapshot {
    id: number;
    createdAt: string;
    tenantCognitoId: string;
    integrityScore: number;
    totalLatePayments: number;
    totalReports: number;
    totalLeasesCompleted: number;
    averageManagerRating: number | null;
  }

  interface IntegrityBreakdown {
    baseScore: number;
    latePaymentPenalty: number;
    reportPenalty: number;
    leaseBonus: number;
    ratingAdjustment: number;
  }

  interface TenantIntegrity {
    integrityScore: number;
    latePaymentCount: number;
    reportsCount: number;
    totalLeasesCompleted: number;
    averageManagerRating: number | null;
    breakdown: IntegrityBreakdown;
  }

  interface TenantReputation {
    tenant: {
      id: number;
      cognitoId: string;
      name: string;
      email: string;
    };
    currentIntegrity: TenantIntegrity;
    evaluations: TenantEvaluation[];
    integrityHistory: IntegritySnapshot[];
  }

  interface PropertyEvaluationsResponse {
    propertyId: number;
    totalEvaluations: number;
    averageRating: number | null;
    evaluations: PropertyEvaluation[];
  }

  interface CanEvaluateResponse {
    canEvaluate: boolean;
    reason: string | null;
  }

  interface CreateTenantEvaluationRequest {
    leaseId: number;
    rating: number;
    comment: string;
  }

  interface CreatePropertyEvaluationRequest {
    leaseId: number;
    rating: number;
    comment: string;
  }
}

export {};
