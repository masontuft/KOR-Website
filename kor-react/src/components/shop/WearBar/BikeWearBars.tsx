import React from 'react';
import WearBar from './index'; // existing WearBar component
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

interface BikeWearBarsProps {
  bike: any;
  bikeName?: string;
  ownerName?: string;
  showContext?: boolean;
}

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

const BikeWearBars: React.FC<BikeWearBarsProps> = ({
  bike,
  bikeName,
  ownerName,
  showContext = false
}) => {
  const { part_data, service_periods } = bike;

  // List of parts
  const parts = [
    {
      label: 'Chain',
      used: part_data.chain_used_miles,
      period: service_periods.chain_miles,
      icon: partIcons.chain
    },
    {
      label: 'Cassette',
      used: part_data.cassette_used_miles,
      period: service_periods.cassette_miles,
      icon: partIcons.cassette
    },
    {
      label: 'Chain Ring',
      used: part_data.chain_ring_used_miles,
      period: service_periods.chain_ring_miles,
      icon: partIcons.chain_ring
    },
    {
      label: 'Bottom Bracket',
      used: part_data.bottom_bracket_used_miles,
      period: service_periods.bottom_bracket_miles,
      icon: partIcons.bottom_bracket
    },
    {
      label: 'Front Fork',
      used: part_data.front_fork_used_miles,
      period: service_periods.front_fork_miles,
      icon: partIcons.front_fork
    },
    {
      label: 'Rear Shock',
      used: part_data.rear_shock_used_miles,
      period: service_periods.rear_shock_miles,
      icon: partIcons.rear_shock
    },
    {
      label: 'Brake Pads',
      used: part_data.brake_pads_used_miles,
      period: service_periods.brake_pads_miles,
      icon: partIcons.brake_pads
    },
    {
      label: 'Brake Rotors',
      used: part_data.brake_rotors_used_miles,
      period: service_periods.brake_rotors_miles,
      icon: partIcons.brake_rotors
    },
    {
      label: 'Dropper',
      used: part_data.dropper_used_miles,
      period: service_periods.dropper_miles,
      icon: partIcons.dropper
    },
    {
      label: 'Tires',
      used: part_data.tires_used_miles,
      period: service_periods.tires_miles,
      icon: partIcons.tires
    },
    {
      label: 'Sealant',
      used: part_data.sealant_used_hours,
      period: service_periods.sealant_refresh_hours,
      icon: partIcons.sealant
    }
  ];

  parts.sort((a, b) => {
    const aPct = a.period > 0 ? a.used / a.period : 0;
    const bPct = b.period > 0 ? b.used / b.period : 0;
    return bPct - aPct;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {parts.map(p => {
        const value =
          p.period > 0
            ? Math.min(Math.round((p.used / p.period) * 100), 100)
            : 0;
        return (
          <div
            key={p.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <WearBar label={p.label} value={value} imageSRC={p.icon} />
            {showContext && (
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#555',
                  marginLeft: '2rem'
                }}
              >
                {bikeName} ({ownerName})
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BikeWearBars;
