/**
 * Styles for User Management Modals
 * Used for managing family plan users (viewing, deleting)
 */

import { CSSProperties } from 'react';
import { tokens } from './shopMaintenance.styles';

export const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

export const modalContentStyle: CSSProperties = {
  background: 'white',
  padding: '1.5rem',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '80vh',
  borderRadius: '8px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
};

export const modalHeaderStyle: CSSProperties = {
  marginTop: 0,
  color: tokens.colors.textPrimary,
  marginBottom: '1rem',
  fontSize: '1.5rem',
};

export const modalSubtextStyle: CSSProperties = {
  color: tokens.colors.textSecondary,
  marginBottom: '1rem',
  fontSize: '0.9rem',
};

export const userListContainerStyle: CSSProperties = {
  flex: '1 1 auto',
  overflowY: 'auto',
  marginBottom: '1rem',
};

export const userListItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem',
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.sm,
  marginBottom: '0.5rem',
  background: tokens.colors.white,
};

export const userListInfoStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
};

export const userListNameStyle: CSSProperties = {
  fontWeight: 600,
  color: tokens.colors.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const userListEmailStyle: CSSProperties = {
  fontSize: '0.85rem',
  color: tokens.colors.textSecondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const deleteButtonStyle = (disabled: boolean): CSSProperties => ({
  backgroundColor: '#d63031',
  color: 'white',
  border: 'none',
  padding: '0.4rem 0.6rem',
  borderRadius: '4px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '1.2rem',
  opacity: disabled ? 0.5 : 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '32px',
  minHeight: '32px',
});

export const modalFooterStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  paddingTop: '1rem',
  borderTop: `1px solid ${tokens.colors.border}`,
};

export const modalButtonStyle = (
  variant: 'primary' | 'secondary'
): CSSProperties => ({
  backgroundColor: variant === 'primary' ? '#007bff' : '#f8f9fa',
  color: variant === 'primary' ? 'white' : '#495057',
  border: variant === 'secondary' ? `1px solid ${tokens.colors.border}` : 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: 500,
});

// Confirmation modal styles
export const confirmModalContentStyle: CSSProperties = {
  ...modalContentStyle,
  maxWidth: '400px',
};

export const confirmModalHeaderStyle: CSSProperties = {
  marginTop: 0,
  color: '#d63031',
  marginBottom: '0.5rem',
  fontSize: '1.25rem',
};

export const confirmModalTextStyle: CSSProperties = {
  color: tokens.colors.textSecondary,
  marginBottom: '1.5rem',
  lineHeight: '1.5',
};

export const confirmModalFooterStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
};

export const confirmButtonStyle = (
  variant: 'danger' | 'cancel',
  disabled: boolean
): CSSProperties => ({
  backgroundColor: variant === 'danger' ? '#d63031' : '#f8f9fa',
  color: variant === 'danger' ? 'white' : '#495057',
  border: variant === 'cancel' ? `1px solid ${tokens.colors.border}` : 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
  fontSize: '0.95rem',
  fontWeight: 500,
});

export const loadingSpinnerStyle: CSSProperties = {
  display: 'inline-block',
  width: '14px',
  height: '14px',
  border: '2px solid rgba(255,255,255,0.3)',
  borderTop: '2px solid white',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  marginRight: '0.5rem',
};

export const errorMessageStyle: CSSProperties = {
  backgroundColor: '#ffe6e6',
  color: '#d63031',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #d63031',
  marginBottom: '1rem',
  fontSize: '0.9rem',
};

export const emptyStateStyle: CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
  color: tokens.colors.textSecondary,
};

// CSS animation string for injecting into a <style> tag if needed
export const spinAnimationCSS = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
