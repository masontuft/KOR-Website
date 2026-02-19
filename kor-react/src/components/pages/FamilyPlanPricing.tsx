import React, { useEffect } from 'react';
import StructuredData from '../common/StructuredData';

// Declare Chargebee as a global variable for TypeScript
declare global {
  interface Window {
    Chargebee: any;
  }
}

const FamilyPlanPricing: React.FC = () => {
  useEffect(() => {
    // Initialize Chargebee when component mounts
    if (window.Chargebee) {
      const site = process.env.REACT_APP_CHARGEBEE_SITE || 'jmrcycling';
      const publishableKey = process.env.REACT_APP_CHARGEBEE_PUBLISHABLE_KEY;

      const initConfig: any = { site };
      if (publishableKey) {
        initConfig.publishableKey = publishableKey;
      }

      window.Chargebee.init(initConfig);

      const isProduction =
        process.env.REACT_APP_ENVIRONMENT === 'production' ||
        process.env.NODE_ENV === 'production';
      if (!publishableKey) {
        if (isProduction) {
          console.warn(
            'Chargebee publishable key is not configured. Some checkout features may not work in production.'
          );
        } else {
          console.log(
            'Chargebee publishable key not set - assuming development mode.'
          );
        }
      }

      console.log(
        `Chargebee initialized with site: ${site}${publishableKey ? ' and publishable key' : ''}`
      );
    } else {
      console.warn('Chargebee not loaded - using development fallback mode');
    }
  }, []);

  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';

  const handleSubscription = (billingCycle: string) => {
    console.log(`Attempting to subscribe to Family - ${billingCycle}`);

    // Debug environment variables
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
      REACT_APP_CHARGEBEE_PUBLISHABLE_KEY:
        process.env.REACT_APP_CHARGEBEE_PUBLISHABLE_KEY
    });

    // Check if we're in development mode or Chargebee isn't configured
    const isDevelopment =
      process.env.NODE_ENV === 'development' ||
      process.env.REACT_APP_ENVIRONMENT === 'development';
    const isTestKey =
      process.env.REACT_APP_CHARGEBEE_PUBLISHABLE_KEY ===
      'test_publishable_key';

    console.log('Dev mode checks:', { isDevelopment, isTestKey });

    // ALWAYS bypass Chargebee in dev mode or with test key - check this FIRST
    if (isDevelopment || isTestKey) {
      console.log(
        '🧪 [FamilyPlanPricing] Dev mode detected - bypassing Chargebee'
      );
      const confirmed = window.confirm(
        `Development Mode:\n\nYou're trying to subscribe to:\nFamily Plan - ${billingCycle}\n\nThis would normally open Chargebee checkout.\n\nClick OK to simulate successful subscription, or Cancel to abort.`
      );

      if (confirmed) {
        // Simulate successful subscription in development
        alert(
          'Simulated successful subscription! Redirecting to family sign in...'
        );
        window.location.href =
          '/family-plan-signup?success=true&plan_type=family&billing=' +
          encodeURIComponent(billingCycle);
      }
      return;
    }

    // Production path - only if NOT in dev mode
    if (!window.Chargebee) {
      alert(
        'Payment system is not available. Please try again in a moment or contact support.'
      );
      return;
    }

    // Map plan types to Chargebee plan IDs
    const planMap: { [key: string]: string } = {
      Monthly: 'Family-USD-Monthly',
      Yearly: 'Family-USD-Yearly'
    };

    const planId = planMap[billingCycle];

    if (!planId) {
      console.error('Plan ID not found for:', billingCycle);
      alert('Plan configuration error. Please contact support.');
      return;
    }

    try {
      // Initialize Chargebee instance if not already done
      const cbInstance = window.Chargebee.getInstance();

      if (!cbInstance) {
        alert(
          'Payment system initialization error. Please refresh the page and try again.'
        );
        return;
      }

      // Open Chargebee checkout
      cbInstance.openCheckout({
        hostedPage: () => {
          // This should return a hosted page object from your backend
          // For now, we'll attempt to create a basic checkout configuration
          return {
            id: planId,
            type: 'checkout_new_subscription',
            embed: false,
            success_url: `${window.location.origin}/family-plan-signup?success=true&plan_type=family`,
            cancel_url: `${window.location.origin}/family-sign-up?cancelled=true`
          };
        },
        success: (hostedPageId: string) => {
          console.log('Checkout successful:', hostedPageId);
          window.location.href =
            '/family-plan-signup?success=true&plan_type=family&subscription=' +
            encodeURIComponent(hostedPageId);
        },
        error: (error: any) => {
          console.error('Checkout error:', error);
          alert(
            'There was an error processing your subscription. Please try again or contact support.'
          );
        },
        close: () => {
          console.log('Checkout closed by user');
        }
      });
    } catch (error) {
      console.error('Error opening Chargebee checkout:', error);

      if (isDevelopment || isTestKey) {
        alert(
          'Chargebee configuration error in development. Using fallback simulation.'
        );
        const confirmed = window.confirm(
          `Simulate subscription to Family Plan - ${billingCycle}?`
        );
        if (confirmed) {
          window.location.href =
            '/family-plan-signup?success=true&plan_type=family&billing=' +
            encodeURIComponent(billingCycle);
        }
      } else {
        alert('Unable to open checkout. Please contact support.');
      }
    }
  };

  return (
    <>
      <StructuredData
        type='website'
        pageTitle='Family Plan Sign Up — KOR'
        pageDescription="Keep your whole family rolling with KOR's Family Plan. Track maintenance for up to 6 riders in one account."
        url={`${baseUrl}/family-sign-up`}
      />
      <div className='parallax_parent'>
        <div className='parallax_sign_up'>
          <div style={{ padding: '5%' }}>
            <h1 className='title_box'>Family Plan Sign Up</h1>
            <div className='mobile_textbox'>
              <p className='paragraph'>
                Keep your whole family rolling! The KOR Family Plan is perfect
                for families, roommates, or small groups who want to track bike
                maintenance together. Manage up to 6 riders, track unlimited
                bikes, and never miss a maintenance reminder again.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='parallax_parent'>
        <div className='parallax2_sign_up'>
          <div style={{ padding: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ maxWidth: '900px', width: '100%' }}>
              <div className='payment-card1'>
                <h1>Family Plan</h1>
                <h2 className='title'>$X/month</h2>
                <h2 className='title'>Features</h2>
                <ul className='list'>
                  <li>Up to 6 family members/riders</li>
                  <li>Unlimited bikes per family</li>
                  <li>Comprehensive maintenance tracking</li>
                  <li>Automated wear notifications for all members</li>
                  <li>Shared maintenance history</li>
                  <li>QR code for easy member onboarding</li>
                  <li>Family dashboard with all bikes at a glance</li>
                  <li>Email support</li>
                </ul>
              </div>
              <div className='payment1'>
                <div className='payment-row' style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type='button'
                    className='subscribe'
                    onClick={() => handleSubscription('Monthly')}
                  >
                    Subscribe Monthly - $X/mo
                  </button>
                  <button
                    type='button'
                    className='subscribe'
                    onClick={() => handleSubscription('Yearly')}
                  >
                    Subscribe Yearly $X
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FamilyPlanPricing;
