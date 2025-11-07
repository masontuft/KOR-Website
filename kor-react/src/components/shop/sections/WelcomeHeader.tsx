import React from 'react';
import { DashboardSectionProps } from '../types';

const WelcomeHeader: React.FC<DashboardSectionProps> = ({ shopUser, planFeatures }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: planFeatures?.color || '#007bff',
      color: 'white',
      borderRadius: '12px',
      backgroundImage: 'linear-gradient(135deg, ' + (planFeatures?.color || '#007bff') + ', ' + (planFeatures?.color || '#007bff') + '90)'
    }}>
      <div>
        <h1 style={{ color: 'white', margin: 0, marginBottom: '0.5rem', textAlign: 'left' }}>Welcome, {shopUser?.shopName}!</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '1.1rem' }}>
          {planFeatures?.description || 'Managing your bike shop with KOR'}
        </p>
        {shopUser?.shopCode && (
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            Shop Code: <strong>{shopUser.shopCode}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default WelcomeHeader;