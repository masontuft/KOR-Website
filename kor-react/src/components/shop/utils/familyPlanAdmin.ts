/**
 * Utility functions for Family Plan Admin management
 * 
 * Centralizes logic for reading/writing admin ID to sessionStorage
 * and dispatching admin update events.
 */

import { FAMILY_PLAN_STORAGE_KEYS, FAMILY_PLAN_EVENTS } from '../constants/familyPlan';

/**
 * Reads the admin user ID from sessionStorage
 * @returns Admin user ID as a number, or null if not set or invalid
 */
export const getAdminUserId = (): number | null => {
  if (typeof window === 'undefined') return null;
  
  const raw = sessionStorage.getItem(FAMILY_PLAN_STORAGE_KEYS.ADMIN_ID);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Sets the admin user ID in sessionStorage and dispatches update event
 * @param userId - The user ID to set as admin
 */
export const setAdminUserId = (userId: number): void => {
  if (typeof window === 'undefined') return;
  
  sessionStorage.setItem(FAMILY_PLAN_STORAGE_KEYS.ADMIN_ID, String(userId));
  window.dispatchEvent(new Event(FAMILY_PLAN_EVENTS.ADMIN_UPDATED));
};

/**
 * Clears the admin user ID from sessionStorage and dispatches update event
 */
export const clearAdminUserId = (): void => {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem(FAMILY_PLAN_STORAGE_KEYS.ADMIN_ID);
  window.dispatchEvent(new Event(FAMILY_PLAN_EVENTS.ADMIN_UPDATED));
};
