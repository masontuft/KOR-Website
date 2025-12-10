import React, { useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useLegacyParams, buildLegacyUrl } from '../../hooks/useLegacyParams';

const ShopLogin: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, error, user } =
    useAuth0();
  const navigate = useNavigate();
  const params = useLegacyParams();

  const handleParameterBasedLogin = useCallback(() => {
    console.log('📝 [ShopLogin] Using parameter-based authentication fallback');

    // Build the redirect URI with current parameters
    const dashboardUrl = buildLegacyUrl('/shop/dashboard', {
      ...params,
      source: 'params'
    });

    console.log('🎯 [ShopLogin] Parameter-based redirect to:', dashboardUrl);
    navigate(dashboardUrl);
  }, [navigate, params]);

  // Legacy-style API authentication function
  const handleAuthenticatedUser = useCallback(async () => {
    if (!user) {
      console.log('⚠️ [ShopLogin] No user data available yet');
      return;
    }

    console.log(
      '🔐 [ShopLogin] User authenticated, calling legacy API:',
      user.sub
    );

    try {
      // Match the legacy system API call exactly
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

      const urlencoded = new URLSearchParams();
      urlencoded.append('auth0_sub_id', user.sub || '');

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow' as RequestRedirect
      };

      console.log('📡 [ShopLogin] Making API call to /loginShop...');
      const response = await fetch(
        'https://jmrcycling.com:3001/loginShop',
        requestOptions
      );
      const result = await response.json();

      console.log('✅ [ShopLogin] API response received:', result);
      console.log('📊 [ShopLogin] Shop data:', {
        plan_type: result.plan_type[0].plan_type,
        shop_name: result.plan_type[0].shop_name,
        shop_code: result.plan_type[0].shop_code,
        shop_token: result.plan_type[0].shop_token
      });

      // Store data in sessionStorage exactly like legacy system
      sessionStorage.setItem('shop_name', result.plan_type[0].shop_name);
      sessionStorage.setItem('shop_code', result.plan_type[0].shop_code);
      sessionStorage.setItem('plan_type', result.plan_type[0].plan_type);
      sessionStorage.setItem('shop_token', result.plan_type[0].shop_token);

      console.log('💾 [ShopLogin] Data stored in sessionStorage:', {
        shop_name: sessionStorage.getItem('shop_name'),
        shop_code: sessionStorage.getItem('shop_code'),
        plan_type: sessionStorage.getItem('plan_type'),
        shop_token: sessionStorage.getItem('shop_token')
      });

      // Build dashboard URL with API data (legacy style)
      const dashboardUrl = `/shop/dashboard?plan_type=${result.plan_type[0].plan_type}&shop_name=${encodeURIComponent(result.plan_type[0].shop_name)}&shop_code=${result.plan_type[0].shop_code}&source=api`;

      console.log('🎯 [ShopLogin] Redirecting to dashboard:', dashboardUrl);
      navigate(dashboardUrl);
    } catch (error) {
      console.error('❌ [ShopLogin] API call failed:', error);
      // Fallback to parameter-based flow if API fails
      console.log(
        '🔄 [ShopLogin] Falling back to parameter-based authentication'
      );
      handleParameterBasedLogin();
    }
  }, [user, navigate, handleParameterBasedLogin]);

  useEffect(() => {
    console.log('🔐 [ShopLogin] Authentication state changed:', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      currentParams: params,
      currentUrl: window.location.href
    });

    // If user is authenticated and we have user data, call the legacy API
    if (isAuthenticated && user) {
      handleAuthenticatedUser();
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    navigate,
    params,
    handleAuthenticatedUser
  ]);

  const handleLogin = async () => {
    console.log('🚀 [ShopLogin] Login initiated:', {
      currentUrl: window.location.href,
      currentParams: params,
      timestamp: new Date().toISOString()
    });

    // Store parameters as fallback in case API fails
    const paramsToPreserve = [
      'sub_id',
      'invoice_id',
      'plan_type',
      'shop_name',
      'shop_code'
    ];
    const paramsToStore: Record<string, string> = {};

    paramsToPreserve.forEach(param => {
      const value = params[param as keyof typeof params];
      if (value) {
        paramsToStore[param] = value;
        localStorage.setItem(`kor_param_${param}`, value);
        console.log(
          `💾 [ShopLogin] Fallback stored: kor_param_${param} = ${value}`
        );
      } else {
        localStorage.removeItem(`kor_param_${param}`);
      }
    });

    // Use simple redirect back to login page (legacy approach)
    const redirectUri = window.location.origin + '/shop/login';

    console.log('🌐 [ShopLogin] LEGACY API APPROACH:', {
      note: 'After Auth0 login, will call /loginShop API and use sessionStorage like legacy system',
      redirectUri,
      fallbackParams: paramsToStore
    });

    try {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: redirectUri
        }
      });
      console.log('✅ [ShopLogin] loginWithRedirect call completed');
    } catch (error) {
      console.error('❌ [ShopLogin] loginWithRedirect failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div
        className='page-container'
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <div className='loading-spinner' style={{ margin: '2rem auto' }}>
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}
          ></div>
        </div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return (
    <div
      className='page-container'
      style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Shop Partner Login
      </h1>

      {error && (
        <div
          style={{
            backgroundColor: '#ffe6e6',
            color: '#d63031',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #d63031'
          }}
        >
          Authentication error: {error.message}
        </div>
      )}

      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}
      >
        <p style={{ marginBottom: '1.5rem', color: '#666', lineHeight: '1.5' }}>
          Welcome back! Sign in to access your bike shop dashboard and manage
          customer notifications.
        </p>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' &&
          Object.keys(params).some(
            key => params[key as keyof typeof params]
          ) && (
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                textAlign: 'left'
              }}
            >
              <strong>Debug - Current Parameters:</strong>
              <br />
              {Object.entries(params).map(([key, value]) =>
                value ? (
                  <div key={key}>
                    {key}: {value}
                  </div>
                ) : null
              )}
            </div>
          )}

        <button
          onClick={handleLogin}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginBottom: '1rem'
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          Sign In to Shop Dashboard
        </button>

        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          <p>Don't have a shop account yet?</p>
          <a
            href='/sign-up'
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            Sign up for a shop partnership →
          </a>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>
          <p>
            🔒 Secure authentication powered by Auth0
            <br />
            Your login credentials are encrypted and protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;
