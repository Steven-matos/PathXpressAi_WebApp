import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionPlan } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export const SubscriptionManager: React.FC = () => {
  const {
    subscription,
    plans,
    usageHistory,
    loading,
    error,
    upgradeSubscription,
    downgradeSubscription,
    refreshSubscription,
  } = useSubscription();

  const handlePlanChange = async (planId: string, isUpgrade: boolean) => {
    try {
      if (isUpgrade) {
        await upgradeSubscription(planId);
      } else {
        await downgradeSubscription(planId);
      }
      await refreshSubscription();
    } catch (error) {
      console.error('Failed to change subscription plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">No active subscription found</div>
      </div>
    );
  }

  const currentPlan = plans.find((plan) => plan.id === subscription.planId);
  const usagePercentage = (subscription.usage.currentUsage / subscription.usage.routesPerMonth) * 100;

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Subscription</h2>
            <div className="flex items-center gap-2">
              <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                {subscription.status}
              </Badge>
              <span className="text-gray-500">
                {new Date(subscription.startDate).toLocaleDateString()} -{' '}
                {new Date(subscription.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${currentPlan?.price}</div>
            <div className="text-gray-500">per {currentPlan?.billingPeriod}</div>
          </div>
        </div>
      </Card>

      {/* Usage Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Monthly Route Usage</span>
              <span className="font-medium">
                {subscription.usage.currentUsage} / {subscription.usage.routesPerMonth}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Max Drivers</div>
              <div className="font-medium">{currentPlan?.limits.maxDrivers}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Max Vehicles</div>
              <div className="font-medium">{currentPlan?.limits.maxVehicles}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Plans */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{plan.name}</h4>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>
                <div className="text-2xl font-bold">${plan.price}</div>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={plan.id === subscription.planId ? 'outline' : 'default'}
                  className="w-full"
                  onClick={() =>
                    handlePlanChange(plan.id, plan.price > (currentPlan?.price || 0))
                  }
                  disabled={plan.id === subscription.planId}
                >
                  {plan.id === subscription.planId
                    ? 'Current Plan'
                    : plan.price > (currentPlan?.price || 0)
                    ? 'Upgrade'
                    : 'Downgrade'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}; 