import React from 'react';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';
import { UsageAlerts } from '@/components/subscription/UsageAlerts';

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SubscriptionManager />
          </div>
          <div>
            <UsageAlerts />
          </div>
        </div>
      </div>
    </div>
  );
} 