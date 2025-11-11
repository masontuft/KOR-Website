import React, { useMemo } from 'react';
import BikeWearBars from './BikeWearBars';

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

const AllPartsWear: React.FC<AllPartsWearProps> = ({
  filteredUsers,
  bikesByUser,
  showAllParts
}) => {
  const allParts = useMemo(() => {
    if (!showAllParts) return [];

    const partsList: { bike: any; ownerName: string }[] = [];

    filteredUsers.forEach(user => {
      const bikes = bikesByUser[String(user.strava_user_id)]?.bikes || [];
      bikes.forEach(bike => {
        partsList.push({
          bike,
          ownerName: `${user.first_name} ${user.last_name}`
        });
      });
    });

    // Sort bikes by their most worn part
    return partsList.sort((a, b) => {
      const maxWear = (bike: any) =>
        Math.max(
          bike.part_data.chain_used_miles / bike.service_periods.chain_miles ||
            0,
          bike.part_data.cassette_used_miles /
            bike.service_periods.cassette_miles || 0,
          bike.part_data.tires_used_miles / bike.service_periods.tires_miles ||
            0
        );
      return maxWear(b.bike) - maxWear(a.bike);
    });
  }, [filteredUsers, bikesByUser, showAllParts]);

  if (!showAllParts || allParts.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3 style={{ color: '#333', marginBottom: '1rem' }}>All Part Wear</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {allParts.map(({ bike, ownerName }) => (
          <div
            key={`${bike.part_data.strava_bike_id}`}
            style={{
              border: '1px solid #eee',
              borderRadius: 10,
              padding: '1rem',
              background: '#fafafa'
            }}
          >
            <BikeWearBars
              bike={bike}
              bikeName={bike.part_data.strava_bike_name}
              ownerName={ownerName}
              showContext
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPartsWear;
