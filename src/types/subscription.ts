export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
  limits: {
    routesPerMonth: number;
    maxDrivers: number;
    maxVehicles: number;
  };
  isActive: boolean;
  stripePriceId: string;
  stripeProductId: string;
}

export interface SubscriptionUsage {
  routesPerMonth: number;
  currentUsage: number;
  lastResetDate: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  stripeSubscriptionId: string;
  usage: SubscriptionUsage;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlanResponse {
  data: {
    getSubscriptionPlans: SubscriptionPlan[];
  };
}

export interface SubscriptionResponse {
  data: {
    getSubscriptionDetails: Subscription;
  };
}

export interface UsageHistory {
  id: string;
  subscriptionId: string;
  date: string;
  usage: number;
  limit: number;
}

export interface UsageAlert {
  id: string;
  subscriptionId: string;
  threshold: number;
  isEnabled: boolean;
  email: string;
} 