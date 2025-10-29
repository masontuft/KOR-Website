import React from 'react';
import { DashboardSectionProps } from '../types';

const GettingStartedSection: React.FC<DashboardSectionProps> = ({ shopUser, planFeatures }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginTop: '1rem',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#333', marginBottom: '1rem' }}>Getting Started with JMR Cycling</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Your dashboard is being prepared with all the features of your {planFeatures?.name || 'plan'}.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ padding: '1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
          <h4 style={{ color: planFeatures?.color || '#007bff' }}>Download KOR App</h4>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Your customers will use your shop code: <strong>{shopUser?.shopCode}</strong></p>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
          <h4 style={{ color: planFeatures?.color || '#007bff' }}>Configure Settings</h4>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Customize notifications and shop preferences</p>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
          <h4 style={{ color: planFeatures?.color || '#007bff' }}>Start Managing</h4>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Begin tracking customer bike maintenance</p>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedSection;