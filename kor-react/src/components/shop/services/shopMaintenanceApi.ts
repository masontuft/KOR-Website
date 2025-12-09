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

interface FetchConfig {
  baseUrl: string;
  authToken: string;
  shopToken: string;
}

interface ShopMaintenanceResponse {
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
