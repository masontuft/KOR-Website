import { ADD_MILES_AMOUNT, ADD_HOURS_AMOUNT } from '../WearBar/wearUtils';

const FORM_ENCODED = 'application/x-www-form-urlencoded';

const postJson = async (url: string, body: Record<string, unknown>): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'follow' as RequestRedirect,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data?.message !== 'success') throw new Error(data?.error || 'Request failed');
  return data;
};

const postForm = async (url: string, body: Record<string, string>): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': FORM_ENCODED },
    body: new URLSearchParams(body) as unknown as BodyInit,
    redirect: 'follow' as RequestRedirect,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data?.message !== 'success') throw new Error(data?.error || 'Request failed');
  return data;
};

// ---------------------------------------------------------------------------
// replacePart
// ---------------------------------------------------------------------------

export interface ReplacePartParams {
  baseUrl: string;
  stravaUserId: string | number;
  stravaWearBikeId: string | number;
  bikeName: string;
  replaceEndpoint: string;
  usedBodyKey: string;
  partType: string;
  usedAmount: number;
  brokenWorn: 'worn_out' | 'broke';
  extraBody?: Record<string, string>;
}

/**
 * Resets part mileage to 0 and logs the replacement in part history.
 */
export const replacePart = async (params: ReplacePartParams): Promise<void> => {
  const {
    baseUrl,
    stravaUserId,
    stravaWearBikeId,
    bikeName,
    replaceEndpoint,
    usedBodyKey,
    partType,
    usedAmount,
    brokenWorn,
    extraBody,
  } = params;

  // 1. Reset the part's used miles/hours to 0
  await postForm(`${baseUrl}${replaceEndpoint}`, {
    strava_user_id: String(stravaUserId),
    strava_bike_id: String(stravaWearBikeId),
    [usedBodyKey]: '0',
    ...extraBody,
  });

  // 2. Log replacement in history
  await postForm(`${baseUrl}/updatePartHistory`, {
    strava_user_id: String(stravaUserId),
    strava_bike_id: String(stravaWearBikeId),
    part_type: partType,
    model: '',
    used_miles: String(usedAmount),
    broken_worn: brokenWorn,
    bike_type: 'Bike',
  });
};

// ---------------------------------------------------------------------------
// addMileage
// ---------------------------------------------------------------------------

export interface AddMileageParams {
  baseUrl: string;
  stravaUserId: string | number;
  bikeId: string | number;
  bikeName: string;
  partType: string;
  usedBodyKey: string;
  unit: 'miles' | 'hours';
}

/**
 * Adds a fixed amount (100 miles or 100 hours) to a part's used total.
 */
export const addMileage = async (params: AddMileageParams): Promise<void> => {
  const { baseUrl, stravaUserId, bikeId, bikeName, partType, usedBodyKey, unit } = params;
  const increase = unit === 'hours' ? ADD_HOURS_AMOUNT : ADD_MILES_AMOUNT;

  await postJson(`${baseUrl}/addMileage`, {
    part_type: partType,
    used_body_key: usedBodyKey,
    bike_name: bikeName,
    strava_user_id: String(stravaUserId),
    bike_id: String(bikeId),
    increase,
  });
};
