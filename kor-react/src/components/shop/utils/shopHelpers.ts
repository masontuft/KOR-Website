/**
 * Utility Functions for Shop Components
 * 
 * WHY: Reusable helper functions that don't depend on React state or props
 * These are pure functions - same input always produces same output
 */

/**
 * Formats an ISO date string into a human-readable "time ago" format
 * 
 * @param iso - ISO date string or null
 * @returns Human-readable time string (e.g., "2h ago", "3d ago")
 * 
 * EXAMPLE:
 * formatTimeAgo("2024-12-06T18:00:00.000Z") -> "2h ago"
 */
export const formatTimeAgo = (iso?: string | null): string => {
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

/**
 * Returns a color code based on user activity status
 * 
 * @param status - User activity status string
 * @returns Hex color code
 * 
 * PATTERN: Using a switch statement makes it easy to add new statuses
 */
export const getStatusColor = (status?: string | null): string => {
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

/**
 * Creates a semi-transparent background color from a hex color
 * 
 * @param hex - Hex color code (e.g., "#667eea")
 * @returns Hex color with 20% opacity (e.g., "#667eea20")
 * 
 * WHY: Consistent way to create subtle backgrounds throughout the app
 */
export const createBadgeBackground = (hex: string): string => {
  return `${hex}20`;
};

/**
 * Gets the full name from first and last name with fallback
 * 
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Full name or "Unnamed User" if both are empty
 */
export const getFullName = (firstName: string, lastName: string): string => {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  return fullName || 'Unnamed User';
};

/**
 * Gets the first letter of a name for avatar initial
 * 
 * @param name - Full name string
 * @returns First letter uppercased, or 'U' as fallback
 */
export const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase() || 'U';
};
