import React, { useEffect, useState } from 'react';
import StructuredData from '../common/StructuredData';

// Declare Chargebee as a global variable for TypeScript
declare global {
  interface Window {
    Chargebee: any;
  }
}

const SignUp: React.FC = () => {
  const [demoFormData, setDemoFormData] = useState({
    shopName: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

      const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production' || process.env.NODE_ENV === 'production';
      if (!publishableKey) {
        if (isProduction) {
          console.warn('Chargebee publishable key is not configured. Some checkout features may not work in production.');
        } else {
          console.log('Chargebee publishable key not set - assuming development mode.');
        }
      }

      console.log(`Chargebee initialized with site: ${site}${publishableKey ? ' and publishable key' : ''}`);
    } else {
      console.warn('Chargebee not loaded - using development fallback mode');
    }
  }, []);

  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const formspreeId = process.env.REACT_APP_FORMSPREE_ID || 'myyvklzv';
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopName: demoFormData.shopName,
          contactName: demoFormData.contactName,
          email: demoFormData.email,
          phone: demoFormData.phone,
          message: demoFormData.message,
          _replyto: demoFormData.email,
          _subject: `KOR Shop Demo Request: ${demoFormData.shopName}`
        }),
      });
      
      if (response.ok) {
        setSubmitMessage('Demo request submitted successfully! We\'ll contact you within 48 hours.');
        setDemoFormData({ shopName: '', contactName: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('Error submitting request. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDemoFormData({
      ...demoFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubscription = (planType: string, billingCycle: string) => {
    console.log(`Attempting to subscribe to ${planType} - ${billingCycle}`);
    
    // Check if we're in development mode or Chargebee isn't configured
    const isDevelopment = process.env.REACT_APP_ENVIRONMENT === 'development';
    
    if (!window.Chargebee) {
      if (isDevelopment) {
        // Development fallback - show a modal or redirect to a test page
        const confirmed = window.confirm(
          `Development Mode:\n\nYou're trying to subscribe to:\n${planType} - ${billingCycle}\n\nThis would normally open Chargebee checkout.\n\nClick OK to simulate successful subscription, or Cancel to abort.`
        );
        
        if (confirmed) {
          // Simulate successful subscription in development
          alert('Simulated successful subscription! Redirecting to dashboard...');
          window.location.href = '/shop/dashboard?success=true&plan=' + encodeURIComponent(`${planType}-${billingCycle}`);
        }
        return;
      } else {
        alert('Payment system is not available. Please try again in a moment or contact support.');
        return;
      }
    }

    // Map plan types to Chargebee plan IDs
    const planMap: { [key: string]: string } = {
      'Basic-Monthly': 'Basic-USD-Monthly',
      'Basic-Yearly': 'Basic-Plan-USD-Yearly', 
      'Premium-Monthly': 'Premium-USD-Monthly',
      'Premium-Yearly': 'Premium-USD-Yearly'
    };

    const planId = planMap[`${planType}-${billingCycle}`];
    
    if (!planId) {
      console.error('Plan ID not found for:', planType, billingCycle);
      alert('Plan configuration error. Please contact support.');
      return;
    }

    try {
      // Initialize Chargebee instance if not already done
      const cbInstance = window.Chargebee.getInstance();
      
      if (!cbInstance) {
        alert('Payment system initialization error. Please refresh the page and try again.');
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
            success_url: `${window.location.origin}/shop/dashboard?success=true`,
            cancel_url: `${window.location.origin}/sign-up?cancelled=true`
          };
        },
        success: (hostedPageId: string) => {
          console.log('Checkout successful:', hostedPageId);
          window.location.href = `/shop/dashboard?success=true&subscription=${hostedPageId}`;
        },
        error: (error: any) => {
          console.error('Checkout error:', error);
          alert('There was an error processing your subscription. Please try again or contact support.');
        },
        close: () => {
          console.log('Checkout closed by user');
        }
      });
    } catch (error) {
      console.error('Error opening Chargebee checkout:', error);
      
      if (isDevelopment) {
        alert('Chargebee configuration error in development. Using fallback simulation.');
        const confirmed = window.confirm(`Simulate subscription to ${planType} - ${billingCycle}?`);
        if (confirmed) {
          window.location.href = '/shop/dashboard?success=true&plan=' + encodeURIComponent(`${planType}-${billingCycle}`);
        }
      } else {
        alert('Unable to open checkout. Please contact support.');
      }
    }
  };

  return (
    <>
      <StructuredData
        type="website"
        pageTitle="Shop Sign Up — KOR"
        pageDescription="Partner with KOR to invite customers, automate maintenance notifications, and enhance service."
        url={`${baseUrl}/sign-up`}
      />
      <div className="parallax_parent">
        <div className="parallax_sign_up">
          <div style={{ padding: '5%' }}>
            <h1 className="title_box">Shop Sign Up</h1>
            <div className="mobile_textbox">
              <p className="paragraph" style={{ fontSize: '1.1em', marginBottom: '0.8em', color: '#e0e0e0' }}>
                KOR tracks your customers' component wear from Strava in the background, automatically alerting them when service is due.
              </p>
              <p className="paragraph" style={{ fontWeight: 600, marginBottom: '0.5em', fontSize: '1.3em' }}>
                Turn your customers' Strava rides into automated maintenance revenue and stronger relationships.
              </p>
              <p className="paragraph" style={{ fontSize: '1.2em', fontWeight: 700, color: '#4CAF50', marginTop: '1em' }}>
                KOR can have an increase of up to 30% in service revenue.
              </p>
            </div>
            {/* How It Works Section */}
            <div className="mobile_textbox" style={{ marginTop: '3em', marginBottom: '2em', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2em', borderRadius: '10px' }}>
              <h2 style={{ color: 'white', textAlign: 'center', fontSize: '2em', marginBottom: '1em' }}>How KOR Works for Your Shop</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2em', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '1.3em', marginBottom: '0.5em' }}>1. Invite Customers</h3>
                  <p style={{ color: '#e0e0e0', fontSize: '1em' }}><strong>Invite customers at the counter.</strong> Share your unique shop code when they purchase or service their bikes.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '1.3em', marginBottom: '0.5em' }}>2. Automatic Tracking</h3>
                  <p style={{ color: '#e0e0e0', fontSize: '1em' }}><strong>KOR syncs with Strava.</strong> Component wear is tracked on every ride with no manual input needed.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '1.3em', marginBottom: '0.5em' }}>3. Timely Reminders</h3>
                  <p style={{ color: '#e0e0e0', fontSize: '1em' }}><strong>Customers get alerts before failure.</strong> Shop-branded notifications tell them when parts need service.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '1.3em', marginBottom: '0.5em' }}>4. More Revenue</h3>
                  <p style={{ color: '#e0e0e0', fontSize: '1em' }}><strong>Fill your service schedule proactively.</strong> Book maintenance appointments instead of waiting for reactive repairs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="parallax_parent">
        <div className="parallax2_sign_up">
          <div style={{ padding: '5%' }}>
            <div className="mobile_textbox" style={{ marginBottom: '3em' }}>
              <h2 style={{ color: 'white', textAlign: 'center', fontSize: '2em', marginBottom: '1em' }}>Choose Your Plan</h2>
              <p className="paragraph" style={{ marginBottom: '2em' }}>
                Most shops lose service revenue because customers only come in after parts fail—KOR helps you reach them before that point with automated, shop-branded maintenance reminders.
              </p>
            </div>
            <div className="payment-plans">
              <div className="payment-card1">
                <h1>Basic</h1>
                {/*<h2 className="title">$40/month</h2>*/}
                <p className="paragraph" style={{ padding: '0 1em', marginBottom: '1em', fontSize: '0.95em' }}>
                  Keep customers coming back with simple, automated notifications that tell them when their parts are worn and point them straight to your shop.
                </p>
                {/*<h2 className="title">Features</h2>*/}
                {/*<ul className="list">*/}
                {/*  <li>Unlimited Customer Invites</li>*/}
                {/*  <li>*/}
                {/*    Daily email reports of customers notified about worn parts*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    Automated notifications to customers about worn parts with*/}
                {/*    your shop's contact information*/}
                {/*  </li>*/}
                {/*</ul>*/}
              </div>
              {/*<div className="payment1">*/}
              {/*  <div className="payment-row">*/}
              {/*    <button*/}
              {/*      type="button"*/}
              {/*      data-cb-type="checkout"*/}
              {/*      data-cb-item-0="Basic-USD-Monthly"*/}
              {/*      data-cb-item-0-quantity="1"*/}
              {/*      className="subscribe"*/}
              {/*      onClick={() => handleSubscription('Basic', 'Monthly')}*/}
              {/*    >*/}
              {/*      Subscribe Monthly*/}
              {/*    </button>*/}
              {/*    <button*/}
              {/*      type="button"*/}
              {/*      data-cb-type="checkout"*/}
              {/*      data-cb-item-0="Basic-Plan-USD-Yearly"*/}
              {/*      data-cb-item-0-quantity="1"*/}
              {/*      className="subscribe"*/}
              {/*      onClick={() => handleSubscription('Basic', 'Yearly')}*/}
              {/*    >*/}
              {/*      Subscribe Yearly*/}
              {/*    </button>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="payment-card2">
                <h1>Premium</h1>
                {/*<h2 className="title">$80/month</h2>*/}
                <p className="paragraph" style={{ padding: '0 1em', marginBottom: '1em', fontSize: '0.95em' }}>
                  Layer on customizable notifications so you can promote tune-up specials, seasonal service, and events to engaged riders already tracking their bikes with KOR.
                </p>
                {/*<h2 className="title">Features</h2>*/}
                {/*<ul className="list">*/}
                {/*  <li>Unlimited Customer Invites</li>*/}
                {/*  <li>*/}
                {/*    Daily email reports of customers notified about worn parts*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    Automated notifications to customers about worn parts with*/}
                {/*    your shop's contact information*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    Customizable notifications to customers for activities or*/}
                {/*    special deals*/}
                {/*  </li>*/}
                {/*</ul>*/}
              </div>
              {/*<div className="payment2">*/}
              {/*  <div className="payment-row">*/}
              {/*    <button*/}
              {/*      type="button"*/}
              {/*      data-cb-type="checkout"*/}
              {/*      data-cb-item-0="Premium-USD-Monthly"*/}
              {/*      data-cb-item-0-quantity="1"*/}
              {/*      className="subscribe"*/}
              {/*      onClick={() => handleSubscription('Premium', 'Monthly')}*/}
              {/*    >*/}
              {/*      Subscribe Monthly*/}
              {/*    </button>*/}
              {/*    <button*/}
              {/*      type="button"*/}
              {/*      data-cb-type="checkout"*/}
              {/*      data-cb-item-0="Premium-USD-Yearly"*/}
              {/*      data-cb-item-0-quantity="1"*/}
              {/*      className="subscribe"*/}
              {/*      onClick={() => handleSubscription('Premium', 'Yearly')}*/}
              {/*    >*/}
              {/*      Subscribe Yearly*/}
              {/*    </button>*/}
              {/*  </div>*/}
              {/*</div>*/}
              
              <div className="payment-card3">
                <h1>Pro</h1>
                <p className="paragraph" style={{ padding: '0 1em', marginBottom: '1em', fontSize: '0.95em' }}>
                  Gain pro-level insight into each customer's component wear so you can proactively recommend service
                  and deliver a white-glove experience.
                </p>
                {/*<h2 className="title">Features</h2>*/}
                {/*<ul className="list">*/}
                {/*  <li>Unlimited Customer Invites</li>*/}
                {/*  <li>*/}
                {/*    Daily email reports of customers that have been notified of*/}
                {/*    warn out parts*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    Automated Notifications notifying your customers that their*/}
                {/*    parts are worn and gives your contact information*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    Customizable notifications to customers for activities or*/}
                {/*    special deals*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    Ability to view your customer's part data and send direct*/}
                {/*    notifications to them regarding their part wear*/}
                {/*  </li>*/}
                {/*</ul>*/}
              </div>
              {/*<div className="payment3" style={{ opacity: 0.5 }}>*/}
              {/*  <div className="payment-row">*/}
              {/*    */}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            

            
            <div className="mobile_textbox" style={{paddingTop: '0.001em', marginTop: '2em', paddingBottom: '1em' }}>
              <h1>Request a Pressure Free Call From Our Founders</h1>
              <p className="paragraph" style={{ fontStyle: 'italic', marginBottom: '2em' }}>
                Spend less time chasing customers and more time booking profitable, well-timed service appointments with riders who feel taken care of by your shop.
              </p>
              
              {submitMessage && (
                <div className={`form-message ${submitMessage.includes('Error') ? 'error' : 'success'}`} style={{ 
                  marginBottom: '1rem', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  backgroundColor: submitMessage.includes('Error') ? '#ffe6e6' : '#e6f7e6',
                  color: submitMessage.includes('Error') ? '#d63031' : '#00b894',
                  border: `1px solid ${submitMessage.includes('Error') ? '#d63031' : '#00b894'}`
                }}>
                  {submitMessage}
                </div>
              )}
              
              <form
                action="https://formspree.io/f/myyvklzv"
                method="post"
                name="DemoRequestForm"
                className="login_form"
                onSubmit={handleDemoSubmit}
                style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '2em' }}
              >
                <div className="form_line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}>
                  <label htmlFor="shopName" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Shop Name *</label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    placeholder="Your bike shop name"
                    value={demoFormData.shopName}
                    onChange={handleDemoChange}
                    style={{ padding: '0.75em', fontSize: '1em', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                
                <div className="form_line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}>
                  <label htmlFor="contactName" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Contact Name *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    placeholder="Your full name"
                    value={demoFormData.contactName}
                    onChange={handleDemoChange}
                    style={{ padding: '0.75em', fontSize: '1em', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                
                <div className="form_line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}>
                  <label htmlFor="email" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="youraddress@example.com"
                    value={demoFormData.email}
                    onChange={handleDemoChange}
                    style={{ padding: '0.75em', fontSize: '1em', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                
                <div className="form_line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}>
                  <label htmlFor="phone" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(123) 456-7890"
                    value={demoFormData.phone}
                    onChange={handleDemoChange}
                    style={{ padding: '0.75em', fontSize: '1em', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                
                <div className="form_line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}>
                  <label htmlFor="message" style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>Tell us about your shop (optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Number of customers and what you're looking for..."
                    rows={4}
                    value={demoFormData.message}
                    onChange={handleDemoChange}
                    style={{ padding: '0.75em', fontSize: '1em', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                  />
                </div>

                <button 
                  className="btn" 
                  type="submit" 
                  disabled={isSubmitting} 
                  style={{ 
                    marginTop: '1.5em',
                    width: '100%',
                    maxWidth: '300px',
                    padding: '1em 2em',
                    fontSize: '1.1em',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Request Demo'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
