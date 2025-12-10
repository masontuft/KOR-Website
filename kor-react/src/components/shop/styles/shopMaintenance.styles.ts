/**
 * Styles for Shop Maintenance Components
 * 
 * WHY SEPARATE STYLES?
 * 1. Reusability - Can be used across components
 * 2. Maintainability - All styles in one place
 * 3. Consistency - Shared design tokens
 * 
 * PATTERN: CSS-in-JS using React's inline styles (could migrate to styled-components later)
 */

import { CSSProperties } from 'react';

/**
 * Design tokens - shared values used throughout the app
 * WHY: Makes it easy to change colors/spacing globally
 */
export const tokens = {
  colors: {
    border: '#eee',
    borderLight: '#f1f1f1',
    backgroundLight: '#fafafa',
    textPrimary: '#333',
    textSecondary: '#666',
    textTertiary: '#999',
    error: '#e74c3c',
    white: '#fff',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
  },
  shadows: {
    card: '0 2px 10px rgba(0,0,0,0.1)',
  },
};

/**
 * Container styles
 */
export const containerStyle: CSSProperties = {
  background: tokens.colors.white,
  borderRadius: tokens.borderRadius.lg,
  boxShadow: tokens.shadows.card,
  marginTop: tokens.spacing.xl,
  overflow: 'hidden',
};

/**
 * Header section styles
 */
export const headerStyle = (accentColor: string): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
  borderBottom: `1px solid ${tokens.colors.border}`,
  background: `${accentColor}20`,
});

export const headerTitleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

export const titleTextStyle: CSSProperties = {
  margin: 0,
  color: tokens.colors.textPrimary,
};

/**
 * Controls section styles
 */
export const controlsContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

export const searchContainerStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

export const searchIconStyle: CSSProperties = {
  position: 'absolute',
  left: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#888',
};

export const searchInputStyle: CSSProperties = {
  padding: '8px 10px 8px 30px',
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.sm,
  outline: 'none',
  minWidth: 220,
};

export const selectStyle: CSSProperties = {
  padding: '8px',
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.sm,
};

export const buttonStyle = (
  bgColor: string,
  isSecondary: boolean = false
): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  background: bgColor,
  color: tokens.colors.white,
  border: 'none',
  padding: '12px 16px',
  borderRadius: tokens.borderRadius.sm,
  cursor: 'pointer',
  fontSize: '15px',
  ...(isSecondary && { background: '#333' }),
});

/**
 * Content section styles
 */
export const contentStyle: CSSProperties = {
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
};

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: tokens.spacing.md,
};

/**
 * User card styles
 */
export const userCardStyle: CSSProperties = {
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.md,
  overflow: 'hidden',
  background: tokens.colors.white,
};

export const userHeaderStyle: CSSProperties = {
  padding: '0.9rem 1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${tokens.colors.borderLight}`,
  flexWrap: 'wrap',
  gap: 8,
};

export const userInfoStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minWidth: 0,
  flex: '1 1 auto',
};

export const avatarStyle = (accentColor: string): CSSProperties => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: `${accentColor}20`,
  color: accentColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  flex: '0 0 auto',
});

export const userNameStyle: CSSProperties = {
  fontWeight: 600,
  color: tokens.colors.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const userActionsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flex: '0 1 auto',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  minWidth: 180,
};

export const statusBadgeStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

export const statusDotStyle = (color: string): CSSProperties => ({
  display: 'inline-block',
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: color,
});

export const statusTextStyle: CSSProperties = {
  fontSize: 12,
  color: tokens.colors.textSecondary,
};

export const lastLoginStyle: CSSProperties = {
  fontSize: 12,
  color: tokens.colors.textTertiary,
};

export const toggleBikesButtonStyle = (
  accentColor: string,
  disabled: boolean = false
): CSSProperties => ({
  border: `1px solid ${disabled ? '#ccc' : accentColor}`,
  background: 'transparent',
  color: disabled ? '#999' : accentColor,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 10px',
  borderRadius: tokens.borderRadius.sm,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
});

/**
 * Bikes section styles
 */
export const bikesContainerStyle: CSSProperties = {
  padding: '0.8rem 1rem',
};

export const bikesGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 10,
};

export const bikeCardStyle = (accentColor: string): CSSProperties => ({
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.sm,
  padding: tokens.spacing.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  background: tokens.colors.backgroundLight,
});

export const bikeHeaderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

export const bikeIconContainerStyle: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: tokens.borderRadius.sm,
  background: '#8FB779',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const bikeNameStyle: CSSProperties = {
  fontWeight: 600,
  color: '#000000',
  fontSize: 22,
};

/**
 * Loading and error states
 */
export const loadingStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: tokens.colors.textSecondary,
};

export const errorStyle: CSSProperties = {
  color: tokens.colors.error,
  marginBottom: tokens.spacing.md,
};

export const emptyStateStyle: CSSProperties = {
  color: tokens.colors.textSecondary,
};

/**
 * Responsive CSS (for <style> tag)
 */
export const responsiveCSS = `
  .spin { 
    animation: spin 1s linear infinite; 
  }
  
  @keyframes spin { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }
  
  @media (max-width: 768px) {
    .shop-header {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 1rem;
    }
    
    .shop-controls {
      width: 100%;
      flex-direction: column;
      align-items: stretch !important;
    }
    
    .shop-controls > * {
      width: 100%;
    }
    
    .shop-controls input {
      width: 100% !important;
      min-width: unset !important;
      box-sizing: border-box;
    }
    
    .shop-controls button {
      width: 100%;
      justify-content: center;
      font-size: 16px;
    }
    
    .shop-controls > div {
      width: 100%;
    }
    
    .shop-controls select {
      width: 100%;
    }
    
    .bikes-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
