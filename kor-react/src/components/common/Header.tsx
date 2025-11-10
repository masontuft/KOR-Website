import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, isLoading } = useAuth0();
  const location = useLocation();

  // Soft auth: consider sessionStorage shop data as an authenticated shop session while Auth0 hydrates
  const sessionHasShopData = typeof window !== 'undefined' && !!(sessionStorage.getItem('shop_name') && sessionStorage.getItem('plan_type'));
  const softAuthenticated = isAuthenticated || sessionHasShopData;
  const showLoading = isLoading && !softAuthenticated;

  // Check if we're on a shop page (dashboard, login, etc.)
  const isOnShopPage = location.pathname.startsWith('/shop');

  const handleLogout = () => {
    try {
      // Clear legacy session data to avoid soft-auth illusions after logout
      sessionStorage.removeItem('shop_name');
      sessionStorage.removeItem('shop_code');
      sessionStorage.removeItem('plan_type');
      sessionStorage.removeItem('shop_token');
    } catch {}

    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div id="header_grid">
        <Link to="/">
          <img 
            className="icon" 
            src="/images/KOR_app_Logo.png" 
            alt="KOR Logo" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link className="link" to="/">Home</Link>
          <Link className="link" to="/our-app">The KOR App</Link>
          <Link className="link" to="/our-story">Our Story</Link>
          <Link className="link" to="/sign-up">Shop Sign Up</Link>
          <Link className="link" to="/faq">FAQ</Link>
          <Link className="link" to="/contact">Contact Us</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X color="white" size={24} /> : <Menu color="white" size={24} />}
        </button>

        <nav className="right_position desktop-nav">
          {showLoading ? (
            <span className="link loading-auth">Loading...</span>
          ) : isOnShopPage && softAuthenticated ? (
            <>
              <Link 
                className="link" 
                to="/shop/settings"
              >
                ⚙️ Settings
              </Link>
              <button 
                className="link"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <Link 
              className="link" 
              to="/shop/login"
            >
              Log In
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link className="mobile-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </Link>
        <Link className="mobile-link" to="/our-app" onClick={() => setIsMobileMenuOpen(false)}>
          The KOR App
        </Link>
        <Link className="mobile-link" to="/our-story" onClick={() => setIsMobileMenuOpen(false)}>
          Our Story
        </Link>
        <Link className="mobile-link" to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
          Shop Sign Up
        </Link>
        <Link className="mobile-link" to="/faq" onClick={() => setIsMobileMenuOpen(false)}>
          FAQ
        </Link>
        <Link className="mobile-link" to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
          Contact Us
        </Link>
        {showLoading ? (
          <span className="mobile-link loading-auth">Loading...</span>
        ) : isOnShopPage && softAuthenticated ? (
          <>
            <Link className="mobile-link" to="/shop/settings" onClick={() => setIsMobileMenuOpen(false)}>
              ⚙️ Settings
            </Link>
            <button 
              className="mobile-link" 
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <Link className="mobile-link" to="/shop/login" onClick={() => setIsMobileMenuOpen(false)}>
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
