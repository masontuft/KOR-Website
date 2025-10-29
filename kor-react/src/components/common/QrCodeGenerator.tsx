import React, { useState, useEffect } from 'react';

interface QrCodeGeneratorProps {
  shopCode?: string;
  shopName?: string;
  size?: number;
  className?: string;
  onError?: (error: string) => void;
  genericMode?: boolean; // For inactive users - shows generic app download
  genericUrl?: string; // Custom URL for generic mode
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({
  shopCode,
  shopName,
  size = 200,
  className = '',
  onError,
  genericMode = false,
  genericUrl = 'https://jmrcycling.com/app_auth.html'
}) => {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');


  // Download QR code image
  const downloadQrCode = async () => {
    if (!qrImageUrl) return;

    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${shopName || shopCode}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      console.log('✅ [QrCodeGenerator] QR code downloaded successfully');
    } catch (err) {
      const errorMsg = 'Failed to download QR code';
      console.error('❌ [QrCodeGenerator] Download error:', err);
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  // Print QR code
  const printQrCode = () => {
    if (!qrImageUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>KOR QR Code - ${shopName || shopCode}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                margin: 0;
              }
              .qr-container {
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                border: 2px solid #333;
                border-radius: 10px;
              }
              .shop-info {
                margin-bottom: 20px;
              }
              .instructions {
                margin-top: 20px;
                font-size: 14px;
                color: #666;
                line-height: 1.4;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="shop-info">
                <h2>🏪 ${shopName || 'Bike Shop'}</h2>
                <p><strong>Shop Code:</strong> ${shopCode}</p>
                <h3>📱 Scan to Get KOR App</h3>
              </div>
              <img src="${qrImageUrl}" alt="QR Code for ${shopName || shopCode}" />
              <div class="instructions">
                <p><strong>How to use:</strong></p>
                <p>1. Scan this QR code with your phone camera</p>
                <p>2. App will download and open automatically</p>
                <p>3. Your shop code will be pre-filled</p>
                <p>4. Complete Strava authentication to start!</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      console.log('🖨️ [QrCodeGenerator] Print dialog opened');
    }
  };

  // Generate QR code when shopCode or genericMode changes
  useEffect(() => {
    if (!genericMode && !shopCode) {
      setError('Shop code is required');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      let targetUrl: string;
      
      if (genericMode) {
        // Generic mode for inactive users
        targetUrl = genericUrl;
      } else {
        // Normal shop-specific mode for active users
        targetUrl = `https://jmrcycling.com:3001/qr/onboard/${shopCode}`;
      }
      
      const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(targetUrl)}&size=${size}`;
      setQrImageUrl(qrUrl);
      
      console.log('📱 [QrCodeGenerator] QR code generated:', {
        mode: genericMode ? 'generic' : 'shop-specific',
        shopCode: genericMode ? 'N/A' : shopCode,
        shopName: genericMode ? 'N/A' : shopName,
        targetUrl,
        qrUrl
      });
    } catch (err) {
      const errorMsg = 'Failed to generate QR code';
      console.error('❌ [QrCodeGenerator] Generation error:', err);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [shopCode, size, shopName, onError, genericMode, genericUrl]);

  if (isLoading) {
    return (
      <div className={`qr-loading ${className}`} style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#666' }}>Generating QR code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`qr-error ${className}`} style={{ 
        textAlign: 'center', 
        padding: '2rem',
        backgroundColor: '#ffe6e6',
        border: '1px solid #d63031',
        borderRadius: '8px',
        color: '#d63031'
      }}>
        <p>❌ {error}</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Shop Code: <code>{shopCode}</code>
        </p>
      </div>
    );
  }

  return (
    <div className={`qr-generator ${className}`} style={{ textAlign: 'center' }}>
      {/* QR Code Image */}
      <div style={{ 
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'inline-block'
      }}>
        {qrImageUrl ? (
          <img
            src={qrImageUrl}
            alt={`QR Code for ${shopName || shopCode}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              maxWidth: '100%'
            }}
            onLoad={() => console.log('✅ [QrCodeGenerator] QR code image loaded')}
            onError={(e) => {
              const errorMsg = 'Failed to load QR code image';
              console.error('❌ [QrCodeGenerator] Image load error:', e);
              setError(errorMsg);
              onError?.(errorMsg);
            }}
          />
        ) : null}
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        marginTop: '1rem'
      }}>
        <button
          onClick={downloadQrCode}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#5a6fd8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#667eea';
          }}
        >
          📥 Download
        </button>
        
        <button
          onClick={printQrCode}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#218838';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#28a745';
          }}
        >
          🖨️ Print
        </button>
      </div>

      {/* QR Code Info */}
      <div style={{ 
        fontSize: '0.8rem', 
        color: '#666', 
        marginTop: '1rem',
        lineHeight: 1.4
      }}>
        {genericMode ? (
          <>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Mode:</strong> <code style={{ backgroundColor: '#f1f1f1', padding: '2px 6px', borderRadius: '4px' }}>Generic App Access</code>
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Target URL:</strong><br />
              <code style={{ backgroundColor: '#f1f1f1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                {genericUrl}
              </code>
            </p>
          </>
        ) : (
          <>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Shop Code:</strong> <code style={{ backgroundColor: '#f1f1f1', padding: '2px 6px', borderRadius: '4px' }}>{shopCode}</code>
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Onboarding URL:</strong><br />
              <code style={{ backgroundColor: '#f1f1f1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                https://jmrcycling.com:3001/qr/onboard/{shopCode}
              </code>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default QrCodeGenerator;
