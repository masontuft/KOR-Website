import React, { useEffect, useState } from 'react';
import StructuredData from '../common/StructuredData';

const PersonalPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';

  const handlePlanSelect = (planType: string) => {
    setSelectedPlan(planType);
  };

  // Ensure Chargebee's drop-in script binds to dynamically rendered React elements
  useEffect(() => {
    const cb: any = (window as any).Chargebee;
    if (cb && typeof cb.registerAgain === 'function') {
      try {
        cb.registerAgain();
      } catch (e) {
        console.error('Chargebee.registerAgain failed', e);
      }
    }
  }, []);

  const handleSubscribe = (planType: string) => {
    // For now, redirect to app stores for the free version
    // In the future, this could integrate with payment processing for premium personal plans

    const message =
      `You've selected the ${planType} plan. ` +
      `${
        planType === 'free'
          ? 'Click OK to download the free version from your app store.'
          : 'Premium personal plans will be available soon. For now, enjoy the free version!'
      }`;


    const message =
      `You've selected the ${planType} plan. ` +
      `${
        planType === 'free'
          ? 'Click OK to download the free version from your app store.'
          : 'Premium personal plans will be available soon. For now, enjoy the free version!'
      }`;

    if (window.confirm(message)) {
      // Redirect to app stores
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;

      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;

      if (/android/i.test(userAgent)) {
        window.open(
          'https://play.google.com/store/apps/details?id=com.robtuft.newKOR',
          '_blank'
        );
        window.open(
          'https://play.google.com/store/apps/details?id=com.robtuft.newKOR',
          '_blank'
        );
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        window.open(
          'https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993',
          '_blank'
        );
        window.open(
          'https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993',
          '_blank'
        );
      } else {
        // Default to Google Play for desktop users
        window.open(
          'https://play.google.com/store/apps/details?id=com.robtuft.newKOR',
          '_blank'
        );
        window.open(
          'https://play.google.com/store/apps/details?id=com.robtuft.newKOR',
          '_blank'
        );
      }
    }
  };

  return (
    <>
      <StructuredData
        type='website'
        pageTitle='Personal Account Plans — KOR'
        pageDescription='Track your bike maintenance for free today. Premium plans coming soon with advanced features and notifications.'
        type='website'
        pageTitle='Personal Account Plans — KOR'
        pageDescription='Track your bike maintenance for free today. Premium plans coming soon with advanced features and notifications.'
        url={`${baseUrl}/personal-plans`}
      />
      <div className='parallax_parent'>
        <div className='parallax_sign_up'>
      <div className='parallax_parent'>
        <div className='parallax_sign_up'>
          <div style={{ padding: '5%' }}>
            <h1 className='title_box'>Personal Account Plans</h1>
            <div className='mobile_textbox'>
              <p className='paragraph'>
                Perfect for individual cyclists who want to track their bike
                maintenance without a bike shop partnership. Get started with
                our free version or upgrade to premium features for enhanced
                tracking and notifications.
            <h1 className='title_box'>Personal Account Plans</h1>
            <div className='mobile_textbox'>
              <p className='paragraph'>
                Perfect for individual cyclists who want to track their bike
                maintenance without a bike shop partnership. Get started with
                our free version or upgrade to premium features for enhanced
                tracking and notifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='parallax_parent'>
        <div className='parallax2_sign_up'>

      <div className='parallax_parent'>
        <div className='parallax2_sign_up'>
          <div style={{ padding: '5%' }}>
            <div className='payment-plans'>
            <div className='payment-plans'>
              {/* Free Plan */}
              <div
                className={`payment-card1 ${selectedPlan === 'free' ? 'selected' : ''}`}
              >
              <div
                className={`payment-card1 ${selectedPlan === 'free' ? 'selected' : ''}`}
              >
                <h1>Free</h1>
                <h2 className='title'>$0/month</h2>
                <h2 className='title'>Features</h2>
                <ul className='list'>
                <h2 className='title'>$0/month</h2>
                <h2 className='title'>Features</h2>
                <ul className='list'>
                  <li>Basic component tracking</li>
                  <li>Strava integration</li>
                  <li>Manual maintenance logging</li>
                  <li>Basic wear percentage alerts</li>
                  <li>Single bike support</li>
                </ul>
                <div className='plan-limitations'>
                  <h3 className='limitation-title'>Limitations:</h3>
                  <ul className='limitation-list'>
                <div className='plan-limitations'>
                  <h3 className='limitation-title'>Limitations:</h3>
                  <ul className='limitation-list'>
                    <li>Limited to basic components</li>
                    <li>Manual notifications only</li>
                    <li>No advanced analytics</li>
                  </ul>
                </div>
              </div>

              <div className='payment1'>
                <div className='payment-row'>

              <div className='payment1'>
                <div className='payment-row'>
                  <button
                    type='button'
                    type='button'
                    className={`subscribe ${selectedPlan === 'free' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('free')}
                  >
                    {selectedPlan === 'free' ? 'Selected' : 'Select Free Plan'}
                  </button>
                  <button
                    type='button'
                    className='subscribe primary'
                    type='button'
                    className='subscribe primary'
                    onClick={() => handleSubscribe('free')}
                  >
                    Download Free App
                  </button>
                </div>
              </div>

              {/* Premium Plan (Coming Soon) */}
              {/* Premium Plan (Coming Soon) */}
              <a
                href='/premium-plan'
                className={`payment-card2 ${selectedPlan === 'premium' ? 'selected' : ''}`}
              <a
                href='/premium-plan'
                className={`payment-card2 ${selectedPlan === 'premium' ? 'selected' : ''}`}
                style={{ opacity: 0.8 }}
              >
                <h1>Premium</h1>
                <h2 className='title'>$9.99/month</h2>
                <h2 className='title'>Features</h2>
                <ul className='list'>
                <h2 className='title'>$9.99/month</h2>
                <h2 className='title'>Features</h2>
                <ul className='list'>
                  <li>All Free features</li>
                  <li>Advanced component tracking</li>
                  <li>Automated email/push notifications</li>
                  <li>Multiple bike support</li>
                  <li>Detailed analytics & reports</li>
                  <li>Custom maintenance schedules</li>
                  <li>Weather-based adjustments</li>
                  <li>Component replacement reminders</li>
                </ul>
                <div className='coming-soon-badge'>
                <div className='coming-soon-badge'>
                  <span>Coming Soon!</span>
                </div>
              </a>

              <div className='payment2' style={{ opacity: 0.8 }}>
                <div className='payment-row'>
                  <button type='button' className='subscribe disabled' disabled>
              <div className='payment2' style={{ opacity: 0.8 }}>
                <div className='payment-row'>
                  <button type='button' className='subscribe disabled' disabled>
                    Coming Soon
                  </button>
                  <p className='coming-soon-text'>
                    Premium personal plans will be available in Q2 2024. Join
                    our free version now and get notified when premium launches!
                  <p className='coming-soon-text'>
                    Premium personal plans will be available in Q2 2024. Join
                    our free version now and get notified when premium launches!
                  </p>
                </div>
              </div>

              {/* Family Plan */}
              <a
                href='/family-plan-pricing'
                className={`payment-card3 ${selectedPlan === 'family' ? 'selected' : ''}`}
                onClick={e => {
                  e.preventDefault();
                  setSelectedPlan('family');
                  window.location.href = '/family-plan-pricing';
                }}
              >
                <h1>Family</h1>
                <h2 className='title'>$19.99/month</h2>
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
              </a>

              <div className='payment3'>
                <div
                  className='payment-row'
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <a
                    href='#'
                    data-cb-type='checkout'
                    data-cb-item-0='Family-USD-Monthly'
                    data-cb-item-0-quantity='1'
                    className='subscribe'
                    onClick={e => e.preventDefault()}
                  >
                    Subscribe Monthly - $19.99/mo
                  </a>
                  <a
                    href='#'
                    data-cb-type='checkout'
                    data-cb-item-0='Family-USD-Yearly'
                    data-cb-item-0-quantity='1'
                    className='subscribe'
                    onClick={e => e.preventDefault()}
                  >
                    Subscribe Yearly - $X/yr
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Section for Personal Plans */}
            <div
              className='personal-plans-faq'
              style={{
                marginTop: '3rem',
                padding: '2rem',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '10px'
              }}
            >
              <h2 style={{ color: 'black', marginBottom: '1rem' }}>
                Frequently Asked Questions
              </h2>

              <div className='faq-item' style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'black', marginBottom: '0.5rem' }}>
                  Q: What's the difference between personal and shop accounts?
                </h4>
            <div
              className='personal-plans-faq'
              style={{
                marginTop: '3rem',
                padding: '2rem',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '10px'
              }}
            >
              <h2 style={{ color: 'black', marginBottom: '1rem' }}>
                Frequently Asked Questions
              </h2>

              <div className='faq-item' style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'black', marginBottom: '0.5rem' }}>
                  Q: What's the difference between personal and shop accounts?
                </h4>
                <p style={{ color: 'black' }}>
                  A: Personal accounts are perfect for individual cyclists. Shop
                  accounts allow bike shops to invite customers and send
                  automated maintenance notifications with the shop's contact
                  information.
                  A: Personal accounts are perfect for individual cyclists. Shop
                  accounts allow bike shops to invite customers and send
                  automated maintenance notifications with the shop's contact
                  information.
                </p>
              </div>

              <div className='faq-item' style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'black', marginBottom: '0.5rem' }}>
                  Q: Can I upgrade from free to premium later?
                </h4>

              <div className='faq-item' style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'black', marginBottom: '0.5rem' }}>
                  Q: Can I upgrade from free to premium later?
                </h4>
                <p style={{ color: 'black' }}>
                  A: Absolutely! When premium personal plans launch, you'll be
                  able to upgrade seamlessly while keeping all your existing
                  data and settings.
                  A: Absolutely! When premium personal plans launch, you'll be
                  able to upgrade seamlessly while keeping all your existing
                  data and settings.
                </p>
              </div>

              <div className='faq-item'>
                <h4 style={{ color: 'black', marginBottom: '0.5rem' }}>
                  Q: Do I need a bike shop to use KOR?
                </h4>

              <div className='faq-item'>
                <h4 style={{ color: 'black', marginBottom: '0.5rem' }}>
                  Q: Do I need a bike shop to use KOR?
                </h4>
                <p style={{ color: 'black' }}>
                  A: Not at all! Personal accounts work completely
                  independently. However, if you have a participating bike shop,
                  they can provide additional features and support.
                  A: Not at all! Personal accounts work completely
                  independently. However, if you have a participating bike shop,
                  they can provide additional features and support.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div
              className='personal-cta-section'
              style={{ marginTop: '2rem', textAlign: 'center' }}
            >
              <h2 style={{ color: 'black', marginBottom: '1rem' }}>
                Ready to Never Miss Maintenance Again?
              </h2>
              <div className='app-store-buttons'>
            <div
              className='personal-cta-section'
              style={{ marginTop: '2rem', textAlign: 'center' }}
            >
              <h2 style={{ color: 'black', marginBottom: '1rem' }}>
                Ready to Never Miss Maintenance Again?
              </h2>
              <div className='app-store-buttons'>
                <a
                  href='https://play.google.com/store/apps/details?id=com.robtuft.newKOR'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='store-button-link'
                  href='https://play.google.com/store/apps/details?id=com.robtuft.newKOR'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='store-button-link'
                >
                  <img
                    className='store_buttons_large'
                    src='/images/Google_play_button.svg'
                    alt='Download on Google Play Store'
                    className='store_buttons_large'
                    src='/images/Google_play_button.svg'
                    alt='Download on Google Play Store'
                  />
                </a>
                <a
                  href='https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='store-button-link'
                  href='https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='store-button-link'
                >
                  <img
                    className='store_buttons_large'
                    src='/images/Apple_app_store_button.svg'
                    alt='Download on App Store'
                    className='store_buttons_large'
                    src='/images/Apple_app_store_button.svg'
                    alt='Download on App Store'
                  />
                </a>
              </div>
              <p style={{ color: 'black', marginTop: '1rem' }}>
                ✅ Free to download • 🔒 Secure Strava integration • 📱
                Available on all devices
                ✅ Free to download • 🔒 Secure Strava integration • 📱
                Available on all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalPlans;
