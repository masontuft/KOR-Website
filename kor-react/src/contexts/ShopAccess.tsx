import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

export type ShopStatus = 'active' | 'paused' | 'inactive' | 'cancelled' | string;

type ShopAccess = {
  loaded: boolean;
  status: ShopStatus;
  plan: string | null;
  name: string | null;
  code: string | null;
  refresh: () => Promise<void>;
};

const ShopAccessCtx = createContext<ShopAccess>({
  loaded: false,
  status: 'active',
  plan: null,
  name: null,
  code: null,
  refresh: async () => {}
});

export function useShopAccess() {
  return useContext(ShopAccessCtx);
}

export function ShopAccessProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<ShopStatus>('active');
  const [plan, setPlan] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';

  const refresh = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('shop_token');
      if (!token) {
        // No token yet; likely not logged in. Mark as loaded but keep status active (no gate)
        setLoaded(true);
        return;
      }
      const res = await fetch(`${baseUrl}/shop/status?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.message === 'success') {
          setStatus((data.sub_activity as ShopStatus) || 'inactive');
          setPlan(data.plan_type ?? null);
          setName(data.shop_name ?? null);
          setCode(data.shop_code ?? null);
        } else {
          // Unknown response -> do not gate
          setStatus('active');
        }
      } else {
        // Error fetching -> do not gate
        setStatus('active');
      }
    } catch (e) {
      // Network error -> do not gate
      setStatus('active');
    } finally {
      setLoaded(true);
    }
  }, [baseUrl]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ loaded, status, plan, name, code, refresh }), [loaded, status, plan, name, code, refresh]);

  return (
    <ShopAccessCtx.Provider value={value}>
      {children}
    </ShopAccessCtx.Provider>
  );
}

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const { loaded, status, refresh } = useShopAccess();
  const gated = loaded && status !== 'active';

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: gated ? 'blur(3px)' : 'none', transition: 'filter 120ms ease' }}>
        {children}
      </div>

      {gated && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 12,
            width: 'min(680px, 92vw)',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Subscription Required</h2>
              <p style={{ marginTop: 8, color: '#555' }}>
                Your shop subscription is currently <strong>{String(status)}</strong>. You can browse your data, but actions are disabled until you resume or subscribe.
              </p>
            </div>


            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button
                onClick={() => refresh()}
                style={{
                  background: '#0d6efd', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
