import chainIcon from '../WearBar/images/chain.png';
import cassetteIcon from '../WearBar/images/cassette.png';
import chainRingIcon from '../WearBar/images/chainring.png';
import bottomBracketIcon from '../WearBar/images/bottom_bracket.png';
import frontForkIcon from '../WearBar/images/front_fork.png';
import rearShockIcon from '../WearBar/images/rear_suspension.png';
import brakePadsIcon from '../WearBar/images/brake_pads.png';
import brakeRotorsIcon from '../WearBar/images/brake_rotors.png';
import dropperIcon from '../WearBar/images/dropper.png';
import tiresIcon from '../WearBar/images/tires.png';
import sealantIcon from '../WearBar/images/sealant.png';

export const partIcons: Record<string, string> = {
  chain: chainIcon,
  cassette: cassetteIcon,
  chain_ring: chainRingIcon,
  bottom_bracket: bottomBracketIcon,
  front_fork: frontForkIcon,
  rear_shock: rearShockIcon,
  brake_pads: brakePadsIcon,
  brake_rotors: brakeRotorsIcon,
  dropper: dropperIcon,
  tires: tiresIcon,
  sealant: sealantIcon
};

// ---------------------------------------------------------------------------
// PART_CONFIG — single source of truth for all part metadata
// ---------------------------------------------------------------------------

export interface PartConfig {
  label: string;
  icon: string;
  unit: 'miles' | 'hours';
  partType: string;
  replaceEndpoint: string;
  usedBodyKey: string;
  getUsed: (pd: any) => number;
  getPeriod: (sp: any) => number;
  getDate: (pd: any) => string | null;
  getShow: (pd: any) => boolean;
}

export const PART_CONFIGS: PartConfig[] = [
  {
    label: 'Chain',
    icon: partIcons.chain,
    unit: 'miles',
    partType: 'chain',
    replaceEndpoint: '/newChain',
    usedBodyKey: 'chain_used_miles',
    getUsed: pd => pd.chain_used_miles ?? 0,
    getPeriod: sp => sp.chain_miles ?? 0,
    getDate: pd => pd.new_chain_date ?? null,
    getShow: () => true,
  },
  {
    label: 'Cassette',
    icon: partIcons.cassette,
    unit: 'miles',
    partType: 'cassette',
    replaceEndpoint: '/newCassette',
    usedBodyKey: 'cassette_used_miles',
    getUsed: pd => pd.cassette_used_miles ?? 0,
    getPeriod: sp => sp.cassette_miles ?? 0,
    getDate: pd => pd.new_cassette_date ?? null,
    getShow: () => true,
  },
  {
    label: 'Chain Ring',
    icon: partIcons.chain_ring,
    unit: 'miles',
    partType: 'chain ring',
    replaceEndpoint: '/newChainRing',
    usedBodyKey: 'chain_ring_used_miles',
    getUsed: pd => pd.chain_ring_used_miles ?? 0,
    getPeriod: sp => sp.chain_ring_miles ?? 0,
    getDate: pd => pd.new_chain_ring_date ?? null,
    getShow: () => true,
  },
  {
    label: 'Bottom Bracket',
    icon: partIcons.bottom_bracket,
    unit: 'miles',
    partType: 'bottom bracket',
    replaceEndpoint: '/newBottomBracket',
    usedBodyKey: 'bottom_bracket_used_miles',
    getUsed: pd => pd.bottom_bracket_used_miles ?? 0,
    getPeriod: sp => sp.bottom_bracket_miles ?? 0,
    getDate: pd => pd.new_bottom_bracket_date ?? null,
    getShow: () => true,
  },
  {
    label: 'Front Fork',
    icon: partIcons.front_fork,
    unit: 'miles',
    partType: 'front fork',
    replaceEndpoint: '/frontForkService',
    usedBodyKey: 'front_fork_used_miles',
    getUsed: pd => pd.front_fork_used_miles ?? 0,
    getPeriod: sp => sp.front_fork_miles ?? 0,
    getDate: pd => pd.front_fork_service_date ?? null,
    getShow: pd => Boolean(pd.front_fork_show),
  },
  {
    label: 'Rear Shock',
    icon: partIcons.rear_shock,
    unit: 'miles',
    partType: 'rear shock',
    replaceEndpoint: '/rearShockService',
    usedBodyKey: 'rear_shock_used_hours',
    getUsed: pd => pd.rear_shock_used_miles ?? 0,
    getPeriod: sp => sp.rear_shock_miles ?? 0,
    getDate: pd => pd.rear_shock_service_date ?? null,
    getShow: pd => Boolean(pd.rear_suspension_show),
  },
  {
    label: 'Brake Pads',
    icon: partIcons.brake_pads,
    unit: 'miles',
    partType: 'brake pads',
    replaceEndpoint: '/newBrakePads',
    usedBodyKey: 'brake_pads_used_miles',
    getUsed: pd => pd.brake_pads_used_miles ?? 0,
    getPeriod: sp => sp.brake_pads_miles ?? 0,
    getDate: pd => pd.new_brake_pads_date ?? null,
    getShow: pd => Boolean(pd.brake_pads_show || pd.brake_pad_show),
  },
  {
    label: 'Brake Rotors',
    icon: partIcons.brake_rotors,
    unit: 'miles',
    partType: 'brake rotors',
    replaceEndpoint: '/newBrakeRotors',
    usedBodyKey: 'brake_rotors_used_miles',
    getUsed: pd => pd.brake_rotors_used_miles ?? 0,
    getPeriod: sp => sp.brake_rotors_miles ?? 0,
    getDate: pd => pd.new_brake_rotors_date ?? null,
    getShow: pd => Boolean(pd.brake_rotors_show || pd.brake_rotor_show),
  },
  {
    label: 'Dropper',
    icon: partIcons.dropper,
    unit: 'miles',
    partType: 'dropper',
    replaceEndpoint: '/DropperService',
    usedBodyKey: 'dropper_used_miles',
    getUsed: pd => pd.dropper_used_miles ?? 0,
    getPeriod: sp => sp.dropper_miles ?? 0,
    getDate: pd => pd.dropper_service_date ?? null,
    getShow: pd => Boolean(pd.dropper_show),
  },
  {
    label: 'Tires',
    icon: partIcons.tires,
    unit: 'miles',
    partType: 'tires',
    replaceEndpoint: '/newTires',
    usedBodyKey: 'tires_used_miles',
    getUsed: pd => pd.tires_used_miles ?? 0,
    getPeriod: sp => sp.tires_miles ?? 0,
    getDate: pd => pd.new_tires_date ?? null,
    getShow: () => true,
  },
  {
    label: 'Sealant',
    icon: partIcons.sealant,
    unit: 'hours',
    partType: 'sealant',
    replaceEndpoint: '/sealantRefresh',
    usedBodyKey: 'sealant_used_hours',
    getUsed: pd => pd.sealant_used_hours ?? 0,
    getPeriod: sp => sp.sealant_refresh_hours ?? 0,
    getDate: pd => pd.sealant_refresh_date ?? null,
    getShow: pd => Boolean(pd.sealant_show),
  },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PartDefinition {
  label: string;
  used: number;
  period: number;
  icon: string;
  show: boolean;
  unit: 'miles' | 'hours';
  partType: string;
  replaceEndpoint: string;
  usedBodyKey: string;
  lastReplacedDate: string | null;
  bikeId: string | number;
}

export interface WearPart extends PartDefinition {
  wearPercent: number;
}

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

/**
 * Build all part definitions for a given bike (including hidden ones).
 */
export const buildPartsForBike = (bike: any): PartDefinition[] => {
  if (!bike || !bike.part_data || !bike.service_periods) return [];

  const { part_data, service_periods } = bike;
  const bikeId = part_data.strava_bike_id ?? '';

  return PART_CONFIGS.map(config => ({
    label: config.label,
    used: config.getUsed(part_data),
    period: config.getPeriod(service_periods),
    icon: config.icon,
    show: config.getShow(part_data),
    unit: config.unit,
    partType: config.partType,
    replaceEndpoint: config.replaceEndpoint,
    usedBodyKey: config.usedBodyKey,
    lastReplacedDate: config.getDate(part_data),
    bikeId,
  }));
};

/**
 * Get visible parts for a bike, with computed wear percentage and sorted
 * by wear percentage.
 */
export const getWearPartsForBike = (
  bike: any,
  sortMode: 'wear_desc' | 'wear_asc' = 'wear_desc'
): WearPart[] => {
  const parts = buildPartsForBike(bike);

  return parts
    .filter(part => part.show)
    .map(part => ({
      ...part,
      wearPercent:
        part.period > 0
          ? Math.min(Math.round((part.used / part.period) * 100), 100)
          : 0
    }))
    .sort((a, b) =>
      sortMode === 'wear_asc'
        ? a.wearPercent - b.wearPercent
        : b.wearPercent - a.wearPercent
    );
};
