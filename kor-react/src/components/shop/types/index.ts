export interface ShopUser {
  email: string;
  name: string;
  shopName?: string;
  shopCode?: string;
  subscription?: {
    plan: string;
    status: string;
    nextBilling?: string;
    subId?: string;
    invoiceId?: string;
  };
}

export interface PlanFeatures {
  name: string;
  maxCustomers: number;
  maxNotifications: number;
  features: string[];
  color: string;
  description: string;
}

export interface DashboardSectionProps {
  shopUser: ShopUser | null;
  planFeatures: PlanFeatures | null;
}

export interface CustomerUsageProps {
  customerCount: number | null;
  customerCountLoading: boolean;
  customerCountError: string | null;
}
