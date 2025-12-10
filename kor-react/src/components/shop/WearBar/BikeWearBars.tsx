import React from 'react';
import WearBar from './index'; // existing WearBar component
import { getWearPartsForBike } from './partWear';

interface BikeWearBarsProps {
  bike: any;
  bikeName?: string;
  ownerName?: string;
  showContext?: boolean;
  sortMode?: 'wear_desc' | 'wear_asc';
}

const BikeWearBars: React.FC<BikeWearBarsProps> = ({
  bike,
  bikeName,
  ownerName,
  showContext = false,
  sortMode = 'wear_desc'
}) => {
  const [expanded, setExpanded] = React.useState(false);

  // Get visible parts with wear percentage, sorted per sortMode
  const parts = getWearPartsForBike(bike, sortMode);

  const visibleParts = expanded ? parts : parts.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {visibleParts.map(p => {
        const value = p.wearPercent;
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
