import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import GoogleAnalytics, { initGA } from './components/common/GoogleAnalytics';
import { initPostHog } from './lib/posthog';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './components/pages/Home';
import OurStory from './components/pages/OurStory';
import OurApp from './components/pages/OurApp';
import SignUp from './components/pages/SignUp';
import PersonalPlans from './components/pages/PersonalPlans';
import Contact from './components/pages/Contact';
import FAQ from './components/pages/FAQ';
import QrGuide from './components/pages/QrGuide';
import ShopLogin from './components/shop/ShopLogin';
import ShopDashboard from './components/shop/ShopDashboard';
import ShopSignIn from './components/shop/ShopSignIn';
import LegacyParamsDemo from './components/demo/LegacyParamsDemo';
import ParameterTestPage from './components/demo/ParameterTestPage';
import PersonalSignIn from './components/personal/PersonalSignIn';
import OAuthAuthorize from './components/oauth/OAuthAuthorize';
 import './styles/styles.css';

function App() {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN || 'dev-kor-shop.us.auth0.com';
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || 'your-client-id';
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  useEffect(() => {
    console.log('🚀 [App] KOR React app initializing:', {
      domain,
      clientId,
      audience: audience || 'Not configured',
      currentUrl: window.location.href,
      timestamp: new Date().toISOString()
    });
    
    initGA();
    initPostHog();
    
    console.log('✨ [App] App initialization complete');
  }, [domain, clientId, audience]);

  // Create auth params object - NO redirect_uri here to allow dynamic redirects in components
  const authParams: any = {};
  
  // Only include audience if it's configured
  if (audience) {
    authParams.audience = audience;
  }
  
  console.log('🔧 [App] Auth0Provider configuration:', {
    domain,
    clientId,
    authParams,
    note: 'No redirect_uri set - will be dynamic per login call'
  });

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authParams}
    >
      <Router>
        <GoogleAnalytics />
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/our-app" element={<OurApp />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/personal-plans" element={<PersonalPlans />} />
              <Route path="/personal/signin" element={<PersonalSignIn />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/qr-guide" element={<QrGuide />} />
              <Route path="/oauth/authorize/*" element={<OAuthAuthorize />} />
              <Route path="/shop/login" element={<ShopLogin />} />
              <Route path="/shop/dashboard" element={<ShopDashboard />} />
              {/* Legacy-compatible routes */}
              <Route path="/shop/signin" element={<ShopSignIn />} />
              <Route path="/shop_tools/signin" element={<ShopSignIn />} />
              <Route path="/shop_tools/dashboard" element={<ShopDashboard />} />
              {/* Development/testing routes */}
              <Route path="/demo/legacy-params" element={<LegacyParamsDemo />} />
              <Route path="/demo/parameter-test" element={<ParameterTestPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;
