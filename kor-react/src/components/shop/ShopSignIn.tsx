import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LegacyAuthGuard from '../auth/LegacyAuthGuard';
import { useLegacyParams, buildLegacyUrl, logLegacyParams } from '../../hooks/useLegacyParams';

interface FormData {
  shop_name: string;
  email: string;
  password: string;
  phone: string;
  shop_initials: string;
}

const ShopSignIn: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const params = useLegacyParams();
  
  const [formData, setFormData] = useState<FormData>({
    shop_name: '',
    email: '',
    password: '',
    phone: '',
    shop_initials: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    logLegacyParams(params, 'ShopSignIn');
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[+]?[1-9]?[0-9]{7,15}$/;
    return re.test(phone.replace(/[\s\-()]/g, ''));
  };

  // Legacy-compatible helpers based on the original site scripts
  const getAuth0ManagementToken = async (): Promise<string> => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
    console.log('🪪 [ShopSignIn][Token] Requesting management token', { endpoint: `${baseUrl}/getauth0Token` });
    const resp = await fetch(`${baseUrl}/getauth0Token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ access_token: 'auth0_token' }) as unknown as BodyInit,
      redirect: 'follow' as RequestRedirect
    });
    console.log('🪪 [ShopSignIn][Token] Response received', { status: resp.status });

    if (!resp.ok) {
      let errTxt = '';
      try { errTxt = await resp.text(); } catch {}
      console.warn('🪪 [ShopSignIn][Token] Non-OK response body', errTxt?.slice(0, 200));
      throw new Error(`Failed to get Auth0 token (${resp.status})`);
    }

    // Some legacy endpoints return text that needs parsing
    let data: any;
    try {
      data = await resp.json();
    } catch {
      const text = await resp.text();
      data = JSON.parse(text);
    }

    const token = data?.token?.[0]?.auth0_token;
    console.log('🪪 [ShopSignIn][Token] Token parsed', { length: token ? String(token).length : 0 });
    if (!token) throw new Error('Auth0 token missing in response');
    return token;
  };

  const createAuth0User = async (
    email: string,
    password: string,
    name: string,
    mgmtToken: string
  ): Promise<string> => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN || 'dev-oseu3r74.us.auth0.com';
    const url = `https://${domain}/api/v2/users`;
    console.log('👤 [ShopSignIn][Auth0User] Creating Auth0 user', { domain, url });

    // Create user with the password they provided in the form (they'll also log in via Auth0 Universal Login)
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mgmtToken}`
      },
      body: JSON.stringify({
        email,
        password,
        connection: 'Username-Password-Authentication',
        name
      }),
      redirect: 'follow' as RequestRedirect
    });

    // Auth0 Management API often returns JSON with user_id or error payload
    const payloadText = await resp.text();
    let payload: any = {};
    try { payload = JSON.parse(payloadText); } catch { /* leave as text for diagnostics */ }
    console.log('👤 [ShopSignIn][Auth0User] Response', { status: resp.status, hasUserId: !!payload?.user_id, hasError: !!payload?.error });

    if (!resp.ok || payload?.error || !payload?.user_id) {
      const message =
        payload?.message ||
        payload?.error_description ||
        payload?.error ||
        `Failed to create Auth0 user (${resp.status})`;
      console.error('👤 [ShopSignIn][Auth0User] Error creating user', { status: resp.status, message, payloadSnippet: typeof payloadText === 'string' ? payloadText.slice(0, 200) : undefined });
      throw new Error(message);
    }

    return payload.user_id as string;
  };



  const createShopAccount = async (
    userId: string
  ): Promise<void> => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
    const bearer = process.env.REACT_APP_API_AUTH_TOKEN;

    const paramsBody = new URLSearchParams();
    paramsBody.append('shop_name', formData.shop_name);
    paramsBody.append('email', formData.email);
    if (params.sub_id) paramsBody.append('sub_Id', params.sub_id);
    if (params.invoice_id) paramsBody.append('invoice_Id', params.invoice_id);
    if (params.plan_type) paramsBody.append('plan_type', params.plan_type);
    paramsBody.append('phone', formData.phone);
    paramsBody.append('user_id', userId);
    paramsBody.append('shop_init', formData.shop_initials);

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    if (bearer) headers['Authorization'] = `Bearer ${bearer}`;

    console.log('🏪 [ShopSignIn][Backend] Creating shop account', {
      endpoint: `${baseUrl}/signinShop`,
      hasBearer: !!bearer,
      bodyKeys: Array.from(paramsBody.keys())
    });

    const resp = await fetch(`${baseUrl}/signinShop`, {
      method: 'POST',
      headers,
      body: paramsBody as unknown as BodyInit,
      redirect: 'follow' as RequestRedirect
    });

    const respText = await resp.text();
    console.log('🏪 [ShopSignIn][Backend] Response', { status: resp.status, bodySnippet: respText.slice(0, 200) });

    if (!resp.ok) {
      throw new Error(`Failed to create shop account (${resp.status}) ${respText || ''}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.shop_name.trim()) {
      setError('Please enter your shop name');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!formData.shop_initials.trim()) {
      setError('Please enter shop initials');
      return;
    }

    setIsLoading(true);

    try {
      const traceId = Math.random().toString(36).slice(2, 8);
      console.log(`🚀 [ShopSignIn][Trace ${traceId}] Starting signup flow`, {
        formData: { ...formData },
        params,
        timestamp: new Date().toISOString()
      });

      // 1) Get Auth0 management token from backend
      const mgmtToken = await getAuth0ManagementToken();
      console.log('🪪 [ShopSignIn] Management token acquired');

      // 2) Create Auth0 user account with provided password
      const auth0UserId = await createAuth0User(
        formData.email,
        formData.password,
        formData.shop_name,
        mgmtToken
      );
      console.log('👤 [ShopSignIn] Auth0 user created', { userId: auth0UserId });

      // 3) Create KOR shop account in backend (binds Auth0 user to shop)
      await createShopAccount(auth0UserId);
      console.log('🏪 [ShopSignIn] Shop account created on server');

      // 4) Redirect to Auth0 login; user will log in using the password just created
      const redirectUri = window.location.origin + '/shop/login';
      console.log('🔐 [ShopSignIn] Redirecting to Auth0 login', { redirectUri });
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: redirectUri,
          login_hint: formData.email
        }
      });
    } catch (err: any) {
      console.error('❌ [ShopSignIn] Signup flow error', { message: err?.message, stack: err?.stack });
      const message =
        typeof err?.message === 'string' && err.message
          ? err.message
          : 'An error occurred during account creation. Please try again.';
      setError(message);
    } finally {
      console.log('🏁 [ShopSignIn] Flow complete');
      setIsLoading(false);
    }
  };

  const handleAuthWithAuth0 = async () => {
    try {
      // Build return URL with current parameters
      const returnUrl = buildLegacyUrl('/shop/dashboard', params);
      console.log('🔐 [ShopSignIn] Manual Auth0 login requested', { returnUrl });
      
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin + returnUrl
        }
      });
    } catch (error) {
      console.error('🔐 [ShopSignIn] Auth0 login error:', error);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleAuthorizationChange = (authorized: boolean) => {
    // Authorization status changed - could be used for additional logic
    console.log('Authorization status:', authorized);
  };

  const signInContent = (
    <div className="page-container" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/images/KOR_app_Logo.png"
            alt="KOR Logo"
            style={{ width: '80px', height: '80px', marginBottom: '1rem' }}
          />
          <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>Create Shop Account</h1>
          <p style={{ color: '#666', marginBottom: '0' }}>
            Join the KOR network and start managing your bike services
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffe6e6',
            color: '#d63031',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #d63031'
          }}>
            {error}
          </div>
        )}

        {/* Display current parameters for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.8rem'
          }}>
            <strong>Debug - Legacy Parameters:</strong>
            <br />
            Sub ID: {params.sub_id || 'None'}
            <br />
            Invoice ID: {params.invoice_id || 'None'}
            <br />
            Plan Type: {params.plan_type || 'None'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label htmlFor="shop_name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Shop Name
              </label>
              <input
                type="text"
                id="shop_name"
                name="shop_name"
                value={formData.shop_name}
                onChange={handleInputChange}
                placeholder="Enter your shop name"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="shop@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>


            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password"
                  required
                  minLength={8}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#007bff',
                    fontSize: '0.85rem',
                    padding: '0.25rem',
                    fontWeight: '500'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>
                You will confirm this on the next page
              </small>
            </div>

            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label htmlFor="shop_initials" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Shop Initials
              </label>
              <input
                type="text"
                id="shop_initials"
                name="shop_initials"
                value={formData.shop_initials}
                onChange={handleInputChange}
                placeholder="e.g., GC"
                required
                maxLength={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                2-4 characters (e.g., "GC" for George's Cycles)
              </small>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <span style={{ color: '#666' }}>- OR -</span>
            </div>

            <button
              type="button"
              onClick={handleAuthWithAuth0}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Sign in with Auth0
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#666' }}>
              Already have an account?{' '}
              <a href="/shop/login" style={{ color: '#007bff' }}>Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <LegacyAuthGuard 
      requiresAuth={true}
      onAuthorizationChange={handleAuthorizationChange}
    >
      {signInContent}
    </LegacyAuthGuard>
  );
};

export default ShopSignIn;
