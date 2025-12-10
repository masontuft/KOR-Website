/**
 * Custom Hook: useShopMaintenance
 * 
 * WHY CUSTOM HOOKS?
 * 1. Encapsulation - All logic in one place
 * 2. Reusability - Can be used in multiple components
 * 3. Testability - Easy to test separately from UI
 * 4. Cleaner Components - Components focus only on rendering
 * 
 * PATTERN: Custom hooks start with "use" and can use other hooks inside
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MaintenanceUser, BikeState } from '../types/shopUsersAndBikes.types';
import { fetchShopMaintenanceReports, getApiConfig } from '../services/shopMaintenanceApi';

/**
 * Custom hook to manage shop maintenance data
 * 
 * WHAT IT DOES:
 * - Fetches users and bikes from API
 * - Manages loading/error states
 * - Handles bike expansion/collapse
 * - Provides search and filter functionality
 * 
 * @returns Object with state and actions
 */
export const useShopMaintenance = () => {
  // STATE: Data storage
  const [users, setUsers] = useState<MaintenanceUser[]>([]);
  const [bikesByUser, setBikesByUser] = useState<Record<string, BikeState>>({});
  
  // STATE: UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAllParts, setShowAllParts] = useState(false);
  const [allBikesExpanded, setAllBikesExpanded] = useState(false);

  /**
   * USECALLBACK: Memoizes function to prevent unnecessary re-renders
   * WHY: Function reference stays same unless dependencies change
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Reset UI states when refreshing
    setShowAllParts(false);
    setAllBikesExpanded(false);

    try {
      const config = getApiConfig();
      
      if (!config.shopToken) {
        throw new Error('Missing shop_token. Please log in again.');
      }

      // Fetch data from API
      const data = await fetchShopMaintenanceReports(config);

      // Map API response to our interface
      const mapped: MaintenanceUser[] = data.users.map((u: any) => ({
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

      // Initialize bikes state - bikes already loaded from API
      const bikesState: Record<string, BikeState> = {};
      mapped.forEach(u => {
        bikesState[String(u.strava_user_id)] = {
          loading: false,
          error: null,
          bikes: u.bikes || [],
          expanded: false
        };
      });
      setBikesByUser(bikesState);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies = function created once

  /**
   * USEEFFECT: Runs on component mount
   * WHY: We want to load data when component first renders
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Include fetchUsers in dependency array


  /**
   * Toggle bike expansion for a single user
   */
  const toggleExpand = useCallback((userId: string | number) => {
    const key = String(userId);
    setBikesByUser(prev => {
      const current = prev[key] || {
        bikes: [],
        error: null,
        loading: false,
        expanded: false
      };
      return {
        ...prev,
        [key]: { ...current, expanded: !current.expanded }
      };
    });
  }, []);

  /**
   * Expand all bikes for all users
   * Also closes the All Parts view if it's open
   */
  const expandAllBikes = useCallback(() => {
    // Close All Parts view when expanding bikes
    setShowAllParts(false);
    
    const ids = users.map(u => String(u.strava_user_id));
    
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
    setAllBikesExpanded(true);
  }, [users]);

  /**
   * Collapse all bikes for all users
   */
  const collapseAllBikes = useCallback(() => {
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
  }, [users]);

  /**
   * Toggle between expand all / collapse all
   */
  const toggleAllBikes = useCallback(() => {
    if (allBikesExpanded) {
      collapseAllBikes();
    } else {
      expandAllBikes();
    }
  }, [allBikesExpanded, expandAllBikes, collapseAllBikes]);

  /**
   * USEMEMO: Memoizes computed value
   * WHY: Only recalculate when dependencies change
   * 
   * Filters and sorts users based on search term
   */
  const filteredUsers = useMemo(() => {
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

      // Search by part names
      const partNames = [
        'chain', 'cassette', 'chainring', 'chain ring',
        'bottom bracket', 'brake', 'brake pad', 'brake rotor',
        'tire', 'fork', 'shock', 'sealant', 'dropper'
      ];
      return partNames.some(part => part.includes(term) || term.includes(part));
    });
  }, [users, search, bikesByUser]);

  /**
   * Toggle Show All Parts view
   * When toggling on, collapses all bikes
   */
  const toggleShowAllParts = useCallback(() => {
    const newShowAllParts = !showAllParts;
    setShowAllParts(newShowAllParts);
    
    // If opening All Parts view, collapse all bikes
    if (newShowAllParts && allBikesExpanded) {
      setAllBikesExpanded(false);
      // Collapse all individual bike expansions too
      const ids = users.map(u => String(u.strava_user_id));
      setBikesByUser(prev => {
        const copy = { ...prev };
        ids.forEach(id => {
          if (copy[id]) {
            copy[id] = { ...copy[id], expanded: false };
          }
        });
        return copy;
      });
    }
  }, [showAllParts, allBikesExpanded, users]);

  /**
   * RETURN: Expose state and actions to component
   * 
   * PATTERN: Return an object with everything the component needs
   */
  return {
    // Data
    users: filteredUsers,
    bikesByUser,
    
    // Loading states
    loading,
    error,
    
    // UI state
    search,
    showAllParts,
    allBikesExpanded,
    
    // Actions (functions)
    setSearch,
    setShowAllParts,
    toggleShowAllParts,
    fetchUsers,
    toggleExpand,
    toggleAllBikes,
  };
};
