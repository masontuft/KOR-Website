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
  const [expanded, setExpanded] = React.useState(false);

  const bikeId = bike?.id || bikeName || 'unknown-bike';

  const { part_data, service_periods } = bike;

  // List of parts with their show flags
  const allParts = [
    {
      label: 'Chain',
      used: part_data.chain_used_miles,
      period: service_periods.chain_miles,
      icon: partIcons.chain,
      show: true // Chain always shows
    },
    {
      label: 'Cassette',
      used: part_data.cassette_used_miles,
      period: service_periods.cassette_miles,
      icon: partIcons.cassette,
      show: true // Cassette always shows
    },
    {
      label: 'Chain Ring',
      used: part_data.chain_ring_used_miles,
      period: service_periods.chain_ring_miles,
      icon: partIcons.chain_ring,
      show: true // Chain ring always shows
    },
    {
      label: 'Bottom Bracket',
      used: part_data.bottom_bracket_used_miles,
      period: service_periods.bottom_bracket_miles,
      icon: partIcons.bottom_bracket,
      show: true // Bottom bracket always shows
    },
    {
      label: 'Front Fork',
      used: part_data.front_fork_used_miles,
      period: service_periods.front_fork_miles,
      icon: partIcons.front_fork,
      show: Boolean(part_data.front_fork_show)
    },
    {
      label: 'Rear Shock',
      used: part_data.rear_shock_used_miles,
      period: service_periods.rear_shock_miles,
      icon: partIcons.rear_shock,
      show: Boolean(part_data.rear_suspension_show)
    },
    {
      label: 'Brake Pads',
      used: part_data.brake_pads_used_miles,
      period: service_periods.brake_pads_miles,
      icon: partIcons.brake_pads,
      show: Boolean(part_data.brake_pads_show || part_data.brake_pad_show)
    },
    {
      label: 'Brake Rotors',
      used: part_data.brake_rotors_used_miles,
      period: service_periods.brake_rotors_miles,
      icon: partIcons.brake_rotors,
      show: Boolean(part_data.brake_rotors_show || part_data.brake_rotor_show)
    },
    {
      label: 'Dropper',
      used: part_data.dropper_used_miles,
      period: service_periods.dropper_miles,
      icon: partIcons.dropper,
      show: Boolean(part_data.dropper_show)
    },
    {
      label: 'Tires',
      used: part_data.tires_used_miles,
      period: service_periods.tires_miles,
      icon: partIcons.tires,
      show: true // Tires always show
    },
    {
      label: 'Sealant',
      used: part_data.sealant_used_hours,
      period: service_periods.sealant_refresh_hours,
      icon: partIcons.sealant,
      show: Boolean(part_data.sealant_show)
    }
  ];

  // Filter parts based on show flag
  const parts = allParts.filter(p => p.show);

  parts.sort((a, b) => {
    const aPct = a.period > 0 ? a.used / a.period : 0;
    const bPct = b.period > 0 ? b.used / b.period : 0;
    return bPct - aPct;
  });

  const visibleParts = expanded ? parts : parts.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {visibleParts.map(p => {
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
      {parts.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3B82F6',
            cursor: 'pointer',
            fontWeight: 500,
            padding: '0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}
        >
          {expanded ? (
            <>
              Show Less{' '}
              <span style={{ marginLeft: 4, fontSize: '.7rem' }}>▲</span>
            </>
          ) : (
            <>
              Show More{' '}
              <span style={{ marginLeft: 4, fontSize: '.7rem' }}>▼</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default BikeWearBars;
