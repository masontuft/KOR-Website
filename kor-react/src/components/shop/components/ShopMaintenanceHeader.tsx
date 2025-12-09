import React from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Users
} from 'lucide-react';
import {
  headerStyle,
  headerTitleStyle,
  titleTextStyle,
  controlsContainerStyle,
  searchContainerStyle,
  searchIconStyle,
  searchInputStyle,
  selectStyle,
  buttonStyle
} from '../styles/shopMaintenance.styles';

interface ShopMaintenanceHeaderProps {
  accentColor: string;
  showBikes: boolean;
  readOnlyMode: boolean;
  search: string;
  sortMode: 'wear_desc' | 'wear_asc';
  showAllParts: boolean;
  allBikesExpanded: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: 'wear_desc' | 'wear_asc') => void;
  onToggleAllParts: () => void;
  onToggleAllBikes: () => void;
  onRefresh: () => void;
}

/**
 * ShopMaintenanceHeader - The top section with title and controls
 *
 * COMPONENT BREAKDOWN:
 * - Title section (left)
 * - Controls section (right): search, sort, buttons
 */
export const ShopMaintenanceHeader: React.FC<ShopMaintenanceHeaderProps> = ({
  accentColor,
  showBikes,
  readOnlyMode,
  search,
  sortMode,
  showAllParts,
  allBikesExpanded,
  onSearchChange,
  onSortChange,
  onToggleAllParts,
  onToggleAllBikes,
  onRefresh
}) => {
  return (
    <div className='shop-header' style={headerStyle(accentColor)}>
      {/* Left: Title */}
      <div style={headerTitleStyle}>
        <Users size={20} color={accentColor} />
        <h2 style={titleTextStyle}>
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

      {/* Right: Controls */}
      <div className='shop-controls' style={controlsContainerStyle}>
        {/* Search Input */}
        <div style={searchContainerStyle}>
          <Search size={16} style={searchIconStyle} />
          <input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder='Search'
            style={searchInputStyle}
          />
        </div>

        {/* Sort Dropdown */}
        <div>
          <select
            value={sortMode}
            onChange={e =>
              onSortChange(e.target.value as 'wear_desc' | 'wear_asc')
            }
            style={selectStyle}
          >
            <option value='wear_desc'>Most Worn</option>
            <option value='wear_asc'>Least Worn</option>
          </select>
        </div>

        {/* Show All Part Wear Button */}
        <button
          onClick={onToggleAllParts}
          style={{
            ...buttonStyle('#BF4A00'), // Keep the original orange color
            fontWeight: 'normal' // Remove dynamic font weight changes
          }}
        >
          {showAllParts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showAllParts ? 'Hide All Part Wear' : 'Show All Part Wear'}
        </button>

        {/* Show/Hide All Bikes Button */}
        {showBikes && !readOnlyMode && (
          <button
            onClick={onToggleAllBikes}
            title={allBikesExpanded ? 'Hide all bikes' : 'Show all bikes'}
            style={{
              ...buttonStyle('#BF4A00'), // Keep the original orange color
              fontWeight: 'normal' // Remove dynamic font weight changes
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

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          title='Refresh users'
          style={buttonStyle(accentColor)} // Use the passed accent color
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>
    </div>
  );
};

export default ShopMaintenanceHeader;
