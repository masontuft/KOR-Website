import React, { useMemo } from 'react';
import WearBar from './index';
import { partIcons } from './BikeWearBars';

interface User {
  strava_user_id: number;
  first_name: string;
  last_name: string;
}

interface BikeCollection {
  bikes: any[];
}

interface AllPartsWearProps {
  filteredUsers: User[];
  bikesByUser: Record<string, BikeCollection>;
  showAllParts: boolean;
}

interface PartEntry {
  label: string;
  wearPercent: number;
  bikeName: string;
  ownerName: string;
  icon: string;
}

const AllPartsWear: React.FC<AllPartsWearProps> = ({
  filteredUsers,
  bikesByUser,
  showAllParts
}) => {
  const [showAll, setShowAll] = React.useState(false);

  const allParts = useMemo(() => {
    if (!showAllParts) return [];

    const partsList: PartEntry[] = [];

    filteredUsers.forEach(user => {
      const bikes = bikesByUser[String(user.strava_user_id)]?.bikes || [];
      const ownerName = `${user.first_name} ${user.last_name}`;

      bikes.forEach(bike => {
        const { part_data, service_periods } = bike;
        const bikeName = part_data.strava_bike_name || 'Bike';

        // Define all parts for this bike with their show flags
        const allParts = [
          {
            label: 'Chain',
            used: part_data.chain_used_miles,
            period: service_periods.chain_miles,
            icon: partIcons.chain,
            show: true
          },
          {
            label: 'Cassette',
            used: part_data.cassette_used_miles,
            period: service_periods.cassette_miles,
            icon: partIcons.cassette,
            show: true
          },
          {
            label: 'Chain Ring',
            used: part_data.chain_ring_used_miles,
            period: service_periods.chain_ring_miles,
            icon: partIcons.chain_ring,
            show: true
          },
          {
            label: 'Bottom Bracket',
            used: part_data.bottom_bracket_used_miles,
            period: service_periods.bottom_bracket_miles,
            icon: partIcons.bottom_bracket,
            show: true
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
            show: Boolean(
              part_data.brake_rotors_show || part_data.brake_rotor_show
            )
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
            show: true
          },
          {
            label: 'Sealant',
            used: part_data.sealant_used_hours,
            period: service_periods.sealant_refresh_hours,
            icon: partIcons.sealant,
            show: Boolean(part_data.sealant_show)
          }
        ];

        // Filter parts based on show flag, then add to the list with wear percentage
        allParts
          .filter(part => part.show)
          .forEach(part => {
            const wearPercent =
              part.period > 0
                ? Math.min(Math.round((part.used / part.period) * 100), 100)
                : 0;

            partsList.push({
              label: part.label,
              wearPercent,
              bikeName,
              ownerName,
              icon: part.icon
            });
          });
      });
    });

    // Sort all parts by wear percentage (most worn first)
    return partsList.sort((a, b) => b.wearPercent - a.wearPercent);
  }, [filteredUsers, bikesByUser, showAllParts]);

  if (!showAllParts || allParts.length === 0) return null;
  const visibleParts = showAll ? allParts : allParts.slice(0, 5);
  return (
    <div
      style={{
        marginTop: '1rem'
      }}
    >
      <h3 style={{ color: '#333', marginBottom: '1rem' }}>All Part Wear</h3>
      <div
        style={{
          border: '1px solid #eee',
          borderRadius: 10,
          padding: '1rem',
          background: '#fafafa'
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          {visibleParts.map((part, index) => (
            <div
              key={`${part.ownerName}-${part.bikeName}-${part.label}-${index}`}
            >
              <WearBar
                label={part.label}
                value={part.wearPercent}
                imageSRC={part.icon}
              />
              <div
                style={{
                  fontSize: '.9rem',
                  color: '#555',
                  marginLeft: '2rem',
                  marginTop: '0.25rem'
                }}
              >
                <span style={{ color: '#000', fontWeight: 600 }}>
                  {part.bikeName}
                </span>{' '}
                (<span style={{ color: '#999' }}>{part.ownerName}</span>)
              </div>
            </div>
          ))}
        </div>
        {allParts.length > 5 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem'
            }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: 'none',
                border: 'none',
                color: '#3B82F6',
                fontWeight: 500,
                fontSize: '1.0rem',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {showAll ? 'Show Less' : 'Show All'}

              {/*Arrow*/}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1,
                  fontSize: '1.1rem'
                }}
              >
                {showAll ? '▴' : '▾'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPartsWear;
