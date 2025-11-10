import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface ShopData {
  shop_name: string;
  shop_code: string;
  shop_initials: string;
  phone_number: string;
  email: string;
}

const ShopSettings: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [originalInitials, setOriginalInitials] = useState('');
  
  const [formData, setFormData] = useState<ShopData>({
    shop_name: '',
    shop_code: '',
    shop_initials: '',
    phone_number: '',
    email: ''
  });

  const fetchShopDetails = useCallback(async (shopToken: string) => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
      const response = await fetch(`${baseUrl}/myShop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ shop_token: shopToken }) as unknown as BodyInit,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📞 [ShopSettings] Fetched shop details:', data);
        if (data.message === 'success') {
          // Extract initials from shop_code (remove numbers)
          const shopCode = data.shop_code || '';
          const initialsFromCode = shopCode.replace(/[0-9]/g, '');
          
          // Use functional update to avoid dependency on formData
          setFormData(prev => {
            const updatedData = {
              ...prev,
              shop_name: data.shop_name || prev.shop_name,
              shop_code: shopCode,
              shop_initials: initialsFromCode || '',
              phone_number: data.phone_number || ''
            };
            console.log('📝 [ShopSettings] Updated form data:', updatedData);
            return updatedData;
          });
          
          // Store original initials for comparison
          setOriginalInitials(initialsFromCode || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch shop details:', err);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/shop/login');
      return;
    }

    if (isAuthenticated) {
      // Load shop data from sessionStorage
      const shopName = sessionStorage.getItem('shop_name') || '';
      const shopCode = sessionStorage.getItem('shop_code') || '';
      const shopToken = sessionStorage.getItem('shop_token') || '';
      
      setFormData({
        shop_name: shopName,
        shop_code: shopCode,
        shop_initials: '',
        phone_number: '',
        email: user?.email || ''
      });

      // Fetch current shop details if we have the token
      if (shopToken) {
        fetchShopDetails(shopToken);
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, fetchShopDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const shopToken = sessionStorage.getItem('shop_token');
      if (!shopToken) {
        setMessage({ type: 'error', text: 'Shop token not found. Please log in again.' });
        setLoading(false);
        return;
      }

      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
      const updatedFields: string[] = [];
      
      // Check if shop initials changed (which means shop code needs updating)
      const initialsChanged = formData.shop_initials.trim().toUpperCase() !== originalInitials.toUpperCase();
      
      if (initialsChanged && formData.shop_initials.trim()) {
        // Validate initials
        const initials = formData.shop_initials.trim();
        if (initials.length < 2 || initials.length > 4 || !/^[A-Za-z]+$/.test(initials)) {
          setMessage({ type: 'error', text: 'Shop initials must be 2-4 letters only' });
          setLoading(false);
          return;
        }
        
        // Update shop code
        const codeResponse = await fetch(`${baseUrl}/updateShopCode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            shop_token: shopToken,
            new_initials: initials
          }) as unknown as BodyInit,
        });

        const codeData = await codeResponse.json();

        if (codeResponse.ok && codeData.message === 'success') {
          sessionStorage.setItem('shop_code', codeData.new_code);
          updatedFields.push(`shop_code (${codeData.old_code} → ${codeData.new_code})`);
        } else {
          setMessage({ type: 'error', text: codeData.error || 'Failed to update shop code' });
          setLoading(false);
          return;
        }
      }
      
      // Update other shop settings
      const updateData: any = { shop_token: shopToken };
      
      if (formData.shop_name.trim()) {
        updateData.shop_name = formData.shop_name.trim();
      }
      if (formData.phone_number.trim()) {
        updateData.phone_number = formData.phone_number.trim();
      }

      // Only call updateShopSettings if there are fields to update
      if (updateData.shop_name || updateData.phone_number) {
        const response = await fetch(`${baseUrl}/updateShopSettings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(updateData) as unknown as BodyInit,
        });

        const data = await response.json();

        if (response.ok && data.message === 'success') {
          // Update sessionStorage with new values
          if (updateData.shop_name) {
            sessionStorage.setItem('shop_name', updateData.shop_name);
          }
          
          updatedFields.push(...data.updated_fields);
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update settings' });
          setLoading(false);
          return;
        }
      }
      
      // Show success message
      if (updatedFields.length > 0) {
        // Update original initials to the new value to prevent re-saving
        if (initialsChanged) {
          setOriginalInitials(formData.shop_initials.trim().toUpperCase());
        }
        
        setMessage({ 
          type: 'success', 
          text: `Successfully updated: ${updatedFields.join(', ')}` 
        });
        
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } else {
        setMessage({ type: 'error', text: 'No changes to save' });
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>⚙️ Shop Settings</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Update your shop information and preferences
      </p>

      {message && (
        <div style={{
          backgroundColor: message.type === 'success' ? '#e6f7e6' : '#ffe6e6',
          color: message.type === 'success' ? '#00b894' : '#d63031',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: `1px solid ${message.type === 'success' ? '#00b894' : '#d63031'}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#333', marginTop: 0 }}>Shop Information</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Shop Name
            </label>
            <input
              type="text"
              value={formData.shop_name}
              onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="Enter shop name"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Shop Initials (2-4 letters)
            </label>
            <input
              type="text"
              value={formData.shop_initials}
              onChange={(e) => setFormData({ ...formData, shop_initials: e.target.value })}
              maxLength={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                textTransform: 'uppercase'
              }}
              placeholder="e.g., BIKE"
            />
            <small style={{ color: '#666' }}>
              Changes your shop code. New code will be: <strong>{formData.shop_initials.toUpperCase() || '____'}{formData.shop_code.replace(/[^0-9]/g, '')}</strong>
            </small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="(555) 123-4567"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#999' }}>
              Shop Code (Read Only)
            </label>
            <input
              type="text"
              value={formData.shop_code}
              disabled
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                backgroundColor: '#f5f5f5',
                color: '#666'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Email & Password Management via Auth0 */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginTop: 0 }}>Email & Password</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Email and password are managed securely through Auth0
        </p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#999' }}>
            Email (Managed by Auth0)
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              backgroundColor: '#f5f5f5',
              color: '#666'
            }}
          />
        </div>

        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          To change your email, please contact our support team. You can change your password using the button below.
        </p>
        
        <button
          onClick={async () => {
            if (!user?.sub) {
              alert('User ID not found. Please try logging in again.');
              return;
            }
            
            const confirmed = window.confirm(
              'You will be redirected to a secure page to change your password.\n\nContinue?'
            );
            
            if (!confirmed) return;
            
            setLoading(true);
            setMessage(null);
            
            try {
              const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
              
              const response = await fetch(`${baseUrl}/createPasswordChangeTicket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user_id: user.sub,
                  email: user.email
                })
              });
              
              const data = await response.json();
              
              if (response.ok && data.message === 'success' && data.ticket_url) {
                // Open password change in new window
                const passwordWindow = window.open(data.ticket_url, 'passwordChange', 'width=600,height=700');
                
                if (passwordWindow) {
                  setMessage({ 
                    type: 'success', 
                    text: 'Password change window opened. After changing your password, you can close the window and continue using the dashboard.' 
                  });
                } else {
                  // Fallback if popup blocked
                  window.location.href = data.ticket_url;
                }
              } else {
                setMessage({ 
                  type: 'error', 
                  text: data.error || 'Failed to create password change link. Please contact support.' 
                });
              }
            } catch (err) {
              console.error('Error creating password change ticket:', err);
              setMessage({ 
                type: 'error', 
                text: 'An error occurred. Please try again or contact support.' 
              });
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '5px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Creating secure link...' : '🔒 Change Password'}
        </button>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/shop/dashboard')}
          style={{
            backgroundColor: 'transparent',
            color: '#667eea',
            border: '2px solid #667eea',
            padding: '0.75rem 2rem',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ShopSettings;
