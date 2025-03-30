import { useState, useEffect } from 'react';
import { subscriptionService } from '@/services/subscriptionService';
import {
  Subscription,
  SubscriptionPlan,
  UsageHistory,
  UsageAlert,
} from '@/types/subscription';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [usageAlerts, setUsageAlerts] = useState<UsageAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const details = await subscriptionService.getSubscriptionDetails();
      setSubscription(details);
    } catch (err) {
      setError('Failed to fetch subscription details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const availablePlans = await subscriptionService.getSubscriptionPlans();
      setPlans(availablePlans);
    } catch (err) {
      setError('Failed to fetch subscription plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      setLoading(true);
      const history = await subscriptionService.getUsageHistory();
      setUsageHistory(history);
    } catch (err) {
      setError('Failed to fetch usage history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageAlerts = async () => {
    try {
      setLoading(true);
      const alerts = await subscriptionService.getUsageAlerts();
      setUsageAlerts(alerts);
    } catch (err) {
      setError('Failed to fetch usage alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const upgradeSubscription = async (planId: string) => {
    try {
      setLoading(true);
      const updatedSubscription = await subscriptionService.upgradeSubscription(planId);
      setSubscription(updatedSubscription);
      return updatedSubscription;
    } catch (err) {
      setError('Failed to upgrade subscription');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downgradeSubscription = async (planId: string) => {
    try {
      setLoading(true);
      const updatedSubscription = await subscriptionService.downgradeSubscription(planId);
      setSubscription(updatedSubscription);
      return updatedSubscription;
    } catch (err) {
      setError('Failed to downgrade subscription');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setUsageAlert = async (threshold: number, email: string) => {
    try {
      setLoading(true);
      const newAlert = await subscriptionService.setUsageAlert(threshold, email);
      setUsageAlerts((prev) => [...prev, newAlert]);
      return newAlert;
    } catch (err) {
      setError('Failed to set usage alert');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionDetails();
    fetchSubscriptionPlans();
    fetchUsageHistory();
    fetchUsageAlerts();
  }, []);

  return {
    subscription,
    plans,
    usageHistory,
    usageAlerts,
    loading,
    error,
    upgradeSubscription,
    downgradeSubscription,
    setUsageAlert,
    refreshSubscription: fetchSubscriptionDetails,
    refreshPlans: fetchSubscriptionPlans,
    refreshUsageHistory: fetchUsageHistory,
    refreshUsageAlerts: fetchUsageAlerts,
  };
}; 