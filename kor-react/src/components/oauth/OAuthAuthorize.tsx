import React, { useEffect, useRef, useState, useMemo } from 'react';

// A React version of the static oauth/authorize handler.
// It parses code/state, derives the deep link base (exp:// or kor://), redirects,
// and shows a fallback UI with debug info if the app doesn't open.

function multiDecode(value: string | null | undefined, maxDepth = 4): string[] {
  const results: string[] = [];
  let current = value == null ? '' : String(value);
  for (let i = 0; i < maxDepth; i++) {
    results.push(current);
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch (_) {
      break;
    }
  }
  return results;
}

function tryParseJSON<T = any>(s: string): T | null {
  try { return JSON.parse(s) as T; } catch { return null; }
}

function extractExpoBaseFromState(stateRaw: string | null): string {
  if (!stateRaw) return '';
  const candidates = multiDecode(stateRaw, 4);
  for (const c of candidates) {
    const parsed = tryParseJSON<Record<string, unknown>>(c);
    const base = (parsed && typeof parsed === 'object' && typeof (parsed as any).b === 'string') ? (parsed as any).b : '';
    if (base && base.startsWith('exp://')) return base;
  }
  const last = candidates[candidates.length - 1] || '';
  const m = last.match(/"b"\s*:\s*"(exp:\/\/[^"\\]+)"/);
  return m && m[1] ? m[1] : '';
}

function normalizeBase(base: string): string {
  return (base || '').replace(/\/+$/, '');
}

const OAuthAuthorize: React.FC = () => {
  const [appLink, setAppLink] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [debug, setDebug] = useState<string>('');
  const [showFallback, setShowFallback] = useState<boolean>(false);
  const hasRunRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);

  useEffect(() => {
    if (hasRunRef.current) return; // guard against React StrictMode double-invoke in dev
    hasRunRef.current = true;

    const code = queryParams.get('code');
    const state = queryParams.get('state');
    const error = queryParams.get('error');
    const baseParam = queryParams.get('base'); // optional override
    const dev = queryParams.get('dev'); // optional hint

    const stateDerivedBase = extractExpoBaseFromState(state);
    const chosenBase = (baseParam && baseParam.trim()) ? baseParam.trim() : stateDerivedBase;
    const deepLinkBase = normalizeBase(chosenBase);

    const decodedStates = multiDecode(state, 4);
    setDebug([
      `URL: ${window.location.href}`,
      `Code: ${code ? 'present' : 'missing'}`,
      `State (raw): ${state || 'missing'}`,
      `State decodes:`,
      ...decodedStates.map((s, i) => `[${i}] ${s}`),
      `Derived base from state: ${stateDerivedBase || 'none'}`,
      `Base override param: ${baseParam || 'none'}`,
      `Dev: ${dev || 'false'}`,
      `Error: ${error || 'none'}`
    ].join('\n'));

    if (error) {
      setErrorMsg(`Authentication failed: ${error}`);
      return;
    }

    if (!code) {
      setErrorMsg('No authorization code received');
      return;
    }

    const path = 'oauth/callback';
    const query = `code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ''}`;

    let link: string;
    if (deepLinkBase && (deepLinkBase.startsWith('exp://') || deepLinkBase.startsWith('http://') || deepLinkBase.startsWith('https://'))) {
      // Expo dev or web base: needs /--/ prefix
      link = `${deepLinkBase}/--/${path}?${query}`;
    } else if (dev === 'true' && !deepLinkBase) {
      // Dev hint but no base provided in state; conservative fallback to custom scheme
      link = `kor://${path}?${query}`;
    } else {
      // Production custom scheme fallback
      const schemeBase = 'kor://';
      const normalized = normalizeBase(schemeBase);
      // Avoid double slash by checking if normalized already ends with ://
      const separator = normalized.endsWith('://') ? '' : '/';
      link = `${normalized}${separator}${path}?${query}`;
    }

    console.log('[OAuthAuthorize] Redirecting to app:', link);
    setAppLink(link);

    // Trigger the deep link
    try {
      window.location.href = link;
    } catch (e) {
      console.warn('[OAuthAuthorize] Immediate redirect failed:', e);
    }

    // Fallback UI if the tab remains visible (i.e., app did not open) after 3s
    timeoutRef.current = window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setShowFallback(true);
      }
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div style={{ maxWidth: 560, width: '100%', background: 'rgba(255,255,255,0.9)', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '1.5rem' }}>
        <h2 style={{ margin: 0, textAlign: 'center', color: '#1D3D47' }}>Connecting to KOR…</h2>
        <div style={{ width: 50, height: 50, border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid #fc6b03', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '20px auto' }} />
        <p style={{ textAlign: 'center', color: '#333' }}>Please wait while we redirect you back to the app.</p>
        <p style={{ textAlign: 'center', color: '#777' }}><small>If nothing happens, use the button below.</small></p>

        {errorMsg && (
          <div style={{ background: '#ffe6e6', color: '#c0392b', border: '1px solid #c0392b', padding: '10px 12px', borderRadius: 6, marginTop: 12 }}>
            {errorMsg}
          </div>
        )}

        {(showFallback || errorMsg) && appLink && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button
              onClick={() => { try { window.location.href = appLink; } catch {} }}
              style={{ padding: '12px 24px', background: '#fc6b03', color: 'white', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
            >
              Open KOR App
            </button>
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              Deep link: {appLink}
            </div>
          </div>
        )}

        {debug && (
          <pre style={{ background: '#f8f9fa', color: '#333', padding: 12, borderRadius: 6, marginTop: 16, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {debug}
          </pre>
        )}

        {/* Simple keyframes for the spinner */}
        <style>{`@keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }`}</style>
      </div>
    </div>
  );
};

export default OAuthAuthorize;
