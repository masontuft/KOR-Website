import React from 'react';
import { DashboardSectionProps } from '../types';

const PlanFeaturesBanner: React.FC<DashboardSectionProps> = ({ planFeatures }) => {
  if (!planFeatures) return null;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
      border: `3px solid ${planFeatures.color}`,
      borderLeft: `6px solid ${planFeatures.color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ color: planFeatures.color, margin: '0 0 0.5rem 0' }}>{planFeatures.name} Features</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <strong>Customer Limit:</strong> {planFeatures.maxCustomers === -1 ? 'Unlimited' : planFeatures.maxCustomers.toLocaleString()}
            </div>
          </div>
        </div>
        {planFeatures.maxCustomers !== 50 && (
          <div style={{
            backgroundColor: planFeatures.color,
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            {planFeatures.name === 'Premium Plan' ? '⭐ POPULAR' : planFeatures.name === 'Family Plan' ? '👨‍👩‍👧‍👦 FAMILY' : '🚀 Pro'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanFeaturesBanner;