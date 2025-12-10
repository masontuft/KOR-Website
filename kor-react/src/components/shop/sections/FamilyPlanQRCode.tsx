import React from 'react';
import QrCodeGenerator from '../../common/QrCodeGenerator';
import { DashboardSectionProps } from '../types';

// Extended props to allow plan-specific customization
interface QRCodeSectionProps extends DashboardSectionProps {
  customerLabel?: string; // "Customer" or "Family Member"
  title?: string; // Custom title
  description?: string; // Custom description
  instructionText?: string; // Custom instruction text
}

const FamilyPlanQRCodeSection: React.FC<QRCodeSectionProps> = ({
  shopUser,
  planFeatures,
  // Default values - if no props passed, use these
  customerLabel = 'Customer',
  title = 'Family Member QR Code',
  description = 'Easy app access for your family!',
  instructionText = 'For your customers:'
}) => {
  if (!shopUser?.shopCode) return null;

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '2rem',
        textAlign: 'center'
      }}
    >
      <h2 style={{ color: '#333', marginBottom: '1rem' }}>📱 {title}</h2>
      <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        <strong>{description}</strong>
      </p>

      {/* QR Code Generator */}
      <QrCodeGenerator
        shopCode={shopUser.shopCode}
        shopName={shopUser.shopName}
        size={200}
        onError={error => console.error('QR Code Error:', error)}
      />
    </div>
  );
};

export default FamilyPlanQRCodeSection;
