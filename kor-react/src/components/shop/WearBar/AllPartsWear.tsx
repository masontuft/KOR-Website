import React, { useMemo } from 'react';
import WearBar from './index';
import { getWearPartsForBike } from './partWear';

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
  // Controls how parts are sorted; currently we only use wear_desc (most worn -> least worn)
  sortMode?: 'wear_desc' | 'wear_asc';
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
  showAllParts,
  sortMode = 'wear_desc'
}) => {
  const [showAll, setShowAll] = React.useState(false);

  const allParts = useMemo(() => {
    if (!showAllParts) return [];

    const partsList: PartEntry[] = [];

    filteredUsers.forEach(user => {
      const bikes = bikesByUser[String(user.strava_user_id)]?.bikes || [];
      const ownerName = `${user.first_name} ${user.last_name}`;

      bikes.forEach(bike => {
        const wearParts = getWearPartsForBike(bike, sortMode);
        const bikeName = bike?.part_data?.strava_bike_name || 'Bike';

        wearParts.forEach(part => {
          partsList.push({
            label: part.label,
            wearPercent: part.wearPercent,
            bikeName,
            ownerName,
            icon: part.icon
          });
        });
      });
    });

    // Sort all parts by wear percentage based on sortMode
    return partsList.sort((a, b) =>
      sortMode === 'wear_asc'
        ? a.wearPercent - b.wearPercent
        : b.wearPercent - a.wearPercent
    );
  }, [filteredUsers, bikesByUser, showAllParts, sortMode]);

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
