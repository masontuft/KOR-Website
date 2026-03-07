/**
 * Type Definitions for Shop Users and Bikes
 * 
 * WHY: Centralizing types makes them reusable across components and ensures consistency.
 * This file contains all interfaces related to the shop users and bikes feature.
 */

export interface PartData {
  id: number;
  bike_brand_and_model: string;
  strava_user_id: number;
  strava_bike_id: string;
  strava_bike_name: string;
  total_miles: number;
  new_chain_mile_marker: number;
  new_cassette_mile_marker: number;
  new_chain_ring_mile_marker: number;
  new_bottom_bracket_mile_marker: number;
  brake_bleed_mile_marker: number;
  new_brake_pads_mile_marker: number;
  new_brake_rotors_mile_marker: number;
  new_tires_mile_marker: number;
  front_fork_mile_marker: number;
  rear_shock_mile_marker: number;
  sealant_hour_marker: number;
  created_at: string;
  updated_at: string;
  chain_used_miles: number;
  chain_ring_used_miles: number;
  cassette_used_miles: number;
  front_fork_used_miles: number;
  rear_shock_used_miles: number;
  bottom_bracket_used_miles: number;
  brake_bleed_used_miles: number;
  brake_pads_used_miles: number;
  brake_rotors_used_miles: number;
  tires_used_miles: number;
  dropper_used_miles: number;
  sealant_used_hours: number;
  new_chain_date: string;
  new_chain_ring_date: string;
  new_cassette_date: string;
  front_fork_service_date: string;
  rear_shock_service_date: string;
  new_bottom_bracket_date: string;
  brake_bleed_date: string;
  new_brake_pads_date: string;
  new_brake_rotors_date: string;
  new_tires_date: string;
  dropper_service_date: string;
  sealant_refresh_date: string;
  sealant_show: boolean;
  rear_suspension_show: boolean;
  dropper_show: boolean;
  front_fork_show: boolean;
  AXS_show: boolean;
  brake_pads_show: boolean;
  brake_bleed_show: boolean;
  brake_rotors_show: boolean;
  dropper_mile_marker: number;
}

export interface ServicePeriods {
  id: number;
  strava_bike_id: string;
  chain_miles: number;
  cassette_miles: number;
  front_fork_miles: number;
  rear_shock_miles: number;
  chain_ring_miles: number;
  bottom_bracket_miles: number;
  sealant_refresh_hours: number;
  brake_bleed_miles: number;
  brake_pads_miles: number;
  brake_rotors_miles: number;
  tires_miles: number;
  dropper_miles: number;
  created_at: string;
  chain_type: string;
  cassette_type: string;
}

// Renamed to avoid conflict with existing Bike interface in index.ts
export interface MaintenanceBike {
  part_data: PartData;
  service_periods: ServicePeriods;
}

// Renamed to avoid conflict with existing ShopUser interface in index.ts
export interface MaintenanceUser {
  strava_user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string;
  shop_activity: string | null;
  bike_count: number;
  bikes: MaintenanceBike[];
}

export interface BikeState {
  loading: boolean;
  error: string | null;
  bikes: MaintenanceBike[];
  expanded: boolean;
}

export interface ShopUsersAndBikesProps {
  accentColor?: string;
  readOnlyMode?: boolean;
  showBikes?: boolean;
}

export type SortMode = 'wear_desc' | 'wear_asc';
