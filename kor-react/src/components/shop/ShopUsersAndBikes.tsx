import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronRight, RefreshCcw, Users, Bike, Loader2 } from 'lucide-react';

interface ShopUserSummary {
  strava_user_id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  last_login?: string | null;
  shop_activity?: string | null; // e.g., 'active', 'inactive', 'pending'
}

interface BikeRecord {
  strava_bike_name: string;
  strava_bike_id: string;
  total_miles?: number | null;
}

interface ShopUsersAndBikesProps {
  accentColor?: string;
  readOnlyMode?: boolean; // For inactive users - disable bike loading and interactions
  showBikes?: boolean; // Whether to show bike functionality at all
}

const formatTimeAgo = (iso?: string | null): string => {
  if (!iso) return 'Never';
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return 'Unknown';
  const diffMs = Date.now() - dt.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 14) return `${d}d ago`;
  return dt.toLocaleDateString();
};

const statusHue = (status?: string | null): string => {
  switch ((status || '').toLowerCase()) {
    case 'active':
      return '#28a745';
    case 'inactive':
      return '#adb5bd';
    case 'pending':
      return '#f39c12';
    default:
      return '#6c757d';
  }
};

const badgeBg = (hex: string) => `${hex}20`;

const ShopUsersAndBikes: React.FC<ShopUsersAndBikesProps> = ({ 
  accentColor = '#667eea',
  readOnlyMode = false,
  showBikes = true
}) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
  const authToken = process.env.REACT_APP_API_AUTH_TOKEN || '1893784827439273928203838';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<ShopUserSummary[]>([]);

  // Bikes state keyed by user id
  const [bikesByUser, setBikesByUser] = useState<Record<string, { loading: boolean; error: string | null; bikes: BikeRecord[]; expanded: boolean }>>({});

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [sort, setSort] = useState<'last_login_desc' | 'last_login_asc' | 'name_asc' | 'name_desc'>('last_login_desc');

  const shopToken = typeof window !== 'undefined' ? sessionStorage.getItem('shop_token') : null;

  const fetchUsers = useCallback(async () => {
    if (!shopToken) {
      setError('Missing shop_token. Please log in again.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/getShopUsers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ auth: authToken, shop_token: shopToken }) as unknown as BodyInit,
        redirect: 'follow' as RequestRedirect
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${txt}`);
      }
      const data = await res.json();
      if (data?.message !== 'success' || !Array.isArray(data?.users)) {
        throw new Error(data?.error || 'Unexpected response');
      }
      const mapped: ShopUserSummary[] = data.users.map((u: any) => ({
        strava_user_id: u.strava_user_id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        last_login: u.last_login,
        shop_activity: u.shop_activity
      }));
      setUsers(mapped);
      // initialize bikes state
      const init: Record<string, { loading: boolean; error: string | null; bikes: BikeRecord[]; expanded: boolean }> = {};
      mapped.forEach((u) => {
        const key = String(u.strava_user_id);
        init[key] = { loading: false, error: null, bikes: [], expanded: false };
      });
      setBikesByUser(init);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken, shopToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchBikesForUser = useCallback(async (userId: string | number) => {
    const key = String(userId);
    setBikesByUser((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { bikes: [], error: null, expanded: true, loading: false }), loading: true, error: null }
    }));
    try {
      const res = await fetch(`${baseUrl}/getBikes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ strava_user_id: key }) as unknown as BodyInit,
        redirect: 'follow' as RequestRedirect
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${txt}`);
      }
      const data = await res.json();
      const bikes: BikeRecord[] = Array.isArray(data?.bikes) ? data.bikes : [];
      setBikesByUser((prev) => ({
        ...prev,
        [key]: { ...(prev[key] || { bikes: [], error: null, expanded: true, loading: false }), loading: false, bikes }
      }));
    } catch (e) {
      setBikesByUser((prev) => ({
        ...prev,
        [key]: { ...(prev[key] || { bikes: [], error: null, expanded: true, loading: false }), loading: false, error: e instanceof Error ? e.message : 'Failed to load bikes' }
      }));
    }
  }, [baseUrl]);

  const toggleExpand = useCallback((userId: string | number) => {
    // Disable bike loading in readOnlyMode
    if (readOnlyMode || !showBikes) return;
    
    const key = String(userId);
    setBikesByUser((prev) => {
      const current = prev[key] || { bikes: [], error: null, loading: false, expanded: false };
      const nextExpanded = !current.expanded;
      const next = { ...prev, [key]: { ...current, expanded: nextExpanded } };
      // If expanding and no bikes loaded yet, fetch
      if (nextExpanded && !current.loading && (!current.bikes || current.bikes.length === 0) && !current.error) {
        // fire and forget
        fetchBikesForUser(userId);
      }
      return next;
    });
  }, [fetchBikesForUser, readOnlyMode, showBikes]);

  const loadAllBikes = useCallback(async () => {
    // Disable bike loading in readOnlyMode
    if (readOnlyMode || !showBikes) return;
    
    // simple concurrency limit
    const ids = users.map(u => String(u.strava_user_id));
    const limit = 4;
    let i = 0;

    // mark all expanded
    setBikesByUser((prev) => {
      const copy = { ...prev };
      ids.forEach(id => {
        const cur = copy[id] || { bikes: [], error: null, loading: false, expanded: false };
        copy[id] = { ...cur, expanded: true };
      });
      return copy;
    });

    const runNext = async (): Promise<void> => {
      if (i >= ids.length) return;
      const id = ids[i++];
      await fetchBikesForUser(id);
      return runNext();
    };

    const workers = Array.from({ length: Math.min(limit, ids.length) }, () => runNext());
    await Promise.all(workers);
  }, [users, fetchBikesForUser, readOnlyMode, showBikes]);

  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = users.filter(u => {
      const statusOk = statusFilter === 'all' || (u.shop_activity || '').toLowerCase() === statusFilter;
      const text = `${u.first_name} ${u.last_name}`.toLowerCase();
      const textOk = !term || text.includes(term);
      return statusOk && textOk;
    });

    switch (sort) {
      case 'name_asc':
        list = list.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
        break;
      case 'name_desc':
        list = list.sort((a, b) => `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`));
        break;
      case 'last_login_asc':
        list = list.sort((a, b) => new Date(a.last_login || 0).getTime() - new Date(b.last_login || 0).getTime());
        break;
      case 'last_login_desc':
      default:
        list = list.sort((a, b) => new Date(b.last_login || 0).getTime() - new Date(a.last_login || 0).getTime());
        break;
    }
    return list;
  }, [users, search, statusFilter, sort]);

  return (
    <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginTop: '2rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #eee', background: badgeBg(accentColor) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={20} color={accentColor} />
          <h2 style={{ margin: 0, color: '#333' }}>
            {showBikes ? 'Customers & Bikes' : 'Customers'}
            {readOnlyMode && <span style={{ fontSize: '0.8rem', color: '#856404', marginLeft: '0.5rem' }}>(Read Only)</span>}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#888' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name"
              style={{ padding: '8px 10px 8px 30px', border: '1px solid #ddd', borderRadius: 8, outline: 'none', minWidth: 220 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#666', marginRight: 6 }}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: 8 }}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#666', marginRight: 6 }}>Sort</label>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: 8 }}>
              <option value="last_login_desc">Last login (newest)</option>
              <option value="last_login_asc">Last login (oldest)</option>
              <option value="name_asc">Name (A→Z)</option>
              <option value="name_desc">Name (Z→A)</option>
            </select>
          </div>
          <button
            onClick={() => fetchUsers()}
            title="Refresh users"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: accentColor, color: 'white', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
          {showBikes && !readOnlyMode && (
            <button
              onClick={() => loadAllBikes()}
              title="Load bikes for all users"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#333', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
            >
              <Bike size={16} /> Load All Bikes
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '1rem 1.25rem' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#666' }}>
            <Loader2 size={18} className="spin" /> Loading users...
          </div>
        )}
        {error && (
          <div style={{ color: '#e74c3c', marginBottom: '1rem' }}>Error loading users: {error}</div>
        )}

        {!loading && !error && filteredSorted.length === 0 && (
          <div style={{ color: '#666' }}>No users found.</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredSorted.map((u) => {
            const key = String(u.strava_user_id);
            const bikesState = bikesByUser[key] || { bikes: [], loading: false, error: null, expanded: false };
            const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Unnamed User';
            const lastLogin = formatTimeAgo(u.last_login);

            return (
              <div key={key} style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', background: 'white' }}>
                <div style={{ padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f1f1', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 auto' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: badgeBg(accentColor), color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flex: '0 0 auto' }}>
                      {fullName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={{ minWidth: 0, maxWidth: '100%' }}>
                      <div style={{ fontWeight: 600, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fullName}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 1 auto', flexWrap: 'wrap', justifyContent: 'flex-end', minWidth: 180 }}>
                    <div title={`Status: ${u.shop_activity || 'unknown'}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: statusHue(u.shop_activity) }} />
                      <span style={{ fontSize: 12, color: '#666' }}>{(u.shop_activity || 'unknown').toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>Last: {lastLogin}</div>
                    {showBikes && (
                      <button
                        onClick={() => toggleExpand(u.strava_user_id)}
                        disabled={readOnlyMode}
                        style={{ 
                          border: `1px solid ${readOnlyMode ? '#ccc' : accentColor}`, 
                          background: 'transparent', 
                          color: readOnlyMode ? '#999' : accentColor, 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: 6, 
                          padding: '6px 10px', 
                          borderRadius: 8, 
                          cursor: readOnlyMode ? 'not-allowed' : 'pointer',
                          opacity: readOnlyMode ? 0.6 : 1
                        }}
                      >
                        {bikesState.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Bikes
                      </button>
                    )}
                  </div>
                </div>

                {showBikes && bikesState.expanded && (
                  <div style={{ padding: '0.8rem 1rem' }}>
                    {bikesState.loading && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666' }}>
                        <Loader2 size={16} className="spin" /> Loading bikes...
                      </div>
                    )}
                    {bikesState.error && (
                      <div style={{ color: '#e74c3c' }}>Error loading bikes: {bikesState.error}</div>
                    )}
                    {!bikesState.loading && !bikesState.error && bikesState.bikes.length === 0 && (
                      <div style={{ color: '#666' }}>No bikes found for this user.</div>
                    )}
                    {!bikesState.loading && !bikesState.error && bikesState.bikes.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                        {bikesState.bikes.map((b) => (
                          <div key={b.strava_bike_id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.75rem', display: 'flex', alignItems: 'center', gap: 10, background: '#fafafa' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: badgeBg(accentColor), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Bike size={18} color={accentColor} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, color: '#333', marginBottom: 2 }}>{b.strava_bike_name || 'Bike'}</div>
                              <div style={{ fontSize: 12, color: '#666' }}>Miles: {Math.round((b.total_miles || 0) * 10) / 10}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>
        {`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
};

export default ShopUsersAndBikes;
