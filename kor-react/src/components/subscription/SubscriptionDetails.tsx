import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { pauseSubscription as cbPauseSubscription, resumeSubscription as cbResumeSubscription } from '../../services/chargebeeClient';

// Declare Chargebee as a global variable for TypeScript
declare global {
  interface Window {
    Chargebee: any;
  }
}

interface SubscriptionData {
  subscriptionId: string;
  customerId: string;
  planId: string;
  planName: string;
  status: string;
  amount: string;
  unitPrice: string;
  quantity: number;
  currency: string;
  billingPeriod: number;
  billingPeriodUnit: string;
  mrr: string;
  createdAt: string;
  startedAt: string;
  activatedAt: string;
  currentTermStart: string;
  currentTermEnd: string;
  nextBillingAt: string;
  trialStart?: string;
  trialEnd?: string;
  cancelledAt?: string;
  customer: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
  shop: {
    name: string;
    code: string;
    planType: string;
    token: string;
  };
  isActive: boolean;
  isCancelled: boolean;
  isInTrial: boolean;
  isPaused: boolean;
  autoCollection: string;
  dueInvoicesCount: number;
  cancelReason?: string;
}

interface SubscriptionDetailsProps {
  subscriptionId?: string;
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
  onSubscriptionData?: (data: SubscriptionData | null) => void;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  subscriptionId,
  onError,
  onLoading,
  onSubscriptionData
}) => {
  const { user, isAuthenticated } = useAuth0();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Local UI state for pause/resume actions
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseDateStr, setPauseDateStr] = useState('');
  const [resumeDateStr, setResumeDateStr] = useState('');
  const [pauseOption, setPauseOption] = useState<'SPECIFIC_DATE' | 'IMMEDIATELY'>('SPECIFIC_DATE');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const getFallbackSubscriptionId = useCallback((): string | null => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get('sub_id');
      if (fromUrl) return fromUrl;
      const fromLS = localStorage.getItem('kor_param_sub_id');
      if (fromLS) return fromLS;
    } catch {}
    return null;
  }, []);

  const fetchSubscriptionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    onLoading?.(true);

    try {
      const authToken = process.env.REACT_APP_API_AUTH_TOKEN || '1893784827439273928203838';
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';

      const requestBody: any = {
        auth: authToken
      };

      const fallbackSubId = getFallbackSubscriptionId();

      // Identifier priority: explicit prop -> fallback sub_id -> auth0_sub_id
      if (subscriptionId) {
        requestBody.subscription_id = subscriptionId;
      } else if (fallbackSubId) {
        requestBody.subscription_id = fallbackSubId;
      } else if (isAuthenticated && user?.sub) {
        requestBody.auth0_sub_id = user.sub;
      } else {
        throw new Error('Awaiting authentication or subscription ID');
      }

      console.log('Fetching subscription data with:', { ...requestBody, auth: '***' });

      const response = await fetch(`${baseUrl}/getChargebeeSubscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(requestBody)
      });

      if (!response.ok) {
        let errorData: any = null;
        try { errorData = await response.json(); } catch {}
        throw new Error((errorData && errorData.error) || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.message === 'success') {
        if (data.subscription) {
          setSubscriptionData(data.subscription);
          console.log('Successfully fetched subscription data:', data.subscription);
          // Notify parent component of subscription data
          onSubscriptionData?.(data.subscription);
        } else {
          // Backend may return 200 with shop_status when the shop exists but is not active
          console.log('No active subscription found. Backend status:', data.shop_status || 'unknown');
          setSubscriptionData(null);
          onSubscriptionData?.(null);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch subscription data');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching subscription data:', err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  }, [isAuthenticated, user?.sub, subscriptionId, onError, onLoading, getFallbackSubscriptionId, onSubscriptionData]);

  const refreshData = () => {
    fetchSubscriptionData();
  };

  // Helpers for pause/resume
  const dateStringToEpochSeconds = (dateStr: string): number => {
    // Parse as local midnight of the selected date
    const dt = new Date(`${dateStr}T00:00:00`);
    if (isNaN(dt.getTime())) throw new Error('Invalid date');
    return Math.floor(dt.getTime() / 1000);
  };

  const openPauseModal = () => {
    setActionError(null);
    setActionSuccess(null);
    setPauseDateStr('');
    setResumeDateStr('');
    setPauseOption('SPECIFIC_DATE');
    setShowPauseModal(true);
  };

  const closePauseModal = () => {
    if (!actionLoading) setShowPauseModal(false);
  };

  const handlePauseConfirm = async () => {
    if (!subscriptionData) return;

    if (pauseOption === 'SPECIFIC_DATE') {
      if (!pauseDateStr || !resumeDateStr) {
        setActionError('Please select both pause and resume dates.');
        return;
      }

      let pauseSec: number;
      let resumeSec: number;
      try {
        pauseSec = dateStringToEpochSeconds(pauseDateStr);
        resumeSec = dateStringToEpochSeconds(resumeDateStr);
      } catch (e) {
        setActionError('Invalid date(s). Please check your selections.');
        return;
      }

      if (resumeSec <= pauseSec) {
        setActionError('Resume date must be after the pause date.');
        return;
      }

      const nowSec = Math.floor(Date.now() / 1000);
      if (pauseSec <= nowSec) {
        setActionError('Pause date must be in the future.');
        return;
      }
    } else {
      // IMMEDIATELY - no date validation needed
      if (!resumeDateStr) {
        setActionError('Please select a resume date for immediate pause.');
        return;
      }
    }

    try {
      setActionLoading(true);
      setActionError(null);
      
      let pauseParams;
      let successMessage;
      
      if (pauseOption === 'IMMEDIATELY') {
        const resumeSec = dateStringToEpochSeconds(resumeDateStr);
        pauseParams = {
          subscriptionId: subscriptionData.subscriptionId,
          pauseOption: 'IMMEDIATELY' as const,
          resumeDate: resumeSec
        };
        successMessage = `Subscription paused immediately, will resume on ${resumeDateStr}`;
      } else {
        const pauseSec = dateStringToEpochSeconds(pauseDateStr);
        const resumeSec = dateStringToEpochSeconds(resumeDateStr);
        pauseParams = {
          subscriptionId: subscriptionData.subscriptionId,
          pauseOption: 'SPECIFIC_DATE' as const,
          pauseDate: pauseSec,
          resumeDate: resumeSec
        };
        successMessage = `Subscription paused from ${pauseDateStr} to ${resumeDateStr}`;
      }
      
      await cbPauseSubscription(pauseParams);
      setShowPauseModal(false);
      setActionSuccess(successMessage);
      refreshData();
      // Clear success message after 5 seconds
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to pause subscription.';
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeNow = async () => {
    if (!subscriptionData) return;
    if (!window.confirm('Resume your subscription now?')) return;

    try {
      setActionLoading(true);
      setActionError(null);
      await cbResumeSubscription({ subscriptionId: subscriptionData.subscriptionId });
      setActionSuccess('Subscription resumed successfully!');
      refreshData();
      // Clear success message after 5 seconds
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to resume subscription.';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const openCustomerPortal = () => {
    if (!subscriptionData) {
      console.error('No subscription data available');
      return;
    }

    console.log('Opening Chargebee Customer Portal for customer:', subscriptionData.customerId);

    // Check if Chargebee is loaded
    if (!window.Chargebee) {
      // Fallback to the existing portal button behavior if Chargebee.js isn't loaded
      console.warn('Chargebee.js not loaded, opening portal in new window');
      const portalUrl = `https://jmrcycling.chargebee.com/portal/v2/login`;
      window.open(portalUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      return;
    }

    try {
      // Initialize Chargebee if not already done
      const site = process.env.REACT_APP_CHARGEBEE_SITE || 'jmrcycling';
      
      if (!window.Chargebee.init) {
        console.warn('Chargebee not properly initialized');
        // Fallback to direct portal URL
        const portalUrl = `https://${site}.chargebee.com/portal/v2/login`;
        window.open(portalUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        return;
      }

      window.Chargebee.init({
        site: site
      });

      // Use Chargebee's portal opening mechanism
      const cbInstance = window.Chargebee.getInstance();
      
      if (cbInstance && cbInstance.setPortalSession) {
        // Open the customer portal
        cbInstance.setPortalSession(() => {
          return {
            redirect_url: window.location.href,
            forward_url: window.location.href
          };
        });
        
        cbInstance.openPortal();
      } else {
        // Fallback: Use the data-cb-type="portal" approach
        console.log('Using fallback portal opening method');
        
        // Create a temporary element with Chargebee portal attributes
        const tempElement = document.createElement('a');
        tempElement.setAttribute('data-cb-type', 'portal');
        tempElement.setAttribute('href', '#');
        tempElement.addEventListener('click', (e) => e.preventDefault());
        
        // Trigger the Chargebee portal
        tempElement.click();
      }
      
    } catch (error) {
      console.error('Error opening Chargebee portal:', error);
      
      // Final fallback - open portal URL directly
      const site = process.env.REACT_APP_CHARGEBEE_SITE || 'jmrcycling';
      const portalUrl = `https://${site}.chargebee.com/portal/v2/login`;
      window.open(portalUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    }
  };

  useEffect(() => {
    // Initialize Chargebee when component mounts
    if (window.Chargebee) {
      const site = process.env.REACT_APP_CHARGEBEE_SITE || 'jmrcycling';
      try {
        window.Chargebee.init({
          site: site
        });
        console.log(`Chargebee initialized with site: ${site}`);
      } catch (error) {
        console.warn('Chargebee initialization error:', error);
      }
    } else {
      console.warn('Chargebee.js not loaded');
    }
    
    const haveSubId = !!subscriptionId || !!getFallbackSubscriptionId();
    if (haveSubId || (isAuthenticated && user)) {
      fetchSubscriptionData();
    }
  }, [isAuthenticated, user, subscriptionId, fetchSubscriptionData, getFallbackSubscriptionId]);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'in_trial': return '#17a2b8';
      case 'paused': return '#ffc107';
      case 'past_due': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return '✓';
      case 'cancelled': return '✗';
      case 'in_trial': return '🎯';
      case 'paused': return '⏸️';
      case 'past_due': return '⚠️';
      default: return '•';
    }
  };


  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p>Loading subscription details...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '1.5rem',
        backgroundColor: '#ffe6e6',
        color: '#d63031',
        borderRadius: '8px',
        border: '1px solid #d63031'
      }}>
        <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
          ⚠️ Error Loading Subscription
        </h4>
        <p style={{ margin: '0.5rem 0' }}>{error}</p>
        <button
          onClick={refreshData}
          style={{
            backgroundColor: '#d63031',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div style={{ 
        padding: '1rem', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <p>No subscription data available.</p>
        <button
          onClick={refreshData}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: `3px solid ${getStatusColor(subscriptionData.status)}`,
      borderLeft: `6px solid ${getStatusColor(subscriptionData.status)}`
    }}>
      {/* Pause Modal */}
      {showPauseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '1.5rem', width: '100%', maxWidth: '520px', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>Pause Subscription</h3>
            <p style={{ color: '#666', marginTop: '0.25rem' }}>Choose when to pause your subscription. A resume date is always required.</p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Pause timing</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="pauseOption"
                    value="IMMEDIATELY"
                    checked={pauseOption === 'IMMEDIATELY'}
                    onChange={(e) => setPauseOption(e.target.value as 'IMMEDIATELY')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Pause now
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="pauseOption"
                    value="SPECIFIC_DATE"
                    checked={pauseOption === 'SPECIFIC_DATE'}
                    onChange={(e) => setPauseOption(e.target.value as 'SPECIFIC_DATE')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Pause on specific date
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: pauseOption === 'IMMEDIATELY' ? '1fr' : '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
              {pauseOption === 'SPECIFIC_DATE' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Pause date</label>
                  <input
                    type="date"
                    value={pauseDateStr}
                    onChange={(e) => setPauseDateStr(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Resume date</label>
                <input
                  type="date"
                  value={resumeDateStr}
                  onChange={(e) => setResumeDateStr(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
            </div>

            {actionError && (
              <div style={{ backgroundColor: '#ffe6e6', color: '#d63031', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d63031', marginBottom: '0.75rem' }}>
                {actionError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={closePauseModal}
                disabled={actionLoading}
                style={{ backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', padding: '0.5rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handlePauseConfirm}
                disabled={actionLoading}
                style={{ backgroundColor: '#ffc107', color: '#333', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                {actionLoading ? 'Pausing…' : 'Confirm Pause'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {actionSuccess && (
        <div style={{
          backgroundColor: '#e6f7e6',
          color: '#00b894',
          padding: '0.75rem',
          borderRadius: '6px',
          border: '1px solid #00b894',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ✅ {actionSuccess}
        </div>
      )}

      {/* Header with status and refresh button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ 
          margin: 0,
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💳 Subscription Details
          <span style={{
            backgroundColor: getStatusColor(subscriptionData.status),
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            {getStatusIcon(subscriptionData.status)} {subscriptionData.status.toUpperCase()}
          </span>
        </h3>
        <button
          onClick={refreshData}
          style={{
            backgroundColor: '#f8f9fa',
            color: '#495057',
            border: '1px solid #dee2e6',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
          title="Refresh subscription data"
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {/* Plan Information */}
        <div>
          <h4 style={{ color: getStatusColor(subscriptionData.status), marginTop: 0, marginBottom: '0.75rem' }}>
            📋 Plan Information
          </h4>
          <div style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
            <p><strong>Plan:</strong> {subscriptionData.planName}</p>
            <p><strong>Amount:</strong> {subscriptionData.amount}</p>
            {subscriptionData.billingPeriod && (
              <p><strong>Billing:</strong> Every {subscriptionData.billingPeriod} {subscriptionData.billingPeriodUnit}(s)</p>
            )}
            {subscriptionData.mrr && subscriptionData.mrr !== '$0.00' && (
              <p><strong>Monthly Recurring Revenue:</strong> {subscriptionData.mrr}</p>
            )}
          </div>
        </div>

        {/* Billing Information */}
        <div>
          <h4 style={{ color: getStatusColor(subscriptionData.status), marginTop: 0, marginBottom: '0.75rem' }}>
            🗓️ Billing Dates
          </h4>
          <div style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
            {subscriptionData.startedAt && <p><strong>Started:</strong> {subscriptionData.startedAt}</p>}
            {subscriptionData.currentTermStart && <p><strong>Current Term:</strong> {subscriptionData.currentTermStart}</p>}
            {subscriptionData.currentTermEnd && <p><strong>Term Ends:</strong> {subscriptionData.currentTermEnd}</p>}
            {subscriptionData.nextBillingAt && <p><strong>Next Billing:</strong> {subscriptionData.nextBillingAt}</p>}
            {subscriptionData.cancelledAt && <p><strong>Cancelled:</strong> {subscriptionData.cancelledAt}</p>}
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 style={{ color: getStatusColor(subscriptionData.status), marginTop: 0, marginBottom: '0.75rem' }}>
            👤 Customer Information
          </h4>
          <div style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
            {subscriptionData.customer.name && <p><strong>Name:</strong> {subscriptionData.customer.name}</p>}
            <p><strong>Email:</strong> {subscriptionData.customer.email}</p>
            {subscriptionData.customer.company && <p><strong>Company:</strong> {subscriptionData.customer.company}</p>}
            {subscriptionData.customer.phone && <p><strong>Phone:</strong> {subscriptionData.customer.phone}</p>}
          </div>
        </div>

        {/* Subscription Details */}
        <div>
          <h4 style={{ color: getStatusColor(subscriptionData.status), marginTop: 0, marginBottom: '0.75rem' }}>
            🔧 Subscription Details
          </h4>
          <div style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
            <p><strong>Subscription ID:</strong> 
              <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                {subscriptionData.subscriptionId}
              </code>
            </p>
            <p><strong>Customer ID:</strong> 
              <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                {subscriptionData.customerId}
              </code>
            </p>
            <p><strong>Auto Collection:</strong> {subscriptionData.autoCollection}</p>
            {subscriptionData.dueInvoicesCount > 0 && (
              <p style={{ color: '#dc3545' }}>
                <strong>Due Invoices:</strong> {subscriptionData.dueInvoicesCount}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trial Information (if applicable) */}
      {(subscriptionData.isInTrial || subscriptionData.trialStart || subscriptionData.trialEnd) && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#1976d2', marginTop: 0, marginBottom: '0.5rem' }}>
            🎯 Trial Information
          </h4>
          {subscriptionData.trialStart && <p><strong>Trial Started:</strong> {subscriptionData.trialStart}</p>}
          {subscriptionData.trialEnd && <p><strong>Trial Ends:</strong> {subscriptionData.trialEnd}</p>}
          {subscriptionData.isInTrial && (
            <p style={{ color: '#1976d2', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
              ✨ Currently in trial period
            </p>
          )}
        </div>
      )}

      {/* Cancellation Information (if applicable) */}
      {subscriptionData.isCancelled && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#d32f2f', marginTop: 0, marginBottom: '0.5rem' }}>
            ❌ Cancellation Information
          </h4>
          {subscriptionData.cancelledAt && <p><strong>Cancelled On:</strong> {subscriptionData.cancelledAt}</p>}
          {subscriptionData.cancelReason && <p><strong>Reason:</strong> {subscriptionData.cancelReason}</p>}
        </div>
      )}

      {/* Subscription Management Actions */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#333', marginTop: 0, marginBottom: '1rem' }}>
          🛠️ Manage Your Subscription
        </h4>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Update your payment method, change plans, download invoices, and more in the secure customer portal.
        </p>
        
        <button
          onClick={openCustomerPortal}
          style={{
            backgroundColor: getStatusColor(subscriptionData.status),
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          title="Open Chargebee Customer Portal to manage your subscription"
        >
          🚀 Manage Subscription
        </button>

        {/* Pause/Resume controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          {(['active', 'in_trial'].includes((subscriptionData.status || '').toLowerCase())) && (
            <button
              onClick={openPauseModal}
              disabled={actionLoading}
              style={{ backgroundColor: '#ffc107', color: '#333', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              title="Pause subscription on a specific date"
            >
              ⏸️ Pause Subscription
            </button>
          )}
          {(subscriptionData.status || '').toLowerCase() === 'paused' && (
            <button
              onClick={handleResumeNow}
              disabled={actionLoading}
              style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              title="Resume subscription now"
            >
              ▶️ Resume Now
            </button>
          )}
        </div>
        
        <div style={{
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: '#666',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.5rem',
          maxWidth: '600px',
          margin: '1rem auto 0'
        }}>
          <div>✓ Update payment method</div>
          <div>✓ Download invoices</div>
          <div>✓ Change billing address</div>
          <div>✓ Update plan</div>
          <div>✓ Pause subscription</div>
          <div>✓ Cancel subscription</div>
        </div>
      </div>

      {/* Shop Information Footer */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#6c757d'
      }}>
        <strong>Shop:</strong> {subscriptionData.shop.name} ({subscriptionData.shop.code}) | 
        <strong> Plan Type:</strong> {subscriptionData.shop.planType}
      </div>
    </div>
  );
};

export default SubscriptionDetails;
