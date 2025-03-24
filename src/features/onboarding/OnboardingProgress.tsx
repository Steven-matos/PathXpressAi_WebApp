"use client";

import { useOnboarding, OnboardingStep } from '@/context/OnboardingContext';
import { useTranslation } from '@/context/TranslationContext';

export function OnboardingProgress() {
  const { t } = useTranslation();
  const { currentStep } = useOnboarding();

  const steps: { id: OnboardingStep; label: string }[] = [
    { id: 'profile', label: t('onboarding.steps.profile') || 'Your Profile' },
    { id: 'address', label: t('onboarding.steps.address') || 'Home Base Address' },
    { id: 'subscription', label: t('onboarding.steps.subscription') || 'Subscription Plan' },
  ];

  // Calculate the step index (0-based)
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`text-sm font-medium ${
              index <= currentIndex ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
      <div className="w-full bg-secondary h-2 rounded-full">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
} 