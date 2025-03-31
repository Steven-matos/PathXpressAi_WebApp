"use client";

import React, { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '@/context/TranslationContext';

export function UsageAlerts() {
  const { t } = useTranslation();
  const { subscription, loading, error } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!subscription) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Subscription Status</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Plan Type</span>
          <span className="font-medium capitalize">{subscription.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status</span>
          <span className={`font-medium capitalize ${
            subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {subscription.status}
          </span>
        </div>
        {subscription.type === 'free' && (
          <div className="mt-4">
            <Button
              onClick={() => setShowUpgrade(true)}
              className="w-full"
            >
              Upgrade Plan
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
} 