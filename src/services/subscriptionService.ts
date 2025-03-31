import { generateClient } from 'aws-amplify/api';
import { GraphQLQuery } from '@aws-amplify/api';
import {
  SubscriptionPlan,
  Subscription,
  UsageHistory,
  UsageAlert,
  SubscriptionPlanResponse,
  SubscriptionResponse,
} from '@/types/subscription';

interface SubscriptionPlanResponse {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface GraphQLResponse<T> {
  data: {
    [key: string]: T;
  };
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
    extensions?: Record<string, any>;
  }>;
}

const client = generateClient();

const SUBSCRIPTION_API = 'PathXpressAPI';

export const subscriptionService = {
  // Plan Management
  async getSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
    try {
      const response = await client.graphql({
        query: /* GraphQL */ `
          query GetSubscriptionPlans {
            getSubscriptionPlans {
              id
              type
              price
              features
            }
          }
        `
      }) as unknown as GraphQLResponse<SubscriptionPlanResponse[]>;

      return response.data.getSubscriptionPlans;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  async getSubscriptionDetails(): Promise<Subscription> {
    try {
      const response = await client.graphql({
        query: `
          query GetSubscriptionDetails {
            getSubscriptionDetails {
              id
              userId
              planId
              status
              startDate
              endDate
              autoRenew
              stripeSubscriptionId
              usage {
                routesPerMonth
                currentUsage
                lastResetDate
              }
              createdAt
              updatedAt
            }
          }
        `,
      }) as SubscriptionResponse;
      return response.data.getSubscriptionDetails;
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      throw error;
    }
  },

  async upgradeSubscription(planId: string): Promise<SubscriptionPlanResponse> {
    try {
      const response = await client.graphql({
        query: `
          mutation UpgradeSubscription($planId: String!) {
            upgradeSubscription(planId: $planId) {
              id
              status
              planId
              startDate
              endDate
              usage {
                routesPerMonth
                currentUsage
                lastResetDate
              }
            }
          }
        `,
        variables: { planId },
      }) as unknown as GraphQLResponse<SubscriptionPlanResponse>;
      return response.data.upgradeSubscription;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  },

  async downgradeSubscription(planId: string): Promise<SubscriptionPlanResponse> {
    try {
      const response = await client.graphql({
        query: `
          mutation DowngradeSubscription($planId: String!) {
            downgradeSubscription(planId: $planId) {
              id
              status
              planId
              startDate
              endDate
              usage {
                routesPerMonth
                currentUsage
                lastResetDate
              }
            }
          }
        `,
        variables: { planId },
      }) as unknown as GraphQLResponse<SubscriptionPlanResponse>;
      return response.data.downgradeSubscription;
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      throw error;
    }
  },

  // Usage Management
  async getUsageHistory(): Promise<UsageHistory[]> {
    try {
      const response = await client.graphql({
        query: `
          query GetUsageHistory {
            getUsageHistory {
              id
              subscriptionId
              date
              usage
              limit
            }
          }
        `,
      }) as unknown as GraphQLResponse<UsageHistory[]>;
      return response.data.getUsageHistory;
    } catch (error) {
      console.error('Error fetching usage history:', error);
      throw error;
    }
  },

  async getUsageAlerts(): Promise<UsageAlert[]> {
    try {
      const response = await client.graphql({
        query: `
          query GetUsageAlerts {
            getUsageAlerts {
              id
              subscriptionId
              threshold
              isEnabled
              email
            }
          }
        `,
      }) as unknown as GraphQLResponse<UsageAlert[]>;
      return response.data.getUsageAlerts;
    } catch (error) {
      console.error('Error fetching usage alerts:', error);
      throw error;
    }
  },

  async setUsageAlert(threshold: number, email: string): Promise<UsageAlert> {
    try {
      const response = await client.graphql({
        query: `
          mutation SetUsageAlert($threshold: Float!, $email: String!) {
            setUsageAlert(threshold: $threshold, email: $email) {
              id
              subscriptionId
              threshold
              isEnabled
              email
            }
          }
        `,
        variables: { threshold, email },
      }) as unknown as GraphQLResponse<UsageAlert>;
      return response.data.setUsageAlert;
    } catch (error) {
      console.error('Error setting usage alert:', error);
      throw error;
    }
  },
}; 