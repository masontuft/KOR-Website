import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader2 } from 'lucide-react';
import { useShopMaintenance } from './hooks/useShopMaintenance';
import { fetchShopUsers, getApiConfig } from './services/shopMaintenanceApi';
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
  // Get all state and actions from our custom hook
  const { user: auth0User } = useAuth0();

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAdminUpdated = () => {
      setAdminUserId(getAdminUserId());
    };

    window.addEventListener(FAMILY_PLAN_EVENTS.ADMIN_UPDATED, handleAdminUpdated);
    return () => window.removeEventListener(FAMILY_PLAN_EVENTS.ADMIN_UPDATED, handleAdminUpdated);
  }, []);

  const auth0EmailRaw =
    typeof auth0User?.email === 'string'
      ? auth0User.email
      : typeof (auth0User as any)?.name === 'string'
        ? (auth0User as any).name
        : null;

  const auth0Email =
    typeof auth0EmailRaw === 'string' && auth0EmailRaw.includes('@')
      ? auth0EmailRaw
      : null;

  // Resolve the currently logged-in user's Strava user id.
  // NOTE: Some endpoints may not include email; if so, we fall back to `getShopUsers`.
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveCurrentUserId = async () => {
      if (!auth0Email) {
        if (!cancelled) setCurrentUserId(null);
        return;
      }

      // 1) Best case: maintenance report users include email
      const directMatch = allUsers.find(
        u => (u.email || '').toLowerCase() === auth0Email.toLowerCase()
      );
      if (directMatch?.strava_user_id != null) {
        const parsed = Number((directMatch as any).strava_user_id);
        if (!cancelled) setCurrentUserId(Number.isFinite(parsed) ? parsed : null);
        return;
      }

      // 2) Fallback: fetch shop users list (includes email) to identify the viewer
      try {
        const config = getApiConfig();
        const shopUsers = await fetchShopUsers(config);
        const match = shopUsers.find(
          (u: any) => (u?.email || '').toLowerCase() === auth0Email.toLowerCase()
        );
        const parsed = match?.strava_user_id != null ? Number(match.strava_user_id) : NaN;
        if (!cancelled) setCurrentUserId(Number.isFinite(parsed) ? parsed : null);
      } catch {
        if (!cancelled) setCurrentUserId(null);
      }
    };

    resolveCurrentUserId();

    return () => {
      cancelled = true;
    };
  }, [allUsers, auth0Email]);

  // If no admin has been selected yet, default to the current viewer.
  // This ensures admin-only UI shows up immediately for the shop owner without requiring a modal selection.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (adminUserId != null) return;
    if (currentUserId == null) return;

    saveAdminUserId(currentUserId);
    setAdminUserId(currentUserId);
  }, [adminUserId, currentUserId]);

  // Soft-auth fallback: if we cannot resolve the viewer's Strava id (Auth0 not hydrated / blocked),
  // assume the viewer is the admin for UI labeling purposes.
  const viewerIsAdmin =
    adminUserId != null && (currentUserId == null || adminUserId === currentUserId);

  // Final fallback: if no admin is selected and we have users loaded, default to the first user.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (adminUserId != null) return;
    if (allUsers.length === 0) return;

    const fallbackAdminId = Number((allUsers[0] as any).strava_user_id);
    if (!Number.isFinite(fallbackAdminId)) return;

    saveAdminUserId(fallbackAdminId);
    setAdminUserId(fallbackAdminId);
  }, [adminUserId, allUsers]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    // eslint-disable-next-line no-console
    console.debug('[ShopMaintenanceView] admin label state', {
      auth0Email,
      adminUserId,
      currentUserId,
      viewerIsAdmin,
    });
  }, [auth0Email, adminUserId, currentUserId, viewerIsAdmin]);

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
