"use client";

import { UsageAlerts } from '@/components/subscription/UsageAlerts';
import { useTranslation } from '@/context/TranslationContext';
import { Card } from '@/components/ui/card';

export default function SubscriptionPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <UsageAlerts />
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Free Plan</h3>
              <p className="text-gray-600 text-sm mt-1">Basic features for individual users</p>
              <p className="text-2xl font-bold mt-2">$0</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
            
            <div className="border rounded-lg p-4 bg-primary/5">
              <h3 className="font-medium">Pro Plan</h3>
              <p className="text-gray-600 text-sm mt-1">Advanced features for growing businesses</p>
              <p className="text-2xl font-bold mt-2">$29.99</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Enterprise Plan</h3>
              <p className="text-gray-600 text-sm mt-1">Full features for large organizations</p>
              <p className="text-2xl font-bold mt-2">$299.99</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 