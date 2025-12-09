/**
 * ShopMaintenanceView - REFACTORED Main Component
 *
 * BEFORE: 900+ lines of mixed logic, styles, and rendering
 * AFTER: ~150 lines focused ONLY on composition and rendering
 *
 * KEY IMPROVEMENTS:
 * 1. All logic moved to useShopMaintenance hook
 * 2. All styles moved to styles file
 * 3. UI broken into sub-components (Header, UserCard)
 * 4. Clear separation of concerns
 *
 * PATTERN: Container Component
 * - Manages state via custom hook
 * - Composes UI from sub-components
 * - Passes data down via props
 */

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useShopMaintenance } from './hooks/useShopMaintenance';
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
  const {
    users,
    bikesByUser,
    loading,
    error,
    search,
    showAllParts,
    allBikesExpanded,
    setSearch,
    toggleShowAllParts,
    fetchUsers,
    toggleExpand,
    toggleAllBikes
  } = useShopMaintenance();

  // Local UI state (doesn't need to be in hook)
  const [sortMode, setSortMode] = useState<SortMode>('wear_desc');

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
