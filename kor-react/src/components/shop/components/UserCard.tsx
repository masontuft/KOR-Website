/**
 * UserCard Component
 * 
 * WHY SEPARATE COMPONENTS?
 * 1. Single Responsibility - This component only renders ONE user
 * 2. Reusability - Can be used in lists, grids, etc.
 * 3. Testability - Easy to test in isolation
 * 4. Performance - React can optimize re-renders better
 * 
 * PATTERN: Presentational Component (receives data via props, no business logic)
 */

import React from 'react';
import { ChevronDown, ChevronRight, Loader2, Bike } from 'lucide-react';
import { MaintenanceUser, BikeState } from '../types/shopUsersAndBikes.types';
import { formatTimeAgo, getStatusColor, getFullName, getInitial } from '../utils/shopHelpers';
import BikeWearBars from '../WearBar/BikeWearBars';
import {
  userCardStyle,
  userHeaderStyle,
  userInfoStyle,
  avatarStyle,
  userNameStyle,
  youSuffixStyle,
  userActionsStyle,
  statusBadgeStyle,
  statusDotStyle,
  statusTextStyle,
  lastLoginStyle,
  toggleBikesButtonStyle,
  bikesContainerStyle,
  bikesGridStyle,
  bikeCardStyle,
  bikeHeaderRowStyle,
  bikeIconContainerStyle,
  bikeNameStyle,
  loadingStyle,
  errorStyle,
  emptyStateStyle,
} from '../styles/shopMaintenance.styles';

interface UserCardProps {
  user: MaintenanceUser;
  bikesState: BikeState;
  accentColor: string;
  showBikes: boolean;
  readOnlyMode: boolean;
  sortMode: 'wear_desc' | 'wear_asc';
  onToggleExpand: (userId: number) => void;
  showYou?: boolean;
}

/**
 * UserCard - Displays a single user with their bikes
 * 
 * PROPS EXPLANATION:
 * - user: The user data to display
 * - bikesState: UI state for this user's bikes (expanded, loading, etc.)
 * - accentColor: Theme color for styling
 * - showBikes: Whether bike functionality is enabled
 * - readOnlyMode: Disable interactions
 * - sortMode: How to sort parts in bike wear bars
 * - onToggleExpand: Callback when user clicks to expand/collapse bikes
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  bikesState,
  accentColor,
  showBikes,
  readOnlyMode,
  sortMode,
  onToggleExpand,
  showYou = false,
}) => {
  const fullName = getFullName(user.first_name, user.last_name);
  const initial = getInitial(fullName);
  const lastLogin = formatTimeAgo(user.last_login);
  const statusColor = getStatusColor(user.shop_activity);

  return (
    <div style={userCardStyle}>
      {/* User Header */}
      <div style={userHeaderStyle}>
        {/* Left: Avatar and Name */}
        <div style={userInfoStyle}>
          <div style={avatarStyle(accentColor)}>{initial}</div>
          <div style={{ minWidth: 0, maxWidth: '100%' }}>
            <div style={userNameStyle}>
              {fullName}
              {showYou && <span style={youSuffixStyle}> (You)</span>}
            </div>
          </div>
        </div>

        {/* Right: Status, Last Login, and Bikes Button */}
        <div style={userActionsStyle}>
          {/* Status Badge */}
          <div title={`Status: ${user.shop_activity || 'unknown'}`} style={statusBadgeStyle}>
            <span style={statusDotStyle(statusColor)} />
            <span style={statusTextStyle}>{(user.shop_activity || 'unknown').toUpperCase()}</span>
          </div>

          {/* Last Login */}
          <div style={lastLoginStyle}>Last: {lastLogin}</div>

          {/* Toggle Bikes Button */}
          {showBikes && (
            <button
              onClick={() => onToggleExpand(user.strava_user_id)}
              disabled={readOnlyMode}
              style={toggleBikesButtonStyle(accentColor, readOnlyMode)}
            >
              {bikesState.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Bikes
            </button>
          )}
        </div>
      </div>

      {/* Bikes Section (when expanded) */}
      {showBikes && bikesState.expanded && (
        <div style={bikesContainerStyle}>
          {/* Loading State */}
          {bikesState.loading && (
            <div style={loadingStyle}>
              <Loader2 size={16} className="spin" /> Loading bikes...
            </div>
          )}

          {/* Error State */}
          {bikesState.error && (
            <div style={errorStyle}>Error loading bikes: {bikesState.error}</div>
          )}

          {/* Empty State */}
          {!bikesState.loading && !bikesState.error && bikesState.bikes.length === 0 && (
            <div style={emptyStateStyle}>No bikes found for this user.</div>
          )}

          {/* Bikes Grid */}
          {!bikesState.loading && !bikesState.error && bikesState.bikes.length > 0 && (
            <div className="bikes-grid" style={bikesGridStyle}>
              {bikesState.bikes.map((bike) => (
                <div key={bike.part_data.strava_bike_id} style={bikeCardStyle(accentColor)}>
                  {/* Bike Header: Icon + Name */}
                  <div style={bikeHeaderRowStyle}>
                    <div style={bikeIconContainerStyle}>
                      <Bike size={18} color="#333333" />
                    </div>
                    <div style={bikeNameStyle}>
                      {bike.part_data.strava_bike_name || 'Bike'}
                    </div>
                  </div>

                  {/* Bike Wear Bars */}
                  <BikeWearBars bike={bike} sortMode={sortMode} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
