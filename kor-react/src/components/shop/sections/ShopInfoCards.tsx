import React from 'react';
import { DashboardSectionProps, CustomerUsageProps } from '../types';

interface ShopInfoCardsProps extends DashboardSectionProps, CustomerUsageProps {}

const ShopInfoCards: React.FC<ShopInfoCardsProps> = ({ 
  shopUser, 
  planFeatures, 
  customerCount, 
  customerCountLoading, 
  customerCountError 
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {/* Shop Info Card - Enhanced with parameters */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center' }}>
          🏪 Shop Information
        </h3>
        <div style={{ lineHeight: 1.6 }}>
          <p><strong>Shop Name:</strong> {shopUser?.shopName}</p>
          <p><strong>Email:</strong> {shopUser?.email}</p>
          {shopUser?.shopCode && <p><strong>Shop Code:</strong> <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>{shopUser.shopCode}</code></p>}
        </div>
      </div>

      {/* Plan Limits Card - Dynamic based on plan */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center' }}>
          📊 Plan Usage
        </h3>
        <div style={{ lineHeight: 1.6 }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Customers:</strong>
              <span>{customerCountLoading ? 'Loading…' : (customerCount ?? 0)} / {planFeatures?.maxCustomers === -1 ? '∞' : planFeatures?.maxCustomers}</span>
            </div>
            {planFeatures?.maxCustomers !== -1 && (
              <div style={{ backgroundColor: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  backgroundColor: planFeatures?.color || '#007bff', 
                  height: '100%', 
                  width: `${(planFeatures?.maxCustomers && planFeatures.maxCustomers > 0 && (customerCount ?? 0) >= 0) ? Math.min(100, Math.round(((customerCount ?? 0) / planFeatures.maxCustomers) * 100)) : 0}%` 
                }}></div>
              </div>
            )}
            {customerCountError && (
              <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.5rem' }}>Error loading customers: {customerCountError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoCards;