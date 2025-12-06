import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  RefreshCcw,
  Users,
  Bike,
  Loader2
} from 'lucide-react';
import BikeWearBars from './WearBar/BikeWearBars';
import AllPartsWear from './WearBar/AllPartsWear';
import fakeData from './fakeShopUsers.json'; // Your mock JSON for development
import { convertApiResponse, convertShopUsers } from './modules/dataConverter';

// Full JSON types
interface PartData {
  id: number;
  bike_brand_and_model: string;
  strava_user_id: number;
  strava_bike_id: string;
  strava_bike_name: string;
  total_miles: number;
  new_chain_mile_marker: number;
  new_cassette_mile_marker: number;
  new_chain_ring_mile_marker: number;
  new_bottom_bracket_mile_marker: number;
  brake_bleed_mile_marker: number;
  new_brake_pads_mile_marker: number;
  new_brake_rotors_mile_marker: number;
  new_tires_mile_marker: number;
  front_fork_mile_marker: number;
  rear_shock_mile_marker: number;
  sealant_hour_marker: number;
  created_at: string;
  updated_at: string;
  chain_used_miles: number;
  chain_ring_used_miles: number;
  cassette_used_miles: number;
  front_fork_used_miles: number;
  rear_shock_used_miles: number;
  bottom_bracket_used_miles: number;
  brake_bleed_used_miles: number;
  brake_pads_used_miles: number;
  brake_rotors_used_miles: number;
  tires_used_miles: number;
  dropper_used_miles: number;
  sealant_used_hours: number;
  new_chain_date: string;
  new_chain_ring_date: string;
  new_cassette_date: string;
  front_fork_service_date: string;
  rear_shock_service_date: string;
  new_bottom_bracket_date: string;
  brake_bleed_date: string;
  new_brake_pads_date: string;
  new_brake_rotors_date: string;
  new_tires_date: string;
  dropper_service_date: string;
  sealant_refresh_date: string;
  sealant_show: boolean;
  rear_suspension_show: boolean;
  dropper_show: boolean;
  front_fork_show: boolean;
  AXS_show: boolean;
  brake_pads_show: boolean;
  brake_bleed_show: boolean;
  brake_rotors_show: boolean;
  dropper_mile_marker: number;
}

interface ServicePeriods {
  id: number;
  strava_bike_id: string;
  chain_miles: number;
  cassette_miles: number;
  front_fork_miles: number;
  rear_shock_miles: number;
  chain_ring_miles: number;
  bottom_bracket_miles: number;
  sealant_refresh_hours: number;
  brake_bleed_miles: number;
  brake_pads_miles: number;
  brake_rotors_miles: number;
  tires_miles: number;
  dropper_miles: number;
  created_at: string;
  chain_type: string;
  cassette_type: string;
}

interface Bike {
  part_data: PartData;
  service_periods: ServicePeriods;
}

interface ShopUser {
  strava_user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string;
  shop_activity: string | null; // convert number -> string
  bike_count: number;
  bikes: Bike[];
}

interface ShopUsersAndBikesProps {
  accentColor?: string;
  readOnlyMode?: boolean;
  showBikes?: boolean;
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
  const baseUrl =
    process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
  const authToken =
    process.env.REACT_APP_API_AUTH_TOKEN || '1893784827439273928203838';
  const shopToken =
    typeof window !== 'undefined' ? sessionStorage.getItem('shop_token') : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<ShopUser[]>([]);
  const [bikesByUser, setBikesByUser] = useState<
    Record<
      string,
      {
        loading: boolean;
        error: string | null;
        bikes: Bike[];
        expanded: boolean;
      }
    >
  >({});
  const [showAllParts, setShowAllParts] = useState(false);
  const [allBikesExpanded, setAllBikesExpanded] = useState(false);

  const [search, setSearch] = useState('');
  // Sort mode controls how parts are ordered in the bike view and all-parts view
  const [sort, setSort] = useState<'wear_desc' | 'wear_asc'>('wear_desc');

  const fetchUsers = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      // Use fake data in dev and convert boolean fields from 0/1 to true/false
      const mapped = convertShopUsers(fakeData.users as any) as ShopUser[];
      setUsers(mapped);

      const init: Record<
        string,
        {
          loading: boolean;
          error: string | null;
          bikes: Bike[];
          expanded: boolean;
        }
      > = {};
      mapped.forEach(u => {
        init[String(u.strava_user_id)] = {
          loading: false,
          error: null,
          bikes: u.bikes || [],
          expanded: false
        };
      });
      setBikesByUser(init);
      return;
    }

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
        body: new URLSearchParams({
          auth: authToken,
          shop_token: shopToken
        }) as unknown as BodyInit,
        redirect: 'follow' as RequestRedirect
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.message !== 'success' || !Array.isArray(data?.users))
        throw new Error(data?.error || 'Unexpected response');

      // Convert API response and map to ShopUser format
      const convertedData = convertApiResponse(data);
      const mapped: ShopUser[] = convertedData.users.map((u: any) => ({
        strava_user_id: u.strava_user_id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        last_login: u.last_login,
        shop_activity: u.shop_activity,
        bike_count: u.bike_count,
        bikes: u.bikes || []
      }));
      setUsers(mapped);

      const init: Record<
        string,
        {
          loading: boolean;
          error: string | null;
          bikes: Bike[];
          expanded: boolean;
        }
      > = {};
      mapped.forEach(u => {
        init[String(u.strava_user_id)] = {
          loading: false,
          error: null,
          bikes: u.bikes || [],
          expanded: false
        };
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

  const fetchBikesForUser = useCallback(
    async (userId: string | number) => {
      const key = String(userId);

      if (process.env.NODE_ENV === 'development') return; // Already loaded in dev

      setBikesByUser(prev => ({
        ...prev,
        [key]: {
          ...(prev[key] || {
            bikes: [],
            error: null,
            expanded: true,
            loading: false
          }),
          loading: true,
          error: null
        }
      }));

      try {
        const res = await fetch(`${baseUrl}/getBikes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            strava_user_id: key
          }) as unknown as BodyInit,
          redirect: 'follow' as RequestRedirect
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const convertedData = convertApiResponse(data);
        const bikes: Bike[] = Array.isArray(convertedData?.bikes)
          ? convertedData.bikes
          : [];

        setBikesByUser(prev => ({
          ...prev,
          [key]: {
            ...(prev[key] || {
              bikes: [],
              error: null,
              expanded: true,
              loading: false
            }),
            loading: false,
            bikes
          }
        }));
      } catch (e) {
        setBikesByUser(prev => ({
          ...prev,
          [key]: {
            ...(prev[key] || {
              bikes: [],
              error: null,
              expanded: true,
              loading: false
            }),
            loading: false,
            error: e instanceof Error ? e.message : 'Failed to load bikes'
          }
        }));
      }
    },
    [baseUrl]
  );

  const toggleExpand = useCallback(
    (userId: string | number) => {
      if (readOnlyMode || !showBikes) return;

      const key = String(userId);
      setBikesByUser(prev => {
        const current = prev[key] || {
          bikes: [],
          error: null,
          loading: false,
          expanded: false
        };
        const nextExpanded = !current.expanded;
        const next = { ...prev, [key]: { ...current, expanded: nextExpanded } };
        if (
          nextExpanded &&
          !current.loading &&
          (!current.bikes || current.bikes.length === 0) &&
          !current.error
        ) {
          fetchBikesForUser(userId);
        }
        return next;
      });
    },
    [fetchBikesForUser, readOnlyMode, showBikes]
  );

  const loadAllBikes = useCallback(async () => {
    if (readOnlyMode || !showBikes) return;
    const ids = users.map(u => String(u.strava_user_id));
    const limit = 4;
    let i = 0;

    setBikesByUser(prev => {
      const copy = { ...prev };
      ids.forEach(id => {
        const cur = copy[id] || {
          bikes: [],
          error: null,
          loading: false,
          expanded: false
        };
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

    const workers = Array.from({ length: Math.min(limit, ids.length) }, () =>
      runNext()
    );
    await Promise.all(workers);
    setAllBikesExpanded(true);
  }, [users, fetchBikesForUser, readOnlyMode, showBikes]);

  const hideAllBikes = useCallback(() => {
    if (readOnlyMode || !showBikes) return;
    const ids = users.map(u => String(u.strava_user_id));

    setBikesByUser(prev => {
      const copy = { ...prev };
      ids.forEach(id => {
        const cur = copy[id];
        if (cur) {
          copy[id] = { ...cur, expanded: false };
        }
      });
      return copy;
    });
    setAllBikesExpanded(false);
  }, [users, readOnlyMode, showBikes]);

  const toggleAllBikes = useCallback(() => {
    if (allBikesExpanded) {
      hideAllBikes();
    } else {
      // Close the All Part Wear view when showing all bikes
      if (showAllParts) {
        setShowAllParts(false);
      }
      loadAllBikes();
    }
  }, [allBikesExpanded, hideAllBikes, loadAllBikes, showAllParts]);

  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    
    return users.filter(u => {
      // Search by user name
      const userName = `${u.first_name} ${u.last_name}`.toLowerCase();
      if (userName.includes(term)) return true;
      
      // Search by bike names
      const key = String(u.strava_user_id);
      const userBikes = bikesByUser[key]?.bikes || [];
      const hasBikeNameMatch = userBikes.some(bike => 
        bike.part_data.strava_bike_name?.toLowerCase().includes(term)
      );
      if (hasBikeNameMatch) return true;
      
      // Search by part names (chain, cassette, brakes, etc.)
      const partNames = [
        'chain', 'cassette', 'chainring', 'chain ring',
        'bottom bracket', 'brake', 'brake pad', 'brake rotor',
        'tire', 'fork', 'shock', 'sealant', 'dropper'
      ];
      const hasPartMatch = partNames.some(part => part.includes(term) || term.includes(part));
      
      return hasPartMatch;
    });
  }, [users, search, bikesByUser]);

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '2rem',
        overflow: 'hidden'
      }}
    >
      <div
        className='shop-header'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #eee',
          background: badgeBg(accentColor)
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={20} color={accentColor} />
          <h2 style={{ margin: 0, color: '#333' }}>
            {showBikes ? 'Family Members & Bikes' : 'Customers'}
            {readOnlyMode && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#856404',
                  marginLeft: '0.5rem'
                }}
              >
                (Read Only)
              </span>
            )}
          </h2>
        </div>
        <div
          className='shop-controls'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#888'
              }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search'
              style={{
                padding: '8px 10px 8px 30px',
                border: '1px solid #ddd',
                borderRadius: 8,
                outline: 'none',
                minWidth: 220
              }}
            />
          </div>
          <div>
            <select
              value={sort}
              onChange={e =>
                setSort(e.target.value as 'wear_desc' | 'wear_asc')
              }
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: 8
              }}
            >
              <option value='wear_desc'>Most Worn</option>
              <option value='wear_asc'>Least Worn</option>
            </select>
          </div>
          <button
            onClick={() => {
              setShowAllParts(!showAllParts);
              // Reset the Show All Bikes button when opening All Part Wear view
              if (!showAllParts) {
                setAllBikesExpanded(false);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#BF4A00',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            {showAllParts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showAllParts ? 'Hide All Part Wear' : 'Show All Part Wear'}
          </button>
          {showBikes && !readOnlyMode && (
            <button
              onClick={toggleAllBikes}
              title={allBikesExpanded ? 'Hide all bikes' : 'Show all bikes'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#BF4A00',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              {allBikesExpanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              {allBikesExpanded ? 'Hide All Bikes' : 'Show All Bikes'}
            </button>
          )}
          <button
            onClick={() => fetchUsers()}
            title='Refresh users'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: accentColor,
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: '1rem 1.25rem' }}>
        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#666'
            }}
          >
            <Loader2 size={18} className='spin' /> Loading users...
          </div>
        )}
        {error && (
          <div style={{ color: '#e74c3c', marginBottom: '1rem' }}>
            Error loading users: {error}
          </div>
        )}

        {!loading && !error && filteredSorted.length === 0 && (
          <div style={{ color: '#666' }}>No users found.</div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem'
          }}
        >
          <div style={{ width: '90%', maxWidth: 1000, margin: '0 auto' }}>
            <AllPartsWear
              filteredUsers={filteredSorted}
              bikesByUser={bikesByUser}
              showAllParts={showAllParts}
              sortMode={sort}
            />
          </div>

          {!showAllParts &&
            filteredSorted.map(u => {
              const key = String(u.strava_user_id);
              const bikesState = bikesByUser[key] || {
                bikes: [],
                loading: false,
                error: null,
                expanded: false
              };
              const fullName =
                `${u.first_name || ''} ${u.last_name || ''}`.trim() ||
                'Unnamed User';
              const lastLogin = formatTimeAgo(u.last_login);

              return (
                <div
                  key={key}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: 'white'
                  }}
                >
                  <div
                    style={{
                      padding: '0.9rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f1f1f1',
                      flexWrap: 'wrap',
                      gap: 8
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        minWidth: 0,
                        flex: '1 1 auto'
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: badgeBg(accentColor),
                          color: accentColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          flex: '0 0 auto'
                        }}
                      >
                        {fullName.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div style={{ minWidth: 0, maxWidth: '100%' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: '#333',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {fullName}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        flex: '0 1 auto',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                        minWidth: 180
                      }}
                    >
                      <div
                        title={`Status: ${u.shop_activity || 'unknown'}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: statusHue(u.shop_activity)
                          }}
                        />
                        <span style={{ fontSize: 12, color: '#666' }}>
                          {(u.shop_activity || 'unknown').toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        Last: {lastLogin}
                      </div>
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
                          {bikesState.expanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}{' '}
                          Bikes
                        </button>
                      )}
                    </div>
                  </div>

                  {showBikes && bikesState.expanded && (
                    <div style={{ padding: '0.8rem 1rem' }}>
                      {bikesState.loading && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#666'
                          }}
                        >
                          <Loader2 size={16} className='spin' /> Loading
                          bikes...
                        </div>
                      )}
                      {bikesState.error && (
                        <div style={{ color: '#e74c3c' }}>
                          Error loading bikes: {bikesState.error}
                        </div>
                      )}
                      {!bikesState.loading &&
                        !bikesState.error &&
                        bikesState.bikes.length === 0 && (
                          <div style={{ color: '#666' }}>
                            No bikes found for this user.
                          </div>
                        )}
                      {!bikesState.loading &&
                        !bikesState.error &&
                        bikesState.bikes.length > 0 && (
                          <div
                            className='bikes-grid'
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: 10
                            }}
                          >
                            {bikesState.bikes.map(b => (
                              <div
                                key={b.part_data.strava_bike_id}
                                style={{
                                  border: '1px solid #eee',
                                  borderRadius: 8,
                                  padding: '0.75rem',
                                  display: 'flex',
                                  flexDirection: 'column', // Stack icon+name and wear bars vertically
                                  gap: 10,
                                  background: '#fafafa'
                                }}
                              >
                                {/* Top row: bike icon + name */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: 8,
                                      background: '#8FB779',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <Bike size={18} color='#333333' />
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      color: '#000000',
                                      fontSize: 22
                                    }}
                                  >
                                    {b.part_data.strava_bike_name || 'Bike'}
                                  </div>
                                </div>

                                {/* Wear bars */}
                                <BikeWearBars bike={b} sortMode={sort} />
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
          
          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .shop-header {
              flex-direction: column;
              align-items: flex-start !important;
              gap: 1rem;
            }
            
            .shop-controls {
              width: 100%;
              flex-direction: column;
              align-items: stretch !important;
            }
            
            .shop-controls > * {
              width: 100%;
            }
            
            .shop-controls input {
              width: 100% !important;
              min-width: unset !important;
              box-sizing: border-box;
            }
            
            .shop-controls button {
              width: 100%;
              justify-content: center;
              font-size: 16px;
            }
            
            .shop-controls > div {
              width: 100%;
            }
            
            .shop-controls select {
              width: 100%;
            }
            
            .bikes-grid {
              grid-template-columns: 1fr !important;
            }
          }
          `}
      </style>
    </div>
  );
};

export default ShopUsersAndBikes;
