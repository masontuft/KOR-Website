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

const FORM_ENCODED = 'application/x-www-form-urlencoded';

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

/** Shape of a user returned by /getShopUsers */
export interface ShopUser {
  strava_user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface RemoveUserShopResponse {
  message: string;
  strava_user_id: number | string;
  previous_shop_token?: string | null;
  updated: number;
  error?: string;
}

export interface SetUserHeadResponse {
  message: string;
  strava_user_id: number | string;
  error?: string;
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
    headers: { 'Content-Type': FORM_ENCODED },
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
): Promise<ShopUser[]> => {
  const { baseUrl, authToken, shopToken } = config;

  if (!shopToken) {
    throw new Error('Missing shop_token. Please log in again.');
  }

  const response = await fetch(`${baseUrl}/getShopUsers`, {
    method: 'POST',
    headers: { 'Content-Type': FORM_ENCODED },
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

  return data.users as ShopUser[];
};

/**
 * Removes a user's association with the current shop.
 *
 * NOTE: Only `baseUrl` is used from config — this endpoint requires only
 * the Strava user id, not auth or shop_token.
 */
export const removeUserShop = async (
  config: FetchConfig,
  stravaUserId: number | string
): Promise<RemoveUserShopResponse> => {
  const { baseUrl } = config;
  const response = await fetch(`${baseUrl}/removeUserShop`, {
    method: 'POST',
    headers: { 'Content-Type': FORM_ENCODED },
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

  const data = (await response.json()) as RemoveUserShopResponse;

  if (data?.message !== 'success') {
    throw new Error(data?.error || data?.message || 'Failed to remove user');
  }

  return data;
};

/**
 * Sets a user as the head/admin of the family plan.
 *
 * @param config - API configuration (baseUrl is used)
 * @param stravaUserId - Strava user ID of the user to set as admin
 * @returns Response indicating success
 * @throws Error if API call fails
 */
export const setUserHead = async (
  config: FetchConfig,
  stravaUserId: number | string
): Promise<SetUserHeadResponse> => {
  const { baseUrl } = config;

  const response = await fetch(`${baseUrl}/setUserHead`, {
    method: 'POST',
    headers: { 'Content-Type': FORM_ENCODED },
    body: new URLSearchParams({
      strava_user_id: String(stravaUserId)
    }) as unknown as BodyInit,
    redirect: 'follow' as RequestRedirect
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `Failed to set user as admin (HTTP ${response.status} ${errText})`
    );
  }

  const data = (await response.json()) as SetUserHeadResponse;

  if (data?.message !== 'success') {
    throw new Error(data?.error || data?.message || 'Failed to set user as admin');
  }

  return data;
};

export interface GetShopHeadResponse {
  message: string;
  shop_name: string;
  shop_code: string;
  shop_token: string;
  head: {
    strava_user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    last_login?: string;
    shop_activity?: string;
  } | null;
  info?: string;
  error?: string;
}

export interface ShopHeadData {
  strava_user_id: number;
  email: string;
}

/**
 * Gets the current head/admin of the family plan shop.
 *
 * Returns { strava_user_id, email } of the head user, or null if no head is set.
 */
export const getShopHead = async (config: FetchConfig): Promise<ShopHeadData | null> => {
  const { baseUrl, authToken, shopToken } = config;

  const response = await fetch(`${baseUrl}/getShopHead`, {
    method: 'POST',
    headers: { 'Content-Type': FORM_ENCODED },
    body: new URLSearchParams({
      auth: authToken,
      shop_token: shopToken
    }) as unknown as BodyInit,
    redirect: 'follow' as RequestRedirect
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Failed to get shop head (HTTP ${response.status} ${errText})`);
  }

  const data = (await response.json()) as GetShopHeadResponse;

  if (data?.message !== 'success') {
    throw new Error(data?.error || 'Failed to get shop head');
  }

  if (data.head == null) return null;
  return { strava_user_id: data.head.strava_user_id, email: data.head.email };
};

/**
 * Gets API configuration from environment and session storage
 */
export const getApiConfig = (): FetchConfig => {
  const baseUrl =
    process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
  const authToken = process.env.REACT_APP_API_AUTH_TOKEN || '';
  const shopToken =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('shop_token') || ''
      : '';

  return { baseUrl, authToken, shopToken };
};
