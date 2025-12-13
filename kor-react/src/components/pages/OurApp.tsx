import React from 'react';
import ScrollAnimations from '../common/ScrollAnimations';
import StructuredData from '../common/StructuredData';

const OurApp: React.FC = () => {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';
  return (
    <>
      <StructuredData
        type="website"
        pageTitle="The KOR App — Intelligent Bike Maintenance Tracking"
        pageDescription="See how KOR uses Strava data to track component wear, alert you before parts fail, and keep you riding."
        url={`${baseUrl}/our-app`}
      />
      <ScrollAnimations />
      <section className="app-screen-section">
        <div className="app-content-grid">
          <div className="our_app_textbox slide-in">
            <h1>The Keep On Rolling App</h1>
            <p className="paragraph" style={{ fontWeight: 500, marginBottom: '1.5rem' }}>
              KOR prevents surprise failures, keeps your bike ride-ready, and removes the guesswork from maintenance—so you can focus on riding, not wrenching.
            </p>
            <p className="paragraph">
              This application integrates with a third-party application,
              Strava, a social media platform for athletes. Strava tracks the
              miles you accumulate, and our application utilizes this data to
              calculate the percentage of wear on your bicycle.
            </p>
          </div>
          <div className="center slide-in">
            <img
              className="our_app_example"
              src="/images/WelcomeScreenshot.png"
              alt="App Home Screen"
            />
          </div>
        </div>
      </section>

      <section className="app-screen-section">
        <div className="app-content-grid">
          <div className="our_app_textbox slide-in">
            <p className="paragraph">
              See which parts need attention next at a glance, so you can fix issues before they ruin a ride.
            </p>
          </div>
          <div className="center slide-in">
            <img
              src="/images/BikeDashboard.png"
              className="our_app_example"
              alt="App Dashboard"
            />
          </div>
        </div>
      </section>

      <section className="app-screen-section">
        <div className="app-content-grid">
          <div className="our_app_textbox slide-in">
            <p className="paragraph">
              View complete part history and update details in seconds, so you always know when each component was last serviced.
            </p>
          </div>
          <div className="center slide-in">
            <img
              className="our_app_example"
              src="/images/PartPopup.png"
              alt="App Part Screen"
            />
          </div>
        </div>
      </section>

      <section className="app-screen-section">
        <div className="app-content-grid">
          <div className="our_app_textbox slide-in">
            <p className="paragraph">
              Track shock setup, customize parts, and set your default bike—keep all your ride data organized in one place.
            </p>
          </div>
          <div className="center slide-in">
            <img
              className="our_app_example"
              src="/images/BikeSettings.png"
              alt="Bike Settings Screen"
            />
          </div>
        </div>
      </section>

      <section className="app-screen-section">
        <div className="app-content-grid">
          <div className="our_app_textbox slide-in">
            <p className="paragraph">
              Show or hide parts based on what's actually on your bike, so your dashboard stays clutter-free and relevant.
            </p>
          </div>
          <div className="center slide-in">
            <img
              className="our_app_example"
              src="/images/PartVisibility.png"
              alt="App Part Visibility"
            />
          </div>
        </div>
      </section>

      <section className="app-screen-section">
        <div className="app-content-grid">
          <div className="our_app_textbox slide-in">
            <p className="paragraph">
              Adjust wear percentages and lifespan estimates to match your riding style, so alerts fit how you actually use your bike.
            </p>
          </div>
          <div className="center slide-in">
            <img
              className="our_app_example"
              src="/images/PartSettings.png"
              alt="Part Settings Screen"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-banner">
        <div className="cta-banner-content">
          <p className="cta-banner-text" style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
            Join riders already using KOR to keep their bikes dialed in all season.
          </p>
          <h2 className="cta-banner-title">
            Ready to Never Miss Maintenance Again?
          </h2>
          <p className="cta-banner-text" style={{ marginBottom: '1.5rem' }}>
            Free to download—only upgrade if it's working for you.
          </p>
          <div className="cta-banner-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.robtuft.newKOR"
              target="_blank"
              rel="noopener noreferrer"
              className="store-button-link"
              aria-label="Download KOR for Android on Google Play"
            >
              <img
                className="store_buttons_large"
                src="/images/Google_play_button.svg"
                alt="Download on Google Play Store"
              />
            </a>
            <a
              href="https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993"
              target="_blank"
              rel="noopener noreferrer"
              className="store-button-link"
              aria-label="Download KOR for iPhone on the App Store"
            >
              <img
                className="store_buttons_large"
                src="/images/Apple_app_store_button.svg"
                alt="Download on App Store"
              />
            </a>
          </div>
          <div className="cta-banner-secondary">
            <a className="personal-cta-button" href="/personal-plans">
              Personal Plans Available →
            </a>
            <span className="cta-divider">•</span>
            <a className="shop-cta-button" href="/sign-up">
              Bike Shop Partnerships →
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurApp;
