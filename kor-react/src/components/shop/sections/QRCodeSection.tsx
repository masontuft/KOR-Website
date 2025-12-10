import React from 'react';
import QrCodeGenerator from '../../common/QrCodeGenerator';
import { DashboardSectionProps } from '../types';

// Extended props to allow plan-specific customization
interface QRCodeSectionProps extends DashboardSectionProps {
  customerLabel?: string;     // "Customer" or "Family Member"
  title?: string;            // Custom title
  description?: string;      // Custom description
  instructionText?: string;  // Custom instruction text
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ 
  shopUser, 
  planFeatures,
  // Default values - if no props passed, use these
  customerLabel = "Customer",
  title = "Customer QR Code", 
  description = "Seamless customer onboarding for your bike shop!",
  instructionText = "For your customers:"
}) => {
  if (!shopUser?.shopCode) return null;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginTop: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#333', marginBottom: '1rem' }}>📱 {title}</h2>
      <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        <strong>{description}</strong>
      </p>
      <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {customerLabel}s scan → Auto-redirect to app store → App pre-filled with shop code → Instant login!
      </p>
      
      {/* Legacy-style benefits display */}
      <div style={{
        backgroundColor: '#e8f5e8',
        border: '1px solid #28a745',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'inline-block',
        maxWidth: '500px'
      }}>
        <h3 style={{ color: '#28a745', marginTop: 0, marginBottom: '0.5rem' }}>✨ What's Improved</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
          <div>
            <strong style={{ color: '#e67e22' }}>😕 Before (7 steps)</strong>
            <ol style={{ textAlign: 'left', fontSize: '0.8rem', paddingLeft: '1rem' }}>
              <li>Get shop code from staff</li>
              <li>Download app manually</li>
              <li>Open app</li>
              <li>Navigate to login</li>
              <li>Type shop code</li>
              <li>Tap continue</li>
              <li>Complete Strava auth</li>
            </ol>
          </div>
          <div>
            <strong style={{ color: '#28a745' }}>😊 After (3 steps)</strong>
            <ol style={{ textAlign: 'left', fontSize: '0.8rem', paddingLeft: '1rem' }}>
              <li><strong>Scan QR code</strong></li>
              <li><strong>App opens automatically</strong></li>
              <li><strong>Complete Strava auth</strong></li>
            </ol>
            <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              ✨ Shop code auto-filled!
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Generator */}
      <QrCodeGenerator 
        shopCode={shopUser.shopCode}
        shopName={shopUser.shopName}
        size={200}
        onError={(error) => console.error('QR Code Error:', error)}
      />
      
      {/* Instructions for shop owners */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem',
        maxWidth: '600px',
        margin: '2rem auto 0'
      }}>
        <h4 style={{ color: '#333', marginTop: 0 }}>💡 How to Use Your QR Code</h4>
        <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
          <p><strong>{instructionText}</strong></p>
          <blockquote style={{
            backgroundColor: '#667eea',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            fontStyle: 'italic',
            margin: '1rem 0'
          }}>
            "Scan this QR code with your phone to get our bike maintenance app - it'll set everything up automatically!"
          </blockquote>
          
          <p><strong>Ways to share:</strong></p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>📄 <strong>Print it</strong> and display prominently in your shop</li>
            <li>💳 <strong>Add to business cards</strong> or promotional materials</li>
            <li>📧 <strong>Share digitally</strong> via email or social media</li>
            <li>📱 <strong>Show on tablet/phone</strong> for customers to scan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;