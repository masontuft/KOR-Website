import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface WearBarProps {
  label: string;
  value: number;
  threshold?: number;
  imageSRC: string;
}

const WearBar: React.FC<WearBarProps> = ({
  label,
  value,
  threshold = 75,
  imageSRC
}) => {
  // Determine bar color based on wear percentage
  let barColor = '#00FF75';
  if (value == 100) {
    barColor = '#FF1744';
  } else if (value >= 75) {
    barColor = '#FFD700';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        mt: 1.5
      }}
    >
      {/* Icon */}
      <Box sx={{ width: 28, height: 28, mr: 1, flexShrink: 0 }}>
        <img
          src={imageSRC}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>
      {/* Label on the left */}
      <Typography
        variant='body1'
        sx={{
          width: 100, // fixed width ensures all labels take same space
          textAlign: 'left',
          fontWeight: 600,
          flexShrink: 0 // prevents shrinking for long labels
        }}
      >
        {label}
      </Typography>

      {/* Progress bar */}
      <Box sx={{ position: 'relative', mr: 2, width: '75%' }}>
        <LinearProgress
          variant='determinate'
          value={value}
          sx={{
            height: 18,
            borderRadius: 6,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: barColor
            }
          }}
        />
        {/* Threshold marker */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${threshold}%`,
            width: '2px',
            backgroundColor: '#FF1744',
            borderRadius: 1,
            transform: 'translateX(-1px)'
          }}
        />
      </Box>

      {/* Percentage on the right */}
      <Typography
        variant='body1'
        sx={{
          width: 40, // fixed width ensures alignment
          textAlign: 'right',
          fontWeight: 600,
          flexShrink: 0
        }}
      >
        {value}%
      </Typography>
    </Box>
  );
};

export default WearBar;
