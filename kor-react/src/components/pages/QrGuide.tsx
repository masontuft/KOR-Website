import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import StructuredData from '../common/StructuredData';

const QrGuide: React.FC = () => {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';
  const styles = {
    guideContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },
    step: {
      margin: '30px 0',
      padding: '20px',
      borderLeft: '4px solid #667eea',
      background: '#f8f9ff'
    },
    stepTitle: {
      color: '#667eea',
      marginTop: 0
    },
    benefits: {
      background: '#e8f5e8',
      borderLeft: '4px solid #28a745',
      padding: '20px',
      margin: '20px 0'
    },
    oldVsNew: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      margin: '20px 0'
    },
    old: {
      padding: '15px',
      borderRadius: '8px',
      background: '#fff3cd',
      border: '1px solid #ffeaa7'
    },
    new: {
      padding: '15px',
      borderRadius: '8px',
      background: '#d1ecf1',
      border: '1px solid #bee5eb'
    },
    code: {
      background: '#f1f1f1',
      padding: '2px 6px',
      borderRadius: '4px',
      fontFamily: 'monospace'
    },
    quote: {
      background: '#667eea',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontStyle: 'italic',
      margin: '15px 0'
    },
    ctaButton: {
      background: '#667eea',
      color: 'white',
      padding: '15px 30px',
      textDecoration: 'none',
      borderRadius: '25px',
      fontWeight: 'bold',
      display: 'inline-block',
      transition: 'background-color 0.3s ease'
    }
  };

  return (
    <div>
      <Header />
      <StructuredData
        type="website"
        pageTitle="QR Code System Guide — KOR"
        pageDescription="Guide for bike shops to onboard customers via QR codes that auto-redirect to app stores with shop codes pre-filled."
        url={`${baseUrl}/qr-guide`}
      />
      
      <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
        <div style={styles.guideContainer}>
          <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '1rem' }}>
            📱 New QR Code System Guide
          </h1>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginBottom: '2rem' }}>
            Streamlined customer onboarding for your bike shop
          </p>

          <div style={styles.benefits}>
            <h2 style={{ marginTop: 0 }}>🎉 What's New & Improved</h2>
            <p>
              <strong>Your customers now get a seamless experience:</strong> Scan QR → Auto-redirect to app store → App opens with shop code pre-filled → Instant login!
            </p>
          </div>

          <div style={styles.oldVsNew}>
            <div style={styles.old}>
              <h3>😕 Before (7 steps)</h3>
              <ol>
                <li>Get shop code from staff</li>
                <li>Download app manually</li>
                <li>Open app</li>
                <li>Navigate to login screen</li>
                <li>Manually type shop code</li>
                <li>Tap continue</li>
                <li>Complete Strava auth</li>
              </ol>
            </div>
            <div style={styles.new}>
              <h3>😊 After (3 steps)</h3>
              <ol>
                <li><strong>Scan QR code</strong></li>
                <li><strong>App opens automatically</strong></li>
                <li><strong>Complete Strava auth</strong></li>
              </ol>
              <p style={{ color: '#28a745', fontWeight: 'bold', marginTop: '10px' }}>
                ✨ Shop code auto-filled!
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>Step 1: Access Your Dashboard</h3>
            <p>
              Log into your shop dashboard at{' '}
              <Link to="/shop/login" style={{ color: '#667eea' }}>
                KOR Shop Login
              </Link>
            </p>
            <p>
              Your QR code will be automatically generated using your current shop code.
            </p>
          </div>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>Step 2: Display Your QR Code</h3>
            <p>
              The QR code on your dashboard now provides the complete onboarding experience:
            </p>
            <ul>
              <li><strong>Print it</strong> and display it prominently in your shop</li>
              <li><strong>Add it to business cards</strong> or promotional materials</li>
              <li><strong>Share it digitally</strong> via email or social media</li>
            </ul>
          </div>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>Step 3: Guide Your Customers</h3>
            <p>Simply tell your customers:</p>
            <div style={styles.quote}>
              "Scan this QR code with your phone to get our bike maintenance app - it'll set everything up automatically!"
            </div>
          </div>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>🔧 Technical Details</h3>
            <p>
              <strong>QR Code URL Format:</strong>{' '}
              <code style={styles.code}>
                https://jmrcycling.com:3001/qr/onboard/YOUR_SHOP_CODE
              </code>
            </p>
            <p><strong>What happens when scanned:</strong></p>
            <ol>
              <li>Customer scans QR code</li>
              <li>Website validates shop code</li>
              <li>Creates temporary session (expires in 1 hour)</li>
              <li>Redirects to appropriate app store (iOS/Android)</li>
              <li>App opens with deep link containing shop code</li>
              <li>Shop code automatically filled and submitted</li>
              <li>Customer proceeds directly to Strava authorization</li>
            </ol>
          </div>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>🛡️ Security Features</h3>
            <ul>
              <li><strong>Shop code validation:</strong> Only active shop codes work</li>
              <li><strong>Session expiration:</strong> Temporary sessions expire after 1 hour</li>
              <li><strong>Single-use sessions:</strong> Each QR scan creates a unique session</li>
              <li><strong>Automatic cleanup:</strong> Used sessions are automatically deleted</li>
            </ul>
          </div>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>❓ Troubleshooting</h3>
            <p><strong>If customers have issues:</strong></p>
            <ul>
              <li>They can still manually enter the shop code in the app</li>
              <li>Old QR codes will continue to work (legacy support)</li>
              <li>The system automatically falls back to manual entry if needed</li>
            </ul>
            <p>
              <strong>Need help?</strong> Contact us at{' '}
              <a href="mailto:masontuft@jmrcycling.com" style={{ color: '#667eea' }}>
                masontuft@jmrcycling.com
              </a>
            </p>
          </div>

          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Link
              to="/shop/login"
              style={styles.ctaButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#5a6fd8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
              }}
            >
              Access Your Dashboard
            </Link>
          </div>

          {/* Mobile Responsive Styles */}
          <style>{`
            @media screen and (max-width: 768px) {
              .old-vs-new {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QrGuide;
