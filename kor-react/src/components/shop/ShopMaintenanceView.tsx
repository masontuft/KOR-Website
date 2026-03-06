import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useShopMaintenance } from './hooks/useShopMaintenance';
import { getShopHead, getApiConfig } from './services/shopMaintenanceApi';
import { FAMILY_PLAN_EVENTS } from './constants/familyPlan';
import {
  getAdminUserId,
  setAdminUserId as saveAdminUserId
} from './utils/familyPlanAdmin';
import {
  ShopUsersAndBikesProps,
  SortMode
} from './types/shopUsersAndBikes.types';
import ShopMaintenanceHeader from './components/ShopMaintenanceHeader';
import UserCard from './components/UserCard';
import AllPartsWear from './WearBar/AllPartsWear';
import {
  containerStyle,
  contentStyle,
  gridStyle,
  loadingStyle,
  errorStyle,
  emptyStateStyle,
  responsiveCSS
} from './styles/shopMaintenance.styles';

/**
 * Main Component - Family Members & Bikes Dashboard
 *
 * RESPONSIBILITIES:
 * 1. Get data from hook
 * 2. Manage local UI state (sort mode)
 * 3. Render sub-components
 */
const ShopMaintenanceView: React.FC<ShopUsersAndBikesProps> = ({
  accentColor = '#667eea',
  readOnlyMode = false,
  showBikes = true
}) => {
  const {
    users,
    allUsers,
    bikesByUser,
    loading,
    error,
    search,
    showAllParts,
    allBikesExpanded,
    actionError,
    setSearch,
    toggleShowAllParts,
    fetchUsers,
    toggleExpand,
    toggleAllBikes,
  } = useShopMaintenance();

  // Local UI state (doesn't need to be in hook)
  const [sortMode, setSortMode] = useState<SortMode>('wear_desc');

  const [adminUserId, setAdminUserId] = useState<number | null>(getAdminUserId);
  // useRef so the fetch-once guard doesn't trigger a re-render
  const shopHeadFetchedRef = useRef(false);

  // Fetch the server-stored admin once allUsers loads — shop_token is confirmed
  // available at this point since fetchUsers already used it.
  useEffect(() => {
    if (shopHeadFetchedRef.current || allUsers.length === 0) return;

    shopHeadFetchedRef.current = true;

    getShopHead(getApiConfig())
      .then(head => {
        if (head != null) {
          saveAdminUserId(head.strava_user_id);
          setAdminUserId(head.strava_user_id);
        }
      })
      .catch(err => console.error('[ShopMaintenanceView] getShopHead failed:', err));
  }, [allUsers]);

  // Keep in sync when admin changes via the Manage Users modal.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAdminUpdated = () => {
      setAdminUserId(getAdminUserId());
    };

    window.addEventListener(FAMILY_PLAN_EVENTS.ADMIN_UPDATED, handleAdminUpdated);
    return () => window.removeEventListener(FAMILY_PLAN_EVENTS.ADMIN_UPDATED, handleAdminUpdated);
  }, []);

  // Admin indicators show for whoever has head=1 in the DB — no email matching needed.
  const viewerIsAdmin = adminUserId != null;

  /**
   * RENDERING: Clean and focused
   * Each section is clearly separated
   */
  return (
    <div style={containerStyle}>
      {/* Header with all controls */}
      <ShopMaintenanceHeader
        accentColor={accentColor}
        showBikes={showBikes}
        readOnlyMode={readOnlyMode}
        search={search}
        sortMode={sortMode}
        showAllParts={showAllParts}
        allBikesExpanded={allBikesExpanded}
        onSearchChange={setSearch}
        onSortChange={setSortMode}
        onToggleAllParts={toggleShowAllParts}
        onToggleAllBikes={toggleAllBikes}
        onRefresh={fetchUsers}
      />

      {/* Main Content */}
      <div style={contentStyle}>
        {/* Loading State */}
        {loading && (
          <div style={loadingStyle}>
            <Loader2 size={18} className='spin' /> Loading users...
          </div>
        )}

        {/* Error State */}
        {error && <div style={errorStyle}>Error loading users: {error}</div>}

        {/* Action Error State (e.g., failed remove) */}
        {actionError && (
          <div style={{ ...errorStyle, marginTop: error ? '0.5rem' : 0 }}>
            {actionError}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && users.length === 0 && (
          <div style={emptyStateStyle}>No users found.</div>
        )}

        {/* Data Loaded Successfully */}
        {!loading && !error && users.length > 0 && (
          <div style={gridStyle}>
            {/* All Parts Wear View (optional, toggle on/off) */}
            <div style={{ width: '90%', maxWidth: 1000, margin: '0 auto' }}>
              <AllPartsWear
                filteredUsers={users}
                bikesByUser={bikesByUser}
                showAllParts={showAllParts}
                sortMode={sortMode}
                adminUserId={adminUserId}
                viewerIsAdmin={viewerIsAdmin}
              />
            </div>

            {/* User Cards (hidden when showing all parts) */}
            {!showAllParts &&
              users.map(user => {
                const key = String(user.strava_user_id);
                const bikesState = bikesByUser[key] || {
                  bikes: [],
                  loading: false,
                  error: null,
                  expanded: false
                };

                const isAdminUser = adminUserId != null && user.strava_user_id === adminUserId;
                const showYou = viewerIsAdmin && isAdminUser;

                return (
                  <UserCard
                    key={key}
                    user={user}
                    bikesState={bikesState}
                    accentColor={accentColor}
                    showBikes={showBikes}
                    readOnlyMode={readOnlyMode}
                    sortMode={sortMode}
                    onToggleExpand={toggleExpand}
                    showYou={showYou}
                  />
                );
              })}
          </div>
        )}
      </div>

      {/* Responsive CSS */}
      <style>{responsiveCSS}</style>
    </div>
  );
};

export default ShopMaintenanceView;
