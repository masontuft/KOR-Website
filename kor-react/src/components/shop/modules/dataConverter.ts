/**
 * Data Converter Module
 * 
 * Converts API response data with integer boolean values (0/1) to proper TypeScript booleans.
 * This module provides reusable functions to transform bike part data and entire shop user objects.
 */

/**
 * List of fields in PartData that should be converted from 0/1 to boolean
 */
const BOOLEAN_FIELDS = [
  'sealant_show',
  'rear_suspension_show',
  'dropper_show',
  'front_fork_show',
  'AXS_show',
  'brake_pad_show',
  'brake_pads_show',
  'brake_bleed_show',
  'brake_rotor_show',
  'brake_rotors_show'
] as const;

/**
 * Converts integer boolean values (0/1) to proper booleans
 * @param value - The value to convert (can be number, boolean, or any)
 * @returns boolean value
 */
export const toBool = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
  return Boolean(value);
};

/**
 * Converts an object's specified fields from integer booleans to proper booleans
 * @param obj - The object to convert
 * @param fields - Array of field names to convert
 * @returns A new object with converted boolean fields
 */
export const convertBooleanFields = <T extends Record<string, any>>(
  obj: T,
  fields: readonly string[]
): T => {
  const converted: any = { ...obj };
  
  fields.forEach(field => {
    if (field in converted) {
      converted[field] = toBool(converted[field]);
    }
  });
  
  return converted as T;
};

/**
 * Converts bike part data from API format to application format
 * Specifically handles boolean fields that come as 0/1 from the API
 * @param partData - Raw part data from API
 * @returns Converted part data with proper boolean types
 */
export const convertPartData = <T extends Record<string, any>>(partData: T): T => {
  return convertBooleanFields(partData, BOOLEAN_FIELDS);
};

/**
 * Converts a single bike object (including nested part_data)
 * @param bike - Raw bike data from API
 * @returns Converted bike data
 */
export const convertBike = <T extends { part_data: any; service_periods?: any }>(bike: T): T => {
  return {
    ...bike,
    part_data: convertPartData(bike.part_data)
  };
};

/**
 * Converts a shop user object including all nested bikes
 * @param user - Raw user data from API
 * @returns Converted user data with all bikes having proper boolean types
 */
export const convertShopUser = <T extends { bikes?: any[] }>(user: T): T => {
  if (!user.bikes || !Array.isArray(user.bikes)) {
    return user;
  }
  
  return {
    ...user,
    bikes: user.bikes.map(convertBike)
  };
};

/**
 * Converts an array of shop users
 * @param users - Array of raw user data from API
 * @returns Array of converted users
 */
export const convertShopUsers = <T extends { bikes?: any[] }>(users: T[]): T[] => {
  return users.map(convertShopUser);
};

/**
 * Generic API response converter
 * Automatically detects and converts common API response structures
 * @param apiResponse - The raw API response
 * @returns Converted response with proper boolean types
 */
export const convertApiResponse = <T extends { users?: any[]; bikes?: any[]; part_data?: any }>(
  apiResponse: T
): T => {
  const converted = { ...apiResponse };
  
  // If response has users array, convert all users
  if (converted.users && Array.isArray(converted.users)) {
    converted.users = convertShopUsers(converted.users);
  }
  
  // If response has bikes array, convert all bikes
  if (converted.bikes && Array.isArray(converted.bikes)) {
    converted.bikes = converted.bikes.map(convertBike);
  }
  
  // If response has single part_data, convert it
  if (converted.part_data) {
    converted.part_data = convertPartData(converted.part_data);
  }
  
  return converted;
};

const dataConverter = {
  toBool,
  convertBooleanFields,
  convertPartData,
  convertBike,
  convertShopUser,
  convertShopUsers,
  convertApiResponse
};

export default dataConverter;
