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

export interface PartDefinition {
  label: string;
  used: number;
  period: number;
  icon: string;
  show: boolean;
}

export interface WearPart extends PartDefinition {
  wearPercent: number;
}

/**
 * Build all part definitions for a given bike (including hidden ones).
 */
export const buildPartsForBike = (bike: any): PartDefinition[] => {
  if (!bike || !bike.part_data || !bike.service_periods) return [];

  const { part_data, service_periods } = bike;

  return [
    {
      label: 'Chain',
      used: part_data.chain_used_miles ?? 0,
      period: service_periods.chain_miles ?? 0,
      icon: partIcons.chain,
      show: true // Chain always shows
    },
    {
      label: 'Cassette',
      used: part_data.cassette_used_miles ?? 0,
      period: service_periods.cassette_miles ?? 0,
      icon: partIcons.cassette,
      show: true // Cassette always shows
    },
    {
      label: 'Chain Ring',
      used: part_data.chain_ring_used_miles ?? 0,
      period: service_periods.chain_ring_miles ?? 0,
      icon: partIcons.chain_ring,
      show: true // Chain ring always shows
    },
    {
      label: 'Bottom Bracket',
      used: part_data.bottom_bracket_used_miles ?? 0,
      period: service_periods.bottom_bracket_miles ?? 0,
      icon: partIcons.bottom_bracket,
      show: true // Bottom bracket always shows
    },
    {
      label: 'Front Fork',
      used: part_data.front_fork_used_miles ?? 0,
      period: service_periods.front_fork_miles ?? 0,
      icon: partIcons.front_fork,
      show: Boolean(part_data.front_fork_show)
    },
    {
      label: 'Rear Shock',
      used: part_data.rear_shock_used_miles ?? 0,
      period: service_periods.rear_shock_miles ?? 0,
      icon: partIcons.rear_shock,
      show: Boolean(part_data.rear_suspension_show)
    },
    {
      label: 'Brake Pads',
      used: part_data.brake_pads_used_miles ?? 0,
      period: service_periods.brake_pads_miles ?? 0,
      icon: partIcons.brake_pads,
      show: Boolean(part_data.brake_pads_show || part_data.brake_pad_show)
    },
    {
      label: 'Brake Rotors',
      used: part_data.brake_rotors_used_miles ?? 0,
      period: service_periods.brake_rotors_miles ?? 0,
      icon: partIcons.brake_rotors,
      show: Boolean(part_data.brake_rotors_show || part_data.brake_rotor_show)
    },
    {
      label: 'Dropper',
      used: part_data.dropper_used_miles ?? 0,
      period: service_periods.dropper_miles ?? 0,
      icon: partIcons.dropper,
      show: Boolean(part_data.dropper_show)
    },
    {
      label: 'Tires',
      used: part_data.tires_used_miles ?? 0,
      period: service_periods.tires_miles ?? 0,
      icon: partIcons.tires,
      show: true // Tires always show
    },
    {
      label: 'Sealant',
      used: part_data.sealant_used_hours ?? 0,
      period: service_periods.sealant_refresh_hours ?? 0,
      icon: partIcons.sealant,
      show: Boolean(part_data.sealant_show)
    }
  ];
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
