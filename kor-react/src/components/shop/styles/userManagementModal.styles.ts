// Styles for the family plan user management modal and confirm delete modal
// Kept in plain objects for easy reuse and maintainability.

import { tokens } from './shopMaintenance.styles';

/**
 * Modal-specific design tokens.
 * Extends the shared token system with colors unique to this modal.
 */
const modalTokens = {
  colors: {
    // Text
    textHeading: '#1f2937',
    textBody: '#374151',
    textMuted: '#4b5563',
    textDisabled: '#9ca3af',
    textDanger: '#dc2626',
    textDangerDark: '#c0392b',
    textWarning: '#f39c12',
    // Backgrounds
    bgSubtle: '#f3f4f6',
    bgDisabled: '#f9fafb',
    bgError: '#ffe6e6',
    bgDangerDisabled: '#f5b7b1',
    bgSecondaryButton: '#e0e0e0',
    // Borders
    borderSubtle: '#e5e7eb',
    borderDivider: '#eef0f3',
    borderDividerLight: '#f1f5f9',
    borderDanger: '#fee2e2',
    // Blue (primary action / admin indicator)
    blue: '#3B82F6',
    blueDark: '#1d4ed8',
    blueBorder: '#dbeafe',
    blueSubtle: '#eff6ff',
    blueLegendBg: '#f0f7ff',
    // Tab active text
    textTabActive: '#111827',
    textTabInactive: '#6b7280',
  },
  zIndex: {
    modal: 1000,
  },
  size: {
    closeButton: 34,
    deleteButton: 36,
    adminIndicatorDot: 8,
  },
};

export const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: modalTokens.zIndex.modal,
};

export const modalContentStyle: React.CSSProperties = {
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.md,
  padding: '1.25rem',
  width: '100%',
  maxWidth: 560,
  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
};

export const modalTitleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.spacing.sm,
};

export const modalHeaderStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 700,
  color: modalTokens.colors.textHeading,
};

export const closeIconButtonStyle: React.CSSProperties = {
  border: `1px solid ${modalTokens.colors.borderSubtle}`,
  backgroundColor: tokens.colors.white,
  color: modalTokens.colors.textBody,
  borderRadius: tokens.borderRadius.sm,
  width: modalTokens.size.closeButton,
  height: modalTokens.size.closeButton,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export const tabsContainerStyle: React.CSSProperties = {
  display: 'flex',
  marginTop: '0.9rem',
  borderBottom: `1px solid ${modalTokens.colors.borderDivider}`,
};

export const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  border: 'none',
  background: 'transparent',
  padding: '0.65rem 0.9rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: active ? 600 : 500,
  color: active ? modalTokens.colors.textTabActive : modalTokens.colors.textTabInactive,
  borderBottom: active ? `2px solid ${modalTokens.colors.blue}` : '2px solid transparent',
  marginBottom: -1,
});

export const tabPanelStyle: React.CSSProperties = {
  paddingTop: tokens.spacing.md,
};

export const modalSubtextStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: '0.9rem',
  fontSize: '0.9rem',
  color: modalTokens.colors.textMuted,
  lineHeight: 1.4,
};

export const infoNoticeStyle: React.CSSProperties = {
  backgroundColor: modalTokens.colors.bgSubtle,
  border: `1px solid ${modalTokens.colors.borderSubtle}`,
  color: modalTokens.colors.textBody,
  padding: '0.6rem 0.75rem',
  borderRadius: tokens.borderRadius.sm,
  fontSize: '0.85rem',
  marginBottom: tokens.spacing.sm,
};

export const userListContainerStyle: React.CSSProperties = {
  maxHeight: 320,
  overflowY: 'auto',
  marginTop: tokens.spacing.xs,
  marginBottom: tokens.spacing.md,
};

export const userListItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.65rem 0.25rem',
  borderBottom: `1px solid ${modalTokens.colors.borderDividerLight}`,
  gap: tokens.spacing.sm,
};

export const userListInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginRight: '0.25rem',
  minWidth: 0,
  flex: '1 1 auto',
};

export const userListNameRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing.xs,
  minWidth: 0,
};

export const userListNameStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 600,
  color: modalTokens.colors.textTabActive,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const adminBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  border: `1px solid ${modalTokens.colors.blueBorder}`,
  backgroundColor: modalTokens.colors.blueSubtle,
  color: modalTokens.colors.blueDark,
  padding: '0.15rem 0.45rem',
  borderRadius: 999,
  fontSize: '0.75rem',
  fontWeight: 700,
  flex: '0 0 auto',
};

export const userListEmailStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: tokens.colors.textSecondary,
};

export const deleteButtonStyle = (disabled: boolean): React.CSSProperties => ({
  border: `1px solid ${modalTokens.colors.borderDanger}`,
  backgroundColor: disabled ? modalTokens.colors.bgDisabled : tokens.colors.white,
  color: disabled ? modalTokens.colors.textDisabled : modalTokens.colors.textDanger,
  borderRadius: tokens.borderRadius.md,
  width: modalTokens.size.deleteButton,
  height: modalTokens.size.deleteButton,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer',
});

export const modalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: tokens.spacing.sm,
};

export const modalButtonStyle = (
  variant: 'primary' | 'secondary',
): React.CSSProperties => ({
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1.1rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  backgroundColor: variant === 'primary' ? modalTokens.colors.blue : modalTokens.colors.bgSecondaryButton,
  color: variant === 'primary' ? tokens.colors.white : tokens.colors.textPrimary,
  marginLeft: tokens.spacing.xs,
});

export const errorMessageStyle: React.CSSProperties = {
  backgroundColor: modalTokens.colors.bgError,
  color: modalTokens.colors.textDangerDark,
  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
  borderRadius: 4,
  fontSize: '0.85rem',
  marginBottom: tokens.spacing.sm,
};

export const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '1rem 0.5rem',
  fontSize: '0.9rem',
  color: modalTokens.colors.textTabInactive,
};

export const unsavedChangesBadgeStyle: React.CSSProperties = {
  color: modalTokens.colors.textWarning,
  marginLeft: tokens.spacing.xs,
};

export const adminInnerStyle: React.CSSProperties = {
  minWidth: 0,
};

export const adminFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: tokens.spacing.sm,
  gap: tokens.spacing.xs,
};

// Admin settings tab styles

export const adminListContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing.xs,
  maxHeight: 320,
  overflowY: 'auto',
  paddingRight: 2,
};

export const adminListItemStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '18px 1fr auto',
  alignItems: 'center',
  gap: tokens.spacing.sm,
  padding: '0.65rem 0.75rem',
  border: `1px solid ${modalTokens.colors.borderDivider}`,
  borderRadius: tokens.borderRadius.md,
  cursor: 'pointer',
  userSelect: 'none',
};

export const adminRadioStyle: React.CSSProperties = {
  width: 16,
  height: 16,
};

export const adminRowRightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
};

// Confirm delete modal specific styles

export const confirmModalContentStyle: React.CSSProperties = {
  ...modalContentStyle,
  maxWidth: 460,
};

export const confirmModalHeaderStyle: React.CSSProperties = {
  ...modalHeaderStyle,
  marginBottom: tokens.spacing.sm,
};

export const confirmModalTextStyle: React.CSSProperties = {
  ...modalSubtextStyle,
  marginBottom: '1.25rem',
};

export const confirmModalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: tokens.spacing.xs,
};

export const confirmButtonStyle = (
  variant: 'cancel' | 'danger',
  disabled: boolean,
): React.CSSProperties => ({
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1.1rem',
  fontSize: '0.9rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor:
    variant === 'danger'
      ? disabled
        ? modalTokens.colors.bgDangerDisabled
        : tokens.colors.error
      : modalTokens.colors.bgSecondaryButton,
  color: variant === 'danger' ? tokens.colors.white : tokens.colors.textPrimary,
});
