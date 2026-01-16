/**
 * API Service for Shop Maintenance Reports
 *
 * WHY: Separating API calls from components makes them:
 * 1. Reusable - Can be called from anywhere
 * 2. Testable - Easy to mock and unit test
 * 3. Maintainable - Single place to update endpoints
 *
 * PATTERN: Each function handles one API endpoint
 */

import { convertApiResponse } from '../modules/dataConverter';

export interface FetchConfig {
  baseUrl: string;
  authToken: string;
  shopToken: string;
}

export interface ShopMaintenanceResponse {
  message: string;
  shop_info: {
    shop_name: string;
    shop_code: string;
  };
  total_users: number;
  returned_users: number;
  pagination: {
    limit: number;
    offset: number;
    has_more: boolean;
  };
  users: any[];
}

export interface RemoveUserShopResponse {
  message: string;
  strava_user_id: number | string;
  previous_shop_token?: string | null;
  updated: number;
}

/**
 * Fetches all shop users with their bikes and maintenance data
 *
 * @param config - API configuration (baseUrl, authToken, shopToken)
 * @returns Converted shop maintenance data with all users and bikes
 * @throws Error if API call fails or returns invalid data
 */
export const fetchShopMaintenanceReports = async (
  config: FetchConfig
): Promise<ShopMaintenanceResponse> => {
  const { baseUrl, authToken, shopToken } = config;

  const response = await fetch(`${baseUrl}/GetShopMaintenanceReports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth: authToken,
      shop_token: shopToken
    }) as unknown as BodyInit,
    redirect: 'follow' as RequestRedirect
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data?.message !== 'success' || !Array.isArray(data?.users)) {
    throw new Error(data?.error || 'Unexpected response from server');
  }

  // Convert API response to proper format (handles 0/1 to boolean conversion)
  return convertApiResponse(data);
};

/**
 * Fetches basic shop users list (without maintenance details).
 * Used by the family plan Manage Users modal.
 */
export const fetchShopUsers = async (
  config: FetchConfig
): Promise<any[]> => {
  const { baseUrl, authToken, shopToken } = config;

  if (!shopToken) {
    throw new Error('Missing shop_token. Please log in again.');
  }

  const response = await fetch(`${baseUrl}/getShopUsers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth: authToken,
      shop_token: shopToken,
    }) as unknown as BodyInit,
    redirect: 'follow' as RequestRedirect,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Failed to load users (HTTP ${response.status} ${errText})`);
  }

  const data = await response.json();

  if (data?.message !== 'success' || !Array.isArray(data?.users)) {
    throw new Error(data?.error || 'Unexpected response when loading users');
  }

  return data.users;
};

/**
 * Removes a user's association with the current shop.
 *
 * NOTE: This endpoint does not require auth or shop_token; it only
 * needs the Strava user id. We still use the shared baseUrl from config
 * to keep API configuration centralized.
 */
export const removeUserShop = async (
  config: FetchConfig,
  stravaUserId: number | string
): Promise<RemoveUserShopResponse> => {
  const { baseUrl } = config;
  const response = await fetch(`${baseUrl}/removeUserShop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      strava_user_id: String(stravaUserId)
    }) as unknown as BodyInit,
    redirect: 'follow' as RequestRedirect
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `Failed to remove user from shop (HTTP ${response.status} ${errText})`
    );
  }

  const data = (await response.json()) as RemoveUserShopResponse & {
    error?: string;
  };

  if (data?.message !== 'success') {
    throw new Error(data?.error || data?.message || 'Failed to remove user');
  }

  return data;
};

/**
 * Gets API configuration from environment and session storage
 */
export const getApiConfig = (): FetchConfig => {
  const baseUrl =
    process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
  const authToken =
    process.env.REACT_APP_API_AUTH_TOKEN || '1893784827439273928203838';
  const shopToken =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('shop_token') || ''
      : '';

  return { baseUrl, authToken, shopToken };
};

/**
 * Fetches shop users for family plan management
 *
 * @param config - API configuration (baseUrl, authToken, shopToken)
 * @returns List of family members
 * @throws Error if API call fails or returns invalid data
 */
export const fetchShopUsers = async (
  config: FetchConfig
): Promise<any[]> => {
  const { baseUrl, authToken, shopToken } = config;

  const response = await fetch(`${baseUrl}/getShopUsers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth: authToken,
      shop_token: shopToken
    }) as unknown as BodyInit,
    redirect: 'follow' as RequestRedirect
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data?.message !== 'success') {
    throw new Error(data?.error || 'Failed to load users');
  }

  return data.users || [];
};

/**
 * Removes a user from the bike shop (stub for now)
 *
 * @param config - API configuration
 * @param userId - ID of the user to remove
 * @throws Error if API call fails
 */
export const removeUserFromShop = async (
  config: FetchConfig,
  userId: number
): Promise<void> => {
  // TODO: Replace with actual API endpoint when backend is ready
  const stubUrl = '/api/remove-user-from-shop';
  
  console.log(`Stub API call to ${stubUrl} for user ID:`, userId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // When the real endpoint is ready, use this pattern:
  // const { baseUrl, authToken, shopToken } = config;
  // const response = await fetch(`${baseUrl}/removeShopUser`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   body: new URLSearchParams({
  //     auth: authToken,
  //     shop_token: shopToken,
  //     user_id: userId.toString()
  //   }) as unknown as BodyInit,
  //   redirect: 'follow' as RequestRedirect
  // });
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP ${response.status}`);
  // }
  //
  // const data = await response.json();
  // if (data?.message !== 'success') {
  //   throw new Error(data?.error || 'Failed to remove user');
  // }
};
