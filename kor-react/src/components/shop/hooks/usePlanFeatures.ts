import { useCallback } from 'react';
import { PlanFeatures } from '../types';

export const usePlanFeatures = () => {
  const getPlanFeatures = useCallback((planType: string): PlanFeatures => {
    const plans: { [key: string]: PlanFeatures } = {
      basic: {
        name: 'Basic Plan',
        maxCustomers: 50,
        maxNotifications: 100,
        features: [
          'Customer Management',
          'Basic Notifications',
          'Email Support'
        ],
        color: '#17a2b8',
        description: 'Perfect for small bike shops getting started with KOR'
      },
      premium: {
        name: 'Premium Plan',
        maxCustomers: -1, // Unlimited customers
        maxNotifications: -1, // Unlimited notifications
        features: [
          'Advanced Customer Management',
          'Unlimited Notifications',
          'Priority Support',
          'Analytics Dashboard',
          'Custom Campaigns'
        ],
        color: '#28a745',
        description: 'Full-featured plan for growing bike shops'
      },
      pro: {
        name: 'Pro Plan',
        maxCustomers: -1, // Unlimited customers
        maxNotifications: -1, // Unlimited notifications
        features: [
          'Pro Customer Management',
          'Unlimited Everything',
          '24/7 Support',
          'Advanced Analytics',
          'Custom Integrations'
        ],
        color: '#6f42c1',
        description: 'Complete solution for large bike shop networks'
      },
      family: {
        name: 'Family Plan',
        maxCustomers: 6,
        maxNotifications: -1, // Unlimited notifications
        features: [
          'Advanced Customer Management',
          'Unlimited Notifications',
          'Priority Support',
          'Analytics Dashboard',
          'Custom Campaigns'
        ],
        color: '#BF4A00',
        description: 'The ideal solution for a family of up to 6 bikers'
      }
    };

    return plans[planType] || plans['basic'];
  }, []);

  return { getPlanFeatures };
};
