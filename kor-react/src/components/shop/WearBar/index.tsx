import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { buildTooltipText } from './wearUtils';

interface WearBarProps {
  label: string;
  value: number;
  threshold?: number;
  imageSRC: string;
  showAdminIndicator?: boolean;
  // Optional — tooltip is suppressed when omitted
  usedAmount?: number;
  periodAmount?: number;
  lastReplacedDate?: string | null;
  unit?: 'miles' | 'hours';
}

const WearBar: React.FC<WearBarProps> = ({
  label,
  value,
  threshold = 75,
  imageSRC,
  showAdminIndicator = false,
  usedAmount,
  periodAmount,
  lastReplacedDate,
  unit = 'miles',
}) => {
  let barColor = '#00FF75';
  if (value === 100) {
    barColor = '#FF1744';
  } else if (value >= 75) {
    barColor = '#FFD700';
  }

  const tooltipText =
    usedAmount !== undefined && periodAmount !== undefined
      ? buildTooltipText(label, usedAmount, periodAmount, unit, lastReplacedDate)
      : '';

  const bar = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        mt: 1.5
      }}
    >
      {/* Admin indicator */}
      {showAdminIndicator && (
        <Box
          sx={{
            width: 8,
            height: 8,
            mr: 0.75,
            flexShrink: 0,
            borderRadius: '50%',
            backgroundColor: '#3B82F6'
          }}
        />
      )}
      {/* Icon */}
      <Box sx={{ width: 28, height: 28, mr: 1, flexShrink: 0 }}>
        <img
          src={imageSRC}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>
      {/* Label */}
      <Typography
        variant='body1'
        sx={{
          width: 100,
          textAlign: 'left',
          fontWeight: 600,
          flexShrink: 0
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

      {/* Percentage */}
      <Typography
        variant='body1'
        sx={{
          width: 40,
          textAlign: 'right',
          fontWeight: 600,
          flexShrink: 0
        }}
      >
        {value}%
      </Typography>
    </Box>
  );

  if (!tooltipText) return bar;

  return (
    <Tooltip
      title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}
      placement='top'
      arrow
    >
      {bar}
    </Tooltip>
  );
};

export default WearBar;
