import React from 'react';
import { DashboardSectionProps } from '../types';

const PlanFeaturesDisplay: React.FC<DashboardSectionProps> = ({ planFeatures }) => {
  if (!planFeatures) return null;

  const getFeatureDescription = (feature: string) => {
    const descriptions: { [key: string]: string } = {
      'Customer Management': 'Track and manage all your bike service customers',
      'Basic Notifications': 'Send service reminders to your customers',
      'Email Support': 'Get help via email from our support team',
      'Advanced Customer Management': 'Detailed customer profiles and service history',
      'Unlimited Notifications': 'Send unlimited maintenance alerts and promotions',
      'Priority Support': 'Get faster response times from our team',
      'Analytics Dashboard': 'Detailed insights into your shop performance',
      'Custom Campaigns': 'Create targeted marketing campaigns',
      'Pro Customer Management': 'Multi-location customer management',
      'Unlimited Everything': 'No limits on any features',
      '24/7 Support': 'Round-the-clock support via phone and chat',
      'Advanced Analytics': 'Deep business intelligence and reporting',
      'Custom Integrations': 'Connect with your existing business tools'
    };
    
    return descriptions[feature] || 'Available in your current plan';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginTop: '2rem'
    }}>
      <h2 style={{ color: '#333', marginBottom: '1rem', textAlign: 'center' }}>Your {planFeatures.name} Features</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {planFeatures.features.map((feature, index) => (
          <div key={index} style={{ 
            padding: '1rem',
            textAlign: 'center',
            border: `2px solid ${planFeatures.color}20`,
            borderRadius: '8px',
            backgroundColor: `${planFeatures.color}10`
          }}>
            <h4 style={{ color: planFeatures.color, marginTop: 0 }}>✓ {feature}</h4>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
              {getFeatureDescription(feature)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanFeaturesDisplay;