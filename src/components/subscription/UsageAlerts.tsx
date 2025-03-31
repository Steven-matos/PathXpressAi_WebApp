import React, { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const UsageAlerts: React.FC = () => {
  const { usageAlerts, loading, error, setUsageAlert, refreshUsageAlerts } = useSubscription();
  const [threshold, setThreshold] = useState(80);
  const [email, setEmail] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnabled) return;

    try {
      setIsSubmitting(true);
      await setUsageAlert(threshold, email);
      await refreshUsageAlerts();
      setEmail('');
      setThreshold(80);
      setIsEnabled(true);
    } catch (error) {
      console.error('Failed to set usage alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Usage Alerts</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Usage Alerts</Label>
            <Switch
              id="enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Alert Threshold (%)</Label>
            <Input
              id="threshold"
              type="number"
              min="1"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              disabled={!isEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Notification Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              disabled={!isEnabled}
            />
          </div>

          <Button
            type="submit"
            disabled={!isEnabled || isSubmitting || !email}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Alert...
              </>
            ) : (
              'Set Usage Alert'
            )}
          </Button>
        </form>
      </Card>

      {usageAlerts.length > 0 && (
        <Card className="p-6">
          <h4 className="text-md font-semibold mb-4">Active Alerts</h4>
          <div className="space-y-4">
            {usageAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">
                    Alert at {alert.threshold}% usage
                  </div>
                  <div className="text-sm text-gray-500">{alert.email}</div>
                </div>
                <Badge variant={alert.isEnabled ? 'default' : 'secondary'}>
                  {alert.isEnabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}; 